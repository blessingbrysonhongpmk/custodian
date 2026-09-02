/**
 * TreeGuard GPS Verification
 * 
 * Haversine distance calculation for verifying checkpoint GPS against tree registration.
 */

export interface GpsVerificationResult {
  distanceMeters: number;
  status: "excellent" | "acceptable" | "flagged" | "mismatch";
  label: string;
  emoji: string;
}

/**
 * Calculate Haversine distance in meters between two coordinates
 */
export function haversineDistanceMeters(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000; // Earth radius in meters
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
 * Verify GPS proximity of a checkpoint submission against registered tree location
 */
export function verifyGps(
  treeLat: number, treeLon: number,
  checkpointLat: number, checkpointLon: number,
): GpsVerificationResult {
  const distance = haversineDistanceMeters(treeLat, treeLon, checkpointLat, checkpointLon);
  const distanceMeters = Math.round(distance);

  if (distanceMeters <= 50) {
    return {
      distanceMeters,
      status: "excellent",
      label: `📍 Location Verified — ${distanceMeters}m from registered coordinates`,
      emoji: "📍",
    };
  }

  if (distanceMeters <= 150) {
    return {
      distanceMeters,
      status: "acceptable",
      label: `📍 Location Acceptable — ${distanceMeters}m from registered coordinates`,
      emoji: "📍",
    };
  }

  if (distanceMeters <= 300) {
    return {
      distanceMeters,
      status: "flagged",
      label: `⚠ Location Flagged — ${distanceMeters}m from registered coordinates`,
      emoji: "⚠",
    };
  }

  return {
    distanceMeters,
    status: "mismatch",
    label: `🚨 Location Mismatch — ${distanceMeters}m from registered coordinates`,
    emoji: "🚨",
  };
}
