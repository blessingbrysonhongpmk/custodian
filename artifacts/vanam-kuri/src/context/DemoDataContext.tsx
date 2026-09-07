import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { Tree, CheckpointEvidence, CustodyRecord, MaintenanceLog, RiskItem, OrganizationReliability } from '../types/custodia';
import { sampleTrees, initialReliability, mockRiskQueue } from '../data/mockData';
import { useAuth } from './AuthContext';
import { treesApi, custodyApi, checkpointsApi, maintenanceApi, autopsyApi, authApi } from '../lib/api';

export interface AppUser {
  id: string;
  name: string;
  role: 'ADMIN' | 'CUSTODIAN' | 'PEER_VERIFIER';
  roleTitle: string;
  email: string;
  location: string;
  organization: string;
  avatarBg: string;
  bio: string;
  joinedDate: string;
}

export interface HandoffRequest {
  id: string;
  treeId: string;
  treeSpecies: string;
  fromCustodianName: string;
  fromCustodianId: string;
  toCustodianName: string;
  toCustodianId: string;
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  requestedAt: string;
  respondedAt?: string;
  landmark: string;
}

export interface SearchResult {
  custodians: (AppUser & { assignedTreesCount: number; verifiedTreesCount: number })[];
  trees: Tree[];
}

export type DemoUser = AppUser;

export const PRESET_DEMO_USERS: AppUser[] = [
  {
    id: '1',
    name: 'Dr. Malathi V.',
    role: 'ADMIN',
    roleTitle: 'State Administrator',
    email: 'malathi.v@greenfieldcollege.edu.in',
    location: 'Chennai, Tamil Nadu',
    organization: 'Department of Environment, Climate Change & Forests',
    avatarBg: 'bg-purple-900',
    bio: 'State Project Director overseeing the digital tree custody network.',
    joinedDate: 'Jan 2024',
  },
  {
    id: '2',
    name: 'Arun Kumar',
    role: 'CUSTODIAN',
    roleTitle: 'Lead Guardian',
    email: 'arun.kumar@gmail.com',
    location: 'Chennai, Tamil Nadu',
    organization: 'Anna University Environmental Club',
    avatarBg: 'bg-emerald-700',
    bio: 'Student Lead Guardian pledged to native tree survival.',
    joinedDate: 'Feb 2024',
  },
  {
    id: '3',
    name: 'Priya S',
    role: 'CUSTODIAN',
    roleTitle: 'Campus Custodian',
    email: 'priya.s@gmail.com',
    location: 'Coimbatore, Tamil Nadu',
    organization: 'NSS Unit 4, Coimbatore',
    avatarBg: 'bg-teal-700',
    bio: 'NSS volunteer dedicated to urban sapling protection and watering rounds.',
    joinedDate: 'Mar 2024',
  },
  {
    id: '4',
    name: 'Karthik R',
    role: 'CUSTODIAN',
    roleTitle: 'Community Custodian',
    email: 'karthik.r@gmail.com',
    location: 'Madurai, Tamil Nadu',
    organization: 'Madurai Green Brigade',
    avatarBg: 'bg-green-700',
    bio: 'Madurai Green Brigade volunteer actively nurturing public park trees.',
    joinedDate: 'Apr 2024',
  },
  {
    id: '5',
    name: 'Suresh R',
    role: 'PEER_VERIFIER',
    roleTitle: 'Certified Field Auditor',
    email: 'suresh.r@tn.gov.in',
    location: 'Trichy, Tamil Nadu',
    organization: 'State Forest Extension Wing',
    avatarBg: 'bg-indigo-700',
    bio: 'Certified field verifier conducting visual evidence and telemetry audits.',
    joinedDate: 'Jan 2024',
  },
  {
    id: '6',
    name: 'Ananya M',
    role: 'PEER_VERIFIER',
    roleTitle: 'Field Auditor',
    email: 'ananya.m@tn.gov.in',
    location: 'Salem, Tamil Nadu',
    organization: 'Environmental Protection Cell',
    avatarBg: 'bg-blue-700',
    bio: 'Independent auditor validating photographic checkpoints across western districts.',
    joinedDate: 'Mar 2024',
  },
];

interface DataContextType {
  trees: Tree[];
  currentUser: AppUser;
  users: AppUser[];
  handoffRequests: HandoffRequest[];
  riskItems: RiskItem[];
  reliability: OrganizationReliability;
  registerTree: (treeData: Partial<Tree>) => Promise<Tree>;
  editTree: (treeId: string, updates: Partial<Tree>) => Promise<void>;
  assignCustodian: (treeId: string, custodianName: string, unit?: string) => Promise<void>;
  assignVerifier: (treeId: string, verifierName: string) => Promise<void>;
  submitCheckpointEvidence: (treeId: string, checkpointId: string, data: { photoUrl: string; notes?: string; heightCm?: number; soilMoisture?: number }) => Promise<void>;
  verifyCheckpoint: (treeId: string, checkpointId: string, decision: 'APPROVE' | 'RECHECK' | 'FLAG', verifierNotes?: string) => Promise<{ success: boolean; error?: string }>;
  requestHandover: (treeId: string, toCustodianName: string, reason: string) => Promise<void>;
  acceptHandover: (handoffId: string) => Promise<void>;
  declineHandover: (handoffId: string) => Promise<void>;
  addMaintenanceLog: (treeId: string, log: { type: any; notes: string; liters?: string }) => Promise<void>;
  searchAll: (query: string) => SearchResult;
  getCustodianTrees: (custodianName: string) => Tree[];
  getVerifierQueue: (verifierName: string) => Tree[];
  refreshData: () => Promise<void>;
}

const STORAGE_KEY_TREES = 'pasumai_db_trees_v3';
const STORAGE_KEY_HANDOFFS = 'pasumai_db_handoffs_v3';

const DemoDataContext = createContext<DataContextType | null>(null);

export const DemoDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();

  // 1. Initial State with LocalStorage Persistence & API Synchronization
  const [trees, setTrees] = useState<Tree[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TREES);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return sampleTrees;
  });

  const [handoffRequests, setHandoffRequests] = useState<HandoffRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HANDOFFS);
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return [];
  });

  const [users, setUsers] = useState<AppUser[]>(PRESET_DEMO_USERS);

  // Dynamically resolve currentUser based on actual authenticated user
  const currentUser: AppUser = authUser ? {
    id: String(authUser.id),
    name: authUser.name,
    role: authUser.role === 'admin' ? 'ADMIN' : authUser.role === 'verifier' ? 'PEER_VERIFIER' : 'CUSTODIAN',
    roleTitle: authUser.role === 'admin' ? 'State Administrator' : authUser.role === 'verifier' ? 'Certified Field Auditor' : 'Tree Custodian',
    email: authUser.email,
    location: authUser.location || 'Tamil Nadu',
    organization: authUser.organization || 'Green Tamil Nadu Initiative',
    avatarBg: authUser.role === 'admin' ? 'bg-purple-900' : authUser.role === 'verifier' ? 'bg-indigo-700' : 'bg-emerald-700',
    bio: 'Dedicated custodian pledged under the Tamil Nadu Environmental Governance initiative.',
    joinedDate: 'Jan 2025',
  } : {
    id: 'guest',
    name: 'Guest Custodian',
    role: 'CUSTODIAN',
    roleTitle: 'Community Custodian',
    email: 'guest@pasumaikaval.tn.gov.in',
    location: 'Chennai, Tamil Nadu',
    organization: 'Green Tamil Nadu Initiative',
    avatarBg: 'bg-emerald-700',
    bio: '',
    joinedDate: 'Jan 2025',
  };

  // Sync from backend API on mount
  const refreshData = useCallback(async () => {
    try {
      const res = await treesApi.list({ limit: 100 });
      if (res.trees && res.trees.length > 0) {
        // Map backend trees into our canonical Tree schema
        const mappedTrees: Tree[] = res.trees.map((bt: any) => ({
          id: bt.treeCode || `TG-IND-${bt.id}`,
          speciesName: bt.species,
          botanicalName: bt.botanicalName || 'Indigenous species',
          tamilName: bt.nickname || '',
          plantedAt: bt.plantingDate,
          zone: bt.zone || 'District Sector',
          landmark: bt.landmark || 'Campus perimeter',
          coordinates: [bt.latitude || 13.0827, bt.longitude || 80.2707],
          status: bt.currentStatus === 'dead' ? 'failed' : bt.currentStatus === 'needs_attention' ? 'at-risk' : 'healthy',
          healthScore: bt.healthScore || 90,
          initialHeightCm: bt.initialHeightCm || 50,
          currentHeightCm: bt.currentHeightCm || 50,
          initialPhotoUrl: bt.plantingPhotoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
          currentPhotoUrl: bt.currentPhotoUrl || bt.plantingPhotoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
          currentCustodian: bt.currentCustodian?.name || 'Unassigned',
          currentCustodianUnit: 'Green Tamil Nadu Grid',
          currentCustodianEmail: bt.currentCustodian?.email || '',
          organization: 'Department of Environment, Climate Change & Forests',
          growthStage: (bt.growthStage as any) || 1,
          checkpoints: [],
          custodyHistory: [],
          maintenanceLogs: [],
        }));

        setTrees(prev => {
          // Merge avoiding duplicates
          const existingIds = new Set(mappedTrees.map(t => t.id));
          const localOnly = prev.filter(t => !existingIds.has(t.id));
          return [...mappedTrees, ...localOnly];
        });
      }
    } catch {
      // Backend not running or offline; keep reactive state
    }

    try {
      const usersRes = await authApi.listUsers();
      if (usersRes.users && usersRes.users.length > 0) {
        const mappedUsers: AppUser[] = usersRes.users.map((u: any) => ({
          id: String(u.id),
          name: u.name,
          role: u.role === 'admin' ? 'ADMIN' : u.role === 'verifier' ? 'PEER_VERIFIER' : 'CUSTODIAN',
          roleTitle: u.role === 'admin' ? 'State Administrator' : u.role === 'verifier' ? 'Certified Field Auditor' : 'Tree Custodian',
          email: u.email,
          location: u.location || 'Tamil Nadu',
          organization: u.organization || 'Green Tamil Nadu Initiative',
          avatarBg: u.role === 'admin' ? 'bg-purple-900' : u.role === 'verifier' ? 'bg-indigo-700' : 'bg-emerald-700',
          bio: 'Registered on Pasumai Kaval digital network.',
          joinedDate: 'Jan 2025',
        }));
        setUsers(prev => {
          const existingEmails = new Set(mappedUsers.map(m => m.email.toLowerCase()));
          const keepPresets = prev.filter(p => !existingEmails.has(p.email.toLowerCase()));
          return [...keepPresets, ...mappedUsers];
        });
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TREES, JSON.stringify(trees));
    } catch { /* ignore */ }
  }, [trees]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HANDOFFS, JSON.stringify(handoffRequests));
    } catch { /* ignore */ }
  }, [handoffRequests]);

  // 2. Computed Metrics (One shared source of truth)
  const totalPlanted = trees.length;
  const verifiedAlive = trees.filter(t => t.status === 'healthy').length;
  const atRiskCount = trees.filter(t => t.status === 'at-risk' || t.status === 'orphaned').length;
  const failedCount = trees.filter(t => t.status === 'failed').length;
  const orphanedCount = trees.filter(t => t.status === 'orphaned' || !t.currentCustodian || t.currentCustodian === 'Unassigned').length;
  const verifiedSurvivalRate = totalPlanted > 0 ? Math.round((verifiedAlive / totalPlanted) * 1000) / 10 : 0;

  const reliability: OrganizationReliability = {
    projectName: 'Government of Tamil Nadu • Pasumai Kaval',
    totalPlanted,
    verifiedAlive,
    atRiskCount,
    failedCount,
    orphanedCount,
    claimedSurvivalRate: 94.0,
    verifiedSurvivalRate,
    verificationGap: Math.max(0, Math.round((94.0 - verifiedSurvivalRate) * 10) / 10),
    custodyContinuityRate: 96.2,
    checkpointComplianceRate: 91.5,
    riskRecoveryRate: 85.0,
    topFailureCause: 'Moisture deficit / Dry spell',
    dominantFailureZone: 'Zone B — Coastal Belt',
  };

  const riskItems: RiskItem[] = trees
    .filter(t => t.status === 'at-risk' || t.status === 'orphaned')
    .map((t, idx) => ({
      id: `RISK-${t.id}-${idx}`,
      treeId: t.id,
      treeSpecies: `${t.speciesName} (${t.tamilName || ''})`,
      zone: t.zone,
      landmark: t.landmark,
      status: t.status,
      severity: t.status === 'orphaned' ? 'high' : 'medium',
      title: t.status === 'orphaned' ? 'Orphaned Tree — Custodian Required' : (t.activeAlert || 'Inspection Overdue'),
      reason: t.activeAlert || 'Tree requires scheduled watering or checkpoint inspection.',
      daysOverdue: 4,
      custodianName: t.currentCustodian || 'Unassigned',
      actionRequired: t.status === 'orphaned' ? 'Assign Successor' : 'Schedule Inspection',
      suggestedActionType: t.status === 'orphaned' ? 'REASSIGN' : 'VERIFY',
    }));

  // 3. Action Handlers (Calling Real API + Reactive State)
  const registerTree = useCallback(async (treeData: Partial<Tree>): Promise<Tree> => {
    const newId = treeData.id || `TG-TN-${Math.floor(100 + Math.random() * 900)}`;
    const custodianName = treeData.currentCustodian || currentUser.name;
    const custodianEmail = treeData.currentCustodianEmail || currentUser.email;
    const custodianUnit = treeData.currentCustodianUnit || currentUser.organization;

    const newTree: Tree = {
      id: newId,
      speciesName: treeData.speciesName || 'Neem',
      botanicalName: treeData.botanicalName || 'Azadirachta indica',
      tamilName: treeData.tamilName || 'வேம்பு',
      plantedAt: treeData.plantedAt || new Date().toISOString().slice(0, 10),
      zone: treeData.zone || 'District Sector',
      landmark: treeData.landmark || 'Tamil Nadu',
      coordinates: treeData.coordinates || [13.0827, 80.2707],
      status: 'healthy',
      healthScore: 92,
      initialHeightCm: treeData.initialHeightCm || 50,
      currentHeightCm: treeData.currentHeightCm || 50,
      initialPhotoUrl: treeData.initialPhotoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      currentPhotoUrl: treeData.currentPhotoUrl || treeData.initialPhotoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
      currentCustodian: custodianName,
      currentCustodianUnit: custodianUnit,
      currentCustodianEmail: custodianEmail,
      organization: 'Department of Environment, Climate Change & Forests',
      growthStage: 1,
      checkpoints: [
        {
          id: `CHK-${newId}-PLANT`,
          stage: 'planted',
          scheduledDate: new Date().toISOString().slice(0, 10),
          submittedDate: new Date().toISOString().slice(0, 10),
          verifiedDate: new Date().toISOString().slice(0, 10),
          status: 'verified',
          photoUrl: treeData.initialPhotoUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
          custodianName,
          verifierName: 'Certified Field Auditor',
          consistencyScore: 'HIGH_CONSISTENCY',
          locationMatched: true,
          timestampVerified: true,
          notes: 'Baseline planting verified.',
        },
        {
          id: `CHK-${newId}-1M`,
          stage: '1m',
          scheduledDate: new Date(Date.now() + 86400000 * 30).toISOString().slice(0, 10),
          status: 'pending',
          photoUrl: '',
          custodianName,
          consistencyScore: 'HIGH_CONSISTENCY',
          locationMatched: false,
          timestampVerified: false,
        }
      ],
      custodyHistory: [
        {
          id: `CUST-${Date.now().toString().slice(-4)}`,
          custodianName,
          custodianRole: 'Designated Custodian',
          custodianEmail,
          organizationUnit: custodianUnit,
          assignedDate: new Date().toISOString().slice(0, 10),
          checkpointsCompleted: 1,
          checkpointsTotal: 3,
          pledgeSigned: true,
          certificateId: `CERT-${newId}-01`,
          active: true,
        }
      ],
      maintenanceLogs: [],
    };

    // Save to backend API if reachable
    try {
      await treesApi.create({
        species: newTree.speciesName,
        botanicalName: newTree.botanicalName,
        nickname: newTree.tamilName,
        latitude: newTree.coordinates[0],
        longitude: newTree.coordinates[1],
        plantingDate: newTree.plantedAt,
        plantingPhotoUrl: newTree.initialPhotoUrl,
        landmark: newTree.landmark,
        zone: newTree.zone,
        initialHeightCm: newTree.initialHeightCm,
      });
    } catch {
      // Offline fallback
    }

    setTrees(prev => [newTree, ...prev]);
    return newTree;
  }, [currentUser]);

  const editTree = useCallback(async (treeId: string, updates: Partial<Tree>) => {
    setTrees(prev => prev.map(t => t.id === treeId ? { ...t, ...updates } : t));
  }, []);

  const assignCustodian = useCallback(async (treeId: string, custodianName: string, unit: string = 'Pasumai Custodian Grid') => {
    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        const updatedHistory = (t.custodyHistory || []).map(c => ({ ...c, active: false }));
        updatedHistory.push({
          id: `CUST-${Date.now().toString().slice(-4)}`,
          custodianName,
          custodianRole: 'Designated Custodian',
          custodianEmail: `${custodianName.toLowerCase().replace(/\s+/g, '.')}@pasumaikaval.tn.gov.in`,
          organizationUnit: unit,
          assignedDate: new Date().toISOString().slice(0, 10),
          checkpointsCompleted: 0,
          checkpointsTotal: 3,
          pledgeSigned: true,
          certificateId: `CERT-TG-${Date.now().toString().slice(-6)}`,
          active: true,
        });

        return {
          ...t,
          currentCustodian: custodianName,
          currentCustodianUnit: unit,
          currentCustodianEmail: `${custodianName.toLowerCase().replace(/\s+/g, '.')}@pasumaikaval.tn.gov.in`,
          status: t.status === 'orphaned' ? 'healthy' : t.status,
          activeAlert: undefined,
          custodyHistory: updatedHistory,
        };
      }
      return t;
    }));
  }, []);

  const assignVerifier = useCallback(async (treeId: string, verifierName: string) => {
    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        const updatedCheckpoints = t.checkpoints.map(c => 
          c.status === 'pending' ? { ...c, verifierName } : c
        );
        return { ...t, checkpoints: updatedCheckpoints };
      }
      return t;
    }));
  }, []);

  // Custodian submits evidence for an audit milestone
  const submitCheckpointEvidence = useCallback(async (
    treeId: string, 
    checkpointId: string, 
    data: { photoUrl: string; notes?: string; heightCm?: number; soilMoisture?: number }
  ) => {
    // Try dispatching to backend
    try {
      await checkpointsApi.submit({
        treeId,
        checkpointType: checkpointId,
        photoUrl: data.photoUrl,
        notes: data.notes,
        heightCm: data.heightCm,
      });
    } catch {
      // Local fallback
    }

    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        const updatedCheckpoints = t.checkpoints.map(c => {
          if (c.id === checkpointId || c.stage === checkpointId) {
            return {
              ...c,
              status: 'pending' as const,
              submittedDate: new Date().toISOString().slice(0, 10),
              photoUrl: data.photoUrl || c.photoUrl,
              notes: data.notes || c.notes,
              heightCm: data.heightCm || c.heightCm,
              soilMoisturePercent: data.soilMoisture || c.soilMoisturePercent,
            };
          }
          return c;
        });

        return {
          ...t,
          status: 'verification-pending',
          currentPhotoUrl: data.photoUrl || t.currentPhotoUrl,
          currentHeightCm: data.heightCm || t.currentHeightCm,
          checkpoints: updatedCheckpoints,
          activeAlert: 'Checkpoint evidence submitted. Awaiting Peer Verifier review.',
        };
      }
      return t;
    }));
  }, []);

  // Peer Verifier evaluates evidence with CONFLICT OF INTEREST ENFORCEMENT
  const verifyCheckpoint = useCallback(async (
    treeId: string, 
    checkpointId: string, 
    decision: 'APPROVE' | 'RECHECK' | 'FLAG', 
    verifierNotes?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const targetTree = trees.find(t => t.id === treeId);
    if (!targetTree) return { success: false, error: 'Tree not found' };

    // STRICT CONFLICT OF INTEREST ENFORCEMENT
    if (targetTree.currentCustodian.toLowerCase().includes(currentUser.name.toLowerCase()) || 
        currentUser.name.toLowerCase().includes(targetTree.currentCustodian.toLowerCase())) {
      return {
        success: false,
        error: `Conflict of Interest: You are the assigned custodian (${targetTree.currentCustodian}) for this tree. Peer verification must be conducted by an independent auditor.`
      };
    }

    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        const isApproved = decision === 'APPROVE';
        const updatedCheckpoints = t.checkpoints.map(c => {
          if (c.id === checkpointId || c.stage === checkpointId || c.status === 'pending') {
            return {
              ...c,
              status: isApproved ? ('verified' as const) : ('at-risk' as const),
              verifiedDate: new Date().toISOString().slice(0, 10),
              verifierName: currentUser.name,
              verifierRole: currentUser.roleTitle,
              notes: verifierNotes ? `${c.notes ? c.notes + ' · ' : ''}Verifier: ${verifierNotes}` : c.notes,
            };
          }
          return c;
        });

        return {
          ...t,
          status: isApproved ? 'healthy' : 'at-risk',
          healthScore: isApproved ? 96 : 48,
          checkpoints: updatedCheckpoints,
          activeAlert: isApproved ? undefined : 'Evidence flagged by verifier. Re-inspection required.',
        };
      }
      return t;
    }));

    return { success: true };
  }, [trees, currentUser]);

  // Custodian requests handover
  const requestHandover = useCallback(async (treeId: string, toCustodianName: string, reason: string) => {
    const targetTree = trees.find(t => t.id === treeId);

    const newRequest: HandoffRequest = {
      id: `HO-${Date.now().toString().slice(-4)}`,
      treeId,
      treeSpecies: targetTree ? `${targetTree.speciesName} (${targetTree.tamilName || ''})` : 'Tree',
      fromCustodianName: currentUser.name,
      fromCustodianId: currentUser.id,
      toCustodianName,
      toCustodianId: toCustodianName.toLowerCase().replace(/\s+/g, '-'),
      reason,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
      landmark: targetTree?.landmark || 'Tamil Nadu',
    };

    setHandoffRequests(prev => [newRequest, ...prev]);
    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        return {
          ...t,
          activeAlert: `Handover requested to ${toCustodianName} (${reason}). Awaiting acceptance.`,
        };
      }
      return t;
    }));
  }, [trees, currentUser]);

  // Recipient accepts responsibility
  const acceptHandover = useCallback(async (handoffId: string) => {
    const req = handoffRequests.find(h => h.id === handoffId);
    if (!req) return;

    setHandoffRequests(prev => prev.map(h => 
      h.id === handoffId ? { ...h, status: 'ACCEPTED', respondedAt: new Date().toISOString() } : h
    ));

    // Update tree in shared state
    setTrees(prev => prev.map(t => {
      if (t.id === req.treeId) {
        const updatedHistory = (t.custodyHistory || []).map(c => ({ ...c, active: false }));
        updatedHistory.push({
          id: `CUST-${Date.now().toString().slice(-4)}`,
          custodianName: req.toCustodianName,
          custodianRole: 'Successor Custodian',
          custodianEmail: `${req.toCustodianName.toLowerCase().replace(/\s+/g, '.')}@pasumaikaval.tn.gov.in`,
          organizationUnit: 'Active Custodian Grid',
          assignedDate: new Date().toISOString().slice(0, 10),
          checkpointsCompleted: 0,
          checkpointsTotal: 3,
          handoffReason: req.reason as any,
          handoffNotes: `Accepted transfer from ${req.fromCustodianName}. Complete chain of custody preserved.`,
          pledgeSigned: true,
          certificateId: `CERT-HO-${Date.now().toString().slice(-6)}`,
          active: true,
        });

        return {
          ...t,
          currentCustodian: req.toCustodianName,
          currentCustodianEmail: `${req.toCustodianName.toLowerCase().replace(/\s+/g, '.')}@pasumaikaval.tn.gov.in`,
          activeAlert: undefined,
          status: 'healthy',
          custodyHistory: updatedHistory,
        };
      }
      return t;
    }));
  }, [handoffRequests]);

  const declineHandover = useCallback(async (handoffId: string) => {
    setHandoffRequests(prev => prev.map(h => 
      h.id === handoffId ? { ...h, status: 'DECLINED', respondedAt: new Date().toISOString() } : h
    ));
  }, []);

  const addMaintenanceLog = useCallback(async (treeId: string, log: { type: any; notes: string; liters?: string }) => {
    const newLog: MaintenanceLog = {
      id: `MNT-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      custodianName: currentUser.name,
      type: log.type,
      notes: log.liters ? `${log.liters}L: ${log.notes}` : log.notes,
    };

    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        return {
          ...t,
          maintenanceLogs: [newLog, ...(t.maintenanceLogs || [])],
        };
      }
      return t;
    }));
  }, [currentUser]);

  // Query Helpers
  const getCustodianTrees = useCallback((custodianName: string) => {
    return trees.filter(t => 
      t.currentCustodian.toLowerCase().includes(custodianName.toLowerCase()) ||
      custodianName.toLowerCase().includes(t.currentCustodian.toLowerCase())
    );
  }, [trees]);

  const getVerifierQueue = useCallback((verifierName: string) => {
    return trees.filter(t => 
      t.checkpoints.some(c => c.status === 'pending') ||
      t.status === 'verification-pending'
    );
  }, [trees]);

  // Universal Search
  const searchAll = useCallback((query: string): SearchResult => {
    const q = query.trim().toLowerCase();

    // Unique custodians derived from actual trees
    const custodiansMap = new Map<string, AppUser>();
    trees.forEach(t => {
      if (t.currentCustodian && t.currentCustodian !== 'Unassigned') {
        if (!custodiansMap.has(t.currentCustodian)) {
          custodiansMap.set(t.currentCustodian, {
            id: t.currentCustodian.toLowerCase().replace(/\s+/g, '-'),
            name: t.currentCustodian,
            role: 'CUSTODIAN',
            roleTitle: 'Tree Custodian',
            email: t.currentCustodianEmail || `${t.currentCustodian.toLowerCase().replace(/\s+/g, '.')}@pasumaikaval.tn.gov.in`,
            location: t.landmark.split(',')[1]?.trim() || 'Tamil Nadu',
            organization: t.currentCustodianUnit || 'Green Tamil Nadu Initiative',
            avatarBg: 'bg-emerald-700',
            bio: 'Registered custodian pledged to tree care and survival continuity.',
            joinedDate: 'Jan 2025',
          });
        }
      }
    });

    const allCustodians = Array.from(custodiansMap.values());

    if (!q) {
      return {
        custodians: allCustodians.map(c => {
          const userTrees = trees.filter(t => t.currentCustodian.toLowerCase().includes(c.name.toLowerCase()));
          return {
            ...c,
            assignedTreesCount: userTrees.length,
            verifiedTreesCount: userTrees.filter(t => t.status === 'healthy').length,
          };
        }),
        trees: trees.slice(0, 6),
      };
    }

    const matchedCustodians = allCustodians.filter(u => 
      u.name.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      u.organization.toLowerCase().includes(q)
    ).map(u => {
      const userTrees = trees.filter(t => t.currentCustodian.toLowerCase().includes(u.name.toLowerCase()));
      return {
        ...u,
        assignedTreesCount: userTrees.length,
        verifiedTreesCount: userTrees.filter(t => t.status === 'healthy').length,
      };
    });

    const matchedTrees = trees.filter(t => 
      t.id.toLowerCase().includes(q) ||
      t.speciesName.toLowerCase().includes(q) ||
      (t.tamilName && t.tamilName.toLowerCase().includes(q)) ||
      t.botanicalName.toLowerCase().includes(q) ||
      t.landmark.toLowerCase().includes(q) ||
      t.zone.toLowerCase().includes(q) ||
      t.currentCustodian.toLowerCase().includes(q)
    );

    return {
      custodians: matchedCustodians,
      trees: matchedTrees,
    };
  }, [trees]);

  return (
    <DemoDataContext.Provider
      value={{
        trees,
        currentUser,
        users,
        handoffRequests,
        riskItems,
        reliability,
        registerTree,
        editTree,
        assignCustodian,
        assignVerifier,
        submitCheckpointEvidence,
        verifyCheckpoint,
        requestHandover,
        acceptHandover,
        declineHandover,
        addMaintenanceLog,
        searchAll,
        getCustodianTrees,
        getVerifierQueue,
        refreshData,
      }}
    >
      {children}
    </DemoDataContext.Provider>
  );
};

export function useDemoData(): DataContextType {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within a DemoDataProvider');
  }
  return context;
}
