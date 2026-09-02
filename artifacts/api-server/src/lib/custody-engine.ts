/**
 * TreeGuard Custody Expiry Engine
 * THE CORE FEATURE: Ensures custody responsibility never lapses.
 * 
 * Calculates days remaining, auto-updates status, generates risk events.
 */

// Demo time offset in milliseconds (for the Demo Time Machine)
let demoTimeOffsetMs = 0;

export function setDemoTimeOffset(offsetMs: number) {
  demoTimeOffsetMs = offsetMs;
}

export function getDemoTimeOffset(): number {
  return demoTimeOffsetMs;
}

export function getCurrentDate(): Date {
  return new Date(Date.now() + demoTimeOffsetMs);
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export interface CustodyExpiryStatus {
  daysRemaining: number;
  status: "active" | "expiring" | "handoff_required" | "urgent" | "expired" | "escalated";
  label: string;
  severity: "low" | "medium" | "high" | "critical";
  emoji: string;
}

/**
 * Calculate custody status based on days remaining until expiry
 */
export function calculateCustodyStatus(expiryDateStr: string): CustodyExpiryStatus {
  const now = getCurrentDate();
  const expiry = new Date(expiryDateStr);
  const diffMs = expiry.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysRemaining <= 0) {
    return {
      daysRemaining,
      status: "expired",
      label: "EXPIRED — Custody Lapsed",
      severity: "critical",
      emoji: "🚨",
    };
  }

  if (daysRemaining <= 7) {
    return {
      daysRemaining,
      status: "handoff_required",
      label: `URGENT — ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`,
      severity: "critical",
      emoji: "⚠️",
    };
  }

  if (daysRemaining <= 30) {
    return {
      daysRemaining,
      status: "handoff_required",
      label: `Handoff Required — ${daysRemaining} days remaining`,
      severity: "high",
      emoji: "🔴",
    };
  }

  if (daysRemaining <= 60) {
    return {
      daysRemaining,
      status: "expiring",
      label: `Custody Expiring — ${daysRemaining} days remaining`,
      severity: "medium",
      emoji: "🟡",
    };
  }

  return {
    daysRemaining,
    status: "active",
    label: `Active — ${daysRemaining} days remaining`,
    severity: "low",
    emoji: "🟢",
  };
}

/**
 * Determine the DB custody_status enum value from calculated status
 */
export function toCustodyDbStatus(status: CustodyExpiryStatus["status"]): string {
  switch (status) {
    case "active": return "active";
    case "expiring": return "expiring";
    case "handoff_required": return "handoff_required";
    case "urgent": return "handoff_required";
    case "expired": return "expired";
    case "escalated": return "escalated";
    default: return "active";
  }
}

/**
 * Determine risk event severity from custody status
 */
export function toRiskSeverity(status: CustodyExpiryStatus["status"]): "low" | "medium" | "high" | "critical" {
  switch (status) {
    case "expired":
    case "escalated": return "critical";
    case "handoff_required":
    case "urgent": return "high";
    case "expiring": return "medium";
    default: return "low";
  }
}
