import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { eq, sql, desc, ilike, inArray } from "drizzle-orm";
import { calculateCustodyStatus } from "../lib/custody-engine";
import { calculateOrphanRisk } from "../lib/orphan-risk";

const router: IRouter = Router();

// GET /api/trees — List all trees with optional filters
router.get("/trees", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { status, zone, search, limit = "50", offset = "0" } = req.query;

    let query = db.select().from(schema.treesTable).$dynamic();

    if (status && typeof status === "string") {
      query = query.where(eq(schema.treesTable.currentStatus, status as any));
    }
    if (zone && typeof zone === "string") {
      query = query.where(eq(schema.treesTable.zone, zone));
    }

    const trees = await query
      .orderBy(desc(schema.treesTable.createdAt))
      .limit(Number(limit))
      .offset(Number(offset));

    // Enrich with custody info
    const enriched = await Promise.all(
      trees.map(async (tree) => {
        const [assignment] = await db
          .select()
          .from(schema.custodyAssignmentsTable)
          .where(eq(schema.custodyAssignmentsTable.treeId, tree.id))
          .orderBy(desc(schema.custodyAssignmentsTable.createdAt))
          .limit(1);

        const [custodian] = assignment
          ? await db.select().from(schema.usersTable).where(eq(schema.usersTable.id, assignment.custodianId)).limit(1)
          : [null];

        const custodyStatus = assignment
          ? calculateCustodyStatus(assignment.expiryDate)
          : null;

        return {
          ...tree,
          currentCustodian: custodian ? { id: custodian.id, name: custodian.name, email: custodian.email, reliabilityScore: custodian.reliabilityScore } : null,
          custodyAssignment: assignment || null,
          custodyStatus,
        };
      }),
    );

    // Get total count
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable);

    res.json({ trees: enriched, total: Number(count) });
  } catch (err) {
    console.error("GET /trees error:", err);
    res.status(500).json({ error: "Failed to fetch trees" });
  }
});

// GET /api/trees/:id — Full tree passport
router.get("/trees/:id", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { id } = req.params;

    // Find by tree code or numeric id
    const [tree] = await db
      .select()
      .from(schema.treesTable)
      .where(
        isNaN(Number(id))
          ? eq(schema.treesTable.treeCode, id)
          : eq(schema.treesTable.id, Number(id)),
      )
      .limit(1);

    if (!tree) return res.status(404).json({ error: "Tree not found" });

    // Get custody history
    const custodyHistory = await db
      .select({
        assignment: schema.custodyAssignmentsTable,
        custodian: schema.usersTable,
      })
      .from(schema.custodyAssignmentsTable)
      .leftJoin(schema.usersTable, eq(schema.custodyAssignmentsTable.custodianId, schema.usersTable.id))
      .where(eq(schema.custodyAssignmentsTable.treeId, tree.id))
      .orderBy(desc(schema.custodyAssignmentsTable.createdAt));

    // Current custody
    const currentCustody = custodyHistory[0] || null;
    const custodyStatus = currentCustody
      ? calculateCustodyStatus(currentCustody.assignment.expiryDate)
      : null;

    // Checkpoints
    const checkpoints = await db
      .select()
      .from(schema.checkpointsTable)
      .where(eq(schema.checkpointsTable.treeId, tree.id))
      .orderBy(desc(schema.checkpointsTable.submittedAt));

    // Maintenance logs
    const maintenanceLogs = await db
      .select({
        log: schema.maintenanceLogsTable,
        custodian: schema.usersTable,
      })
      .from(schema.maintenanceLogsTable)
      .leftJoin(schema.usersTable, eq(schema.maintenanceLogsTable.custodianId, schema.usersTable.id))
      .where(eq(schema.maintenanceLogsTable.treeId, tree.id))
      .orderBy(desc(schema.maintenanceLogsTable.createdAt));

    // Risk events
    const riskEvents = await db
      .select()
      .from(schema.riskEventsTable)
      .where(eq(schema.riskEventsTable.treeId, tree.id))
      .orderBy(desc(schema.riskEventsTable.detectedAt));

    // Failure autopsy
    const [autopsy] = await db
      .select()
      .from(schema.failureAutopsiesTable)
      .where(eq(schema.failureAutopsiesTable.treeId, tree.id))
      .limit(1);

    // Institutional anchor
    const [anchor] = await db
      .select()
      .from(schema.organizationsTable)
      .where(eq(schema.organizationsTable.id, tree.institutionalAnchorId))
      .limit(1);

    // Calculate orphan risk
    const missedCheckpoints = checkpoints.filter(c => !c.verifiedAt && c.verificationStatus === "pending").length;
    const orphanRisk = calculateOrphanRisk({
      custodyDaysRemaining: custodyStatus?.daysRemaining ?? null,
      custodianInactiveDays: 0, // simplified for MVP
      missedCheckpoints,
      totalCheckpointsDue: checkpoints.length || 1,
      backupCandidateCount: 3, // simplified
      reliabilityScore: currentCustody?.custodian?.reliabilityScore || 80,
      projectEndingSoon: false,
    });

    res.json({
      tree,
      currentCustodian: currentCustody?.custodian || null,
      currentCustodyAssignment: currentCustody?.assignment || null,
      custodyStatus,
      custodyHistory: custodyHistory.map(ch => ({
        ...ch.assignment,
        custodianName: ch.custodian?.name,
        custodianEmail: ch.custodian?.email,
        reliabilityScore: ch.custodian?.reliabilityScore,
      })),
      checkpoints,
      maintenanceLogs: maintenanceLogs.map(ml => ({
        ...ml.log,
        custodianName: ml.custodian?.name,
      })),
      riskEvents,
      failureAutopsy: autopsy || null,
      institutionalAnchor: anchor || null,
      orphanRisk,
    });
  } catch (err) {
    console.error("GET /trees/:id error:", err);
    res.status(500).json({ error: "Failed to fetch tree" });
  }
});

// POST /api/trees — Register a new tree
router.post("/trees", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const body = req.body;

    // Generate tree code
    const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable);
    const treeCode = `TG-IND-${String(Number(count) + 1).padStart(3, "0")}`;

    const [newTree] = await db.insert(schema.treesTable).values({
      treeCode,
      species: body.species,
      botanicalName: body.botanicalName || null,
      nickname: body.nickname || null,
      latitude: body.latitude,
      longitude: body.longitude,
      plantingDate: body.plantingDate || new Date().toISOString().slice(0, 10),
      plantingPhotoUrl: body.plantingPhotoUrl || null,
      currentPhotoUrl: body.plantingPhotoUrl || null,
      institutionalAnchorId: body.institutionalAnchorId || 1,
      currentStatus: "healthy",
      healthScore: 90,
      initialHeightCm: body.initialHeightCm || 45,
      currentHeightCm: body.initialHeightCm || 45,
      zone: body.zone || null,
      landmark: body.landmark || null,
      growthStage: 1,
    }).returning();

    // Create initial custody assignment if custodian specified
    if (body.custodianId) {
      const expiryDate = body.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      
      await db.insert(schema.custodyAssignmentsTable).values({
        treeId: newTree.id,
        custodianId: body.custodianId,
        startDate: newTree.plantingDate,
        expiryDate,
        status: "active",
        notes: "Initial custodian assignment at tree registration.",
      });
    }

    // Create planting checkpoint
    await db.insert(schema.checkpointsTable).values({
      treeId: newTree.id,
      checkpointType: "planting",
      photoUrl: body.plantingPhotoUrl || null,
      latitude: body.latitude,
      longitude: body.longitude,
      submittedBy: body.custodianId || null,
      healthStatus: "healthy",
      aiConfidenceScore: 1.0,
      gpsMatch: true,
      gpsDistance: 0,
      timestampValid: true,
      verificationStatus: "verified",
      notes: "Initial planting checkpoint.",
    });

    res.status(201).json({
      tree: newTree,
      treeCode,
      qrUrl: `/tree/${treeCode}`,
      message: `Tree Passport created for ${treeCode} (${body.species})`,
    });
  } catch (err) {
    console.error("POST /trees error:", err);
    res.status(500).json({ error: "Failed to register tree" });
  }
});

// PATCH /api/trees/:id — Update tree
router.patch("/trees/:id", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { id } = req.params;
    const updates = req.body;

    const [updated] = await db
      .update(schema.treesTable)
      .set(updates)
      .where(eq(schema.treesTable.id, Number(id)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Tree not found" });

    res.json({ tree: updated });
  } catch (err) {
    console.error("PATCH /trees/:id error:", err);
    res.status(500).json({ error: "Failed to update tree" });
  }
});

export default router;
