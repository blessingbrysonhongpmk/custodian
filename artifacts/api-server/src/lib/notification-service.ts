/**
 * TreeGuard Notification Service
 * 
 * Abstraction layer for sending notifications.
 * In-app notifications are stored in DB.
 * SMS and WhatsApp are simulated for hackathon.
 */

export interface NotificationPayload {
  userId: number;
  treeId?: number;
  type: string;
  title: string;
  message: string;
}

export interface NotificationResult {
  inApp: { delivered: boolean };
  sms: { queued: boolean; simulated: boolean };
  whatsApp: { queued: boolean; simulated: boolean };
}

/**
 * Send notification through all channels
 */
export async function sendNotification(
  db: any,
  schema: any,
  payload: NotificationPayload,
): Promise<NotificationResult> {
  // 1. In-App (real — stored in DB)
  await db.insert(schema.notificationsTable).values({
    userId: payload.userId,
    treeId: payload.treeId || null,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    channel: "in_app",
    status: "delivered",
  });

  // 2. SMS (simulated)
  await db.insert(schema.notificationsTable).values({
    userId: payload.userId,
    treeId: payload.treeId || null,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    channel: "sms_simulated",
    status: "delivered",
  });

  // 3. WhatsApp (simulated)
  await db.insert(schema.notificationsTable).values({
    userId: payload.userId,
    treeId: payload.treeId || null,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    channel: "whatsapp_simulated",
    status: "delivered",
  });

  console.log(`📱 Notification sent: [${payload.type}] ${payload.title} → User ${payload.userId}`);

  return {
    inApp: { delivered: true },
    sms: { queued: true, simulated: true },
    whatsApp: { queued: true, simulated: true },
  };
}
