import { UserNotFoundError, GitHubRateLimitError } from '@/lib/errors';
import type {
  FilteredRepo,
  RepoQualitySignal,
  GitHubUser,
  GitHubRepo,
  CommitSample,
  EnrichedProfileData,
} from './types';
import { filterAndWeightRepos } from './repoFilter';
import { deepScanRepo } from './deepScan';

export type { GitHubUser, GitHubRepo, CommitSample, EnrichedProfileData };

interface TreeEntry { path: string; type: 'blob' | 'tree'; size?: number }
interface RepositoryTree { entries: TreeEntry[]; truncated: boolean }
interface TreeSignals {
  qualityObserved: boolean;
  treeTruncated: boolean;
  hasTests: boolean;
  hasCI: boolean;
  hasDockerfile: boolean;
  hasContributing: boolean;
  hasLicense: boolean;
  hasChangelog: boolean;
  hasPrettierOrLint: boolean;
  hasGitignore: boolean;
  hasEnvExample: boolean;
  hasEnvCommitted: boolean;
  hasDependencyManifest: boolean;
  hasLockfile: boolean;
  hasSecurityPolicy: boolean;
  hasApiDocs: boolean;
  fileCount: number;
  directoryDepth: number;
  hasModularStructure: boolean;
  readmePath?: string;
}
interface RepoAnalysis {
  repoName: string;
  languages: Record<string, number>;
  commits: CommitSample[];
  readmeSnippet?: string;
  qualitySignal: RepoQualitySignal;
  manifestFiles?: Array<{ filename: string; content: string }>;
}

const getHeaders = (): Record<string, string> => ({
  Accept: 'application/vnd.github+json',
  'User-Agent': 'traceon-analyzer',
  'X-GitHub-Api-Version': '2022-11-28',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
});

function chunkArray<T>(items: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));
}

async function safeFetch(url: string, headers: Record<string, string>): Promise<Response | null> {
  try {
    const response = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });
    return response.ok ? response : null;
  } catch {
    return null;
  }
}

export async function fetchGitHubProfileData(username: string): Promise<EnrichedProfileData> {
  const headers = getHeaders();
  const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers, signal: AbortSignal.timeout(10_000) });
  if (!userResponse.ok) {
    if (userResponse.status === 404) throw new UserNotFoundError(`User ${username} not found on GitHub`);
    if (userResponse.status === 403 || userResponse.status === 429) {
      const reset = userResponse.headers.get('x-ratelimit-reset');
      throw new GitHubRateLimitError(`GitHub API rate limit exceeded for user ${username}`, reset ? new Date(Number(reset) * 1000) : undefined);
    }
    throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
  }
  const user = await userResponse.json() as GitHubUser;

  const allRepos: GitHubRepo[] = [];
  for (let page = 1; page <= 3; page += 1) {
    const response = await safeFetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed&page=${page}`, headers);
    if (!response) break;
    const repos = await response.json() as GitHubRepo[];
    allRepos.push(...repos);
    if (repos.length < 100) break;
  }

  const orgResponse = await safeFetch(`https://api.github.com/users/${encodeURIComponent(username)}/orgs?per_page=100`, headers);
  const orgs = orgResponse ? await orgResponse.json() as unknown[] : [];
  const filteredRepos = filterAndWeightRepos(allRepos);
  const deepRepos = filteredRepos.slice(0, 12);
  const languageBytes: Record<string, number> = {};
  const recentCommits: CommitSample[] = [];
  const readmeSnippets: Record<string, string> = {};
  const repoQualitySignals: RepoQualitySignal[] = [];
  const detectedManifests: Array<{ filename: string; content: string }> = [];

  for (const chunk of chunkArray(deepRepos, 4)) {
    const results = await Promise.all(chunk.map(async repo => {
      try {
        return await analyzeRepo(repo, headers, deepRepos.indexOf(repo));
      } catch (error) {
        console.warn(`[Traceon] Failed deep analysis for repo ${repo.name}:`, error);
        return null;
      }
    }));

    for (const result of results.filter((item): item is RepoAnalysis => item !== null).sort((a, b) => a.repoName.localeCompare(b.repoName))) {
      for (const [language, bytes] of Object.entries(result.languages)) {
        languageBytes[language] = (languageBytes[language] || 0) + bytes;
      }
      recentCommits.push(...result.commits);
      if (result.readmeSnippet) readmeSnippets[result.repoName] = result.readmeSnippet;
      if (result.manifestFiles && detectedManifests.length < 25) {
        const remaining = 25 - detectedManifests.length;
        const prefixed = result.manifestFiles.slice(0, remaining).map(file => ({
          filename: `${result.repoName}/${file.filename}`,
          content: file.content,
        }));
        detectedManifests.push(...prefixed);
      }
      repoQualitySignals.push(result.qualitySignal);
    }
  }

  repoQualitySignals.sort((a, b) => a.repoName.localeCompare(b.repoName));
  recentCommits.sort((a, b) => a.repoName.localeCompare(b.repoName) || b.date.localeCompare(a.date) || a.message.localeCompare(b.message));
  const [pullRequestActivity, issueActivity, commitFrequency] = await Promise.all([
    fetchPRActivity(username, headers),
    fetchIssueActivity(username, headers),
    fetchCommitFrequency(username, headers),
  ]);
  const accountCreated = new Date(user.created_at);
  const accountMonths = Math.max(0, (new Date().getFullYear() - accountCreated.getFullYear()) * 12 + new Date().getMonth() - accountCreated.getMonth());

  return {
    user,
    filteredRepos,
    allRepos,
    languageBytes,
    recentCommits,
    readmeSnippets,
    commitFrequency,
    pullRequestActivity,
    issueActivity,
    repoQualitySignals,
    accountAge: { years: Math.floor(accountMonths / 12), months: accountMonths % 12 },
    totalStarsReceived: allRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
    totalForksReceived: allRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
    orgsCount: Array.isArray(orgs) ? orgs.length : 0,
    detectedManifests,
  };
}

async function analyzeRepo(repo: FilteredRepo, headers: Record<string, string>, index: number): Promise<RepoAnalysis> {
  const treePromise = fetchRepositoryTree(repo.owner, repo.name, repo.default_branch || 'HEAD', headers);
  const languagePromise = index < 8 ? fetchLanguages(repo.owner, repo.name, headers) : Promise.resolve({});
  const commitPromise = index < 8 ? fetchCommitSamples(repo.owner, repo.name, headers) : Promise.resolve([]);
  const [tree, languages, commits] = await Promise.all([treePromise, languagePromise, commitPromise]);
  const signals = inspectTree(tree);
  // Deep static analysis on the strongest repos only — bounded work, evidence-grade metrics.
  const deepMetrics = index < 5 && signals.qualityObserved && !signals.treeTruncated
    ? await deepScanRepo(repo.owner, repo.name, repo.default_branch || 'HEAD')
    : undefined;
  const readmeSnippet = signals.readmePath ? await fetchReadme(repo.owner, repo.name, signals.readmePath, headers) : undefined;
  const readme = analyzeReadme(readmeSnippet);

  return {
    repoName: repo.name,
    languages,
    commits: commits.map(commit => ({ repoName: repo.name, ...commit })),
    readmeSnippet,
    manifestFiles: deepMetrics?.manifestFiles,
    qualitySignal: {
      ...deepMetrics,
      repoName: repo.name,
      qualityObserved: signals.qualityObserved,
      treeTruncated: signals.treeTruncated,
      hasTests: signals.hasTests,
      hasCI: signals.hasCI,
      hasDockerfile: signals.hasDockerfile,
      hasContributing: signals.hasContributing,
      hasLicense: signals.hasLicense,
      hasChangelog: signals.hasChangelog,
      hasPrettierOrLint: signals.hasPrettierOrLint,
      hasGitignore: signals.hasGitignore,
      hasEnvExample: signals.hasEnvExample,
      hasEnvCommitted: signals.hasEnvCommitted,
      hasDependencyManifest: signals.hasDependencyManifest,
      hasLockfile: signals.hasLockfile,
      hasSecurityPolicy: signals.hasSecurityPolicy,
      openIssueCount: repo.open_issues_count || 0,
      dependencyCount: 0,
      lastCommitDate: repo.pushed_at,
      isArchived: repo.archived,
      readmeWordCount: readme.wordCount,
      readmeHasInstallInstructions: readme.hasInstallInstructions,
      readmeHasUsageExamples: readme.hasUsageExamples,
      readmeHasScreenshots: readme.hasScreenshots,
      hasApiDocs: signals.hasApiDocs,
      hasWiki: repo.has_wiki,
      totalLOC: 0,
      fileCount: signals.fileCount,
      directoryDepth: signals.directoryDepth,
      hasModularStructure: signals.hasModularStructure,
      languages,
    },
  };
}
async function fetchRepositoryTree(owner: string, repo: string, ref: string, headers: Record<string, string>): Promise<RepositoryTree | null> {
  const response = await safeFetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(ref)}?recursive=1`, headers);
  if (!response) return null;
  const data = await response.json() as { tree?: TreeEntry[]; truncated?: boolean };
  return { entries: data.tree?.filter(entry => entry.type === 'blob' || entry.type === 'tree') ?? [], truncated: data.truncated === true };
}

function inspectTree(tree: RepositoryTree | null): TreeSignals {
  if (!tree) {
    return {
      qualityObserved: false, treeTruncated: false, hasTests: false, hasCI: false, hasDockerfile: false, hasContributing: false,
      hasLicense: false, hasChangelog: false, hasPrettierOrLint: false, hasGitignore: false, hasEnvExample: false,
      hasEnvCommitted: false, hasDependencyManifest: false, hasLockfile: false, hasSecurityPolicy: false, hasApiDocs: false,
      fileCount: 0, directoryDepth: 0, hasModularStructure: false,
    };
  }

  const paths = tree.entries.filter(entry => entry.type === 'blob').map(entry => entry.path.replace(/^\/+/, ''));
  const lowerPaths = paths.map(path => path.toLowerCase());
  const topDirectories = new Set(paths.map(path => path.split('/')[0]).filter(part => part && !part.startsWith('.') && !['node_modules', 'dist', 'build', 'coverage', 'out'].includes(part)));
  const hasPath = (predicate: (path: string) => boolean) => lowerPaths.some(predicate);
  const readmePath = paths.find(path => /^readme(?:\.[^/]+)?$/i.test(path.split('/').pop() || ''));

  return {
    qualityObserved: true,
    treeTruncated: tree.truncated,
    hasTests: hasPath(path => /(^|\/)(?:__tests__|test|tests|spec|specs)\//.test(path) || /\.(?:test|spec)\.[^/]+$/.test(path) || /(?:^|\/)(?:jest|vitest|playwright|pytest)\.(?:config|ini)/.test(path)),
    hasCI: hasPath(path => path.startsWith('.github/workflows/') || path.startsWith('.circleci/') || /(?:^|\/)(?:jenkinsfile|\.gitlab-ci\.yml|\.travis\.yml)$/.test(path)),
    hasDockerfile: hasPath(path => /(^|\/)(?:dockerfile|docker-compose(?:\.[^/]+)?)$/.test(path)),
    hasContributing: hasPath(path => /(^|\/)contributing(?:\.[^/]+)?$/.test(path)),
    hasLicense: hasPath(path => /(^|\/)licen[cs]e(?:\.[^/]+)?$/.test(path)),
    hasChangelog: hasPath(path => /(^|\/)(?:changelog|changes|history)(?:\.[^/]+)?$/.test(path)),
    hasPrettierOrLint: hasPath(path => /(^|\/)(?:eslint|prettier|biome|stylelint|pylintrc|\.flake8|\.rubocop)/.test(path)),
    hasGitignore: hasPath(path => /(^|\/)\.gitignore$/.test(path)),
    hasEnvExample: hasPath(path => /(^|\/)\.env\.(?:example|sample|template)$/.test(path)),
    hasEnvCommitted: hasPath(path => /(^|\/)\.env(?:\.(?!example$|sample$|template$)[^/]+)?$/.test(path)),
    hasDependencyManifest: hasPath(path => /(^|\/)(?:package\.json|pyproject\.toml|requirements(?:-[^/]+)?\.txt|go\.mod|cargo\.toml|gemfile|composer\.json)$/.test(path)),
    hasLockfile: hasPath(path => /(^|\/)(?:package-lock\.json|yarn\.lock|pnpm-lock\.yaml|bun\.lockb?|poetry\.lock|pipfile\.lock|cargo\.lock|composer\.lock)$/.test(path)),
    hasSecurityPolicy: hasPath(path => /(^|\/)(?:security\.md|\.github\/dependabot\.yml|\.github\/workflows\/.*(?:codeql|security).+\.ya?ml)$/.test(path)),
    hasApiDocs: hasPath(path => /(^|\/)(?:swagger|openapi)\.(?:json|ya?ml)$/.test(path) || /(^|\/)apidoc/.test(path)),
    fileCount: paths.length,
    directoryDepth: Math.min(10, Math.max(0, ...paths.map(path => path.split('/').length - 1))),
    hasModularStructure: topDirectories.size >= 2 && paths.length >= 5,
    readmePath,
  };
}

async function fetchLanguages(owner: string, repo: string, headers: Record<string, string>): Promise<Record<string, number>> {
  const response = await safeFetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`, headers);
  return response ? await response.json() as Record<string, number> : {};
}

async function fetchCommitSamples(owner: string, repo: string, headers: Record<string, string>): Promise<Array<{ message: string; date: string }>> {
  const response = await safeFetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=5`, headers);
  if (!response) return [];
  const commits = await response.json() as Array<{ commit?: { message?: string; author?: { date?: string } } }>;
  return commits.flatMap(commit => commit.commit?.message ? [{ message: commit.commit.message.split('\n')[0], date: commit.commit.author?.date || '' }] : []);
}

async function fetchReadme(owner: string, repo: string, readmePath: string, headers: Record<string, string>): Promise<string | undefined> {
  const response = await safeFetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${readmePath.split('/').map(encodeURIComponent).join('/')}`, headers);
  if (!response) return undefined;
  const data = await response.json() as { content?: string; encoding?: string };
  return data.encoding === 'base64' && data.content ? Buffer.from(data.content, 'base64').toString('utf8') : undefined;
}

function analyzeReadme(content?: string): { wordCount: number; hasInstallInstructions: boolean; hasUsageExamples: boolean; hasScreenshots: boolean } {
  if (!content) return { wordCount: 0, hasInstallInstructions: false, hasUsageExamples: false, hasScreenshots: false };
  const lower = content.toLowerCase();
  return {
    wordCount: content.split(/\s+/).filter(Boolean).length,
    hasInstallInstructions: /install|setup|getting started|npm install|pip install|yarn add|pnpm add|brew install/.test(lower),
    hasUsageExamples: /```[\s\S]*?```|usage|example|how to use/.test(lower),
    hasScreenshots: /!\[.*?\]\(.*?\)|<img\s|screenshot|demo|preview/.test(lower),
  };
}

async function fetchPRActivity(username: string, headers: Record<string, string>) {
  const encodedUser = encodeURIComponent(username);
  const [opened, merged, reviewed] = await Promise.all([
    safeFetch(`https://api.github.com/search/issues?q=author:${encodedUser}+type:pr&per_page=1`, headers),
    safeFetch(`https://api.github.com/search/issues?q=author:${encodedUser}+type:pr+is:merged&per_page=1`, headers),
    safeFetch(`https://api.github.com/search/issues?q=reviewed-by:${encodedUser}+type:pr&per_page=1`, headers),
  ]);
  const count = async (response: Response | null) => response ? Number((await response.json() as { total_count?: number }).total_count || 0) : 0;
  const [totalPRsOpened, totalPRsMerged, prReviewsDone] = await Promise.all([count(opened), count(merged), count(reviewed)]);
  // GitHub Search cannot identify every destination repository from a count. Do
  // not fabricate an external-contribution estimate.
  return { totalPRsOpened, totalPRsMerged, externalPRsMerged: 0, prReviewsDone };
}

async function fetchIssueActivity(username: string, headers: Record<string, string>) {
  const response = await safeFetch(`https://api.github.com/search/issues?q=author:${encodeURIComponent(username)}+type:issue&per_page=1`, headers);
  const data = response ? await response.json() as { total_count?: number } : null;
  return { totalOpened: Number(data?.total_count || 0), externalIssues: 0 };
}

const CONTRIBUTION_QUERY = `query($username: String!, $from: DateTime!, $to: DateTime!) { user(login: $username) { contributionsCollection(from: $from, to: $to) { contributionCalendar { totalContributions weeks { contributionDays { contributionCount date } } } } } }`;

async function fetchCommitFrequency(username: string, headers: Record<string, string>) {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    try {
      const to = new Date();
      const from = new Date(to.getTime() - 365 * 24 * 60 * 60 * 1000);
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: CONTRIBUTION_QUERY, variables: { username, from: from.toISOString(), to: to.toISOString() } }),
        signal: AbortSignal.timeout(10_000),
      });
      const data = response.ok ? await response.json() as { data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions?: number; weeks?: Array<{ contributionDays?: Array<{ contributionCount?: number; date?: string }> }> } } } } } : null;
      const days = data?.data?.user?.contributionsCollection?.contributionCalendar?.weeks?.flatMap(week => week.contributionDays || []) || [];
      if (days.length > 0) {
        const now = Date.now();
        const sum = (withinDays: number) => days.reduce((total, day) => now - new Date(day.date || '').getTime() <= withinDays * 86_400_000 ? total + (day.contributionCount || 0) : total, 0);
        return {
          last30Days: sum(30),
          last90Days: sum(90),
          last365Days: data?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions || 0,
          activeDaysLastYear: days.filter(day => (day.contributionCount || 0) > 0).length,
        };
      }
    } catch {
      // The public Events API is a limited fallback, not extrapolated data.
    }
  }

  const response = await safeFetch(`https://api.github.com/users/${encodeURIComponent(username)}/events?per_page=100`, headers);
  const events = response ? await response.json() as Array<{ type?: string; created_at?: string; payload?: { commits?: unknown[] } }> : [];
  const activeDates = new Set<string>();
  const totals = { last30Days: 0, last90Days: 0, last365Days: 0 };
  const now = Date.now();
  for (const event of events) {
    if (event.type !== 'PushEvent' || !event.created_at) continue;
    const ageDays = (now - new Date(event.created_at).getTime()) / 86_400_000;
    const commits = event.payload?.commits?.length || 1;
    if (ageDays <= 30) totals.last30Days += commits;
    if (ageDays <= 90) totals.last90Days += commits;
    if (ageDays <= 365) {
      totals.last365Days += commits;
      activeDates.add(event.created_at.slice(0, 10));
    }
  }
  return { ...totals, activeDaysLastYear: activeDates.size };
}
