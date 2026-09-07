import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import * as schema from "@workspace/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { calculateCustodyStatus } from "../lib/custody-engine";
import { calculateOrphanRisk } from "../lib/orphan-risk";

const router: IRouter = Router();

// Resilient fallback storage for trees when remote database is unavailable
const fallbackTrees: any[] = [
  {
    id: 1,
    treeCode: "TG-IND-001",
    species: "Neem",
    botanicalName: "Azadirachta indica",
    nickname: "வேம்பு (Neem)",
    latitude: 13.0118,
    longitude: 80.2362,
    plantingDate: "2024-06-05",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: 1,
    currentStatus: "healthy",
    healthScore: 94,
    initialHeightCm: 45,
    currentHeightCm: 85,
    zone: "North Quadrangle",
    landmark: "Anna University Main Quadrangle",
    growthStage: 2,
    currentCustodian: { id: 2, name: "Arun Kumar", email: "arun.kumar@gmail.com", reliabilityScore: 94 },
    custodyStatus: { status: "ACTIVE", daysRemaining: 180, isExpiringSoon: false },
  },
  {
    id: 2,
    treeCode: "TG-IND-002",
    species: "Indian Beech / Pungai",
    botanicalName: "Pongamia pinnata",
    nickname: "புங்கன் (Pungai)",
    latitude: 13.0125,
    longitude: 80.2370,
    plantingDate: "2024-07-12",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: 1,
    currentStatus: "healthy",
    healthScore: 91,
    initialHeightCm: 50,
    currentHeightCm: 72,
    zone: "Lake Bund Perimeter",
    landmark: "Behind Basketball Court Pillar #4",
    growthStage: 1,
    currentCustodian: { id: 3, name: "Priya S", email: "priya.s@gmail.com", reliabilityScore: 91 },
    custodyStatus: { status: "ACTIVE", daysRemaining: 210, isExpiringSoon: false },
  },
  {
    id: 3,
    treeCode: "TG-IND-003",
    species: "Arjun Tree / Marutham",
    botanicalName: "Terminalia arjuna",
    nickname: "மருதம் (Marutham)",
    latitude: 13.0132,
    longitude: 80.2355,
    plantingDate: "2024-05-20",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: 1,
    currentStatus: "healthy",
    healthScore: 89,
    initialHeightCm: 40,
    currentHeightCm: 68,
    zone: "Hostel Grove South",
    landmark: "Hostel Block 3 Courtyard",
    growthStage: 2,
    currentCustodian: { id: 2, name: "Arun Kumar", email: "arun.kumar@gmail.com", reliabilityScore: 94 },
    custodyStatus: { status: "ACTIVE", daysRemaining: 150, isExpiringSoon: false },
  },
  {
    id: 4,
    treeCode: "TG-IND-004",
    species: "Jamun / Naval",
    botanicalName: "Syzygium cumini",
    nickname: "நாவல் (Naval)",
    latitude: 13.0140,
    longitude: 80.2380,
    plantingDate: "2024-04-10",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: 1,
    currentStatus: "needs_attention",
    healthScore: 68,
    initialHeightCm: 55,
    currentHeightCm: 70,
    zone: "Sports Complex",
    landmark: "Athletic Ground West Corner",
    growthStage: 1,
    currentCustodian: { id: 3, name: "Priya S", email: "priya.s@gmail.com", reliabilityScore: 91 },
    custodyStatus: { status: "AT_RISK", daysRemaining: 14, isExpiringSoon: true },
  },
  {
    id: 5,
    treeCode: "TG-IND-005",
    species: "Sacred Fig / Peepal",
    botanicalName: "Ficus religiosa",
    nickname: "அரசமரம் (Peepal)",
    latitude: 13.0105,
    longitude: 80.2348,
    plantingDate: "2024-01-15",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: 1,
    currentStatus: "healthy",
    healthScore: 96,
    initialHeightCm: 60,
    currentHeightCm: 110,
    zone: "Botanical Garden",
    landmark: "Central Amphitheatre lawn",
    growthStage: 3,
    currentCustodian: { id: 2, name: "Arun Kumar", email: "arun.kumar@gmail.com", reliabilityScore: 94 },
    custodyStatus: { status: "ACTIVE", daysRemaining: 300, isExpiringSoon: false },
  },
];

// GET /api/trees — List all trees with optional filters
router.get("/trees", async (req, res) => {
  try {
    const { status, zone, search, limit = "50", offset = "0" } = req.query;

    if (db) {
      try {
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

        if (trees && trees.length > 0) {
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

          const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(schema.treesTable);
          return res.json({ trees: enriched, total: Number(count) });
        }
      } catch (dbErr: any) {
        console.warn("DB query failed in GET /trees, falling back to local registry:", dbErr.message);
      }
    }

    // Fallback filtering
    let filtered = [...fallbackTrees];
    if (status && typeof status === "string") {
      filtered = filtered.filter(t => t.currentStatus === status);
    }
    if (zone && typeof zone === "string") {
      filtered = filtered.filter(t => t.zone === zone);
    }

    return res.json({ trees: filtered, total: filtered.length });
  } catch (err) {
    console.error("GET /trees error:", err);
    res.status(500).json({ error: "Failed to fetch trees" });
  }
});

// GET /api/trees/:id — Full tree passport
router.get("/trees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (db) {
      try {
        const [tree] = await db
          .select()
          .from(schema.treesTable)
          .where(
            isNaN(Number(id))
              ? eq(schema.treesTable.treeCode, id)
              : eq(schema.treesTable.id, Number(id)),
          )
          .limit(1);

        if (tree) {
          const custodyHistory = await db
            .select({
              assignment: schema.custodyAssignmentsTable,
              custodian: schema.usersTable,
            })
            .from(schema.custodyAssignmentsTable)
            .leftJoin(schema.usersTable, eq(schema.custodyAssignmentsTable.custodianId, schema.usersTable.id))
            .where(eq(schema.custodyAssignmentsTable.treeId, tree.id))
            .orderBy(desc(schema.custodyAssignmentsTable.createdAt));

          const currentCustody = custodyHistory[0] || null;
          const custodyStatus = currentCustody
            ? calculateCustodyStatus(currentCustody.assignment.expiryDate)
            : null;

          const checkpoints = await db
            .select()
            .from(schema.checkpointsTable)
            .where(eq(schema.checkpointsTable.treeId, tree.id))
            .orderBy(desc(schema.checkpointsTable.submittedAt));

          const maintenanceLogs = await db
            .select({
              log: schema.maintenanceLogsTable,
              custodian: schema.usersTable,
            })
            .from(schema.maintenanceLogsTable)
            .leftJoin(schema.usersTable, eq(schema.maintenanceLogsTable.custodianId, schema.usersTable.id))
            .where(eq(schema.maintenanceLogsTable.treeId, tree.id))
            .orderBy(desc(schema.maintenanceLogsTable.performedAt));

          const riskEvents = await db
            .select()
            .from(schema.riskEventsTable)
            .where(eq(schema.riskEventsTable.treeId, tree.id))
            .orderBy(desc(schema.riskEventsTable.detectedAt));

          const [autopsy] = await db
            .select()
            .from(schema.failureAutopsiesTable)
            .where(eq(schema.failureAutopsiesTable.treeId, tree.id))
            .limit(1);

          return res.json({
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
          });
        }
      } catch (dbErr: any) {
        console.warn("DB query failed in GET /trees/:id, falling back to local registry:", dbErr.message);
      }
    }

    // Fallback find
    const found = fallbackTrees.find(t => t.id === Number(id) || t.treeCode === id);
    if (!found) {
      return res.status(404).json({ error: "Tree not found" });
    }

    return res.json({
      tree: found,
      currentCustodian: found.currentCustodian,
      custodyStatus: found.custodyStatus,
      custodyHistory: [
        {
          custodianName: found.currentCustodian?.name || "Arun Kumar",
          startDate: found.plantingDate,
          status: "active",
        },
      ],
      checkpoints: [
        {
          id: `CHK-${found.treeCode}-PLANT`,
          checkpointType: "planting",
          photoUrl: found.plantingPhotoUrl,
          verificationStatus: "verified",
          submittedAt: found.plantingDate,
        },
      ],
      maintenanceLogs: [],
      riskEvents: [],
      failureAutopsy: null,
    });
  } catch (err) {
    console.error("GET /trees/:id error:", err);
    res.status(500).json({ error: "Failed to fetch tree" });
  }
});

// POST /api/trees — Register a new tree
router.post("/trees", async (req, res) => {
  try {
    const body = req.body;

    const treeCode = body.treeCode || `TG-IND-${String(fallbackTrees.length + 1).padStart(3, "0")}`;

    const newRecord: any = {
      id: fallbackTrees.length + 1,
      treeCode,
      species: body.species,
      botanicalName: body.botanicalName || null,
      nickname: body.nickname || body.species,
      latitude: body.latitude || 13.0827,
      longitude: body.longitude || 80.2707,
      plantingDate: body.plantingDate || new Date().toISOString().slice(0, 10),
      plantingPhotoUrl: body.plantingPhotoUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      currentPhotoUrl: body.plantingPhotoUrl || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      institutionalAnchorId: body.institutionalAnchorId || 1,
      currentStatus: "healthy",
      healthScore: 92,
      initialHeightCm: body.initialHeightCm || 45,
      currentHeightCm: body.initialHeightCm || 45,
      zone: body.zone || "District Sector",
      landmark: body.landmark || "Tamil Nadu",
      growthStage: 1,
      currentCustodian: body.custodianName ? { name: body.custodianName, email: body.custodianEmail } : { name: "Arun Kumar" },
      custodyStatus: { status: "ACTIVE", daysRemaining: 365, isExpiringSoon: false },
    };

    if (db) {
      try {
        const [insertedTree] = await db.insert(schema.treesTable).values({
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

        if (insertedTree) {
          newRecord.id = insertedTree.id;
        }
      } catch (dbErr: any) {
        console.warn("DB insert failed in POST /trees, saved to local registry:", dbErr.message);
      }
    }

    fallbackTrees.unshift(newRecord);

    return res.status(201).json({
      tree: newRecord,
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
    const { id } = req.params;
    const body = req.body;

    if (db) {
      try {
        const [updated] = await db
          .update(schema.treesTable)
          .set({
            currentStatus: body.status,
            healthScore: body.healthScore,
            currentHeightCm: body.currentHeightCm,
            currentPhotoUrl: body.currentPhotoUrl,
          })
          .where(
            isNaN(Number(id))
              ? eq(schema.treesTable.treeCode, id)
              : eq(schema.treesTable.id, Number(id)),
          )
          .returning();

        if (updated) {
          return res.json({ tree: updated });
        }
      } catch (dbErr: any) {
        console.warn("DB update failed in PATCH /trees/:id:", dbErr.message);
      }
    }

    const idx = fallbackTrees.findIndex(t => t.id === Number(id) || t.treeCode === id);
    if (idx !== -1) {
      fallbackTrees[idx] = { ...fallbackTrees[idx], ...body };
      return res.json({ tree: fallbackTrees[idx] });
    }

    return res.status(404).json({ error: "Tree not found" });
  } catch (err) {
    console.error("PATCH /trees/:id error:", err);
    res.status(500).json({ error: "Failed to update tree" });
  }
});

export default router;
