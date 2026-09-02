import { pgTable, text, serial, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { treesTable } from "./trees";

export const notificationTypeEnum = pgEnum("notification_type", [
  "custody_expiring",
  "handoff_initiated",
  "handoff_accepted",
  "handoff_rejected",
  "checkpoint_due",
  "checkpoint_overdue",
  "verification_complete",
  "risk_alert",
  "institutional_escalation",
  "system",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "in_app",
  "sms_simulated",
  "whatsapp_simulated",
  "email",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "delivered",
  "read",
  "failed",
]);

export const notificationsTable = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  treeId: integer("tree_id").references(() => treesTable.id),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  channel: notificationChannelEnum("channel").notNull().default("in_app"),
  status: notificationStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({ id: true, createdAt: true });
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;
