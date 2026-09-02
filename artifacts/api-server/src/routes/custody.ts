import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { eq, ne, sql, desc, and } from "drizzle-orm";
import { calculateCustodyStatus } from "../lib/custody-engine";
import { rankSuccessorCandidates } from "../lib/successor-matching";
import { sendNotification } from "../lib/notification-service";

const router: IRouter = Router();

// POST /api/custody/assign — Assign a custodian to a tree
router.post("/custody/assign", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { treeId, custodianId, expiryDate, notes } = req.body;

    const [assignment] = await db.insert(schema.custodyAssignmentsTable).values({
      treeId,
      custodianId,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate,
      status: "active",
      notes,
    }).returning();

    res.status(201).json({ assignment });
  } catch (err) {
    console.error("POST /custody/assign error:", err);
    res.status(500).json({ error: "Failed to assign custody" });
  }
});

// GET /api/custody/candidates/:treeId — Get ranked successor candidates
router.get("/custody/candidates/:treeId", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const treeId = Number(req.params.treeId);

    // Get tree info
    const [tree] = await db.select().from(schema.treesTable).where(eq(schema.treesTable.id, treeId)).limit(1);
    if (!tree) return res.status(404).json({ error: "Tree not found" });

    // Get current custodian to exclude
    const [currentAssignment] = await db
      .select()
      .from(schema.custodyAssignmentsTable)
      .where(and(
        eq(schema.custodyAssignmentsTable.treeId, treeId),
        eq(schema.custodyAssignmentsTable.status, "active"),
      ))
      .limit(1);

    // Get eligible users (active custodians/volunteers, not the current one)
    const eligibleUsers = await db
      .select()
      .from(schema.usersTable)
      .where(eq(schema.usersTable.isActive, "true"));

    const filtered = eligibleUsers.filter(
      u => u.id !== currentAssignment?.custodianId && (u.role === "custodian" || u.role === "volunteer"),
    );

    // Count current tree assignments per user
    const withCounts = await Promise.all(
      filtered.map(async (user) => {
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(schema.custodyAssignmentsTable)
          .where(and(
            eq(schema.custodyAssignmentsTable.custodianId, user.id),
            eq(schema.custodyAssignmentsTable.status, "active"),
          ));

        return {
          userId: user.id,
          name: user.name,
          email: user.email,
          organizationId: user.organizationId,
          reliabilityScore: user.reliabilityScore,
          currentTreeCount: Number(count),
        };
      }),
    );

    const ranked = rankSuccessorCandidates(
      withCounts,
      tree.latitude,
      tree.longitude,
      tree.institutionalAnchorId,
    );

    res.json({ candidates: ranked, treeCode: tree.treeCode });
  } catch (err) {
    console.error("GET /custody/candidates error:", err);
    res.status(500).json({ error: "Failed to find candidates" });
  }
});

// POST /api/custody/handoff/initiate — Start a custody handoff
router.post("/custody/handoff/initiate", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { treeId, previousCustodianId, newCustodianId, reason } = req.body;

    const [handoff] = await db.insert(schema.custodyHandoffsTable).values({
      treeId,
      previousCustodianId,
      newCustodianId: newCustodianId || null,
      reason,
      status: newCustodianId ? "pending_acceptance" : "candidate_matching",
    }).returning();

    // Update current custody status
    await db
      .update(schema.custodyAssignmentsTable)
      .set({ status: "handoff_required" })
      .where(and(
        eq(schema.custodyAssignmentsTable.treeId, treeId),
        eq(schema.custodyAssignmentsTable.custodianId, previousCustodianId),
      ));

    // Send notification
    if (newCustodianId) {
      const [tree] = await db.select().from(schema.treesTable).where(eq(schema.treesTable.id, treeId)).limit(1);
      await sendNotification(db, schema, {
        userId: newCustodianId,
        treeId,
        type: "handoff_initiated",
        title: "Custody Transfer Request",
        message: `You have been recommended as the successor custodian for Tree ${tree?.treeCode}. Please review and accept the responsibility.`,
      });
    }

    res.status(201).json({ handoff, message: "Handoff initiated successfully." });
  } catch (err) {
    console.error("POST /custody/handoff/initiate error:", err);
    res.status(500).json({ error: "Failed to initiate handoff" });
  }
});

// POST /api/custody/handoff/accept — Accept custody handoff
router.post("/custody/handoff/accept", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { handoffId, pledgeAccepted, expiryDate } = req.body;

    if (!pledgeAccepted) {
      return res.status(400).json({ error: "Custody pledge must be accepted." });
    }

    // Get handoff
    const [handoff] = await db
      .select()
      .from(schema.custodyHandoffsTable)
      .where(eq(schema.custodyHandoffsTable.id, handoffId))
      .limit(1);

    if (!handoff) return res.status(404).json({ error: "Handoff not found" });
    if (!handoff.newCustodianId) return res.status(400).json({ error: "No successor assigned" });

    // Generate certificate
    const certificateId = `CERT-TG-${Date.now().toString().slice(-8)}`;

    // Complete handoff
    await db
      .update(schema.custodyHandoffsTable)
      .set({
        status: "completed",
        pledgeAccepted: true,
        completedAt: new Date(),
        certificateId,
      })
      .where(eq(schema.custodyHandoffsTable.id, handoffId));

    // Mark old custody as transferred
    await db
      .update(schema.custodyAssignmentsTable)
      .set({ status: "transferred" })
      .where(and(
        eq(schema.custodyAssignmentsTable.treeId, handoff.treeId),
        eq(schema.custodyAssignmentsTable.custodianId, handoff.previousCustodianId),
      ));

    // Create new custody assignment
    const newExpiryDate = expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    
    const [newAssignment] = await db.insert(schema.custodyAssignmentsTable).values({
      treeId: handoff.treeId,
      custodianId: handoff.newCustodianId,
      startDate: new Date().toISOString().slice(0, 10),
      expiryDate: newExpiryDate,
      status: "active",
      notes: `Custody transferred from previous custodian. Certificate: ${certificateId}`,
    }).returning();

    // Resolve related risk events
    await db
      .update(schema.riskEventsTable)
      .set({ status: "resolved", resolvedAt: new Date() })
      .where(and(
        eq(schema.riskEventsTable.treeId, handoff.treeId),
        eq(schema.riskEventsTable.status, "open"),
      ));

    // Send notifications
    const [tree] = await db.select().from(schema.treesTable).where(eq(schema.treesTable.id, handoff.treeId)).limit(1);
    const [newCustodian] = await db.select().from(schema.usersTable).where(eq(schema.usersTable.id, handoff.newCustodianId)).limit(1);

    await sendNotification(db, schema, {
      userId: handoff.previousCustodianId,
      treeId: handoff.treeId,
      type: "handoff_accepted",
      title: "Custody Transfer Complete",
      message: `${newCustodian?.name} has accepted custody of Tree ${tree?.treeCode}. Responsibility transferred successfully.`,
    });

    res.json({
      assignment: newAssignment,
      certificateId,
      message: `Custody transferred successfully. Certificate: ${certificateId}`,
    });
  } catch (err) {
    console.error("POST /custody/handoff/accept error:", err);
    res.status(500).json({ error: "Failed to accept handoff" });
  }
});

export default router;
