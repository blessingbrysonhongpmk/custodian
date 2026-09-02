import { pgTable, text, serial, integer, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { organizationsTable } from "./organizations";

export const treeStatusEnum = pgEnum("tree_status", [
  "healthy",
  "needs_attention",
  "at_risk",
  "critical",
  "dead",
  "orphaned",
  "verification_pending",
]);

export const treesTable = pgTable("trees", {
  id: serial("id").primaryKey(),
  treeCode: text("tree_code").notNull().unique(),
  qrCode: text("qr_code"),
  species: text("species").notNull(),
  botanicalName: text("botanical_name"),
  nickname: text("nickname"),
  latitude: real("latitude").notNull(),
  longitude: real("longitude").notNull(),
  plantingDate: text("planting_date").notNull(),
  plantingPhotoUrl: text("planting_photo_url"),
  currentPhotoUrl: text("current_photo_url"),
  institutionalAnchorId: integer("institutional_anchor_id").references(() => organizationsTable.id).notNull(),
  currentStatus: treeStatusEnum("current_status").notNull().default("healthy"),
  healthScore: integer("health_score").notNull().default(90),
  initialHeightCm: integer("initial_height_cm"),
  currentHeightCm: integer("current_height_cm"),
  zone: text("zone"),
  landmark: text("landmark"),
  growthStage: integer("growth_stage").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTreeSchema = createInsertSchema(treesTable).omit({ id: true, createdAt: true });
export type InsertTree = z.infer<typeof insertTreeSchema>;
export type TreeRecord = typeof treesTable.$inferSelect;
