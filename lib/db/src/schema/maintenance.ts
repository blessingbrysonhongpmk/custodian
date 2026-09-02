import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { treesTable } from "./trees";
import { usersTable } from "./users";

export const maintenanceActionEnum = pgEnum("maintenance_action", [
  "watered",
  "fertilized",
  "pruned",
  "inspected",
  "protected",
  "emergency_intervention",
]);

export const maintenanceLogsTable = pgTable("maintenance_logs", {
  id: serial("id").primaryKey(),
  treeId: integer("tree_id").references(() => treesTable.id).notNull(),
  custodianId: integer("custodian_id").references(() => usersTable.id).notNull(),
  actionType: maintenanceActionEnum("action_type").notNull(),
  notes: text("notes"),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMaintenanceLogSchema = createInsertSchema(maintenanceLogsTable).omit({ id: true, createdAt: true });
export type InsertMaintenanceLog = z.infer<typeof insertMaintenanceLogSchema>;
export type MaintenanceLog = typeof maintenanceLogsTable.$inferSelect;
