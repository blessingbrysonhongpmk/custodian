import React, { useState } from 'react';
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

// Components
import { Navbar } from './components/Navbar';
import { DemoScenarioRunner } from './components/DemoScenarioRunner';
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

export default function App() {
  const [trees, setTrees] = useState<Tree[]>(sampleTrees);
  const [reliability, setReliability] = useState<OrganizationReliability>(initialReliability);
  const [riskItems, setRiskItems] = useState<RiskItem[]>(mockRiskQueue);
  
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [activeRole, setActiveRole] = useState<ActiveRole>('ADMIN');
  const [selectedTreeId, setSelectedTreeId] = useState<string>('TN-COL-00125');
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

  // Demo Runner Script Handler
  const handleDemoStepChange = (stepIndex: number) => {
    setDemoStep(stepIndex);
    switch (stepIndex) {
      case 0: // Step 1: 500 trees overview & verification gap
        setActiveTab('dashboard');
        setActiveRole('ADMIN');
        showToast("Step 1: Notice the 25.4% Verification Gap (89% Claimed vs 63.6% Verified Alive).");
        break;
      case 1: // Step 2: Open Pilot Tree TN-COL-00125
        setSelectedTreeId('TN-COL-00125');
        setActiveTab('passport');
        setActiveRole('CUSTODIAN');
        showToast("Step 2: Inspecting Pilot Tree TN-COL-00125 (Arun K. - Graduating in 14 days).");
        break;
      case 2: // Step 3: Custody handoff Arun -> Priya
        setSelectedTreeId('TN-COL-00125');
        setActiveTab('passport');
        setHandoffModalTree(pilotTree);
        showToast("Step 3: Initiating mandatory Custody Handoff Ceremony (Arun → Priya).");
        break;
      case 3: // Step 4: Peer Verification with Divya
        setSelectedTreeId('TN-COL-00125');
        setActiveTab('passport');
        setActiveRole('PEER_VERIFIER');
        setVerificationModalTree(pilotTree);
        showToast("Step 4: Independent Peer Audit with AI-assisted anomaly detection.");
        break;
      case 4: // Step 5: Failure Autopsy
        setSelectedTreeId('TN-COL-00042');
        setActiveTab('autopsy');
        setActiveRole('ADMIN');
        showToast("Step 5: Inspecting Failure Autopsy in Zone B (Water shortage root-cause).");
        break;
      case 5: // Step 6: Final Impact Report
        setActiveTab('impact-report');
        setActiveRole('ADMIN');
        showToast("Step 6: Executive TN Green Mission Audit Dossier & Closing Impact Statement.");
        break;
      default:
        break;
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
          certificateId: `CERT-TN-2025-${treeId}-B`,
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

    // Remove from risk queue
    setRiskItems(prev => prev.filter(r => r.treeId !== treeId));
    showToast(`Responsibility for Tree ${treeId} successfully transferred to ${newCustodianName}!`);
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

    showToast(`Peer verification recorded for Tree ${treeId}. Status confirmed as: ${status.toUpperCase()}`);
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

    showToast(`Failure autopsy saved for Tree ${treeId}. Mortality intelligence updated.`);
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
    showToast(`Tree Passport created for ${newTree.id} (${newTree.speciesName})!`);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 flex flex-col leaf-grid-bg antialiased">
      {/* Top Floating Notification Toast */}
      {notificationToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl border border-emerald-400 text-xs font-semibold flex items-center gap-2 animate-rise">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        activeRole={activeRole}
        onSelectRole={(role) => setActiveRole(role)}
        onOpenRegisterTree={() => setIsRegisterModalOpen(true)}
        riskCount={riskItems.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
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
          />
        )}

        {/* Tab 7: Official Audit Export & Impact Dossier */}
        {activeTab === 'impact-report' && (
          <ImpactReportView
            reliability={reliability}
            trees={trees}
          />
        )}
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

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200/80 bg-white text-xs text-slate-500 text-center space-y-1">
        <p className="font-semibold text-slate-800">
          CUSTODIA • Tree Survival, Responsibility & Verification OS
        </p>
        <p>
          Green Tamil Nadu Mission Campus Initiative • Loyola Pilot Phase 2024–2027
        </p>
      </footer>
    </div>
  );
}