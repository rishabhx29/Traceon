import assert from 'node:assert/strict';
import { getCriticalModuleIds, rankImportantNodes } from '../src/lib/analyzer/graph/importance.ts';
import { parseFileContent } from '../src/lib/analyzer/parser.ts';
import { computeAllCURISMScores } from '../src/lib/profile/curismScorer.ts';
import type { IGraphEdge, IGraphNode } from '../src/lib/db/models/AnalysisResult.ts';

const nodes: IGraphNode[] = [
  { id: 'src/app/page.tsx', label: 'page.tsx', type: 'entry', path: 'src/app/page.tsx', imports: [], exports: [], loc: 50, inDegree: 0, outDegree: 1 },
  { id: 'src/lib/auth.ts', label: 'auth.ts', type: 'utility', path: 'src/lib/auth.ts', imports: [], exports: [], loc: 80, inDegree: 3, outDegree: 0 },
  { id: 'src/types/session.ts', label: 'session.ts', type: 'type', path: 'src/types/session.ts', imports: [], exports: [], loc: 20, inDegree: 2, outDegree: 0 },
  { id: 'src/lib/auth.test.ts', label: 'auth.test.ts', type: 'utility', path: 'src/lib/auth.test.ts', imports: [], exports: [], loc: 70, inDegree: 10, outDegree: 0 },
  { id: 'src/lib/unused.ts', label: 'unused.ts', type: 'utility', path: 'src/lib/unused.ts', imports: [], exports: [], loc: 10, inDegree: 0, outDegree: 0 },
] ;
const edges: IGraphEdge[] = [
  { source: 'src/app/page.tsx', target: 'src/lib/auth.ts', relationship: 'imports', weight: 1 },
  { source: 'src/lib/auth.test.ts', target: 'src/lib/auth.ts', relationship: 'imports', weight: 1 },
] ;
const important = rankImportantNodes(nodes, edges);
const critical = getCriticalModuleIds(nodes, edges);
assert.deepEqual(important, rankImportantNodes(nodes, edges));
assert(!critical.includes('src/app/page.tsx'));
assert(critical.includes('src/lib/auth.ts'));
assert(!critical.includes('src/lib/auth.test.ts'));
assert(!critical.includes('src/lib/unused.ts'));

const python = parseFileContent('from app.services.auth import login\ndef run(): pass\nclass Session: pass', 'main.py');
assert.deepEqual(python.imports, ['app/services/auth']);
assert.deepEqual(python.functions, ['run']);
assert.deepEqual(python.classes, ['Session']);

import type { RepoQualitySignal, SecurityFlags } from '../src/lib/profile/types.ts';

const signal = (overrides: Partial<RepoQualitySignal> = {}): RepoQualitySignal => ({
  repoName: 'fixture', qualityObserved: true, treeTruncated: false, hasTests: false, hasCI: false, hasDockerfile: false,
  hasContributing: false, hasLicense: false, hasChangelog: false, hasPrettierOrLint: false, hasGitignore: false,
  hasEnvExample: false, hasEnvCommitted: false, hasDependencyManifest: true, hasLockfile: false, hasSecurityPolicy: false,
  openIssueCount: 0, dependencyCount: 0, lastCommitDate: '2026-01-01', isArchived: false, readmeWordCount: 0,
  readmeHasInstallInstructions: false, readmeHasUsageExamples: false, readmeHasScreenshots: false, hasApiDocs: false,
  hasWiki: false, totalLOC: 200, fileCount: 10, directoryDepth: 2, hasModularStructure: false, languages: { TypeScript: 100 },
  cyclomaticComplexity: undefined,
  highComplexityRatio: undefined,
  maintainabilityIndex: undefined,
  securityFlags: undefined,
  errorHandlingRatio: undefined,
  ...overrides,
});
const score = (repoSignals: RepoQualitySignal[]) => computeAllCURISMScores({
  repoSignals, avgCommitMessageLength: 55, totalStars: 10, totalForks: 2, followers: 5,
  filteredRepos: [{ name: 'fixture', owner: 'owner', description: 'A documented API service', language: 'TypeScript', stargazers_count: 10, forks_count: 2, topics: ['api'], created_at: '2024-01-01', updated_at: '2026-01-01', pushed_at: '2026-01-01', size: 100, fork: false, archived: false, html_url: '', open_issues_count: 0, has_wiki: false, default_branch: 'main', recencyWeight: 1, complexityWeight: 1, qualityBoost: 1, combinedWeight: 1 }],
  totalPRsOpened: 10, totalPRsMerged: 8, externalPRsMerged: 0, prReviewsDone: 5, externalIssues: 0, totalIssuesOpened: 3,
  activeDaysLastYear: 100, orgsCount: 2, readmeSnippets: {},
});
const beginner = score([signal()]);
const professional = score([signal({ hasTests: true, hasCI: true, hasDockerfile: true, hasContributing: true, hasLicense: true, hasPrettierOrLint: true, hasGitignore: true, hasEnvExample: true, hasLockfile: true, hasSecurityPolicy: true, readmeWordCount: 400, readmeHasInstallInstructions: true, readmeHasUsageExamples: true, hasApiDocs: true, hasModularStructure: true })]);
assert(professional.scores.reliability > beginner.scores.reliability + 4);
assert(professional.scores.security > beginner.scores.security + 3);
assert(professional.scores.maintainability > beginner.scores.maintainability + 4);

// ─── AST Evidence Tests: Complexity & Maintainability ───
const cleanRepo = score([signal({
  deepAnalysis: true,
  hasTests: true,
  testToCodeRatio: 0.3,
  meanFunctionLength: 20,
  commentDensity: 0.1,
  hasHighTodoDensity: false,
  cyclomaticComplexity: 3, // low CC (<= 6)
  highComplexityRatio: 0.05,
  maintainabilityIndex: 85, // high MI (>= 65)
  errorHandlingRatio: 0.6,
})]);

const messyRepo = score([signal({
  deepAnalysis: true,
  hasTests: true,
  testToCodeRatio: 0.3,
  meanFunctionLength: 60,
  commentDensity: 0.02,
  hasHighTodoDensity: true,
  cyclomaticComplexity: 18, // CC > 15 (and > 12)
  highComplexityRatio: 0.5, // > 0.25
  maintainabilityIndex: 20, // low MI
  errorHandlingRatio: 0.1,
})]);

// Low CC & high MI repo scores significantly higher in Reliability and Maintainability than CC > 15 & low MI
assert(cleanRepo.scores.reliability > messyRepo.scores.reliability + 3, 'Expected clean repo to have significantly higher reliability than complex repo');
assert(cleanRepo.scores.maintainability > messyRepo.scores.maintainability + 3, 'Expected clean repo to have significantly higher maintainability than low MI repo');
assert(cleanRepo.acidBreakdown.architecture > messyRepo.acidBreakdown.architecture, 'Expected clean repo to have higher architecture score in ACID breakdown');

// ─── AST Evidence Tests: Security Flags ───
const secureRepo = score([signal({
  deepAnalysis: true,
  hasGitignore: true,
  hasLockfile: true,
  hasEnvExample: true,
  hasSecurityPolicy: true,
  hasCI: true,
  securityFlags: {
    hardcodedSecrets: 0,
    unsafeCalls: 0,
    insecureCrypto: 0,
    rawSqlConcatenation: 0,
  },
})]);

const insecureRepo = score([signal({
  deepAnalysis: true,
  hasGitignore: true,
  hasLockfile: true,
  hasEnvExample: true,
  hasSecurityPolicy: true,
  hasCI: true,
  securityFlags: {
    hardcodedSecrets: 1, // 2.5 penalty
    rawSqlConcatenation: 1, // 1.5 penalty -> 4.0 total penalty
    unsafeCalls: 0,
    insecureCrypto: 0,
  },
})]);

const severelyInsecureRepo = score([signal({
  deepAnalysis: true,
  hasGitignore: true,
  hasLockfile: true,
  hasEnvExample: true,
  hasSecurityPolicy: true,
  hasCI: true,
  securityFlags: {
    hardcodedSecrets: 2, // 5.0
    rawSqlConcatenation: 2, // 3.0 -> total 8.0, capped at 6.0
    unsafeCalls: 1,
    insecureCrypto: 1,
  },
})]);

// Repos with detected security flags receive lower Security scores
assert(secureRepo.scores.security > insecureRepo.scores.security, 'Expected secure repo to have higher security score than repo with security flags');
assert.equal(secureRepo.scores.security, 10);
assert.equal(insecureRepo.scores.security, 6);
assert.equal(severelyInsecureRepo.scores.security, 4);

console.log('analysis checks passed');
