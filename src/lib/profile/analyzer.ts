import type { EnrichedProfileData } from './githubFetcher';
import type { ACIDBreakdown, CURISMScores, MasterScoreData } from './types';

export interface QualitativeAnalysisOutput {
  archetype: string;
  curismDescriptions: {
    reliability: string;
    security: string;
    maintainability: string;
    influence: string;
    contribution: string;
    uniqueness: string;
  };
  engineeringDNA: { problemSolving: string; architectureMaturity: string; documentation: string };
  traits: { strengths: string[]; weaknesses: string[] };
  skillsByDomain: { domain: string; skills: string[] }[];
}

const scoreLabel = (score: number) => score >= 8 ? 'strong' : score >= 6 ? 'solid' : score >= 4 ? 'developing' : 'limited';

/**
 * Profile text is deliberately derived from the same data as the scores. An LLM
 * cannot verify private code or omitted GitHub data, so it is not used here.
 */
export async function analyzeProfileQualitative(
  data: EnrichedProfileData,
  scores: CURISMScores,
  acid: ACIDBreakdown,
  master: MasterScoreData,
): Promise<QualitativeAnalysisOutput> {
  const observed = data.repoQualitySignals.filter(signal => signal.qualityObserved && !signal.treeTruncated);
  const total = observed.length;
  const count = (predicate: (signal: typeof observed[number]) => boolean) => observed.filter(predicate).length;
  const languages = Object.entries(data.languageBytes).sort(([aLanguage, aBytes], [bLanguage, bBytes]) => bBytes - aBytes || aLanguage.localeCompare(bLanguage)).slice(0, 6).map(([language]) => language);
  const topics = [...new Set(data.filteredRepos.flatMap(repo => repo.topics))].sort().slice(0, 8);
  const collaboration = data.pullRequestActivity.totalPRsMerged > 0 || data.pullRequestActivity.prReviewsDone > 0
    ? 'Collaborative Builder'
    : 'Independent Builder';
  const strengths = [
    ...(total && count(signal => signal.hasTests) / total >= 0.5 ? ['Tests are present in at least half of the fully observed repositories'] : []),
    ...(total && count(signal => signal.hasCI) / total >= 0.5 ? ['Continuous integration is present in at least half of the fully observed repositories'] : []),
    ...(data.pullRequestActivity.prReviewsDone > 0 ? [`${data.pullRequestActivity.prReviewsDone} recorded pull-request reviews`] : []),
    ...(data.totalStarsReceived > 0 ? [`${data.totalStarsReceived} stars across public repositories`] : []),
  ].slice(0, 4);
  const weaknesses = total === 0
    ? ['Public repository quality signals were unavailable, so code-practice claims are intentionally withheld']
    : [
      ...(count(signal => signal.hasTests) / total < 0.5 ? ['Add automated tests to more observed repositories'] : []),
      ...(count(signal => signal.hasCI) / total < 0.5 ? ['Add CI checks to more observed repositories'] : []),
      ...(count(signal => signal.hasSecurityPolicy) === 0 ? ['Add a SECURITY.md or automated dependency/security checks where applicable'] : []),
      ...(count(signal => signal.readmeHasInstallInstructions && signal.readmeHasUsageExamples) / total < 0.5 ? ['Document setup and usage for more observed repositories'] : []),
    ].slice(0, 4);

  if (total === 0) {
    return {
      archetype: `${languages[0] || 'General'} Developer × Evidence Pending`,
      curismDescriptions: {
        reliability: 'Repository quality could not be inspected, so no reliability claim is made.',
        security: 'Repository security files could not be inspected, so no security claim is made.',
        maintainability: 'Repository structure and documentation could not be inspected, so no maintainability claim is made.',
        influence: `${data.totalStarsReceived} public stars, ${data.totalForksReceived} forks, and ${data.user.followers} followers were observed independently of repository-quality scoring.`,
        contribution: `${data.pullRequestActivity.totalPRsMerged} merged pull requests, ${data.pullRequestActivity.prReviewsDone} reviews, and ${data.commitFrequency.activeDaysLastYear} active days were observed independently of repository-quality scoring.`,
        uniqueness: 'Repository architecture and documentation could not be inspected, so no builder-skill claim is made.',
      },
      engineeringDNA: {
        problemSolving: 'No engineering-DNA conclusion is available because public repository file evidence could not be collected.',
        architectureMaturity: 'No repository tree was fully observed, so architecture maturity is intentionally not scored.',
        documentation: 'No repository README evidence was available to the analyser.',
      },
      traits: { strengths, weaknesses },
      skillsByDomain: languages.length ? [{ domain: 'Languages', skills: languages }] : [],
    };
  }

  return {
    archetype: `${languages[0] || 'General'} Developer × ${collaboration}`,
    curismDescriptions: {
      reliability: `${scoreLabel(scores.reliability)} reliability from tests in ${count(signal => signal.hasTests)}/${total} and CI in ${count(signal => signal.hasCI)}/${total} fully observed repositories.`,
      security: `${scoreLabel(scores.security)} public security hygiene from gitignore, lockfile, environment-example, and security-policy signals; committed .env files reduce this score.`,
      maintainability: `${scoreLabel(scores.maintainability)} maintainability from repository structure, linting, and README/API documentation signals.`,
      influence: `${scoreLabel(scores.influence)} public reach from ${data.totalStarsReceived} stars, ${data.totalForksReceived} forks, and ${data.user.followers} followers.`,
      contribution: `${scoreLabel(scores.contribution)} collaboration evidence from ${data.pullRequestActivity.totalPRsMerged} merged pull requests, ${data.pullRequestActivity.prReviewsDone} reviews, and ${data.commitFrequency.activeDaysLastYear} active days.`,
      uniqueness: `${scoreLabel(scores.uniqueness)} builder evidence: architecture ${acid.architecture}/10, cross-domain ${acid.crossDomain}/10, innovation ${acid.innovation}/10, documentation ${acid.documentation}/10.`,
    },
    engineeringDNA: {
      problemSolving: `The profile score is ${master.finalScore}/10 and is based on public repository evidence only. ${topics.length ? `Observed repository topics include ${topics.slice(0, 4).join(', ')}.` : 'No topic-based problem-domain claim is made.'}`,
      architectureMaturity: `${count(signal => signal.hasModularStructure)}/${total} fully observed repositories show a multi-directory structure. ${count(signal => signal.hasCI)}/${total} show CI configuration.`,
      documentation: `${count(signal => signal.readmeWordCount > 0)}/${total} fully observed repositories have a README available to the analyser; ${count(signal => signal.readmeHasInstallInstructions && signal.readmeHasUsageExamples)}/${total} include both setup and usage evidence.`,
    },
    traits: { strengths, weaknesses },
    skillsByDomain: [
      ...(languages.length ? [{ domain: 'Languages', skills: languages }] : []),
      ...(topics.length ? [{ domain: 'Repository topics', skills: topics }] : []),
    ],
  };
}
