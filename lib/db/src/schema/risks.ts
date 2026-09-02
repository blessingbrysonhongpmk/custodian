import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { treesTable } from "./trees";

export const riskTypeEnum = pgEnum("risk_type", [
  "custody_expiring",
  "missed_checkpoint",
  "health_decline",
  "verification_mismatch",
  "orphan_risk",
  "no_custodian",
]);

export const riskSeverityEnum = pgEnum("risk_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const riskStatusEnum = pgEnum("risk_status", [
  "open",
  "acknowledged",
  "resolved",
  "escalated",
]);

export const riskEventsTable = pgTable("risk_events", {
  id: serial("id").primaryKey(),
  treeId: integer("tree_id").references(() => treesTable.id).notNull(),
  riskType: riskTypeEnum("risk_type").notNull(),
  severity: riskSeverityEnum("severity").notNull(),
  reason: text("reason").notNull(),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
  status: riskStatusEnum("status").notNull().default("open"),
  suggestedAction: text("suggested_action"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const failureAutopsiesTable = pgTable("failure_autopsies", {
  id: serial("id").primaryKey(),
  treeId: integer("tree_id").references(() => treesTable.id).notNull(),
  failureCategory: text("failure_category").notNull(),
  primaryCause: text("primary_cause").notNull(),
  contributingFactors: text("contributing_factors"),
  preventability: text("preventability"),
  lessons: text("lessons"),
  classification: text("classification"),
  custodianAtFailure: text("custodian_at_failure"),
  lastVerifiedAliveDate: text("last_verified_alive_date"),
  zone: text("zone"),
  microclimateFactor: text("microclimate_factor"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRiskEventSchema = createInsertSchema(riskEventsTable).omit({ id: true, createdAt: true });
export type InsertRiskEvent = z.infer<typeof insertRiskEventSchema>;
export type RiskEvent = typeof riskEventsTable.$inferSelect;

export const insertFailureAutopsySchema = createInsertSchema(failureAutopsiesTable).omit({ id: true, createdAt: true });
export type InsertFailureAutopsy = z.infer<typeof insertFailureAutopsySchema>;
export type FailureAutopsyRecord = typeof failureAutopsiesTable.$inferSelect;
