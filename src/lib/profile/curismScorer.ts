import type { ACIDBreakdown, CURISMScores, FilteredRepo, RepoQualitySignal } from './types';

const clamp = (value: number, min = 0, max = 10) => Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
const round = (value: number) => Math.round(clamp(value) * 10) / 10;

function observedSignals(signals: RepoQualitySignal[]): RepoQualitySignal[] {
  // A missing or truncated Git tree is not evidence that a project lacks tests,
  // CI, or documentation.
  return signals.filter(signal => signal.qualityObserved && !signal.treeTruncated);
}

function ratio<T>(items: T[], predicate: (item: T) => boolean): number {
  return items.length ? items.filter(predicate).length / items.length : 0;
}

function computeReliability(repoSignals: RepoQualitySignal[], avgCommitMessageLength: number): number {
  const signals = observedSignals(repoSignals);
  if (!signals.length) return 0;
  const commitQuality = avgCommitMessageLength >= 50 ? 1 : avgCommitMessageLength >= 30 ? 0.65 : avgCommitMessageLength >= 15 ? 0.35 : 0.1;
  const deep = signals.filter(signal => signal.deepAnalysis);
  // File presence is weak evidence; measured test-to-source ratio is strong
  // evidence and partially replaces it when available.
  const testEvidence = deep.length
    ? ratio(deep, signal => (signal.testToCodeRatio ?? 0) >= 0.2) * 2.5 + ratio(deep, signal => signal.hasTests) * 1
    : ratio(signals, signal => signal.hasTests) * 3.5;

  let complexityAdjustment = 0;
  let errorHandlingBoost = 0;

  if (deep.length) {
    const deepWithCC = deep.filter(signal => typeof signal.cyclomaticComplexity === 'number');
    if (deepWithCC.length) {
      const avgCC = deepWithCC.reduce((sum, s) => sum + s.cyclomaticComplexity!, 0) / deepWithCC.length;
      if (avgCC <= 6) {
        complexityAdjustment += 1.0;
      } else if (avgCC > 12) {
        complexityAdjustment -= 1.5;
      }
    }

    const deepWithHCR = deep.filter(signal => typeof signal.highComplexityRatio === 'number');
    if (deepWithHCR.length) {
      const avgHCR = deepWithHCR.reduce((sum, s) => sum + s.highComplexityRatio!, 0) / deepWithHCR.length;
      if (avgHCR > 0.25) {
        complexityAdjustment -= 1.0;
      }
    }

    const deepWithEH = deep.filter(signal => typeof signal.errorHandlingRatio === 'number');
    if (deepWithEH.length) {
      const avgEH = deepWithEH.reduce((sum, s) => sum + s.errorHandlingRatio!, 0) / deepWithEH.length;
      if (avgEH >= 0.5) {
        errorHandlingBoost += 0.5;
      }
    }
  }

  return round(
    1
    + testEvidence
    + ratio(signals, signal => signal.hasCI) * 2
    + ratio(signals, signal => signal.hasPrettierOrLint) * 1.5
    + ratio(signals, signal => signal.hasGitignore)
    + commitQuality * 1.5
    + complexityAdjustment
    + errorHandlingBoost,
  );
}

function computeSecurity(repoSignals: RepoQualitySignal[]): number {
  const signals = observedSignals(repoSignals);
  if (!signals.length) return 0;
  const dependencyRepos = signals.filter(signal => signal.hasDependencyManifest);
  const lockfileRatio = dependencyRepos.length ? ratio(dependencyRepos, signal => signal.hasLockfile) : 0;
  const envLeakPenalty = signals.filter(signal => signal.hasEnvCommitted).length * 3;

  const deep = signals.filter(signal => signal.deepAnalysis);
  let deepSecurityPenalty = 0;
  if (deep.length) {
    const repoPenalties = deep.map(signal => {
      const flags = signal.securityFlags;
      if (!flags) return 0;
      return (
        (flags.hardcodedSecrets ?? 0) * 2.5 +
        (flags.unsafeCalls ?? 0) * 1.5 +
        (flags.rawSqlConcatenation ?? 0) * 1.5 +
        (flags.insecureCrypto ?? 0) * 1.0
      );
    });
    const avgPenalty = repoPenalties.reduce((sum, p) => sum + p, 0) / deep.length;
    const maxPenalty = Math.max(0, ...repoPenalties);
    deepSecurityPenalty = Math.min(6, avgPenalty * 0.5 + maxPenalty * 0.5);
  }

  return round(
    3
    + ratio(signals, signal => signal.hasGitignore) * 1.5
    + lockfileRatio * 1.5
    + ratio(signals, signal => signal.hasEnvExample)
    + ratio(signals, signal => signal.hasSecurityPolicy) * 2
    + ratio(signals, signal => signal.hasCI)
    - envLeakPenalty
    - deepSecurityPenalty,
  );
}

function computeMaintainability(repoSignals: RepoQualitySignal[]): number {
  const signals = observedSignals(repoSignals);
  if (!signals.length) return 0;
  const documentation = signals.reduce((sum, signal) => sum
    + (signal.readmeWordCount >= 50 ? 0.5 : 0)
    + (signal.readmeWordCount >= 200 ? 0.5 : 0)
    + (signal.readmeHasInstallInstructions ? 0.5 : 0)
    + (signal.readmeHasUsageExamples ? 0.5 : 0), 0) / signals.length;
  // Measured code-quality evidence (long functions, dead-code markers, MI) is
  // stronger than file-presence heuristics and partially replaces it.
  const deep = signals.filter(signal => signal.deepAnalysis);
  let codeQuality: number;
  if (deep.length) {
    const deepWithMI = deep.filter(s => typeof s.maintainabilityIndex === 'number');
    const avgMI = deepWithMI.length
      ? deepWithMI.reduce((sum, s) => sum + s.maintainabilityIndex!, 0) / deepWithMI.length
      : 0;
    const miWeight = deepWithMI.length ? 2.0 * (avgMI / 100) : 0;

    codeQuality = miWeight
      + ratio(deep, signal => (signal.meanFunctionLength ?? 0) > 0 && (signal.meanFunctionLength ?? 99) <= 40) * 1.0
      + ratio(deep, signal => (signal.commentDensity ?? 0) >= 0.08) * 0.5
      + ratio(deep, signal => !signal.hasHighTodoDensity) * 0.5;
  } else {
    codeQuality = ratio(signals, signal => signal.hasPrettierOrLint) * 1.5;
  }

  return round(
    1
    + documentation * 1.5
    + ratio(signals, signal => signal.hasModularStructure) * 2.5
    + codeQuality
    + ratio(signals, signal => signal.hasContributing)
    + ratio(signals, signal => signal.hasApiDocs) * 1.5,
  );
}

export function computeInfluence(totalStars: number, totalForks: number, followers: number): number {
  const stars = Math.log2(totalStars + 1) / Math.log2(10_001) * 10;
  const forks = Math.log2(totalForks + 1) / Math.log2(5_001) * 10;
  const audience = Math.log2(followers + 1) / Math.log2(1_001) * 10;
  return round(stars * 0.55 + forks * 0.3 + audience * 0.15);
}

export function computeContribution(
  totalPRsOpened: number,
  totalPRsMerged: number,
  prReviewsDone: number,
  totalIssuesOpened: number,
  activeDaysLastYear: number,
  orgsCount: number,
): number {
  return round(
    Math.min(3, totalPRsMerged * 0.12)
    + Math.min(2.5, prReviewsDone * 0.25)
    + Math.min(1, totalPRsOpened * 0.04)
    + Math.min(0.5, totalIssuesOpened * 0.04)
    + Math.min(2.5, activeDaysLastYear / 365 * 2.5)
    + Math.min(0.5, orgsCount * 0.1),
  );
}

function combinedRepoText(repos: FilteredRepo[]): string {
  return repos.map(repo => `${repo.name} ${repo.description || ''} ${repo.topics.join(' ')}`).join(' ').toLowerCase();
}

function computeArchitectureScore(repoSignals: RepoQualitySignal[]): number {
  const signals = observedSignals(repoSignals);
  if (!signals.length) return 0;
  return round(
    ratio(signals, signal => signal.hasModularStructure) * 3
    + ratio(signals, signal => signal.directoryDepth >= 2 && signal.directoryDepth <= 8) * 1.5
    + ratio(signals, signal => signal.hasEnvExample && !signal.hasEnvCommitted) * 1
    + ratio(signals, signal => signal.hasCI) * 1
    + ratio(signals, signal => signal.hasDockerfile) * 1
    + codeEvidenceBoost(signals) * 0.5,
  );
}

/**
 * Deep static-analysis evidence collected from downloaded repository archives.
 * Presence alone is weak evidence; these ratios measure how the code is
 * actually written (type coverage, test-to-code ratio, comment density,
 * dead-code markers), so inflated files cannot game the score.
 */
function codeEvidenceBoost(signals: RepoQualitySignal[]): number {
  const deep = signals.filter(signal => signal.deepAnalysis);
  if (!deep.length) return 0;
  return round(
    ratio(deep, signal => (signal.testToCodeRatio ?? 0) >= 0.2) * 1.5
    + ratio(deep, signal => (signal.typeCoverage ?? 0) >= 0.6) * 1
    + ratio(deep, signal => (signal.commentDensity ?? 0) >= 0.08) * 1
    + ratio(deep, signal => typeof signal.meanFunctionLength === 'number' && signal.meanFunctionLength > 0 && signal.meanFunctionLength <= 40) * 1
    + ratio(deep, signal => !signal.hasHighTodoDensity) * 0.5
    + ratio(deep, signal => (signal.maintainabilityIndex ?? 0) >= 65) * 1
    + ratio(deep, signal => signal.cyclomaticComplexity !== undefined && signal.cyclomaticComplexity <= 6) * 0.5,
  );
}

function computeCrossDomainScore(repos: FilteredRepo[], repoSignals: RepoQualitySignal[]): number {
  const signals = observedSignals(repoSignals);
  const languages = new Set(signals.flatMap(signal => Object.keys(signal.languages)));
  const text = combinedRepoText(repos);
  const domains = [
    ['database', /\b(?:database|postgres|mysql|mongodb|redis|prisma|drizzle|sqlite)\b/],
    ['api', /\b(?:api|rest|graphql|grpc|webhook)\b/],
    ['auth', /\b(?:auth|oauth|jwt|session|clerk|supabase)\b/],
    ['cloud', /\b(?:aws|gcp|azure|cloud|serverless|lambda|vercel|netlify|kubernetes)\b/],
  ].filter(([, matcher]) => (matcher as RegExp).test(text)).length;
  const infrastructure = signals.some(signal => signal.hasDockerfile) ? 1 : 0;
  const automation = signals.some(signal => signal.hasCI) ? 1 : 0;
  return round(Math.min(10, domains * 1.5 + infrastructure * 1.5 + automation + (languages.size >= 2 ? 1.5 : 0) + (languages.size >= 4 ? 1.5 : 0)));
}

function computeInnovationScore(repos: FilteredRepo[]): number {
  if (!repos.length) return 0;
  const text = combinedRepoText(repos);
  const novelTopics = ['machine-learning', 'deep-learning', 'blockchain', 'web3', 'iot', 'webassembly', 'wasm', 'robotics', 'computer-vision', 'nlp', 'generative-ai', 'llm'];
  // A fork's purpose is unknown; treat it as original work only when its own
  // description or topics say something specific.
  const novelty = novelTopics.filter(topic => text.includes(topic)).length;
  const tutorialTerms = /\b(?:clone|tutorial|course|bootcamp|exercise|practice|template|starter|boilerplate)\b/;
  const originalRatio = ratio(repos, repo => !tutorialTerms.test(`${repo.name} ${repo.description || ''}`.toLowerCase()));
  const describedRatio = ratio(repos, repo => Boolean(repo.description?.trim()));
  const uniqueTopics = new Set(repos.flatMap(repo => repo.topics.map(topic => topic.toLowerCase()))).size;
  return round(Math.min(10, novelty * 1.25 + originalRatio * 4 + describedRatio + Math.min(2, uniqueTopics * 0.2)));
}

function computeDocumentationScore(repoSignals: RepoQualitySignal[]): number {
  const signals = observedSignals(repoSignals);
  if (!signals.length) return 0;
  const averagePoints = signals.reduce((sum, signal) => sum
    + (signal.readmeWordCount > 0 ? 1 : 0)
    + (signal.readmeWordCount >= 300 ? 1 : 0)
    + (signal.readmeHasInstallInstructions ? 1.5 : 0)
    + (signal.readmeHasUsageExamples ? 1.5 : 0)
    + (signal.readmeHasScreenshots ? 1 : 0)
    + (signal.hasApiDocs ? 1.5 : 0)
    + (signal.hasContributing ? 0.5 : 0)
    + (signal.hasLicense ? 0.5 : 0)
    + (signal.hasChangelog ? 0.5 : 0)
    + (signal.hasWiki ? 0.5 : 0), 0) / signals.length;
  return round(averagePoints);
}

export function computeACID(repos: FilteredRepo[], repoSignals: RepoQualitySignal[], _readmeSnippets: Record<string, string>) {
  void _readmeSnippets;
  const architecture = computeArchitectureScore(repoSignals);
  const crossDomain = computeCrossDomainScore(repos, repoSignals);
  const innovation = computeInnovationScore(repos);
  const documentation = computeDocumentationScore(repoSignals);
  return {
    score: round(architecture * 0.3 + crossDomain * 0.25 + innovation * 0.2 + documentation * 0.25),
    breakdown: { architecture, crossDomain, innovation, documentation } satisfies ACIDBreakdown,
  };
}

export interface WeightedRepoScore { repoName: string; reliability: number; security: number; maintainability: number; weight: number }

export function computeWeightedHardSkills(repoScores: WeightedRepoScore[]) {
  if (!repoScores.length) return { reliability: 0, security: 0, maintainability: 0, average: 0 };
  const weight = repoScores.reduce((sum, score) => sum + score.weight, 0) || 1;
  const reliability = repoScores.reduce((sum, score) => sum + score.reliability * score.weight, 0) / weight;
  const security = repoScores.reduce((sum, score) => sum + score.security * score.weight, 0) / weight;
  const maintainability = repoScores.reduce((sum, score) => sum + score.maintainability * score.weight, 0) / weight;
  return { reliability: round(reliability), security: round(security), maintainability: round(maintainability), average: round((reliability + security + maintainability) / 3) };
}

// GitHub popularity is useful context, but must not outweigh observable work in
// the repositories themselves.
export function computeFinalScore(hardSkills: number, softSkills: number, builderSkills: number): number {
  return round(hardSkills * 0.55 + softSkills * 0.15 + builderSkills * 0.3);
}

export function computeAllCURISMScores(input: {
  repoSignals: RepoQualitySignal[];
  avgCommitMessageLength: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  filteredRepos: FilteredRepo[];
  totalPRsOpened: number;
  totalPRsMerged: number;
  externalPRsMerged: number;
  prReviewsDone: number;
  externalIssues: number;
  totalIssuesOpened: number;
  activeDaysLastYear: number;
  orgsCount: number;
  readmeSnippets: Record<string, string>;
}): { scores: CURISMScores; acidBreakdown: ACIDBreakdown } {
  const acid = computeACID(input.filteredRepos, input.repoSignals, input.readmeSnippets);
  return {
    scores: {
      reliability: computeReliability(input.repoSignals, input.avgCommitMessageLength),
      security: computeSecurity(input.repoSignals),
      maintainability: computeMaintainability(input.repoSignals),
      influence: computeInfluence(input.totalStars, input.totalForks, input.followers),
      contribution: computeContribution(input.totalPRsOpened, input.totalPRsMerged, input.prReviewsDone, input.totalIssuesOpened, input.activeDaysLastYear, input.orgsCount),
      uniqueness: acid.score,
    },
    acidBreakdown: acid.breakdown,
  };
}
