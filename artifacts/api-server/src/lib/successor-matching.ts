/**
 * TreeGuard Successor Matching Engine
 * 
 * Recommends the best custodian candidates when a custody handoff is needed.
 * 
 * Candidate Score formula:
 *   score = distance * 0.40 + availability * 0.25 + reliability * 0.20 + org_compat * 0.10 + capacity * 0.05
 */

export interface SuccessorCandidate {
  userId: number;
  name: string;
  email: string;
  organizationId: number | null;
  reliabilityScore: number;
  currentTreeCount: number;
  distanceKm: number;
  matchScore: number;
  matchBreakdown: {
    distanceScore: number;
    availabilityScore: number;
    reliabilityScoreNorm: number;
    organizationScore: number;
    capacityScore: number;
  };
  reasons: string[];
}

/**
 * Haversine distance between two lat/lng points in kilometers
 */
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Calculate distance score (closer is better, max range ~10km)
 */
function calculateDistanceScore(distanceKm: number): number {
  if (distanceKm <= 0.5) return 100;
  if (distanceKm <= 1) return 90;
  if (distanceKm <= 2) return 75;
  if (distanceKm <= 5) return 50;
  if (distanceKm <= 10) return 25;
  return 10;
}

/**
 * Calculate availability score (fewer assigned trees = more available)
 */
function calculateAvailabilityScore(currentTreeCount: number): number {
  if (currentTreeCount === 0) return 100;
  if (currentTreeCount === 1) return 85;
  if (currentTreeCount <= 3) return 65;
  if (currentTreeCount <= 5) return 40;
  return 20;
}

/**
 * Calculate organization compatibility score
 */
function calculateOrgScore(candidateOrgId: number | null, treeAnchorOrgId: number): number {
  if (candidateOrgId === treeAnchorOrgId) return 100;
  if (candidateOrgId !== null) return 60; // different org but still affiliated
  return 30; // no org
}

/**
 * Calculate capacity score (inverse of tree load)
 */
function calculateCapacityScore(currentTreeCount: number, maxCapacity: number = 10): number {
  const loadPercentage = currentTreeCount / maxCapacity;
  return Math.max(0, Math.round((1 - loadPercentage) * 100));
}

/**
 * Score and rank successor candidates
 */
export function rankSuccessorCandidates(
  candidates: Array<{
    userId: number;
    name: string;
    email: string;
    organizationId: number | null;
    reliabilityScore: number;
    currentTreeCount: number;
    latitude?: number;
    longitude?: number;
  }>,
  treeLat: number,
  treeLon: number,
  treeAnchorOrgId: number,
): SuccessorCandidate[] {
  return candidates
    .map((c) => {
      // For demo, if no lat/lng, assume close proximity with some variance
      const distanceKm = (c.latitude && c.longitude)
        ? haversineDistance(treeLat, treeLon, c.latitude, c.longitude)
        : 0.3 + Math.random() * 2;

      const distanceScore = calculateDistanceScore(distanceKm);
      const availabilityScore = calculateAvailabilityScore(c.currentTreeCount);
      const reliabilityScoreNorm = Math.min(100, c.reliabilityScore);
      const organizationScore = calculateOrgScore(c.organizationId, treeAnchorOrgId);
      const capacityScore = calculateCapacityScore(c.currentTreeCount);

      const matchScore = Math.round(
        distanceScore * 0.40 +
        availabilityScore * 0.25 +
        reliabilityScoreNorm * 0.20 +
        organizationScore * 0.10 +
        capacityScore * 0.05
      );

      const reasons: string[] = [];
      if (distanceKm <= 1) reasons.push(`Only ${distanceKm.toFixed(1)} km from tree location`);
      if (c.reliabilityScore >= 90) reasons.push(`High reliability score: ${c.reliabilityScore}/100`);
      if (c.currentTreeCount <= 2) reasons.push(`Low current load: ${c.currentTreeCount} trees assigned`);
      if (c.organizationId === treeAnchorOrgId) reasons.push("Same institutional anchor");
      if (availabilityScore >= 85) reasons.push("High availability");

      return {
        userId: c.userId,
        name: c.name,
        email: c.email,
        organizationId: c.organizationId,
        reliabilityScore: c.reliabilityScore,
        currentTreeCount: c.currentTreeCount,
        distanceKm: Math.round(distanceKm * 10) / 10,
        matchScore,
        matchBreakdown: {
          distanceScore,
          availabilityScore,
          reliabilityScoreNorm,
          organizationScore,
          capacityScore,
        },
        reasons,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}
