import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { verifyGps } from "../lib/gps-verification";
import { analyzeWithGemini, calculateVerificationConfidence } from "../lib/ai-verification";

const router: IRouter = Router();

// POST /api/checkpoints — Submit a checkpoint
router.post("/checkpoints", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { treeId, checkpointType, photoUrl, latitude, longitude, submittedBy, heightCm, notes } = req.body;

    // Get tree for GPS verification
    const [tree] = await db.select().from(schema.treesTable).where(eq(schema.treesTable.id, treeId)).limit(1);
    if (!tree) return res.status(404).json({ error: "Tree not found" });

    // GPS verification
    const gpsResult = latitude && longitude
      ? verifyGps(tree.latitude, tree.longitude, latitude, longitude)
      : null;

    // Map GPS to score for confidence model
    const gpsScore = gpsResult
      ? (gpsResult.status === "excellent" ? 100 : gpsResult.status === "acceptable" ? 80 : gpsResult.status === "flagged" ? 50 : 20)
      : 70;

    // AI verification
    const aiResult = await analyzeWithGemini(
      tree.plantingPhotoUrl || "",
      photoUrl || "",
      {
        species: tree.species,
        plantingDate: tree.plantingDate,
        checkpointDate: new Date().toISOString().slice(0, 10),
        expectedGrowthMonths: Math.round(
          (Date.now() - new Date(tree.plantingDate).getTime()) / (30 * 24 * 60 * 60 * 1000),
        ),
      },
    );

    // Combined confidence
    const { confidence, level } = calculateVerificationConfidence(
      aiResult.visualConsistencyScore,
      gpsScore,
      true, // timestamp always valid for now
      aiResult.growthContinuityScore,
      aiResult.environmentMatchScore,
    );

    const verificationStatus = level === "human_review" ? "human_review" as const
      : level === "flagged" ? "flagged" as const
      : "verified" as const;

    // Save checkpoint
    const [checkpoint] = await db.insert(schema.checkpointsTable).values({
      treeId,
      checkpointType,
      photoUrl,
      latitude,
      longitude,
      submittedBy,
      healthStatus: aiResult.healthStatus,
      aiConfidenceScore: confidence / 100,
      gpsMatch: gpsResult ? gpsResult.status !== "mismatch" : null,
      gpsDistance: gpsResult ? gpsResult.distanceMeters : null,
      timestampValid: true,
      verificationStatus,
      aiAnalysis: JSON.stringify(aiResult),
      notes,
      heightCm,
    }).returning();

    // Update tree photo and health
    await db.update(schema.treesTable).set({
      currentPhotoUrl: photoUrl || tree.currentPhotoUrl,
      currentHeightCm: heightCm || tree.currentHeightCm,
      healthScore: Math.round(confidence * 0.9 + (tree.healthScore || 80) * 0.1),
    }).where(eq(schema.treesTable.id, treeId));

    res.status(201).json({
      checkpoint,
      verification: {
        confidence,
        level,
        gps: gpsResult,
        ai: aiResult,
        disclaimer: "AI-assisted verification. Final accountability remains human.",
      },
    });
  } catch (err) {
    console.error("POST /checkpoints error:", err);
    res.status(500).json({ error: "Failed to submit checkpoint" });
  }
});

// POST /api/verification/analyze — Standalone AI analysis
router.post("/verification/analyze", async (req, res) => {
  try {
    const { plantingPhotoUrl, checkpointPhotoUrl, species, plantingDate } = req.body;

    const expectedGrowthMonths = Math.round(
      (Date.now() - new Date(plantingDate).getTime()) / (30 * 24 * 60 * 60 * 1000),
    );

    const result = await analyzeWithGemini(plantingPhotoUrl, checkpointPhotoUrl, {
      species,
      plantingDate,
      checkpointDate: new Date().toISOString().slice(0, 10),
      expectedGrowthMonths,
    });

    res.json({
      analysis: result,
      disclaimer: "AI-assisted verification. Final accountability remains human.",
      demoMode: result.isDemoMode
        ? "Demo Mode — AI analysis simulated. Connect Gemini API for live verification."
        : undefined,
    });
  } catch (err) {
    console.error("POST /verification/analyze error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

// POST /api/maintenance — Log maintenance activity
router.post("/maintenance", async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: "Database not connected" });

    const { treeId, custodianId, actionType, notes, photoUrl } = req.body;

    const [log] = await db.insert(schema.maintenanceLogsTable).values({
      treeId,
      custodianId,
      actionType,
      notes,
      photoUrl,
    }).returning();

    res.status(201).json({ log });
  } catch (err) {
    console.error("POST /maintenance error:", err);
    res.status(500).json({ error: "Failed to log maintenance" });
  }
});

export default router;
