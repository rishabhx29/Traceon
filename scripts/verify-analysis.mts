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

const signal = (overrides = {}) => ({
  repoName: 'fixture', qualityObserved: true, treeTruncated: false, hasTests: false, hasCI: false, hasDockerfile: false,
  hasContributing: false, hasLicense: false, hasChangelog: false, hasPrettierOrLint: false, hasGitignore: false,
  hasEnvExample: false, hasEnvCommitted: false, hasDependencyManifest: true, hasLockfile: false, hasSecurityPolicy: false,
  openIssueCount: 0, dependencyCount: 0, lastCommitDate: '2026-01-01', isArchived: false, readmeWordCount: 0,
  readmeHasInstallInstructions: false, readmeHasUsageExamples: false, readmeHasScreenshots: false, hasApiDocs: false,
  hasWiki: false, totalLOC: 200, fileCount: 10, directoryDepth: 2, hasModularStructure: false, languages: { TypeScript: 100 },
  ...overrides,
});
const score = (repoSignals: ReturnType<typeof signal>[]) => computeAllCURISMScores({
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

console.log('analysis checks passed');
