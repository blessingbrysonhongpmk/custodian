/**
 * TreeGuard Orphan Risk Score Calculator
 * 
 * Deterministic risk scoring (not ML) that predicts likelihood of a tree becoming orphaned.
 * Score range: 0-100
 *   0-29:  Low
 *   30-59: Moderate  
 *   60-79: High
 *   80-100: Critical
 */

export interface OrphanRiskResult {
  score: number;
  level: "low" | "moderate" | "high" | "critical";
  factors: string[];
  recommendedAction: string;
}

export interface OrphanRiskInput {
  custodyDaysRemaining: number | null; // null = no custodian
  custodianInactiveDays: number;
  missedCheckpoints: number;
  totalCheckpointsDue: number;
  backupCandidateCount: number;
  reliabilityScore: number;
  projectEndingSoon: boolean; // org/project ending within 90 days
}

export function calculateOrphanRisk(input: OrphanRiskInput): OrphanRiskResult {
  const factors: string[] = [];
  let score = 0;

  // Factor 1: Custody expiry proximity (0-30 points)
  if (input.custodyDaysRemaining === null) {
    score += 30;
    factors.push("No active custodian assigned.");
  } else if (input.custodyDaysRemaining <= 0) {
    score += 28;
    factors.push("Custody has expired.");
  } else if (input.custodyDaysRemaining <= 7) {
    score += 25;
    factors.push(`Custody expires in ${input.custodyDaysRemaining} days.`);
  } else if (input.custodyDaysRemaining <= 14) {
    score += 20;
    factors.push(`Custody expires in ${input.custodyDaysRemaining} days.`);
  } else if (input.custodyDaysRemaining <= 30) {
    score += 15;
    factors.push(`Custody expires in ${input.custodyDaysRemaining} days.`);
  } else if (input.custodyDaysRemaining <= 60) {
    score += 8;
    factors.push(`Custody expires in ${input.custodyDaysRemaining} days.`);
  }

  // Factor 2: Custodian inactivity (0-20 points)
  if (input.custodianInactiveDays > 30) {
    score += 20;
    factors.push(`Custodian inactive for ${input.custodianInactiveDays} days.`);
  } else if (input.custodianInactiveDays > 14) {
    score += 12;
    factors.push(`Custodian inactive for ${input.custodianInactiveDays} days.`);
  } else if (input.custodianInactiveDays > 7) {
    score += 5;
  }

  // Factor 3: Missed checkpoints (0-20 points)
  if (input.totalCheckpointsDue > 0) {
    const missRate = input.missedCheckpoints / input.totalCheckpointsDue;
    if (missRate >= 0.5) {
      score += 20;
      factors.push(`${input.missedCheckpoints} of ${input.totalCheckpointsDue} checkpoints missed.`);
    } else if (missRate >= 0.25) {
      score += 10;
      factors.push("Checkpoint overdue.");
    }
  }

  // Factor 4: No backup candidates (0-15 points)
  if (input.backupCandidateCount === 0) {
    score += 15;
    factors.push("No confirmed successor available.");
  } else if (input.backupCandidateCount <= 2) {
    score += 5;
    factors.push(`Only ${input.backupCandidateCount} potential successor(s).`);
  }

  // Factor 5: Low reliability (0-10 points)
  if (input.reliabilityScore < 50) {
    score += 10;
    factors.push("Custodian reliability score is below threshold.");
  } else if (input.reliabilityScore < 70) {
    score += 5;
  }

  // Factor 6: Project ending (0-5 points)
  if (input.projectEndingSoon) {
    score += 5;
    factors.push("Associated project/organization ending soon.");
  }

  // Cap at 100
  score = Math.min(100, score);

  // Determine level
  let level: OrphanRiskResult["level"];
  let recommendedAction: string;

  if (score >= 80) {
    level = "critical";
    recommendedAction = "Initiate institutional intervention immediately.";
  } else if (score >= 60) {
    level = "high";
    recommendedAction = "Urgently find and assign successor custodian.";
  } else if (score >= 30) {
    level = "moderate";
    recommendedAction = "Monitor closely and prepare successor list.";
  } else {
    level = "low";
    recommendedAction = "No immediate action required.";
  }

  return { score, level, factors, recommendedAction };
}
