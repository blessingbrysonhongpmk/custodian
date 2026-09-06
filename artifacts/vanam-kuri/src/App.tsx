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
import { isFirebaseConfigured } from './lib/firebase';
import { treeService } from './services/treeService';
import { riskService } from './services/riskService';
import { notificationService } from './services/notificationService';

// Auth & Language
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ProgramHealthProvider } from './context/ProgramHealthContext';

// Pages
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';

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

import { Search, Bell, Globe, LogOut } from 'lucide-react';

type AppView = 'landing' | 'auth' | 'app';

function AppRouter() {
  const { user, isDemo, signOut, enterDemoMode } = useAuth();
  const [view, setView] = useState<AppView>(() => {
    // If user is already authenticated or in demo, go straight to app
    if (user) return 'app';
    return 'landing';
  });

  useEffect(() => {
    if (user) setView('app');
  }, [user]);

  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('auth')}
        onViewDemo={() => {
          enterDemoMode('admin');
          setView('app');
        }}
      />
    );
  }

  if (view === 'auth') {
    if (user) {
      setView('app');
      return null;
    }
    return <AuthScreen onBack={() => setView('landing')} />;
  }

  if (!user) {
    setView('landing');
    return null;
  }

  return (
    <MainContent
      onSignOut={async () => {
        await signOut();
        setView('landing');
      }}
    />
  );
}

interface MainContentProps {
  onSignOut: () => void;
}

function MainContent({ onSignOut }: MainContentProps) {
  const { user, isDemo, activeRole, setActiveRole } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  // API-driven state with mock data fallback
  const [trees, setTrees] = useState<Tree[]>(sampleTrees);
  const [reliability, setReliability] = useState<OrganizationReliability>(initialReliability);
  const [riskItems, setRiskItems] = useState<RiskItem[]>(mockRiskQueue);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [globalSearch, setGlobalSearch] = useState<string>('');
  
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (activeRole === 'ADMIN') return 'dashboard';
    if (activeRole === 'CUSTODIAN') return 'custodian-view';
    if (activeRole === 'PEER_VERIFIER') return 'verification-queue';
    return 'dashboard';
  });
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
      const dashboardData = await dashboardApi.getMetrics();
      setReliability({
        projectName: dashboardData.projectName || "Green Campus Initiative 2024–2027",
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
      console.log("ℹ API not connected — using demo data.");
    }

    try {
      if (isFirebaseConfigured()) {
        const supabaseTrees = await treeService.getTrees();
        if (supabaseTrees.length > 0) {
          setTrees(supabaseTrees);
        }
      }
    } catch {
      // Keep mock trees
    }

    try {
      if (isFirebaseConfigured()) {
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
      if (isFirebaseConfigured()) {
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
        showToast("Step 1: 500 trees in program. Dashboard shows custody overview.");
        break;
      case 1:
        setSelectedTreeId('TG-IND-001');
        setActiveTab('passport');
        setActiveRole('CUSTODIAN');
        showToast("Step 2: Custodian Arun Kumar graduating. Tree TG-IND-001 custody expires in 14 days.");
        break;
      case 2:
        setSelectedTreeId('TG-IND-001');
        setActiveTab('passport');
        setHandoffModalTree(pilotTree);
        showToast("Step 3: Custody risk detected. Successor recommendation engine finds candidates.");
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
        showToast("Step 5: Checkpoint submitted. Photo-assisted health review completed.");
        break;
      case 5:
        setActiveTab('impact-report');
        setActiveRole('ADMIN');
        showToast("Step 6: Dashboard updated. Custody gap prevented. No tree left behind.");
        break;
      default:
        break;
    }

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
    showToast(`Custody for Tree ${treeId} successfully transferred to ${newCustodianName}.`);
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

    showToast(`Verification recorded for Tree ${treeId}. Status: ${status.toUpperCase()}.`);
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

    showToast(`Failure record saved for Tree ${treeId}.`);
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
    showToast(`Tree Passport created for ${newTree.id} (${newTree.speciesName}).`);
    if (apiConnected) loadFromApi();
  };

  // Get display name
  const displayName = user?.displayName || 'User';
  const roleLabel = activeRole === 'ADMIN' ? 'Program Admin' : activeRole === 'PEER_VERIFIER' ? 'Field Verifier' : 'Custodian';

  return (
    <div className="h-screen nature-bg text-slate-900 flex flex-row antialiased overflow-hidden">
      {/* Top Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-medium flex items-center gap-2 animate-rise max-w-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
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
          <div className="bg-amber-50/90 border-b border-amber-200 text-amber-800 text-xs text-center py-1.5 px-4 font-medium sticky top-0 z-30 backdrop-blur-sm">
            Running with demo data — Start the API server for live data
          </div>
        )}

        {/* Top Navigation Header */}
        <header className="px-6 py-3.5 flex items-center justify-between gap-4 border-b border-slate-200/60 bg-white/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search trees, custodians, locations..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-white pl-10 pr-4 py-2 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Tamil / English Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer"
              title={language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Notification Bell */}
            <button 
              onClick={() => setActiveTab('risk-center')}
              className="relative p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                {riskItems.length > 9 ? '9+' : riskItems.length}
              </span>
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 bg-white pl-1.5 pr-3 py-1 rounded-full border border-slate-200 cursor-default">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-700">
                {displayName.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
                  {roleLabel} {isDemo && '(Demo)'}
                </p>
              </div>
            </div>

            {/* Sign Out */}
            <button
              onClick={onSignOut}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 flex-1 w-full">
          {/* Demo Script Bar */}
          <DemoScenarioRunner
            currentStep={demoStep}
            onStepChange={handleDemoStepChange}
          />

        {/* Tab: Executive Dashboard */}
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

        {/* Tab: Tree Passport */}
        {activeTab === 'passport' && (
          <TreePassportView
            tree={selectedTree}
            onOpenHandoff={(tree) => setHandoffModalTree(tree)}
            onOpenVerification={(tree) => setVerificationModalTree(tree)}
            onOpenAutopsy={(tree) => setAutopsyModalTree(tree)}
          />
        )}

        {/* Tab: Interactive Map */}
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

        {/* Tab: Risk Center */}
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

        {/* Tab: Failure Insights */}
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

        {/* Tab: Custodian View */}
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
            simulatedCustodian={user?.displayName || "Arun K."}
          />
        )}

        {/* Tab: Verifier Queue */}
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

        {/* Tab: Impact Report */}
        {activeTab === 'impact-report' && (
          <ImpactReportView
            reliability={reliability}
            trees={trees}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-slate-200/40 text-xs text-slate-400 text-center space-y-2">
          <p className="font-semibold text-slate-500">
            TreeGuard — Tree Custody Platform
          </p>
          <p>
            Every tree has a caretaker. Every caretaker has a successor.
          </p>
          <p className="text-[10px] text-slate-300 mt-2">
            Designed for integration with Tamil Nadu environmental programs · © {new Date().getFullYear()}
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

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ProgramHealthProvider>
          <AppRouter />
        </ProgramHealthProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}