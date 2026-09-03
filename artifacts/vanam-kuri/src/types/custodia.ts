export type TreeStatus = 
  | 'healthy' 
  | 'at-risk' 
  | 'orphaned' 
  | 'failed' 
  | 'verification-pending' 
  | 'mismatch';

export type CheckpointStage = 'planted' | '1m' | '6m' | '1y' | '3y';

export type CheckpointStatus = 
  | 'verified' 
  | 'self-reported' 
  | 'missed' 
  | 'at-risk' 
  | 'pending' 
  | 'mismatch';

export type EvidenceConsistency = 
  | 'HIGH_CONSISTENCY' 
  | 'REVIEW_REQUIRED' 
  | 'POSSIBLE_ANOMALY';

export type FailureCause = 
  | 'Water shortage' 
  | 'Cattle damage' 
  | 'No custodian' 
  | 'Disease / Pests' 
  | 'Vandalism' 
  | 'Maintenance failure' 
  | 'Wrong species/site' 
  | 'Soil toxicity / salinity' 
  | 'Other';

export type FailureClassification = 
  | 'Environmental / Systemic' 
  | 'Custodial Failure' 
  | 'Biological / Pathogen';

export interface CheckpointEvidence {
  id: string;
  stage: CheckpointStage;
  scheduledDate: string;
  submittedDate?: string;
  verifiedDate?: string;
  status: CheckpointStatus;
  photoUrl: string;
  referencePhotoUrl?: string;
  custodianName: string;
  verifierName?: string;
  verifierRole?: string;
  consistencyScore: EvidenceConsistency;
  anomalyNotes?: string;
  locationMatched: boolean;
  timestampVerified: boolean;
  notes?: string;
  soilMoisturePercent?: number;
  heightCm?: number;
  healthMetrics?: {
    leafColor: 'vibrant-green' | 'pale-yellow' | 'brown-withered';
    canopyDensityPercent: number;
    pestActivity: boolean;
  };
  aiAnalysis?: any;
  confidenceScore?: number;
}

export interface CustodyRecord {
  id: string;
  custodianName: string;
  custodianRole: string;
  custodianEmail: string;
  organizationUnit: string; // e.g., "B.Sc Green Club 2024", "NSS Unit 3"
  assignedDate: string;
  endDate?: string;
  checkpointsCompleted: number;
  checkpointsTotal: number;
  handoffReason?: 'Graduation' | 'Transfer' | 'Semester Leave' | 'Role Change' | 'Emergency Handoff';
  handoffNotes?: string;
  pledgeSigned: boolean;
  certificateId?: string;
  active: boolean;
}

export interface MaintenanceLog {
  id: string;
  date: string;
  custodianName: string;
  type: 'Watering' | 'Organic Fertilizer / Mulch' | 'Tree Guard Repair' | 'Pruning' | 'Pest Treatment' | 'Soil Aeration';
  notes: string;
  photoUrl?: string;
}

export interface FailureAutopsy {
  autopsyId: string;
  treeId: string;
  recordedDate: string;
  reportedBy: string;
  primaryCause: FailureCause;
  contributingFactors: string[];
  classification: FailureClassification;
  lastVerifiedAliveDate: string;
  custodianAtFailure: string;
  autopsyNotes: string;
  preventiveLesson: string;
  zone: string;
  microclimateFactor?: string;
}

export interface Tree {
  id: string; // e.g. "TN-COL-00125"
  speciesName: string; // "Neem"
  botanicalName: string; // "Azadirachta indica"
  tamilName: string; // "வேம்பு"
  plantedAt: string;
  zone: string; // "Playground North"
  landmark: string; // "Behind Basketball Court"
  coordinates: [number, number]; // [lat, lng]
  status: TreeStatus;
  healthScore: number; // 0 - 100
  initialHeightCm: number;
  currentHeightCm: number;
  initialPhotoUrl: string;
  currentPhotoUrl: string;
  currentCustodian: string;
  currentCustodianUnit: string;
  currentCustodianEmail: string;
  organization: string; // "Loyola Sustainability Initiative / Green Tamil Nadu"
  isPilotTree?: boolean;
  checkpoints: CheckpointEvidence[];
  custodyHistory: CustodyRecord[];
  maintenanceLogs: MaintenanceLog[];
  failureAutopsy?: FailureAutopsy;
  growthStage: 1 | 2 | 3 | 4 | 5; // 1: Seedling, 2: 1M, 3: 6M, 4: 1Y, 5: 3Y
  activeAlert?: string;
}

export interface RiskItem {
  id: string;
  treeId: string;
  treeSpecies: string;
  zone: string;
  landmark: string;
  status: TreeStatus;
  severity: 'high' | 'medium' | 'low';
  title: string;
  reason: string;
  daysOverdue: number;
  custodianName: string;
  actionRequired: string;
  suggestedActionType: 'VERIFY' | 'REASSIGN' | 'WATER_EMERGENCY' | 'AUTOPSY' | 'INSPECT';
}

export interface OrganizationReliability {
  projectName: string;
  totalPlanted: number;
  verifiedAlive: number;
  atRiskCount: number;
  failedCount: number;
  orphanedCount: number;
  claimedSurvivalRate: number; // e.g., 89%
  verifiedSurvivalRate: number; // e.g., 63.6%
  verificationGap: number; // e.g., 25.4%
  custodyContinuityRate: number; // e.g., 88%
  checkpointComplianceRate: number; // e.g., 81%
  riskRecoveryRate: number; // e.g., 68%
  topFailureCause: string;
  dominantFailureZone: string;
}

export type ActiveRole = 'ADMIN' | 'CUSTODIAN' | 'PEER_VERIFIER';

export type ActiveTab = 
  | 'dashboard' 
  | 'passport' 
  | 'map' 
  | 'verification' 
  | 'handoff' 
  | 'risk-center' 
  | 'autopsy' 
  | 'custodian-view' 
  | 'impact-report'
  | 'register-tree'
  | 'verification-queue';
