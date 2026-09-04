import React, { useState, useEffect, useCallback } from 'react';
import { 
  Tree, 
  ActiveTab, 
  ActiveRole, 
  OrganizationReliability, 
  RiskItem, 
  FailureAutopsy, 
  EvidenceConsistency 
} from './types/custodia';
import { 
  initialReliability, 
  sampleTrees, 
  mockRiskQueue, 
  pilotTree 
} from './data/mockData';

import { treesApi, dashboardApi, demoApi } from './lib/api';
import { isSupabaseConfigured } from './lib/supabase';
import { treeService } from './services/treeService';
import { riskService } from './services/riskService';
import { notificationService } from './services/notificationService';

// Components
import { Sidebar } from './components/Sidebar';
import { DemoScenarioRunner } from './components/DemoScenarioRunner';
import { VerificationQueueView } from './components/VerificationQueueView';
import { DashboardView } from './components/DashboardView';
import { TreePassportView } from './components/TreePassportView';
import { InteractiveMap } from './components/InteractiveMap';
import { RiskCenterView } from './components/RiskCenterView';
import { FailureInsightsView } from './components/FailureInsightsView';
import { CustodianMobileView } from './components/CustodianMobileView';
import { ImpactReportView } from './components/ImpactReportView';

// Modals
import { CustodyHandoffModal } from './components/CustodyHandoffModal';
import { PeerVerificationModal } from './components/PeerVerificationModal';
import { FailureAutopsyModal } from './components/FailureAutopsyModal';
import { RegisterTreeModal } from './components/RegisterTreeModal';
import { Search, Bell, Menu, User, ShieldCheck } from 'lucide-react';

export default function App() {
  // API-driven state with mock data fallback
  const [trees, setTrees] = useState<Tree[]>(sampleTrees);
  const [reliability, setReliability] = useState<OrganizationReliability>(initialReliability);
  const [riskItems, setRiskItems] = useState<RiskItem[]>(mockRiskQueue);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('custodian-view');
  const [activeRole, setActiveRole] = useState<ActiveRole>('CUSTODIAN');
  const [selectedTreeId, setSelectedTreeId] = useState<string>('TG-IND-001');
  const [demoStep, setDemoStep] = useState<number>(0);

  // Modals state
  const [handoffModalTree, setHandoffModalTree] = useState<Tree | null>(null);
  const [verificationModalTree, setVerificationModalTree] = useState<Tree | null>(null);
  const [autopsyModalTree, setAutopsyModalTree] = useState<Tree | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const selectedTree = trees.find(t => t.id === selectedTreeId) || trees[0];

  const showToast = (message: string) => {
    setNotificationToast(message);
    setTimeout(() => {
      setNotificationToast(null);
    }, 3500);
  };

  // Try loading data from API, fall back to mock data
  const loadFromApi = useCallback(async () => {
    try {
      // Try dashboard metrics
      const dashboardData = await dashboardApi.getMetrics();
      setReliability({
        projectName: dashboardData.projectName || "TreeGuard Campus Pilot",
        totalPlanted: dashboardData.totalPlanted,
        verifiedAlive: dashboardData.verifiedAlive,
        atRiskCount: dashboardData.atRiskCount,
        failedCount: dashboardData.failedCount,
        orphanedCount: dashboardData.orphanedCount,
        claimedSurvivalRate: dashboardData.claimedSurvivalRate,
        verifiedSurvivalRate: dashboardData.verifiedSurvivalRate,
        verificationGap: dashboardData.verificationGap,
        custodyContinuityRate: dashboardData.custodyContinuityRate,
        checkpointComplianceRate: dashboardData.checkpointComplianceRate,
        riskRecoveryRate: dashboardData.riskRecoveryRate,
        topFailureCause: dashboardData.topFailureCause,
        dominantFailureZone: dashboardData.dominantFailureZone,
      });
      setApiConnected(true);
    } catch {
      // API not available, keep mock data
      console.log("ℹ API not connected — using demo data. Start the API server for live data.");
    }

    try {
      if (isSupabaseConfigured()) {
        const supabaseTrees = await treeService.getTrees();
        if (supabaseTrees.length > 0) {
          setTrees(supabaseTrees);
        }
      }
    } catch {
      console.log("Supabase tree fetch failed, using mock trees.");
    }

    try {
      if (isSupabaseConfigured()) {
        const risksData = await riskService.getRisks();
        if (risksData && risksData.length > 0) {
          setRiskItems(risksData.map((r: any) => ({
            id: `RISK-${r.id}`,
            treeId: r.trees?.tree_code || `Tree-${r.tree_id}`,
            treeSpecies: r.trees?.species || "Unknown",
            zone: "Campus",
            landmark: "",
            status: r.risk_type === "no_custodian" ? "orphaned" : "at-risk" as any,
            severity: r.severity,
            title: r.reason?.split(".")[0] || "Risk Event",
            reason: r.reason,
            daysOverdue: 0,
            custodianName: r.profiles?.name || "Unassigned",
            actionRequired: "Review required",
            suggestedActionType: r.risk_type === "no_custodian" ? "REASSIGN" : "VERIFY" as any,
          })));
        }
      }
    } catch { /* keep mock */ }

    try {
      if (isSupabaseConfigured()) {
        const notifData = await notificationService.getNotifications();
        if (notifData && notifData.length > 0) {
          setNotifications(notifData);
        }
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    loadFromApi();
  }, [loadFromApi]);

  // Demo Runner Script Handler
  const handleDemoStepChange = async (stepIndex: number) => {
    setDemoStep(stepIndex);
    switch (stepIndex) {
      case 0:
        setActiveTab('dashboard');
        setActiveRole('ADMIN');
        showToast("Step 1: 500 trees planted. Dashboard shows healthy system. Notice the verification gap.");
        break;
      case 1:
        setSelectedTreeId('TG-IND-001');
        setActiveTab('passport');
        setActiveRole('CUSTODIAN');
        showToast("Step 2: Student custodian Arun Kumar graduating. Tree TG-IND-001 custody expires in 14 days.");
        break;
      case 2:
        setSelectedTreeId('TG-IND-001');
        setActiveTab('passport');
        setHandoffModalTree(pilotTree);
        showToast("Step 3: TreeGuard detects risk. Successor matching engine finds nearby candidates.");
        break;
      case 3:
        setSelectedTreeId('TG-IND-001');
        setActiveTab('passport');
        setActiveRole('PEER_VERIFIER');
        setVerificationModalTree(pilotTree);
        showToast("Step 4: Priya accepts responsibility. Custody chain transfers successfully.");
        break;
      case 4:
        setSelectedTreeId('TN-COL-00042');
        setActiveTab('autopsy');
        setActiveRole('ADMIN');
        showToast("Step 5: Three months later — checkpoint submitted. Gemini verifies health.");
        break;
      case 5:
        setActiveTab('impact-report');
        setActiveRole('ADMIN');
        showToast("Step 6: Dashboard shows: 'Custody Gap Prevented.' NO TREE LEFT BEHIND. 🌳");
        break;
      default:
        break;
    }

    // Try API time travel for demo
    if (apiConnected) {
      try {
        const actions = ["today", "today", "today", "today", "today", "today"];
        await demoApi.timeTravel(actions[stepIndex] || "today");
        await loadFromApi();
      } catch { /* ignore */ }
    }
  };

  // Role Selection Handler
  const handleSelectRole = (role: ActiveRole) => {
    setActiveRole(role);
    if (role === 'ADMIN') {
      setActiveTab('dashboard');
    } else if (role === 'CUSTODIAN') {
      setActiveTab('custodian-view');
    } else if (role === 'PEER_VERIFIER') {
      setActiveTab('verification-queue');
    }
  };

  // Custody Handoff Success Handler
  const handleHandoffSuccess = (treeId: string, newCustodianName: string, newUnit: string) => {
    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        const updatedHistory = t.custodyHistory.map(c => ({ ...c, active: false }));
        updatedHistory.push({
          id: `CUST-${Date.now().toString().slice(-4)}`,
          custodianName: newCustodianName,
          custodianRole: "Lead Custodian",
          custodianEmail: `${newCustodianName.toLowerCase().replace(' ', '.')}@campus.edu`,
          organizationUnit: newUnit,
          assignedDate: new Date().toISOString().slice(0, 10),
          checkpointsCompleted: 0,
          checkpointsTotal: 4,
          handoffReason: undefined,
          pledgeSigned: true,
          certificateId: `CERT-TG-${Date.now().toString().slice(-8)}`,
          active: true,
        });

        return {
          ...t,
          currentCustodian: newCustodianName,
          currentCustodianUnit: newUnit,
          activeAlert: undefined,
          custodyHistory: updatedHistory,
        };
      }
      return t;
    }));

    setRiskItems(prev => prev.filter(r => r.treeId !== treeId));
    showToast(`🌱 Responsibility for Tree ${treeId} successfully transferred to ${newCustodianName}! Custody gap prevented.`);
    if (apiConnected) loadFromApi();
  };

  // Verification Submission Handler
  const handleVerificationSubmitted = (
    treeId: string, 
    status: 'healthy' | 'at-risk' | 'failed' | 'mismatch',
    consistency: EvidenceConsistency,
    verifierNotes: string
  ) => {
    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        return {
          ...t,
          status,
          healthScore: status === 'healthy' ? 95 : status === 'at-risk' ? 52 : 0,
        };
      }
      return t;
    }));

    showToast(`✅ AI-assisted verification recorded for Tree ${treeId}. Status: ${status.toUpperCase()}. Human accountability confirmed.`);
  };

  // Autopsy Saved Handler
  const handleAutopsySaved = (treeId: string, autopsy: FailureAutopsy) => {
    setTrees(prev => prev.map(t => {
      if (t.id === treeId) {
        return {
          ...t,
          status: 'failed',
          healthScore: 0,
          failureAutopsy: autopsy,
        };
      }
      return t;
    }));

    showToast(`📋 Failure autopsy saved for Tree ${treeId}. Learning from this failure to prevent future losses.`);
  };

  // Register New Tree Handler
  const handleTreeRegistered = (newTree: Tree) => {
    setTrees(prev => [newTree, ...prev]);
    setReliability(prev => ({
      ...prev,
      totalPlanted: prev.totalPlanted + 1,
      verifiedAlive: prev.verifiedAlive + 1,
    }));
    setSelectedTreeId(newTree.id);
    setActiveTab('passport');
    showToast(`🌱 Tree Passport created for ${newTree.id} (${newTree.speciesName})! Every tree has a caretaker.`);
    if (apiConnected) loadFromApi();
  };

  return (
    <div className="h-screen nature-bg text-slate-900 flex flex-row antialiased overflow-hidden">
      {/* Top Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#052E1F] text-white px-5 py-2.5 rounded-2xl shadow-xl border border-[#34D399]/40 text-xs font-semibold flex items-center gap-2 animate-rise max-w-xl">
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Main Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        activeRole={activeRole}
        onSelectRole={handleSelectRole}
        onOpenRegisterTree={() => setIsRegisterModalOpen(true)}
        riskCount={riskItems.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 min-w-0 overflow-y-auto relative flex flex-col">
        {/* API Connection Status */}
        {!apiConnected && (
          <div className="bg-amber-50/90 border-b border-amber-200 text-amber-900 text-xs text-center py-1.5 px-4 font-medium sticky top-0 z-30 backdrop-blur-sm">
            📡 Running with demo data — Start the API server ({`pnpm run dev:api`}) and database for live data
          </div>
        )}

        {/* Universal Top Navigation Header (from reference screenshot) */}
        <header className="px-6 py-3.5 flex items-center justify-between gap-4 border-b border-emerald-900/5 bg-white/70 backdrop-blur-md sticky top-0 z-20 shadow-xs">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search trees, ID, locations..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2 rounded-xl text-xs font-medium border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-2xs transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button 
              onClick={() => setActiveTab('risk-center')}
              className="relative p-2 rounded-xl bg-white border border-slate-200/90 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors shadow-2xs"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white">
                4
              </span>
            </button>

            {/* User Profile Chip */}
            <div 
              onClick={() => {
                if (activeRole === 'CUSTODIAN') {
                  handleSelectRole('ADMIN');
                } else if (activeRole === 'ADMIN') {
                  handleSelectRole('PEER_VERIFIER');
                } else {
                  handleSelectRole('CUSTODIAN');
                }
              }}
              className="flex items-center gap-2.5 bg-white pl-1.5 pr-3 py-1 rounded-full border border-slate-200/90 shadow-2xs cursor-pointer hover:border-emerald-300 transition-colors"
              title="Click to cycle role simulation"
            >
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                alt="Arun K." 
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/30"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {activeRole === 'ADMIN' ? 'State Admin' : activeRole === 'PEER_VERIFIER' ? 'Suresh R.' : 'Arun K.'}
                </p>
                <p className="text-[10px] text-emerald-700 font-medium leading-none mt-0.5">
                  {activeRole === 'ADMIN' ? 'Org Admin' : activeRole === 'PEER_VERIFIER' ? 'Peer Verifier' : 'Custodian'}
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 flex-1 w-full">
          {/* 3-Minute Hackathon Demo Script Bar */}
          <DemoScenarioRunner
            currentStep={demoStep}
            onStepChange={handleDemoStepChange}
          />

        {/* Tab 1: Executive Organization Dashboard */}
        {activeTab === 'dashboard' && (
          <DashboardView
            reliability={reliability}
            riskItems={riskItems}
            trees={trees}
            onOpenTree={(id) => {
              setSelectedTreeId(id);
              setActiveTab('passport');
            }}
            onOpenHandoff={(tree) => setHandoffModalTree(tree)}
            onOpenRiskCenter={() => setActiveTab('risk-center')}
            onOpenAutopsy={() => setActiveTab('autopsy')}
          />
        )}

        {/* Tab 2: Living Tree Passport with 3D Twin & Checkpoint Timeline */}
        {activeTab === 'passport' && (
          <TreePassportView
            tree={selectedTree}
            onOpenHandoff={(tree) => setHandoffModalTree(tree)}
            onOpenVerification={(tree) => setVerificationModalTree(tree)}
            onOpenAutopsy={(tree) => setAutopsyModalTree(tree)}
          />
        )}

        {/* Tab 3: Interactive Campus Tracking Map & Ground Locator */}
        {activeTab === 'map' && (
          <InteractiveMap
            trees={trees}
            selectedTreeId={selectedTreeId}
            onSelectTree={(tree) => setSelectedTreeId(tree.id)}
            onOpenPassport={(treeId) => {
              setSelectedTreeId(treeId);
              setActiveTab('passport');
            }}
            onOpenVerification={(tree) => setVerificationModalTree(tree)}
          />
        )}

        {/* Tab 4: Survival Risk Center & Escalation Queue */}
        {activeTab === 'risk-center' && (
          <RiskCenterView
            riskItems={riskItems}
            trees={trees}
            onOpenTree={(id) => {
              setSelectedTreeId(id);
              setActiveTab('passport');
            }}
            onOpenHandoff={(tree) => setHandoffModalTree(tree)}
            onOpenVerification={(tree) => setVerificationModalTree(tree)}
            onOpenAutopsy={(tree) => setAutopsyModalTree(tree)}
          />
        )}

        {/* Tab 5: Failure Insights & Mortality Intelligence */}
        {activeTab === 'autopsy' && (
          <FailureInsightsView
            trees={trees}
            onOpenTree={(id) => {
              setSelectedTreeId(id);
              setActiveTab('passport');
            }}
            onOpenAutopsyModal={(tree) => setAutopsyModalTree(tree)}
          />
        )}

        {/* Tab 6: Custodian Mobile View ("My Trees") */}
        {activeTab === 'custodian-view' && (
          <CustodianMobileView
            trees={trees}
            onOpenTree={(id) => {
              setSelectedTreeId(id);
              setActiveTab('passport');
            }}
            onOpenHandoff={(tree) => setHandoffModalTree(tree)}
            onOpenVerification={(tree) => setVerificationModalTree(tree)}
            onOpenRegisterTree={() => setIsRegisterModalOpen(true)}
            simulatedCustodian="Arun K."
          />
        )}

        {/* Tab 8: Peer Verifier Queue */}
        {activeTab === 'verification-queue' && (
          <VerificationQueueView
            trees={trees}
            onOpenTree={(id) => {
              setSelectedTreeId(id);
              setActiveTab('passport');
            }}
            onOpenVerification={(tree) => setVerificationModalTree(tree)}
          />
        )}

        {/* Tab 7: Official Audit Export & Impact Dossier */}
        {activeTab === 'impact-report' && (
          <ImpactReportView
            reliability={reliability}
            trees={trees}
          />
        )}

        {/* Footer with TN Government Branding */}
        <footer className="mt-16 py-8 border-t-2 text-xs text-slate-400 text-center space-y-3" style={{ borderImage: 'linear-gradient(90deg, transparent, #059669, #10B981, #059669, transparent) 1' }}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src="/tn-gov-logo.svg" alt="Tamil Nadu Government" className="w-8 h-8 opacity-60" />
            <div>
              <p className="font-bold text-emerald-800 text-sm tracking-wide">VANAM KURI • வனம் குறி</p>
              <p className="text-[10px] text-slate-500 font-medium">Government of Tamil Nadu • தமிழ்நாடு அரசு</p>
            </div>
          </div>
          <p className="font-semibold text-emerald-700/70">
            Every tree has a caretaker. Every caretaker has a successor.
          </p>
          <p className="text-slate-400">
            No tree left behind. • AI-assisted verification. Human accountability.
          </p>
          <p className="text-[10px] text-slate-300 mt-2">
            © {new Date().getFullYear()} Department of Environment & Climate Change, Government of Tamil Nadu
          </p>
        </footer>
      </div>
    </main>

    {/* MODALS */}
    {handoffModalTree && (
      <CustodyHandoffModal
        tree={handoffModalTree}
        isOpen={!!handoffModalTree}
        onClose={() => setHandoffModalTree(null)}
        onHandoffSuccess={handleHandoffSuccess}
      />
    )}

    {verificationModalTree && (
      <PeerVerificationModal
        tree={verificationModalTree}
        isOpen={!!verificationModalTree}
        onClose={() => setVerificationModalTree(null)}
        onVerificationSubmitted={handleVerificationSubmitted}
      />
    )}

    {autopsyModalTree && (
      <FailureAutopsyModal
        tree={autopsyModalTree}
        isOpen={!!autopsyModalTree}
        onClose={() => setAutopsyModalTree(null)}
        onAutopsySaved={handleAutopsySaved}
      />
    )}

    {isRegisterModalOpen && (
      <RegisterTreeModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onTreeRegistered={handleTreeRegistered}
        existingCount={trees.length}
      />
    )}
  </div>
  );
}