import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/risks — List open risk events
router.get("/risks", async (_req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const risks = await db
      .select({
        risk: schema.riskEventsTable,
        tree: schema.treesTable,
      })
      .from(schema.riskEventsTable)
      .leftJoin(schema.treesTable, eq(schema.riskEventsTable.treeId, schema.treesTable.id))
      .orderBy(
        sql`CASE ${schema.riskEventsTable.severity}
          WHEN 'critical' THEN 1
          WHEN 'high' THEN 2
          WHEN 'medium' THEN 3
          WHEN 'low' THEN 4
        END`,
        desc(schema.riskEventsTable.detectedAt),
      );

    // Enrich with custodian info
    const enriched = await Promise.all(
      risks.map(async (r) => {
        const [assignment] = await db
          .select({ custodian: schema.usersTable })
          .from(schema.custodyAssignmentsTable)
          .leftJoin(schema.usersTable, eq(schema.custodyAssignmentsTable.custodianId, schema.usersTable.id))
          .where(eq(schema.custodyAssignmentsTable.treeId, r.risk.treeId))
          .orderBy(desc(schema.custodyAssignmentsTable.createdAt))
          .limit(1);

        // Get institutional anchor
        const [anchor] = r.tree
          ? await db.select().from(schema.organizationsTable).where(eq(schema.organizationsTable.id, r.tree.institutionalAnchorId)).limit(1)
          : [null];

        return {
          ...r.risk,
          tree: r.tree ? { treeCode: r.tree.treeCode, species: r.tree.species, zone: r.tree.zone, landmark: r.tree.landmark } : null,
          custodian: assignment?.custodian ? { name: assignment.custodian.name, email: assignment.custodian.email } : null,
          institutionalAnchor: anchor ? { name: anchor.name, type: anchor.type } : null,
        };
      }),
    );

    res.json({ risks: enriched, total: enriched.length });
  } catch (err) {
    console.error("GET /risks error:", err);
    res.status(500).json({ error: "Failed to fetch risks" });
  }
});

// POST /api/risks/:id/resolve — Resolve a risk event
router.post("/risks/:id/resolve", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const [updated] = await db
      .update(schema.riskEventsTable)
      .set({ status: "resolved", resolvedAt: new Date() })
      .where(eq(schema.riskEventsTable.id, Number(req.params.id)))
      .returning();

    if (!updated) return res.status(404).json({ error: "Risk event not found" });

    res.json({ risk: updated, message: "Risk event resolved." });
  } catch (err) {
    console.error("POST /risks/:id/resolve error:", err);
    res.status(500).json({ error: "Failed to resolve risk" });
  }
});

// GET /api/dashboard — Dashboard computed metrics
router.get("/dashboard", async (_req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const [totalTrees] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable);
    const [healthyTrees] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable).where(eq(schema.treesTable.currentStatus, "healthy"));
    const [atRiskTrees] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable).where(eq(schema.treesTable.currentStatus, "at_risk"));
    const [criticalTrees] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable).where(eq(schema.treesTable.currentStatus, "critical"));
    const [deadTrees] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable).where(eq(schema.treesTable.currentStatus, "dead"));
    const [orphanedTrees] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable).where(eq(schema.treesTable.currentStatus, "orphaned"));
    const [needsAttention] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable).where(eq(schema.treesTable.currentStatus, "needs_attention"));

    const [activeCustodians] = await db.select({ count: sql<number>`count(distinct ${schema.custodyAssignmentsTable.custodianId})` }).from(schema.custodyAssignmentsTable).where(eq(schema.custodyAssignmentsTable.status, "active"));
    
    const [totalHandoffs] = await db.select({ count: sql<number>`count(*)` }).from(schema.custodyHandoffsTable);
    const [completedHandoffs] = await db.select({ count: sql<number>`count(*)` }).from(schema.custodyHandoffsTable).where(eq(schema.custodyHandoffsTable.status, "completed"));
    
    const [verifiedCheckpoints] = await db.select({ count: sql<number>`count(*)` }).from(schema.checkpointsTable).where(eq(schema.checkpointsTable.verificationStatus, "verified"));
    const [totalCheckpoints] = await db.select({ count: sql<number>`count(*)` }).from(schema.checkpointsTable);

    const [openRisks] = await db.select({ count: sql<number>`count(*)` }).from(schema.riskEventsTable).where(eq(schema.riskEventsTable.status, "open"));

    const total = Number(totalTrees.count) || 1;
    const healthy = Number(healthyTrees.count);
    const atRisk = Number(atRiskTrees.count) + Number(needsAttention.count);
    const failed = Number(deadTrees.count);
    const orphaned = Number(orphanedTrees.count);
    const verifiedAlive = healthy + atRisk;
    const handoffsTotal = Number(totalHandoffs.count) || 1;
    const handoffsCompleted = Number(completedHandoffs.count);
    const checkpointTotal = Number(totalCheckpoints.count) || 1;
    const checkpointVerified = Number(verifiedCheckpoints.count);

    res.json({
      projectName: "TreeGuard Campus Pilot — Green Roots Foundation",
      totalPlanted: total,
      verifiedAlive,
      healthyCount: healthy,
      atRiskCount: atRisk,
      criticalCount: Number(criticalTrees.count),
      failedCount: failed,
      orphanedCount: orphaned,
      activeCustodians: Number(activeCustodians.count),
      verifiedSurvivalRate: Math.round((verifiedAlive / total) * 1000) / 10,
      claimedSurvivalRate: Math.round(((total - failed) / total) * 1000) / 10,
      verificationGap: Math.round((((total - failed) / total) - (verifiedAlive / total)) * 1000) / 10,
      custodyContinuityRate: Math.round((handoffsCompleted / handoffsTotal) * 1000) / 10,
      checkpointComplianceRate: Math.round((checkpointVerified / checkpointTotal) * 1000) / 10,
      handoffSuccessRate: Math.round((handoffsCompleted / handoffsTotal) * 1000) / 10,
      openRiskCount: Number(openRisks.count),
      topFailureCause: "Water shortage",
      dominantFailureZone: "Campus Zone B",
      riskRecoveryRate: 68,
    });
  } catch (err) {
    console.error("GET /dashboard error:", err);
    res.status(500).json({ error: "Failed to compute dashboard" });
  }
});

// GET /api/notifications — List notifications
router.get("/notifications", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const notifications = await db
      .select()
      .from(schema.notificationsTable)
      .orderBy(desc(schema.notificationsTable.createdAt))
      .limit(50);

    res.json({ notifications });
  } catch (err) {
    console.error("GET /notifications error:", err);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// GET /api/users — List users (for custodian selection)
router.get("/users", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { role } = req.query;
    let query = db.select().from(schema.usersTable).$dynamic();
    
    if (role && typeof role === "string") {
      query = query.where(eq(schema.usersTable.role, role as any));
    }

    const users = await query;
    res.json({ users });
  } catch (err) {
    console.error("GET /users error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET /api/organizations — List organizations
router.get("/organizations", async (_req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });
    const orgs = await db.select().from(schema.organizationsTable);
    res.json({ organizations: orgs });
  } catch (err) {
    console.error("GET /organizations error:", err);
    res.status(500).json({ error: "Failed to fetch organizations" });
  }
});

// POST /api/demo/time-travel — Demo Time Machine
router.post("/demo/time-travel", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { action } = req.body;
    // For the demo, we'll simulate time-related effects directly

    const { setDemoTimeOffset, getCurrentDate } = await import("../lib/custody-engine");
    
    let offsetDays = 0;
    switch (action) {
      case "today": offsetDays = 0; break;
      case "+30": offsetDays = 30; break;
      case "+60": offsetDays = 60; break;
      case "+90": offsetDays = 90; break;
      case "graduation": offsetDays = 15; break;
      case "inactive": offsetDays = 45; break;
      case "missed_checkpoint": offsetDays = 7; break;
      default: offsetDays = 0;
    }

    setDemoTimeOffset(offsetDays * 24 * 60 * 60 * 1000);
    const simulatedDate = getCurrentDate();

    // Update custody statuses based on new time
    const assignments = await db.select().from(schema.custodyAssignmentsTable);
    
    const { calculateCustodyStatus, toCustodyDbStatus, toRiskSeverity } = await import("../lib/custody-engine");

    let expiredCount = 0;
    let expiringCount = 0;

    for (const assignment of assignments) {
      const status = calculateCustodyStatus(assignment.expiryDate);
      const dbStatus = toCustodyDbStatus(status.status);
      
      if (dbStatus !== assignment.status) {
        await db.update(schema.custodyAssignmentsTable)
          .set({ status: dbStatus as any })
          .where(eq(schema.custodyAssignmentsTable.id, assignment.id));

        if (status.status === "expired" || status.status === "handoff_required" || status.status === "expiring") {
          if (status.status === "expired") expiredCount++;
          else expiringCount++;

          // Create risk event
          await db.insert(schema.riskEventsTable).values({
            treeId: assignment.treeId,
            riskType: "custody_expiring",
            severity: toRiskSeverity(status.status),
            reason: `Custody ${status.label}. Time simulation: ${action}`,
            status: "open",
            suggestedAction: status.status === "expired" ? "Escalate to institutional anchor." : "Initiate custody handoff.",
          });
        }
      }
    }

    res.json({
      simulatedDate: simulatedDate.toISOString().slice(0, 10),
      offsetDays,
      effects: {
        expiredCustodies: expiredCount,
        expiringCustodies: expiringCount,
      },
      message: `Time simulated to ${simulatedDate.toISOString().slice(0, 10)} (+${offsetDays} days)`,
    });
  } catch (err) {
    console.error("POST /demo/time-travel error:", err);
    res.status(500).json({ error: "Time travel failed" });
  }
});

// POST /api/failure-autopsy — Create a failure autopsy
router.post("/failure-autopsy", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const body = req.body;
    const [autopsy] = await db.insert(schema.failureAutopsiesTable).values({
      treeId: body.treeId,
      failureCategory: body.failureCategory,
      primaryCause: body.primaryCause,
      contributingFactors: body.contributingFactors ? JSON.stringify(body.contributingFactors) : null,
      preventability: body.preventability,
      lessons: body.lessons,
      classification: body.classification,
      custodianAtFailure: body.custodianAtFailure,
      lastVerifiedAliveDate: body.lastVerifiedAliveDate,
      zone: body.zone,
      microclimateFactor: body.microclimateFactor,
      createdBy: body.createdBy,
    }).returning();

    // Update tree status
    await db.update(schema.treesTable)
      .set({ currentStatus: "dead", healthScore: 0 })
      .where(eq(schema.treesTable.id, body.treeId));

    res.status(201).json({ autopsy });
  } catch (err) {
    console.error("POST /failure-autopsy error:", err);
    res.status(500).json({ error: "Failed to create autopsy" });
  }
});

export default router;
