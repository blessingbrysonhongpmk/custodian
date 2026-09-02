import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { treesTable } from "./trees";
import { usersTable } from "./users";

export const custodyStatusEnum = pgEnum("custody_status", [
  "active",
  "expiring",
  "handoff_required",
  "transferred",
  "expired",
  "escalated",
]);

export const handoffStatusEnum = pgEnum("handoff_status", [
  "initiated",
  "candidate_matching",
  "pending_acceptance",
  "completed",
  "rejected",
  "escalated",
]);

export const handoffReasonEnum = pgEnum("handoff_reason", [
  "graduation",
  "relocation",
  "role_change",
  "temporary_leave",
  "personal_reason",
  "project_completion",
]);

export const custodyAssignmentsTable = pgTable("custody_assignments", {
  id: serial("id").primaryKey(),
  treeId: integer("tree_id").references(() => treesTable.id).notNull(),
  custodianId: integer("custodian_id").references(() => usersTable.id).notNull(),
  startDate: text("start_date").notNull(),
  expiryDate: text("expiry_date").notNull(),
  status: custodyStatusEnum("status").notNull().default("active"),
  reliabilityAtAssignment: integer("reliability_at_assignment"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const custodyHandoffsTable = pgTable("custody_handoffs", {
  id: serial("id").primaryKey(),
  treeId: integer("tree_id").references(() => treesTable.id).notNull(),
  previousCustodianId: integer("previous_custodian_id").references(() => usersTable.id).notNull(),
  newCustodianId: integer("new_custodian_id").references(() => usersTable.id),
  initiatedAt: timestamp("initiated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  reason: handoffReasonEnum("reason").notNull(),
  status: handoffStatusEnum("status").notNull().default("initiated"),
  pledgeAccepted: boolean("pledge_accepted").default(false),
  certificateId: text("certificate_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCustodyAssignmentSchema = createInsertSchema(custodyAssignmentsTable).omit({ id: true, createdAt: true });
export type InsertCustodyAssignment = z.infer<typeof insertCustodyAssignmentSchema>;
export type CustodyAssignment = typeof custodyAssignmentsTable.$inferSelect;

export const insertCustodyHandoffSchema = createInsertSchema(custodyHandoffsTable).omit({ id: true, createdAt: true, initiatedAt: true });
export type InsertCustodyHandoff = z.infer<typeof insertCustodyHandoffSchema>;
export type CustodyHandoff = typeof custodyHandoffsTable.$inferSelect;
