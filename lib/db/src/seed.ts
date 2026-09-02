import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema/index";

const { Pool } = pg;

async function seed() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL is required for seeding");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });
  const db = drizzle(pool, { schema });

  console.log("🌱 Seeding TreeGuard database...\n");

  // 1. Organizations
  console.log("  Creating organizations...");
  const [greenRoots] = await db.insert(schema.organizationsTable).values({
    name: "Green Roots Foundation",
    type: "ngo",
    location: "Kerala, India",
    contactEmail: "info@greenroots.org",
  }).returning();

  const [greenfield] = await db.insert(schema.organizationsTable).values({
    name: "Greenfield College",
    type: "college",
    location: "Kochi, Kerala",
    contactEmail: "admin@greenfieldcollege.edu.in",
  }).returning();

  const [nssClub] = await db.insert(schema.organizationsTable).values({
    name: "NSS Environmental Club",
    type: "community",
    location: "Greenfield College Campus",
    contactEmail: "nss@greenfieldcollege.edu.in",
  }).returning();

  const [rwaGreen] = await db.insert(schema.organizationsTable).values({
    name: "RWA Green Committee",
    type: "rwa",
    location: "Greenfield Residency, Kochi",
    contactEmail: "green@rwagreenfield.org",
  }).returning();

  // 2. Users
  console.log("  Creating users...");
  const [admin] = await db.insert(schema.usersTable).values({
    name: "Dr. Malathi V.",
    email: "malathi.v@greenfieldcollege.edu.in",
    phone: "+91-9876543210",
    role: "admin",
    organizationId: greenfield.id,
    reliabilityScore: 99,
  }).returning();

  const [arun] = await db.insert(schema.usersTable).values({
    name: "Arun Kumar",
    email: "arun.kumar@campus.edu.in",
    phone: "+91-9876543211",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 92,
  }).returning();

  const [priya] = await db.insert(schema.usersTable).values({
    name: "Priya Nair",
    email: "priya.nair@campus.edu.in",
    phone: "+91-9876543212",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 95,
  }).returning();

  const [rahul] = await db.insert(schema.usersTable).values({
    name: "Rahul Kumar",
    email: "rahul.kumar@campus.edu.in",
    phone: "+91-9876543213",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 89,
  }).returning();

  const [kavitha] = await db.insert(schema.usersTable).values({
    name: "Kavitha N.",
    email: "kavitha.n@campus.edu.in",
    phone: "+91-9876543214",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 84,
  }).returning();

  const [meena] = await db.insert(schema.usersTable).values({
    name: "Meena R.",
    email: "meena.r@campus.edu.in",
    phone: "+91-9876543215",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 96,
  }).returning();

  const [vikram] = await db.insert(schema.usersTable).values({
    name: "Vikram R.",
    email: "vikram.r@campus.edu.in",
    phone: "+91-9876543216",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 65,
    isActive: "false",
  }).returning();

  const [gokul] = await db.insert(schema.usersTable).values({
    name: "Gokul M.",
    email: "gokul.m@campus.edu.in",
    phone: "+91-9876543217",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 70,
    isActive: "false",
  }).returning();

  const [divya] = await db.insert(schema.usersTable).values({
    name: "Divya M.",
    email: "divya.m@campus.edu.in",
    phone: "+91-9876543218",
    role: "verifier",
    organizationId: greenfield.id,
    reliabilityScore: 94,
  }).returning();

  const [parvathi] = await db.insert(schema.usersTable).values({
    name: "Parvathi S.",
    email: "parvathi.s@campus.edu.in",
    phone: "+91-9876543219",
    role: "custodian",
    organizationId: greenfield.id,
    reliabilityScore: 91,
  }).returning();

  const [irfan] = await db.insert(schema.usersTable).values({
    name: "Irfan A.",
    email: "irfan.a@campus.edu.in",
    phone: "+91-9876543220",
    role: "volunteer",
    organizationId: greenfield.id,
    reliabilityScore: 88,
  }).returning();

  const [anchor] = await db.insert(schema.usersTable).values({
    name: "Prof. Suresh R.",
    email: "suresh.r@greenfieldcollege.edu.in",
    phone: "+91-9876543221",
    role: "institutional_anchor",
    organizationId: greenfield.id,
    reliabilityScore: 97,
  }).returning();

  // 3. Trees — Main demo tree + variety of statuses
  console.log("  Creating trees...");
  
  const speciesPool = [
    { species: "Neem", botanical: "Azadirachta indica" },
    { species: "Indian Beech / Pungai", botanical: "Pongamia pinnata" },
    { species: "Arjun Tree / Marutham", botanical: "Terminalia arjuna" },
    { species: "Jamun / Naval", botanical: "Syzygium cumini" },
    { species: "Sacred Fig / Peepal", botanical: "Ficus religiosa" },
    { species: "Indian Almond / Badam", botanical: "Terminalia catappa" },
    { species: "Banyan", botanical: "Ficus benghalensis" },
    { species: "Teak / Thekku", botanical: "Tectona grandis" },
    { species: "Mango / Maanga", botanical: "Mangifera indica" },
    { species: "Tamarind / Puli", botanical: "Tamarindus indica" },
  ];

  const zones = ["Campus Zone A", "Campus Zone B", "Hostel Grove", "Lake Perimeter", "Library Quadrangle", "Sports Complex", "Admin Block"];
  const custodians = [arun, priya, rahul, kavitha, meena, parvathi, irfan];

  // Calculate expiry date 14 days from now for demo tree
  const now = new Date();
  const expiryDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  const formatDate = (d: Date) => d.toISOString().slice(0, 10);

  // MAIN DEMO TREE: TG-IND-001
  const [demoTree] = await db.insert(schema.treesTable).values({
    treeCode: "TG-IND-001",
    species: "Neem",
    botanicalName: "Azadirachta indica",
    nickname: "Guardian Neem",
    latitude: 9.9312,
    longitude: 76.2673,
    plantingDate: "2024-08-12",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: greenfield.id,
    currentStatus: "healthy",
    healthScore: 92,
    initialHeightCm: 45,
    currentHeightCm: 118,
    zone: "Campus Zone A",
    landmark: "Behind Basketball Court, Pillar #4",
    growthStage: 3,
  }).returning();

  // Custody for demo tree - expiring in 14 days
  await db.insert(schema.custodyAssignmentsTable).values({
    treeId: demoTree.id,
    custodianId: arun.id,
    startDate: "2024-08-12",
    expiryDate: formatDate(expiryDate),
    status: "expiring",
    reliabilityAtAssignment: 92,
    notes: "Initial custodian assignment. Student graduating soon.",
  });

  // Checkpoints for demo tree
  await db.insert(schema.checkpointsTable).values([
    {
      treeId: demoTree.id,
      checkpointType: "planting",
      photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      latitude: 9.9312,
      longitude: 76.2673,
      submittedBy: arun.id,
      healthStatus: "healthy",
      aiConfidenceScore: 0.95,
      gpsMatch: true,
      gpsDistance: 0,
      timestampValid: true,
      verificationStatus: "verified",
      verifierId: admin.id,
      heightCm: 45,
      notes: "Sapling planted with organic compost and bamboo guard.",
    },
    {
      treeId: demoTree.id,
      checkpointType: "1_month",
      photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
      latitude: 9.9312,
      longitude: 76.2673,
      submittedBy: arun.id,
      healthStatus: "healthy",
      aiConfidenceScore: 0.91,
      gpsMatch: true,
      gpsDistance: 5,
      timestampValid: true,
      verificationStatus: "verified",
      verifierId: divya.id,
      heightCm: 62,
      notes: "First month survival confirmed. Healthy root establishment.",
    },
    {
      treeId: demoTree.id,
      checkpointType: "6_month",
      photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
      latitude: 9.9313,
      longitude: 76.2674,
      submittedBy: arun.id,
      healthStatus: "healthy",
      aiConfidenceScore: 0.88,
      gpsMatch: true,
      gpsDistance: 12,
      timestampValid: true,
      verificationStatus: "verified",
      verifierId: divya.id,
      heightCm: 96,
      notes: "Solid stem thickness, zero pest signs. Tree guard intact.",
    },
  ]);

  // Maintenance logs for demo tree
  await db.insert(schema.maintenanceLogsTable).values([
    { treeId: demoTree.id, custodianId: arun.id, actionType: "watered", notes: "15L drip hydration with neem-cake organic slurry." },
    { treeId: demoTree.id, custodianId: arun.id, actionType: "fertilized", notes: "Applied dried leaf mulch ring around 40cm root base." },
    { treeId: demoTree.id, custodianId: arun.id, actionType: "protected", notes: "Tightened wire ties on outer protection mesh." },
  ]);

  // Risk event for demo tree
  await db.insert(schema.riskEventsTable).values({
    treeId: demoTree.id,
    riskType: "custody_expiring",
    severity: "high",
    reason: `Custodian Arun Kumar graduating. Custody expires in 14 days. Handoff to successor required.`,
    status: "open",
    suggestedAction: "Initiate custody handoff ceremony.",
  });

  // Notification for demo
  await db.insert(schema.notificationsTable).values([
    {
      userId: arun.id,
      treeId: demoTree.id,
      type: "custody_expiring",
      title: "Custody Expires in 14 Days",
      message: "Your custody of Tree TG-IND-001 (Neem) expires in 14 days. Please initiate a handoff to your successor.",
      channel: "in_app",
      status: "delivered",
    },
    {
      userId: admin.id,
      treeId: demoTree.id,
      type: "risk_alert",
      title: "Custody Expiry Risk — TG-IND-001",
      message: "Tree TG-IND-001 has a custody expiry risk. Custodian Arun Kumar is graduating. Successor matching initiated.",
      channel: "in_app",
      status: "delivered",
    },
  ]);

  // CREATE ADDITIONAL TREES with various statuses
  // At-risk tree
  const [atRiskTree] = await db.insert(schema.treesTable).values({
    treeCode: "TG-IND-002",
    species: "Indian Beech / Pungai",
    botanicalName: "Pongamia pinnata",
    latitude: 9.9325,
    longitude: 76.2690,
    plantingDate: "2024-08-12",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: greenfield.id,
    currentStatus: "at_risk",
    healthScore: 48,
    initialHeightCm: 50,
    currentHeightCm: 72,
    zone: "Hostel Grove",
    landmark: "Beside Block C Entrance",
    growthStage: 2,
  }).returning();

  await db.insert(schema.custodyAssignmentsTable).values({
    treeId: atRiskTree.id,
    custodianId: kavitha.id,
    startDate: "2024-08-12",
    expiryDate: "2026-02-12",
    status: "active",
    reliabilityAtAssignment: 84,
  });

  await db.insert(schema.riskEventsTable).values({
    treeId: atRiskTree.id,
    riskType: "missed_checkpoint",
    severity: "high",
    reason: "6-Month checkpoint overdue by 12 days. Soil moisture deficit reported.",
    status: "open",
    suggestedAction: "Trigger emergency watering and physical re-verification.",
  });

  // Dead tree with autopsy
  const [deadTree] = await db.insert(schema.treesTable).values({
    treeCode: "TG-IND-003",
    species: "Arjun Tree / Marutham",
    botanicalName: "Terminalia arjuna",
    latitude: 9.9298,
    longitude: 76.2648,
    plantingDate: "2024-08-12",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: greenfield.id,
    currentStatus: "dead",
    healthScore: 0,
    initialHeightCm: 60,
    currentHeightCm: 60,
    zone: "Campus Zone B",
    landmark: "Near Eastern Gate Outer Trench",
    growthStage: 1,
  }).returning();

  await db.insert(schema.failureAutopsiesTable).values({
    treeId: deadTree.id,
    failureCategory: "Environmental",
    primaryCause: "Water shortage",
    contributingFactors: JSON.stringify(["Main irrigation pipe breach", "Severe dry spell Nov-Dec", "Delayed intervention alert"]),
    preventability: "Partially preventable with automated drip irrigation",
    lessons: "Zone B requires dedicated solar automated drip line and weekly soil moisture alert threshold.",
    classification: "Environmental / Systemic",
    custodianAtFailure: "Vikram R.",
    lastVerifiedAliveDate: "2024-09-12",
    zone: "Campus Zone B",
    microclimateFactor: "High heat reflection from adjacent concrete pavement",
    createdBy: admin.id,
  });

  // Orphaned tree
  const [orphanedTree] = await db.insert(schema.treesTable).values({
    treeCode: "TG-IND-004",
    species: "Jamun / Naval",
    botanicalName: "Syzygium cumini",
    latitude: 9.9340,
    longitude: 76.2705,
    plantingDate: "2024-08-12",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: greenfield.id,
    currentStatus: "orphaned",
    healthScore: 55,
    initialHeightCm: 40,
    currentHeightCm: 85,
    zone: "Lake Perimeter",
    landmark: "North Shore Watchpost #2",
    growthStage: 2,
  }).returning();

  await db.insert(schema.riskEventsTable).values({
    treeId: orphanedTree.id,
    riskType: "no_custodian",
    severity: "critical",
    reason: "Custodian Gokul M. transferred college without handoff. Tree unmonitored for 28 days.",
    status: "open",
    suggestedAction: "Assign new custodian immediately. Escalate to institutional anchor.",
  });

  // Healthy tree with full history
  const [healthyTree] = await db.insert(schema.treesTable).values({
    treeCode: "TG-IND-005",
    species: "Indian Almond / Badam",
    botanicalName: "Terminalia catappa",
    latitude: 9.9318,
    longitude: 76.2660,
    plantingDate: "2024-08-12",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: greenfield.id,
    currentStatus: "healthy",
    healthScore: 95,
    initialHeightCm: 55,
    currentHeightCm: 140,
    zone: "Library Quadrangle",
    landmark: "Central Lawn Fountain Corner",
    growthStage: 3,
  }).returning();

  await db.insert(schema.custodyAssignmentsTable).values({
    treeId: healthyTree.id,
    custodianId: meena.id,
    startDate: "2024-08-12",
    expiryDate: "2027-08-12",
    status: "active",
    reliabilityAtAssignment: 96,
  });

  // Verification mismatch tree
  const [mismatchTree] = await db.insert(schema.treesTable).values({
    treeCode: "TG-IND-006",
    species: "Teak / Thekku",
    botanicalName: "Tectona grandis",
    latitude: 9.9305,
    longitude: 76.2638,
    plantingDate: "2024-08-12",
    plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    currentPhotoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    institutionalAnchorId: greenfield.id,
    currentStatus: "verification_pending",
    healthScore: 60,
    initialHeightCm: 50,
    currentHeightCm: 75,
    zone: "Campus Zone B",
    landmark: "Agricultural Farm Border",
    growthStage: 2,
  }).returning();

  await db.insert(schema.riskEventsTable).values({
    treeId: mismatchTree.id,
    riskType: "verification_mismatch",
    severity: "high",
    reason: "Uploaded photo timestamp and leaf structure inconsistent with 1-month baseline.",
    status: "open",
    suggestedAction: "Dispatch independent peer verifier for on-ground GPS audit.",
  });

  // Generate bulk trees (to reach ~500 total)
  console.log("  Generating bulk trees...");
  const bulkTrees = [];
  for (let i = 7; i <= 500; i++) {
    const speciesIdx = (i - 1) % speciesPool.length;
    const sp = speciesPool[speciesIdx];
    const zoneIdx = (i - 1) % zones.length;
    const statusOptions: Array<"healthy" | "needs_attention" | "at_risk" | "healthy" | "healthy"> = ["healthy", "needs_attention", "at_risk", "healthy", "healthy"];
    const status = statusOptions[i % statusOptions.length];
    const healthScore = status === "healthy" ? 80 + Math.floor(Math.random() * 20) : status === "at_risk" ? 30 + Math.floor(Math.random() * 30) : 50 + Math.floor(Math.random() * 30);

    bulkTrees.push({
      treeCode: `TG-IND-${String(i).padStart(3, "0")}`,
      species: sp.species,
      botanicalName: sp.botanical,
      latitude: 9.925 + Math.random() * 0.015,
      longitude: 76.260 + Math.random() * 0.015,
      plantingDate: "2024-08-12",
      plantingPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      currentPhotoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
      institutionalAnchorId: greenfield.id,
      currentStatus: status as any,
      healthScore,
      initialHeightCm: 40 + Math.floor(Math.random() * 20),
      currentHeightCm: 70 + Math.floor(Math.random() * 80),
      zone: zones[zoneIdx],
      landmark: `Sector ${Math.ceil(i / 50)}`,
      growthStage: Math.min(5, Math.floor(Math.random() * 4) + 1) as any,
    });
  }

  // Insert in batches
  for (let i = 0; i < bulkTrees.length; i += 50) {
    await db.insert(schema.treesTable).values(bulkTrees.slice(i, i + 50));
  }

  // Create custody assignments for bulk trees
  console.log("  Assigning custodians to bulk trees...");
  const allTrees = await db.select({ id: schema.treesTable.id }).from(schema.treesTable);
  const assignedTreeIds = new Set([demoTree.id, atRiskTree.id, healthyTree.id]);
  
  for (const tree of allTrees) {
    if (assignedTreeIds.has(tree.id)) continue;
    const custodian = custodians[tree.id % custodians.length];
    const monthsOut = 6 + Math.floor(Math.random() * 30);
    const expiry = new Date(now.getTime() + monthsOut * 30 * 24 * 60 * 60 * 1000);
    
    await db.insert(schema.custodyAssignmentsTable).values({
      treeId: tree.id,
      custodianId: custodian.id,
      startDate: "2024-08-12",
      expiryDate: formatDate(expiry),
      status: "active",
      reliabilityAtAssignment: custodian.reliabilityScore,
    });
  }

  console.log("\n✅ TreeGuard database seeded successfully!");
  console.log(`   Organizations: 4`);
  console.log(`   Users: 12`);
  console.log(`   Trees: 500`);
  console.log(`   Demo tree: TG-IND-001 (custody expiring in 14 days)`);
  console.log(`   Risk events: 4`);
  console.log(`   Notifications: 2`);

  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
