import { pgTable, text, serial, integer, real, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { treesTable } from "./trees";
import { usersTable } from "./users";

export const checkpointTypeEnum = pgEnum("checkpoint_type", [
  "planting",
  "1_month",
  "6_month",
  "1_year",
  "3_year",
  "manual",
]);

export const verificationStatusEnum = pgEnum("verification_status", [
  "pending",
  "verified",
  "flagged",
  "rejected",
  "human_review",
]);

export const checkpointsTable = pgTable("checkpoints", {
  id: serial("id").primaryKey(),
  treeId: integer("tree_id").references(() => treesTable.id).notNull(),
  checkpointType: checkpointTypeEnum("checkpoint_type").notNull(),
  photoUrl: text("photo_url"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  submittedBy: integer("submitted_by").references(() => usersTable.id),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  healthStatus: text("health_status"),
  aiConfidenceScore: real("ai_confidence_score"),
  gpsMatch: boolean("gps_match"),
  gpsDistance: real("gps_distance"),
  timestampValid: boolean("timestamp_valid"),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("pending"),
  verifierId: integer("verifier_id").references(() => usersTable.id),
  verifiedAt: timestamp("verified_at"),
  aiAnalysis: text("ai_analysis"),
  notes: text("notes"),
  heightCm: integer("height_cm"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCheckpointSchema = createInsertSchema(checkpointsTable).omit({ id: true, createdAt: true });
export type InsertCheckpoint = z.infer<typeof insertCheckpointSchema>;
export type Checkpoint = typeof checkpointsTable.$inferSelect;
