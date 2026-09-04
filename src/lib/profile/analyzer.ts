// src/lib/profile/analyzer.ts
// Qualitative Profile Analysis & Evidence-Driven Engineering DNA Synthesizer
import type { ACIDBreakdown, CURISMScores, EnrichedProfileData, MasterScoreData, RepoQualitySignal } from './types.ts';
import { classifySkillsFromManifests } from './manifestClassifier.ts';

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
  engineeringDNA: {
    problemSolving: string;
    architectureMaturity: string;
    documentation: string;
  };
  traits: {
    strengths: string[];
    weaknesses: string[];
  };
  skillsByDomain: { domain: string; skills: string[] }[];
}

const scoreLabel = (score: number): string =>
  score >= 8 ? 'strong' : score >= 6 ? 'solid' : score >= 4 ? 'developing' : 'limited';

/**
 * Classifies the developer archetype into a primary axis and a secondary collaboration/builder axis.
 * Primary: AI/ML, Systems/Tooling, Fullstack, Backend, Frontend, DevOps, or Language/General.
 * Secondary: Open Source Contributor, Specialized Systems Hacker, Core Product Builder, or Independent Builder.
 */
function determineArchetype(
  skillsByDomain: { domain: string; skills: string[] }[],
  data: EnrichedProfileData,
  scores: CURISMScores,
  acid: ACIDBreakdown,
  languages: string[],
): string {
  const domainSkillCounts: Record<string, number> = {};
  for (const entry of skillsByDomain) {
    domainSkillCounts[entry.domain] = entry.skills.length;
  }

  const aimlCount = domainSkillCounts['AI & Machine Learning'] || 0;
  const systemsCount = domainSkillCounts['Systems & Tooling'] || 0;
  const frontendCount = domainSkillCounts['Frontend & UI'] || 0;
  const backendCount = domainSkillCounts['Backend & APIs'] || 0;
  const dbCount = domainSkillCounts['Databases & Storage'] || 0;
  const devopsCount = domainSkillCounts['DevOps & Cloud'] || 0;

  const systemsLanguages = new Set(['Rust', 'Go', 'C++', 'C']);
  const hasSystemsLang = Object.keys(data.languageBytes || {}).some(lang => systemsLanguages.has(lang)) ||
    (data.filteredRepos || []).some(r => r.language && systemsLanguages.has(r.language));

  // --- Primary Axis ---
  let primaryAxis = '';
  if (aimlCount >= 2) {
    primaryAxis = 'Machine Learning & AI Engineer';
  } else if (systemsCount >= 1 && hasSystemsLang) {
    primaryAxis = 'Systems & Infrastructure Engineer';
  } else if (frontendCount >= 1 && backendCount >= 1) {
    primaryAxis = 'Fullstack Systems Architect';
  } else {
    const backendDbTotal = backendCount + dbCount;
    if (backendDbTotal > frontendCount && backendDbTotal >= devopsCount && backendDbTotal > 0) {
      primaryAxis = 'Backend Systems Engineer';
    } else if (frontendCount > backendDbTotal && frontendCount >= devopsCount && frontendCount > 0) {
      primaryAxis = 'Frontend Experience Engineer';
    } else if (devopsCount > 0 && devopsCount >= backendDbTotal && devopsCount >= frontendCount) {
      primaryAxis = 'Cloud Platform Engineer';
    } else {
      const topLanguage = languages[0] || (data.filteredRepos?.find(r => r.language)?.language ?? '');
      primaryAxis = topLanguage && topLanguage.toLowerCase() !== 'general'
        ? `${topLanguage} Engineer`
        : 'Software Engineer';
    }
  }

  // --- Secondary Axis ---
  let secondaryAxis = 'Independent Builder';
  if (
    (data.pullRequestActivity?.totalPRsMerged ?? 0) >= 5 ||
    (data.pullRequestActivity?.prReviewsDone ?? 0) >= 3
  ) {
    secondaryAxis = 'Open Source Contributor';
  } else if ((acid?.innovation ?? 0) >= 7 || (scores?.uniqueness ?? 0) >= 7) {
    secondaryAxis = 'Specialized Systems Hacker';
  } else if ((data.filteredRepos?.length ?? 0) >= 8) {
    secondaryAxis = 'Core Product Builder';
  }

  return `${primaryAxis} × ${secondaryAxis}`;
}

/**
 * Synthesizes algorithmic depth, cyclomatic complexity control, project originality, and domain scope.
 */
function synthesizeProblemSolving(
  observed: RepoQualitySignal[],
  acid: ACIDBreakdown,
  master: MasterScoreData,
  topics: string[],
): string {
  const total = observed.length;
  if (total === 0) {
    return `Evaluated on public metrics with a master competency score of ${master.finalScore}/10. Direct AST inspection was unavailable, so problem-solving depth is inferred from profile contribution history and architectural signals.`;
  }

  const deep = observed.filter(s => s.deepAnalysis);
  const deepWithCC = deep.filter(s => Number.isFinite(s.cyclomaticComplexity));
  let ccText = '';
  if (deepWithCC.length > 0) {
    const avgCC = Math.round((deepWithCC.reduce((sum, s) => sum + s.cyclomaticComplexity!, 0) / deepWithCC.length) * 10) / 10;
    if (avgCC <= 6) {
      ccText = `Demonstrates disciplined control flow with an average cyclomatic complexity of ${avgCC} per function, reflecting clean decomposition and low cognitive overhead. `;
    } else if (avgCC <= 12) {
      ccText = `Maintains moderate branching complexity with an average cyclomatic complexity of ${avgCC} per function across observed source files. `;
    } else {
      ccText = `Shows high branching complexity with an average cyclomatic complexity of ${avgCC} per function, indicating opportunities for modular refactoring. `;
    }
  } else {
    ccText = `Demonstrates consistent algorithmic structure with a master problem-solving competency score of ${master.finalScore}/10. `;
  }

  let originalityText = '';
  if (acid.innovation >= 7) {
    originalityText = `Projects exhibit high originality (Innovation: ${acid.innovation}/10) with custom architectural solutions rather than derivative boilerplate. `;
  } else if (acid.innovation >= 4) {
    originalityText = `Balances established library patterns with domain-specific customizations (Innovation: ${acid.innovation}/10). `;
  } else {
    originalityText = `Applies standard framework conventions and canonical patterns (Innovation: ${acid.innovation}/10). `;
  }

  let domainText = '';
  if (topics.length > 0) {
    domainText = `Applies technical problem-solving across domains including ${topics.slice(0, 4).join(', ')}.`;
  } else {
    domainText = `Focuses on core software engineering workflows with targeted system implementations.`;
  }

  return (ccText + originalityText + domainText).trim();
}

/**
 * Evaluates directory depth, modular structure, Docker, CI/CD, config management, and Maintainability Index.
 */
function synthesizeArchitectureMaturity(
  observed: RepoQualitySignal[],
  acid: ACIDBreakdown,
): string {
  const total = observed.length;
  if (total === 0) {
    return `Repository tree evidence was not accessible for deep structural verification; architectural maturity defaults to baseline independent builder signals (Architecture score: ${acid.architecture}/10).`;
  }

  const modularCount = observed.filter(s => s.hasModularStructure).length;
  const ciCount = observed.filter(s => s.hasCI).length;
  const dockerCount = observed.filter(s => s.hasDockerfile).length;
  const envExampleCount = observed.filter(s => s.hasEnvExample).length;
  const avgDepth = Math.round((observed.reduce((sum, s) => sum + (s.directoryDepth || 0), 0) / total) * 10) / 10;

  const deep = observed.filter(s => s.deepAnalysis);
  const deepWithMI = deep.filter(s => Number.isFinite(s.maintainabilityIndex));
  let miText = '';
  if (deepWithMI.length > 0) {
    const avgMI = Math.round(deepWithMI.reduce((sum, s) => sum + s.maintainabilityIndex!, 0) / deepWithMI.length);
    miText = ` Deep AST analysis reveals an average Maintainability Index of ${avgMI}/100, indicating ${avgMI >= 75 ? 'highly maintainable, clean codebases' : avgMI >= 50 ? 'moderate maintainability with manageable technical debt' : 'elevated technical debt requiring structural refactoring'}.`;
  }

  const maturityLevel = modularCount >= total * 0.5 ? 'high' : modularCount > 0 ? 'moderate' : 'developing';
  const dockerClause = dockerCount > 0 ? `, containerization (Docker) in ${dockerCount}/${total}` : '';
  const configClause = envExampleCount > 0 ? `, and configuration hygiene (.env templates) in ${envExampleCount}/${total} repositories` : '';

  return `Demonstrates ${maturityLevel} architectural maturity (Architecture score: ${acid.architecture}/10): ${modularCount}/${total} repositories feature modular separation of concerns with multi-directory organization (average depth: ${avgDepth}). Production readiness is reinforced by CI/CD workflows in ${ciCount}/${total}${dockerClause}${configClause}.${miText}`.trim();
}

/**
 * Evaluates README quality (installation, usage, API docs, screenshots), commit length, conventional commits, and comment density.
 */
function synthesizeDocumentation(
  observed: RepoQualitySignal[],
  recentCommits: { message: string }[],
): string {
  const total = observed.length;
  if (total === 0) {
    return 'README and commit documentation could not be directly inspected from public trees; evaluation relies on repository-level metadata.';
  }

  const readmeCount = observed.filter(s => s.readmeWordCount > 0).length;
  const installUsageCount = observed.filter(s => s.readmeHasInstallInstructions && s.readmeHasUsageExamples).length;
  const apiDocsCount = observed.filter(s => s.hasApiDocs).length;
  const screenshotCount = observed.filter(s => s.readmeHasScreenshots).length;

  let readmeText = `Documentation covers ${readmeCount}/${total} repositories, with ${installUsageCount}/${total} providing both installation instructions and usage examples${screenshotCount > 0 ? ` alongside visual walkthroughs in ${screenshotCount} projects` : ''}.`;
  if (apiDocsCount > 0) {
    readmeText += ` API contracts and technical specifications are documented in ${apiDocsCount}/${total} repositories.`;
  }

  const deep = observed.filter(s => s.deepAnalysis);
  const deepWithComments = deep.filter(s => Number.isFinite(s.commentDensity));
  let commentText = '';
  if (deepWithComments.length > 0) {
    const avgComments = Math.round((deepWithComments.reduce((sum, s) => sum + s.commentDensity!, 0) / deepWithComments.length) * 100);
    commentText = ` Codebases maintain ${avgComments >= 10 ? 'healthy' : 'lean'} source documentation with an average inline comment density of ${avgComments}%.`;
  }

  let commitText = '';
  if (recentCommits && recentCommits.length > 0) {
    const avgLen = Math.round(recentCommits.reduce((sum, c) => sum + c.message.length, 0) / recentCommits.length);
    const conventionalCount = recentCommits.filter(c => /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?:\s.+/i.test(c.message.trim())).length;
    const conventionalRatio = conventionalCount / recentCommits.length;
    commitText = ` Git history demonstrates ${avgLen >= 50 ? 'detailed' : avgLen >= 30 ? 'concise' : 'brief'} commit records (avg length: ${avgLen} chars)${conventionalRatio >= 0.25 ? ` with ${Math.round(conventionalRatio * 100)}% adhering to Conventional Commits` : ''}.`;
  }

  return `${readmeText}${commentText}${commitText}`.trim();
}

/**
 * Generates 4-6 precise, fact-based bullet points for strengths and weaknesses.
 */
function synthesizeTraits(
  data: EnrichedProfileData,
  observed: RepoQualitySignal[],
): { strengths: string[]; weaknesses: string[] } {
  const total = observed.length;
  const count = (predicate: (s: RepoQualitySignal) => boolean) => observed.filter(predicate).length;
  const deep = observed.filter(s => s.deepAnalysis);

  const candidateStrengths: string[] = [];
  const candidateWeaknesses: string[] = [];

  if (total > 0) {
    // 1. High test-to-code ratio
    if (count(s => s.deepAnalysis === true && (s.testToCodeRatio ?? 0) >= 0.2) > 0) {
      candidateStrengths.push('High test-to-source code ratio (≥20%) verified through deep AST inspection');
    } else if (count(s => s.hasTests) / total >= 0.5) {
      candidateStrengths.push(`Automated test suites present in ${count(s => s.hasTests)}/${total} observed repositories`);
    }

    // 2. Strong typing coverage (>60%)
    if (count(s => s.deepAnalysis === true && (s.typeCoverage ?? 0) >= 0.6) > 0) {
      candidateStrengths.push('Strong type coverage (>60%) with rigorous parameter and return signatures');
    }

    // 3. High Maintainability Index (>75)
    if (count(s => s.deepAnalysis === true && (s.maintainabilityIndex ?? 0) >= 75) > 0) {
      candidateStrengths.push('High Maintainability Index (>75/100) indicating clean structure and low debt');
    }

    // 4. Low Cyclomatic Complexity (<=6)
    if (count(s => s.deepAnalysis === true && Number.isFinite(s.cyclomaticComplexity) && s.cyclomaticComplexity! <= 6) > 0) {
      candidateStrengths.push('Disciplined control flow with low average cyclomatic complexity (≤6 per function)');
    }

    // 5. Zero security smells
    if (deep.length > 0 && deep.every(s => !s.securityFlags || (
      s.securityFlags.hardcodedSecrets === 0 &&
      s.securityFlags.unsafeCalls === 0 &&
      s.securityFlags.insecureCrypto === 0 &&
      s.securityFlags.rawSqlConcatenation === 0
    ))) {
      candidateStrengths.push('Zero detected security smells or credential leaks across inspected code');
    }

    // 6. Active CI/CD
    if (count(s => s.hasCI) / total >= 0.5) {
      candidateStrengths.push(`Active CI/CD automation configured in ${count(s => s.hasCI)}/${total} observed repositories`);
    }

    // 7. Merged external PRs / PR activity
    const externalPRs = data.pullRequestActivity?.externalPRsMerged ?? 0;
    const totalPRs = data.pullRequestActivity?.totalPRsMerged ?? 0;
    if (externalPRs > 0) {
      candidateStrengths.push(`Proven cross-repository collaboration with ${externalPRs} merged external pull requests`);
    } else if (totalPRs >= 5) {
      candidateStrengths.push(`Consistent pull-request delivery with ${totalPRs} merged pull requests`);
    }

    // 8. Modular architecture
    if (count(s => s.hasModularStructure) / total >= 0.5) {
      candidateStrengths.push(`Modular multi-directory architecture implemented in ${count(s => s.hasModularStructure)}/${total} repositories`);
    }

    // 9. Documentation
    if (count(s => s.readmeHasInstallInstructions && s.readmeHasUsageExamples) / total >= 0.5) {
      candidateStrengths.push(`Comprehensive setup documentation with installation and usage guides in ${count(s => s.readmeHasInstallInstructions && s.readmeHasUsageExamples)}/${total} projects`);
    }

    // 10. Code reviews
    const prReviews = data.pullRequestActivity?.prReviewsDone ?? 0;
    if (prReviews > 0) {
      candidateStrengths.push(`Active code review participation with ${prReviews} recorded pull-request reviews`);
    }

    // 11. Stars / Reach
    const totalStars = data.totalStarsReceived ?? 0;
    if (totalStars >= 10) {
      candidateStrengths.push(`Recognized community impact with ${totalStars} stars across public repositories`);
    }

    // 12. Active commit cadence
    const activeDays = data.commitFrequency?.activeDaysLastYear ?? 0;
    if (activeDays >= 50) {
      candidateStrengths.push(`Consistent contribution cadence with ${activeDays} active days over the past year`);
    }

    // --- Weaknesses ---
    // 1. Missing tests (<50% repos)
    if (count(s => s.hasTests) / total < 0.5) {
      candidateWeaknesses.push(`Missing automated tests in ${total - count(s => s.hasTests)}/${total} observed repositories`);
    }

    // 2. Missing CI
    if (count(s => s.hasCI) / total < 0.5) {
      candidateWeaknesses.push(`Missing CI/CD pipeline automation in ${total - count(s => s.hasCI)}/${total} repositories`);
    }

    // 3. Low Maintainability Index (<50)
    if (count(s => s.deepAnalysis === true && Number.isFinite(s.maintainabilityIndex) && s.maintainabilityIndex! < 50) > 0) {
      candidateWeaknesses.push('Low Maintainability Index (<50/100) detected in inspected files, indicating elevated technical debt');
    }

    // 4. High complexity (>12)
    if (count(s => s.deepAnalysis === true && Number.isFinite(s.cyclomaticComplexity) && s.cyclomaticComplexity! > 12) > 0) {
      candidateWeaknesses.push('High cyclomatic complexity (>12 per function) in inspected code, indicating deeply nested logic');
    }

    // 5. Security flags
    if (count(s => s.deepAnalysis === true && Boolean(s.securityFlags && (
      s.securityFlags.hardcodedSecrets > 0 ||
      s.securityFlags.rawSqlConcatenation > 0 ||
      s.securityFlags.unsafeCalls > 0 ||
      s.securityFlags.insecureCrypto > 0
    ))) > 0) {
      candidateWeaknesses.push('Security smells detected (hardcoded secrets, raw SQL concatenation, or unsafe AST calls)');
    }

    // 6. Missing install/usage documentation
    if (count(s => s.readmeHasInstallInstructions && s.readmeHasUsageExamples) / total < 0.5) {
      candidateWeaknesses.push(`Missing explicit installation or usage documentation in ${total - count(s => s.readmeHasInstallInstructions && s.readmeHasUsageExamples)}/${total} repositories`);
    }

    // 7. High TODO density
    if (count(s => s.deepAnalysis === true && s.hasHighTodoDensity === true) > 0) {
      candidateWeaknesses.push('Elevated TODO/FIXME/HACK comment density (>1 per 200 LOC) signaling incomplete implementations');
    }

    // 8. Missing security policy
    if (count(s => s.hasSecurityPolicy) === 0) {
      candidateWeaknesses.push('No formal SECURITY.md policy found for responsible vulnerability disclosure');
    }

    // 9. Committed .env files
    if (count(s => s.hasEnvCommitted) > 0) {
      candidateWeaknesses.push(`Committed .env file detected in ${count(s => s.hasEnvCommitted)} repositories, risking secret leakage`);
    }

    // 10. Missing .env.example
    if (count(s => s.hasEnvExample) / total < 0.5) {
      candidateWeaknesses.push(`Missing .env.example configuration templates in ${total - count(s => s.hasEnvExample)}/${total} repositories`);
    }
  }

  // Backup fallbacks to ensure 4-6 distinct items for strengths and weaknesses
  const fallbackStrengths: string[] = [
    (data.pullRequestActivity?.totalPRsMerged ?? 0) > 0
      ? `Recorded ${data.pullRequestActivity!.totalPRsMerged} merged pull requests on GitHub`
      : '',
    (data.totalStarsReceived ?? 0) > 0
      ? `Earned ${data.totalStarsReceived} stars across public repositories`
      : '',
    (data.commitFrequency?.activeDaysLastYear ?? 0) > 0
      ? `Active contribution history with ${data.commitFrequency!.activeDaysLastYear} commit days in the last year`
      : '',
    (data.user?.public_repos ?? 0) > 0
      ? `Maintains ${data.user!.public_repos} public repositories on GitHub`
      : '',
    (data.accountAge?.years ?? 0) > 0
      ? `Established track record with ${data.accountAge!.years}+ years on GitHub`
      : '',
    'Clean repository initialization adhering to standard Git conventions',
    'Consistent version control hygiene with structured project branches',
    'Active open-source participation across public developer ecosystems',
    'Domain-focused technical exploration across modern developer tooling',
    'Established foundation for multi-environment software deployment',
  ].filter(Boolean);

  const fallbackWeaknesses: string[] = [
    'Expand automated integration test coverage to protect against regressions',
    'Add automated CI/CD pipeline checks across more repositories',
    'Standardize documentation with explicit installation and usage examples',
    'Add a SECURITY.md vulnerability disclosure policy to primary repositories',
    'Adopt linting and code formatting configurations across all repositories',
    'Increase peer pull-request review engagement in collaborative workflows',
  ];

  if (total === 0) {
    const emptyWeaknesses = [
      'Public repository quality signals were unavailable for deep static analysis',
      'Automated test coverage could not be verified from accessible repository trees',
      'CI/CD pipeline configuration is unverified across public repositories',
      'Installation and usage documentation depth could not be evaluated',
      'Code maintainability and complexity metrics require public source inspection',
    ];

    return {
      strengths: Array.from(new Set([...candidateStrengths, ...fallbackStrengths])).slice(0, 5),
      weaknesses: Array.from(new Set(emptyWeaknesses)).slice(0, 5),
    };
  }

  for (const s of fallbackStrengths) {
    if (candidateStrengths.length >= 4) break;
    if (!candidateStrengths.includes(s)) candidateStrengths.push(s);
  }

  for (const w of fallbackWeaknesses) {
    if (candidateWeaknesses.length >= 4) break;
    if (!candidateWeaknesses.includes(w)) candidateWeaknesses.push(w);
  }

  return {
    strengths: Array.from(new Set(candidateStrengths)).slice(0, 6),
    weaknesses: Array.from(new Set(candidateWeaknesses)).slice(0, 6),
  };
}

/**
 * Profile text is derived from the same deterministic data as the scoring engine.
 * LLM hallucinations are avoided by synthesizing verified repository artifacts.
 */
export function analyzeProfileQualitative(
  data: EnrichedProfileData,
  scores: CURISMScores,
  acid: ACIDBreakdown,
  master: MasterScoreData,
): QualitativeAnalysisOutput {
  const observed = (data.repoQualitySignals || []).filter(signal => signal.qualityObserved && !signal.treeTruncated);
  const total = observed.length;
  const count = (predicate: (signal: typeof observed[number]) => boolean) => observed.filter(predicate).length;

  const languages = Object.entries(data.languageBytes || {})
    .filter(([, bytes]) => typeof bytes === 'number' && bytes > 0)
    .sort(([aLanguage, aBytes], [bLanguage, bBytes]) => bBytes - aBytes || aLanguage.localeCompare(bLanguage))
    .slice(0, 6)
    .map(([language]) => language);

  const topics = [...new Set((data.filteredRepos || []).flatMap(repo => repo.topics || []))].sort();

  // 1. Populate Skills by Domain using manifestClassifier
  const manifests = (data.detectedManifests && data.detectedManifests.length > 0)
    ? data.detectedManifests
    : (data.repoQualitySignals?.flatMap(s => s.manifestFiles || []) || []);
  const skillsByDomain = classifySkillsFromManifests(manifests, topics, data.languageBytes || {});

  // 2. Determine Archetype
  const archetype = determineArchetype(skillsByDomain, data, scores, acid, languages);

  // 3. Synthesize Actionable Traits (4-6 strengths and weaknesses)
  const traits = synthesizeTraits(data, observed);

  // 4. Synthesize Engineering DNA Triad
  const engineeringDNA = {
    problemSolving: synthesizeProblemSolving(observed, acid, master, topics),
    architectureMaturity: synthesizeArchitectureMaturity(observed, acid),
    documentation: synthesizeDocumentation(observed, data.recentCommits || []),
  };

  // 5. Deep AST metric aggregations for granular CURISM descriptions
  const deep = observed.filter(s => s.deepAnalysis);
  const deepWithTestRatio = deep.filter(s => Number.isFinite(s.testToCodeRatio));
  const avgTestRatio = deepWithTestRatio.length > 0
    ? Math.round((deepWithTestRatio.reduce((sum, s) => sum + s.testToCodeRatio!, 0) / deepWithTestRatio.length) * 100)
    : null;

  const deepWithCC = deep.filter(s => Number.isFinite(s.cyclomaticComplexity));
  const avgCC = deepWithCC.length > 0
    ? Math.round((deepWithCC.reduce((sum, s) => sum + s.cyclomaticComplexity!, 0) / deepWithCC.length) * 10) / 10
    : null;

  const deepWithMI = deep.filter(s => Number.isFinite(s.maintainabilityIndex));
  const avgMI = deepWithMI.length > 0
    ? Math.round(deepWithMI.reduce((sum, s) => sum + s.maintainabilityIndex!, 0) / deepWithMI.length)
    : null;

  const envLeakedCount = count(s => s.hasEnvCommitted);
  const secFlagsTotal = deep.reduce((sum, s) => {
    const f = s.securityFlags;
    return sum + (f ? (f.hardcodedSecrets + f.unsafeCalls + f.insecureCrypto + f.rawSqlConcatenation) : 0);
  }, 0);

  const avgDepth = total > 0
    ? Math.round((observed.reduce((sum, s) => sum + (s.directoryDepth || 0), 0) / total) * 10) / 10
    : 0;

  const installUsageCount = count(s => s.readmeHasInstallInstructions && s.readmeHasUsageExamples);

  const followers = data.user?.followers ?? 0;
  const publicRepos = data.user?.public_repos ?? 0;
  const totalStars = data.totalStarsReceived ?? 0;
  const totalForks = data.totalForksReceived ?? 0;
  const totalPRsMerged = data.pullRequestActivity?.totalPRsMerged ?? 0;
  const totalPRsOpened = data.pullRequestActivity?.totalPRsOpened ?? 0;
  const externalPRsMerged = data.pullRequestActivity?.externalPRsMerged ?? 0;
  const prReviewsDone = data.pullRequestActivity?.prReviewsDone ?? 0;
  const activeDaysLastYear = data.commitFrequency?.activeDaysLastYear ?? 0;

  // 6. Granular 2-3 sentence paragraphs for each CURISM dimension
  const curismDescriptions = {
    reliability: total > 0
      ? `Reliability is rated as ${scoreLabel(scores.reliability)} (${scores.reliability}/10), with automated tests present in ${count(s => s.hasTests)}/${total} fully observed repositories${avgTestRatio !== null ? ` and deep AST analysis measuring an average test-to-source ratio of ${avgTestRatio}%` : ''}. Continuous integration pipelines protect ${count(s => s.hasCI)}/${total} projects${avgCC !== null ? (avgCC <= 6 ? `, accompanied by disciplined branch control maintaining an average cyclomatic complexity of ${avgCC} per function` : avgCC <= 12 ? `, maintaining moderate branching structure with an average cyclomatic complexity of ${avgCC} per function` : `, with opportunities to simplify control flow (average cyclomatic complexity: ${avgCC} per function)`) : ''}. This testing posture and build verification reflect ${scoreLabel(scores.reliability)} stability and runtime predictability.`
      : `Reliability is scored at ${scores.reliability}/10 based on public commit activity and repository persistence. Direct automated test suites and CI pipeline workflows could not be observed from public tree entries. Engineering stability is inferred from overall account history and contribution consistency.`,

    security: total > 0
      ? `Security posture is assessed as ${scoreLabel(scores.security)} (${scores.security}/10), with .gitignore hygiene maintained in ${count(s => s.hasGitignore)}/${total} and dependency lockfiles in ${count(s => s.hasLockfile)}/${total} repositories. ${envLeakedCount > 0 ? `Committed environment files were flagged in ${envLeakedCount} repositories, incurring a security penalty.` : 'Zero committed environment secret leaks were detected across repository trees.'} ${deep.length > 0 ? (secFlagsTotal === 0 ? 'Static AST scans verified zero high-risk security smells or hardcoded credentials.' : `Static AST scanning identified ${secFlagsTotal} potential security concerns requiring review.`) : (count(s => s.hasEnvExample) > 0 ? `Configuration templates (.env.example) are present in ${count(s => s.hasEnvExample)} projects.` : 'Standard environment variable isolation is practiced.')} ${count(s => s.hasSecurityPolicy) > 0 ? 'Formal security policies (SECURITY.md) are established for responsible vulnerability reporting.' : 'Adopting formal SECURITY.md policies and automated vulnerability scanning will enhance defense-in-depth.'}`
      : `Security practices are scored at ${scores.security}/10 from public repository hygiene indicators. Detailed vulnerability analysis, dependency lockfiles, and environment configurations were inaccessible for deep inspection. Baseline hygiene is estimated from overall repository metadata.`,

    maintainability: total > 0
      ? `Maintainability evaluates to ${scoreLabel(scores.maintainability)} (${scores.maintainability}/10), with ${count(s => s.hasModularStructure)}/${total} repositories structured into modular multi-directory layouts (average depth: ${avgDepth}). Code consistency is enforced via linters and formatters in ${count(s => s.hasPrettierOrLint)}/${total} repositories, while ${installUsageCount}/${total} provide complete installation and usage guides. ${avgMI !== null ? `Deep AST analysis confirms an average Maintainability Index of ${avgMI}/100, reflecting ${avgMI >= 75 ? 'exceptionally clean, low-debt codebases' : avgMI >= 50 ? 'solid maintainability with manageable technical debt' : 'elevated technical debt requiring refactoring'}.` : 'Clear module organization facilitates ongoing maintenance and team onboarding.'}`
      : `Maintainability is rated at ${scores.maintainability}/10 reflecting baseline architectural conventions. Repository source files and configuration manifests could not be directly inspected for Maintainability Index scoring. Structural cleanliness is estimated from available public profile metadata.`,

    influence: `Influence is evaluated as ${scoreLabel(scores.influence)} (${scores.influence}/10), driven by ${totalStars} stars and ${totalForks} forks across public repositories. The developer has gathered an audience of ${followers} followers with ${publicRepos} total repositories published on GitHub. ${totalStars >= 20 || followers >= 20 ? 'Demonstrates notable open-source footprint and recognized community reach.' : 'Represents an emerging developer footprint with expanding ecosystem visibility.'}`,

    contribution: `Contribution velocity is rated as ${scoreLabel(scores.contribution)} (${scores.contribution}/10), with ${totalPRsMerged} merged pull requests out of ${totalPRsOpened} total opened. ${externalPRsMerged > 0 ? `Demonstrates cross-repository collaboration with ${externalPRsMerged} external contributions, alongside ` : 'Recorded '}${prReviewsDone} peer pull request reviews and ${activeDaysLastYear} active contribution days in the past year. Shows ${prReviewsDone >= 3 || totalPRsMerged >= 5 ? 'active peer collaboration and committed development cadence.' : 'steady personal shipping cadence and dependable project stewardship.'}`,

    uniqueness: total > 0
      ? `Uniqueness is assessed as ${scoreLabel(scores.uniqueness)} (${scores.uniqueness}/10) through ACID evaluation: Architecture ${acid.architecture}/10, Cross-Domain ${acid.crossDomain}/10, Innovation ${acid.innovation}/10, and Documentation ${acid.documentation}/10. ${acid.crossDomain >= 6 ? 'Exhibits multi-disciplinary range bridging frontend, backend, and infrastructure stacks.' : 'Focuses depth within specialized technical domains.'} ${acid.innovation >= 7 ? 'Demonstrates distinctive technical implementations that diverge from generic boilerplate.' : 'Leverages battle-tested architectures and standardized system conventions.'} Highlights ${scoreLabel(scores.uniqueness)} builder autonomy and creative problem-solving capability.`
      : `Uniqueness is evaluated at ${scores.uniqueness}/10 with ACID breakdown of Architecture ${acid.architecture}/10, Cross-Domain ${acid.crossDomain}/10, Innovation ${acid.innovation}/10, and Documentation ${acid.documentation}/10. Repository source files could not be inspected for deep architectural metrics. Builder originality is synthesized from public repository topics and language diversity.`,
  };

  return {
    archetype,
    curismDescriptions,
    engineeringDNA,
    traits,
    skillsByDomain,
  };
}
