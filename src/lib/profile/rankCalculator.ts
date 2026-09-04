// src/lib/profile/rankCalculator.ts
// §13 — Developer Rank Thresholds & Percentile Calculation

import type { DeveloperGrade, MasterScoreData, CURISMScores } from './types';
import { computeFinalScore } from './curismScorer';
import dbConnect from '@/lib/db/connection';
import { ProfileAnalysis } from '@/lib/db/models/ProfileAnalysis';

// Minimum benchmark population before real percentiles are trusted.
const MIN_PERCENTILE_POPULATION = 25;

// ═══════════════════════════════════════════════════════════
// §13 — Grade Thresholds
// ═══════════════════════════════════════════════════════════

interface GradeThreshold {
  min: number;
  max: number;
  grade: DeveloperGrade;
  title: string;
}

const GRADE_THRESHOLDS: GradeThreshold[] = [
  { min: 8.91, max: 10.00, grade: 'S+', title: 'Staff Engineer / Exemplary' },
  { min: 7.34, max: 8.90,  grade: 'S',  title: 'Senior Developer' },
  { min: 5.89, max: 7.33,  grade: 'A',  title: 'Mid-Level Developer' },
  { min: 5.01, max: 5.88,  grade: 'B',  title: 'Junior Developer' },
  { min: 0.00, max: 5.00,  grade: 'C',  title: 'Intern / Beginner' },
];

/**
 * Determine the developer grade from a final score (0–10).
 */
export function getGrade(score: number): { grade: DeveloperGrade; title: string } {
  for (const threshold of GRADE_THRESHOLDS) {
    if (score >= threshold.min && score <= threshold.max) {
      return { grade: threshold.grade, title: threshold.title };
    }
  }
  // Fallback (should never happen if score is in [0, 10])
  return { grade: 'C', title: 'Intern / Beginner' };
}

/**
 * §13.1 — Percentile Calibration (synthetic fallback)
 *
 * Approximate percentile using a logistic curve centered around ~5.5.
 * Used only while the stored-profile benchmark population is below
 * MIN_PERCENTILE_POPULATION — real percentiles come from computeRealPercentile.
 */
export function getPercentile(score: number): number {
  // P(score) ≈ 100 / (1 + e^(-1.5 × (score - 5.5)))
  const percentile = 100 / (1 + Math.exp(-1.5 * (score - 5.5)));
  return Math.round(Math.min(99, Math.max(1, percentile)));
}

/**
 * Compute the complete Master Score from CURISM dimension scores.
 *
 * §10.3:
 *   Hard_Skills   = avg(Reliability, Security, Maintainability)
 *   Soft_Skills   = avg(Influence, Contribution)
 *   Builder_Skills = Uniqueness (ACID)
 *   Final_Score   = (Hard × 0.30) + (Soft × 0.40) + (Builder × 0.30)
 */
export function computeMasterScoreData(scores: CURISMScores, hasRepositoryEvidence: boolean = true): MasterScoreData {
  const hardSkills = (scores.reliability + scores.security + scores.maintainability) / 3;
  const softSkills = (scores.influence + scores.contribution) / 2;
  const builderSkills = scores.uniqueness;

  if (!hasRepositoryEvidence) {
    return {
      finalScore: 0,
      grade: 'N/A',
      gradeTitle: 'Insufficient public repository evidence',
      hardSkills: 0,
      softSkills: Math.round(softSkills * 10) / 10,
      builderSkills: 0,
      assessmentAvailable: false,
    };
  }

  const finalScore = computeFinalScore(hardSkills, softSkills, builderSkills);
  const { grade, title } = getGrade(finalScore);
  const percentile = getPercentile(finalScore);

  return {
    finalScore,
    grade,
    gradeTitle: title,
    hardSkills: Math.round(hardSkills * 10) / 10,
    softSkills: Math.round(softSkills * 10) / 10,
    builderSkills: Math.round(builderSkills * 10) / 10,
    percentile,
    assessmentAvailable: true,
  };
}

/**
 * §13.2 — Real Percentile Calibration
 *
 * Computes percentile against every stored assessable profile in MongoDB
 * instead of a synthetic curve. Returns undefined until the benchmark
 * population is large enough to be statistically meaningful (callers then
 * fall back to the synthetic logistic estimate).
 */
export async function computeRealPercentile(finalScore: number): Promise<number | undefined> {
  try {
    await dbConnect();
    const [above, total] = await Promise.all([
      ProfileAnalysis.countDocuments({ 'masterScore.assessmentAvailable': true, 'masterScore.finalScore': { $gt: finalScore } }),
      ProfileAnalysis.countDocuments({ 'masterScore.assessmentAvailable': true }),
    ]);
    if (total < MIN_PERCENTILE_POPULATION) return undefined;
    const percentile = Math.max(1, Math.min(99, Math.round(((total - above) / total) * 100)));
    console.log(`[Traceon] Real percentile for score ${finalScore}: ${percentile} (population ${total})`);
    return percentile;
  } catch (error) {
    console.warn('[Traceon] Real percentile computation failed:', error instanceof Error ? error.message : error);
    return undefined;
  }
}

/**
 * Export grade thresholds for frontend display
 */
export { GRADE_THRESHOLDS };
