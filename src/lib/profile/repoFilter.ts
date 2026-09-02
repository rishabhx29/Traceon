// src/lib/profile/repoFilter.ts
// §11 — Repository Pre-Processing & Filtering

import type { FilteredRepo } from './types';

interface RawGitHubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  fork: boolean;
  archived: boolean;
  html_url: string;
  open_issues_count: number;
  has_wiki: boolean;
  default_branch: string;
  owner: { login: string };
}

/**
 * §11.1 — Inclusion Criteria
 * Filters repos that are meaningful for analysis.
 */
function passesInclusionCriteria(repo: RawGitHubRepo): boolean {
  // Exclude forks — not original work
  if (repo.fork) return false;

  // Keep small, old, and language-less repositories in the evidence set. A
  // maintained CLI, configuration project, or mature library can be valuable.
  if (repo.size <= 0 && !repo.description && (!repo.topics || repo.topics.length === 0)) return false;

  return true;
}

/**
 * §10.1 — Recency Weighting
 * Recent repos carry more weight in scoring.
 */
function computeRecencyWeight(pushedAt: string): number {
  const monthsOld = monthsSince(pushedAt);

  if (monthsOld < 6) return 1.0;
  if (monthsOld < 12) return 0.85;
  if (monthsOld < 24) return 0.70;
  return 0.50;
}

/**
 * §10.1 — Complexity Weighting
 * Larger codebases carry more weight (proxy for serious projects).
 */
function computeComplexityWeight(repoSizeKB: number): number {
  // repo.size is in KB. Approximate LOC ~ size × 10 (rough heuristic).
  const estimatedLOC = repoSizeKB * 10;

  if (estimatedLOC > 10000) return 1.2;
  if (estimatedLOC > 1000) return 1.0;
  return 0.7;
}

/**
 * §11.2 — Quality Signals for Inclusion Weight
 * Boost weight for repos with quality indicators.
 */
function computeQualityBoost(repo: RawGitHubRepo): number {
  let boost = 1.0;

  if (repo.stargazers_count > 5) boost *= 1.3;
  if (repo.forks_count > 2) boost *= 1.2;
  if (repo.topics && repo.topics.length > 0) boost *= 1.05;

  return boost;
}

/**
 * Main filtering function — returns only repos worth scoring,
 * annotated with recency/complexity/quality weights.
 */
export function filterAndWeightRepos(
  repos: RawGitHubRepo[],
): FilteredRepo[] {
  return repos
    .filter(passesInclusionCriteria)
    .map(repo => {
      const recencyWeight = computeRecencyWeight(repo.pushed_at);
      const complexityWeight = computeComplexityWeight(repo.size);
      const qualityBoost = computeQualityBoost(repo);

      return {
        name: repo.name,
        owner: repo.owner.login,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        topics: repo.topics || [],
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        pushed_at: repo.pushed_at,
        size: repo.size,
        fork: repo.fork,
        archived: repo.archived,
        html_url: repo.html_url,
        open_issues_count: repo.open_issues_count,
        has_wiki: repo.has_wiki,
        default_branch: repo.default_branch,
        recencyWeight,
        complexityWeight,
        qualityBoost,
        combinedWeight: recencyWeight * complexityWeight * qualityBoost,
      };
    })
    // Sort by combined weight descending — best repos first
    .sort((a, b) => b.combinedWeight - a.combinedWeight || b.pushed_at.localeCompare(a.pushed_at) || b.stargazers_count - a.stargazers_count || a.name.localeCompare(b.name));
}

/**
 * Utility: months since a given ISO date string
 */
function monthsSince(dateStr: string): number {
  const date = new Date(dateStr);
  const now = new Date();
  return (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());
}
