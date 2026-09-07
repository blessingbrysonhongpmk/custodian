import React, { useState, useEffect } from 'react';
import { Tree, EvidenceConsistency, FailureAutopsy } from './types/custodia';

// Auth, Language & Data State
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ProgramHealthProvider } from './context/ProgramHealthContext';
import { DemoDataProvider, useDemoData } from './context/DemoDataContext';

// Pages & Screens
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';

// Three Role-Specific Portals
import { AdminPortal } from './components/AdminPortal';
import { CustodianPortal } from './components/CustodianPortal';
import { VerifierPortal } from './components/VerifierPortal';

// Shared Components & Modals
import { CustodianDiscoverModal } from './components/CustodianDiscoverModal';
import { TreePassportView } from './components/TreePassportView';
import { RegisterTreeModal } from './components/RegisterTreeModal';
import { CustodyHandoffModal } from './components/CustodyHandoffModal';
import { PeerVerificationModal } from './components/PeerVerificationModal';
import { FailureAutopsyModal } from './components/FailureAutopsyModal';
import { TamilNaduSeal } from './components/TamilNaduSeal';

import { Search, Globe, LogOut, ArrowLeft, User, Shield, CheckCircle2 } from 'lucide-react';

type AppView = 'landing' | 'auth' | 'app';

function AppRouter() {
  const { user, signOut } = useAuth();
  const [view, setView] = useState<AppView>(() => {
    if (user) return 'app';
    return 'landing';
  });

  useEffect(() => {
    if (user) {
      setView('app');
    }
  }, [user]);

  if (view === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setView('auth')}
        onViewDemo={() => setView('auth')}
      />
    );
  }

  if (view === 'auth') {
    if (user) {
      setView('app');
      return null;
    }
    return (
      <AuthScreen 
        onBack={() => setView('landing')} 
        onSuccess={() => {
          setView('app');
        }}
      />
    );
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
  const { user } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  
  // Unified single source of truth across all 3 roles
  const {
    trees,
    currentUser,
    reliability,
    riskItems,
    registerTree,
    editTree,
    assignCustodian,
    verifyCheckpoint,
  } = useDemoData();

  // Active passport viewing state
  const [viewingPassportTreeId, setViewingPassportTreeId] = useState<string | null>(null);
  
  // Universal Search Modal
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Modals state
  const [handoffModalTree, setHandoffModalTree] = useState<Tree | null>(null);
  const [verificationModalTree, setVerificationModalTree] = useState<Tree | null>(null);
  const [autopsyModalTree, setAutopsyModalTree] = useState<Tree | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Keyboard shortcut for Universal Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Tree Registration
  const handleTreeRegistered = (newTreeData: Tree) => {
    setIsRegisterModalOpen(false);
    showToast(`✅ Registered ${newTreeData.id} (${newTreeData.speciesName}) in shared database!`);
  };

  // Handle Handoff Success
  const handleHandoffSuccess = async (treeId: string, newCustodianName: string, newUnit: string) => {
    await assignCustodian(treeId, newCustodianName, newUnit);
    setHandoffModalTree(null);
    showToast(`🎉 Custody of Tree ${treeId} successfully transferred to ${newCustodianName}.`);
  };

  // Handle Verification Submission
  const handleVerificationSubmitted = async (
    treeId: string,
    status: 'healthy' | 'at-risk' | 'failed' | 'mismatch',
    _consistency: EvidenceConsistency,
    verifierNotes: string
  ) => {
    const decision = status === 'healthy' ? 'APPROVE' : status === 'mismatch' ? 'FLAG' : 'RECHECK';
    const res = await verifyCheckpoint(treeId, '6-month', decision, verifierNotes);
    if (!res.success) {
      showToast(`❌ ${res.error}`);
    } else {
      showToast(`✅ Verification recorded for Tree ${treeId}. Status: ${status.toUpperCase()}`);
    }
    setVerificationModalTree(null);
  };

  // Handle Autopsy Saved
  const handleAutopsySaved = async (treeId: string, autopsy: FailureAutopsy) => {
    await editTree(treeId, {
      status: 'failed',
      healthScore: 0,
      failureAutopsy: autopsy,
    });
    setAutopsyModalTree(null);
    showToast(`Saved failure autopsy record for Tree ${treeId}.`);
  };

  // Find currently inspected passport tree
  const activePassportTree = trees.find(t => t.id === viewingPassportTreeId) || trees[0];

  // User role styling
  const roleBadgeStyle = user?.role === 'admin'
    ? 'bg-purple-50 text-purple-900 border-purple-200'
    : user?.role === 'verifier'
    ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
    : 'bg-emerald-50 text-emerald-900 border-emerald-200';

  const roleLabel = user?.role === 'admin'
    ? (language === 'ta' ? 'மாநில நிர்வாகி' : 'ADMINISTRATOR')
    : user?.role === 'verifier'
    ? (language === 'ta' ? 'கள தணிக்கையாளர்' : 'PEER VERIFIER')
    : (language === 'ta' ? 'மரப் பாதுகாவலர்' : 'CUSTODIAN');

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 flex flex-col font-sans antialiased selection:bg-[#006A4E] selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-rise max-w-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP UNIVERSAL HEADER */}
      <header className="px-4 sm:px-8 py-3 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-30 shadow-2xs">
        {/* Left: State Seal & Brand Title */}
        <div className="flex items-center gap-3">
          <TamilNaduSeal size={36} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-tight">
                PASUMAI KAVAL
              </h1>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${roleBadgeStyle}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                <span>{roleLabel}</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5 hidden sm:block">
              {language === 'ta' ? 'மரப் பாதுகாப்பு மற்றும் தொடர் கண்காணிப்பு தளம்' : 'Department of Environment, Climate Change & Forests • Govt. of Tamil Nadu'}
            </p>
          </div>
        </div>

        {/* Center: Universal Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div 
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-400 cursor-pointer transition-all shadow-2xs group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2.5 group-hover:text-emerald-700 transition-colors" />
            <span className="truncate">Search custodians, tree IDs (TG-IND-001), locations...</span>
            <kbd className="ml-auto text-[10px] font-mono bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right: Authenticated User, Language Toggle & Logout */}
        <div className="flex items-center gap-2.5">
          {/* User Profile Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="w-6 h-6 rounded-lg bg-slate-800 text-white flex items-center justify-center font-bold text-[11px]">
              {user?.name.charAt(0)}
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-900 block leading-tight truncate max-w-[120px]">
                {user?.name}
              </span>
              <span className="text-[10px] text-slate-500 block leading-tight truncate max-w-[120px]">
                {user?.organization || 'Tamil Nadu'}
              </span>
            </div>
          </div>

          {/* Bilingual Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title={language === 'ta' ? 'Switch to English' : 'தமிழுக்கு மாறவும்'}
          >
            <Globe className="w-3.5 h-3.5 text-[#006A4E]" />
            <span className="hidden sm:inline">{language === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
            title="Sign Out / வெளியேறு"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 sm:px-8">
        {/* If viewing a specific Tree Passport, render Passport overlay with Back Button */}
        {viewingPassportTreeId ? (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between bg-white p-3.5 px-5 rounded-2xl border border-slate-200 shadow-2xs">
              <button
                onClick={() => setViewingPassportTreeId(null)}
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-800 transition-colors p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Workspace</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-500">Tree Passport Mode</span>
                <span className="tn-tree-code text-xs font-mono font-bold px-2 py-0.5 rounded">
                  {activePassportTree.id}
                </span>
              </div>
            </div>

            <TreePassportView
              tree={activePassportTree}
              onOpenHandoff={(tree) => setHandoffModalTree(tree)}
              onOpenVerification={(tree) => setVerificationModalTree(tree)}
              onOpenAutopsy={(tree) => setAutopsyModalTree(tree)}
            />
          </div>
        ) : (
          /* Role-Based Primary Portals over the Single Shared Database */
          <>
            {user?.role === 'admin' && (
              <AdminPortal
                onOpenTree={(id) => setViewingPassportTreeId(id)}
                onOpenRegisterTree={() => setIsRegisterModalOpen(true)}
                onOpenHandoff={(tree) => setHandoffModalTree(tree)}
                onOpenVerification={(tree) => setVerificationModalTree(tree)}
                onOpenAutopsy={(tree) => setAutopsyModalTree(tree)}
              />
            )}

            {user?.role === 'custodian' && (
              <CustodianPortal
                onOpenTree={(id) => setViewingPassportTreeId(id)}
                onOpenRegisterTree={() => setIsRegisterModalOpen(true)}
              />
            )}

            {user?.role === 'verifier' && (
              <VerifierPortal
                onOpenTree={(id) => setViewingPassportTreeId(id)}
              />
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className="py-6 border-t border-slate-200/80 text-center text-xs text-slate-500 bg-white/50">
        <p className="font-semibold text-slate-700">
          Pasumai Kaval • Department of Environment, Climate Change & Forests • Government of Tamil Nadu
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          One Single Database • Admin Governance • Custodian Responsibility • Peer Verification
        </p>
      </footer>

      {/* UNIVERSAL SEARCH & DISCOVER MODAL */}
      {isSearchModalOpen && (
        <CustodianDiscoverModal
          onOpenTree={(id) => {
            setIsSearchModalOpen(false);
            setViewingPassportTreeId(id);
          }}
          onClose={() => setIsSearchModalOpen(false)}
          isModal={true}
        />
      )}

      {/* REGISTER TREE MODAL */}
      {isRegisterModalOpen && (
        <RegisterTreeModal
          isOpen={isRegisterModalOpen}
          onClose={() => setIsRegisterModalOpen(false)}
          onTreeRegistered={handleTreeRegistered}
          existingCount={trees.length}
        />
      )}

      {/* CUSTODY HANDOFF MODAL */}
      {handoffModalTree && (
        <CustodyHandoffModal
          tree={handoffModalTree}
          isOpen={!!handoffModalTree}
          onClose={() => setHandoffModalTree(null)}
          onHandoffSuccess={handleHandoffSuccess}
        />
      )}

      {/* PEER VERIFICATION MODAL */}
      {verificationModalTree && (
        <PeerVerificationModal
          tree={verificationModalTree}
          isOpen={!!verificationModalTree}
          onClose={() => setVerificationModalTree(null)}
          onVerificationSubmitted={handleVerificationSubmitted}
        />
      )}

      {/* FAILURE AUTOPSY MODAL */}
      {autopsyModalTree && (
        <FailureAutopsyModal
          tree={autopsyModalTree}
          isOpen={!!autopsyModalTree}
          onClose={() => setAutopsyModalTree(null)}
          onAutopsySaved={handleAutopsySaved}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DemoDataProvider>
        <LanguageProvider>
          <ProgramHealthProvider>
            <AppRouter />
          </ProgramHealthProvider>
        </LanguageProvider>
      </DemoDataProvider>
    </AuthProvider>
  );
}