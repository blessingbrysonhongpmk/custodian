import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// POST /api/failure-autopsy — Persist a tree failure analysis
router.post("/failure-autopsy", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { treeId, primaryCause, contributingFactors, classification, autopsyNotes, preventiveLesson, reportedBy } = req.body;

    if (!treeId) {
      return res.status(400).json({ error: "Tree ID is required" });
    }

    const numericTreeId = Number(treeId);

    // Update tree status to dead in database
    await db
      .update(schema.treesTable)
      .set({
        currentStatus: "dead",
        healthScore: 0,
      })
      .where(eq(schema.treesTable.id, numericTreeId));

    // Save failure autopsy
    const [autopsy] = await db
      .insert(schema.failureAutopsiesTable)
      .values({
        treeId: numericTreeId,
        primaryCause: primaryCause || "Water shortage",
        contributingFactors: Array.isArray(contributingFactors) ? contributingFactors.join(", ") : contributingFactors,
        classification: classification || "Environmental / Systemic",
        autopsyNotes: autopsyNotes || "Tree loss recorded via audit review.",
        preventiveLesson: preventiveLesson || "Ensure continuous root basin hydration schedule.",
        reportedBy: reportedBy ? Number(reportedBy) : null,
      })
      .returning();

    res.status(201).json({ success: true, autopsy });
  } catch (err: any) {
    console.error("POST /failure-autopsy error:", err);
    res.status(500).json({ error: err.message || "Failed to record failure autopsy" });
  }
});

export default router;
