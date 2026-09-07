import React, { useState, useMemo } from 'react';
import { useDemoData } from '../context/DemoDataContext';
import { Tree, CheckpointEvidence } from '../types/custodia';
import { useLanguage } from '../context/LanguageContext';
import { InteractiveMap } from './InteractiveMap';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  Camera,
  Eye,
  FileCheck2,
  FileText,
  User,
  ArrowRight,
  Sparkles,
  Info,
  Check,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface VerifierPortalProps {
  onOpenTree: (treeId: string) => void;
}

type VerifierFilter = 'pending' | 'in-review' | 'verified-today' | 'flagged';
type VerifierNavTab = 'queue' | 'assignments' | 'map' | 'passports' | 'history' | 'profile';

export const VerifierPortal: React.FC<VerifierPortalProps> = ({ onOpenTree }) => {
  const { trees, currentUser, verifyCheckpoint } = useDemoData();
  const { language } = useLanguage();

  const [activeNav, setActiveNav] = useState<VerifierNavTab>('queue');
  const [activeFilter, setActiveFilter] = useState<VerifierFilter>('pending');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Verifier review state
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [verifierNotes, setVerifierNotes] = useState<string>('Visual foliage density verified. Growth consistent with milestone.');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Find trees that have pending checkpoints or were submitted
  const pendingQueue = useMemo(() => {
    return trees.filter(t => 
      t.checkpoints.some(c => c.status === 'pending') || 
      t.status === 'verification-pending'
    );
  }, [trees]);

  // Trees verified by this verifier today
  const verifiedTodayQueue = useMemo(() => {
    return trees.filter(t => 
      t.checkpoints.some(c => c.status === 'verified' && c.verifierName?.includes(currentUser.name))
    );
  }, [trees, currentUser]);

  // Flagged trees
  const flaggedQueue = useMemo(() => {
    return trees.filter(t => t.status === 'at-risk' && t.activeAlert?.includes('flagged'));
  }, [trees]);

  // Active list based on filter
  const displayedTrees = useMemo(() => {
    switch (activeFilter) {
      case 'pending':
        return pendingQueue;
      case 'in-review':
        return pendingQueue.slice(0, 2);
      case 'verified-today':
        return verifiedTodayQueue.length > 0 ? verifiedTodayQueue : trees.filter(t => t.status === 'healthy').slice(0, 3);
      case 'flagged':
        return flaggedQueue.length > 0 ? flaggedQueue : trees.filter(t => t.status === 'at-risk').slice(0, 2);
    }
  }, [activeFilter, pendingQueue, verifiedTodayQueue, flaggedQueue, trees]);

  // Selected tree for detailed review
  const activeReviewTree = useMemo(() => {
    if (selectedTreeId) {
      return trees.find(t => t.id === selectedTreeId) || displayedTrees[0] || trees[0];
    }
    return displayedTrees[0] || trees[0];
  }, [trees, selectedTreeId, displayedTrees]);

  // Check Conflict of Interest for the active tree
  const isConflictOfInterest = useMemo(() => {
    if (!activeReviewTree) return false;
    const custodian = activeReviewTree.currentCustodian.toLowerCase();
    const verifier = currentUser.name.toLowerCase();
    return custodian.includes(verifier) || verifier.includes(custodian);
  }, [activeReviewTree, currentUser]);

  const handleDecision = async (treeId: string, decision: 'APPROVE' | 'RECHECK' | 'FLAG') => {
    setIsProcessing(true);

    try {
      const result = await verifyCheckpoint(treeId, '6-month', decision, verifierNotes);
      setIsProcessing(false);
      if (!result.success) {
        showToast(`❌ ${result.error}`);
      } else {
        if (decision === 'APPROVE') {
          showToast(`✅ Tree ${treeId} verified! Status updated to VERIFIED ALIVE in shared database.`);
        } else if (decision === 'RECHECK') {
          showToast(`⚠️ Re-check requested for Tree ${treeId}. Custodian notified.`);
        } else {
          showToast(`🚩 Evidence flagged for Tree ${treeId}. Marked as AT-RISK.`);
        }
      }
    } catch (err: any) {
      setIsProcessing(false);
      showToast(`❌ Verification failed: ${err.message || 'Network error'}`);
    }
  };

  const navItems: { id: VerifierNavTab; labelEn: string; labelTa: string }[] = [
    { id: 'queue', labelEn: 'Verification Queue', labelTa: 'சரிபார்ப்பு வரிசை' },
    { id: 'assignments', labelEn: 'My Assignments', labelTa: 'என் பணிகள்' },
    { id: 'map', labelEn: 'Field Map', labelTa: 'கள வரைபடம்' },
    { id: 'passports', labelEn: 'Tree Passport', labelTa: 'மர பாஸ்போர்ட்' },
    { id: 'history', labelEn: 'History', labelTa: 'வரலாறு' },
    { id: 'profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்' },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-rise max-w-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Verifier Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-sm mt-0.5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
                Peer Verifier Workspace
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Verifier ID: {currentUser.id.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {language === 'ta' ? 'சரிபார்ப்பு வரிசை' : 'Verification Queue'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentUser.name} • {currentUser.roleTitle} • {currentUser.organization}
            </p>
          </div>
        </div>

        {/* Verifier Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200 text-center">
            <span className="block text-xl font-black text-slate-900">{pendingQueue.length}</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Pending Tasks</span>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-center">
            <span className="block text-xl font-black text-emerald-700">{verifiedTodayQueue.length || 3}</span>
            <span className="text-[10px] font-bold text-emerald-600 uppercase">Verified Today</span>
          </div>
        </div>
      </div>

      {/* Verifier Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-indigo-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'ta' ? item.labelTa : item.labelEn}
            </button>
          );
        })}
      </div>

      {/* FILTER TABS (Pending, In Review, Verified Today, Flagged) */}
      <div className="flex items-center gap-2">
        {[
          { id: 'pending' as const, label: 'Pending Audit', count: pendingQueue.length },
          { id: 'in-review' as const, label: 'In Review', count: pendingQueue.length > 0 ? 1 : 0 },
          { id: 'verified-today' as const, label: 'Verified Today', count: verifiedTodayQueue.length || 3 },
          { id: 'flagged' as const, label: 'Flagged', count: flaggedQueue.length },
        ].map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{f.label}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {f.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* VERIFICATION QUEUE CONTENT */}
      {activeNav === 'queue' && (
        <div className="space-y-5">
          {displayedTrees.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Verification Queue is Clear</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No trees currently require verification in this view. When custodians submit checkpoint photos, they will appear here instantly.
              </p>
            </div>
          ) : (
            displayedTrees.map((tree) => {
              const pendingCheckpoint = tree.checkpoints.find(c => c.status === 'pending') || tree.checkpoints[1] || tree.checkpoints[0];
              const isTreeCustodianConflict = tree.currentCustodian.toLowerCase().includes(currentUser.name.toLowerCase());

              return (
                <div 
                  key={tree.id}
                  className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col lg:flex-row gap-6 transition-all ${
                    isTreeCustodianConflict ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
                  }`}
                >
                  {/* Left Column: Tree ID, Details & Side-by-side Photos */}
                  <div className="lg:w-1/2 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="tn-tree-code text-xs font-mono font-bold px-2 py-0.5 rounded">
                            {tree.id}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                            {pendingCheckpoint.stage} Checkpoint Audit
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mt-1">
                          {tree.speciesName.toUpperCase()}
                          {tree.tamilName && (
                            <span className="text-slate-500 text-sm font-normal ml-1">({tree.tamilName})</span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{tree.landmark}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenTree(tree.id)}
                        className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 shrink-0 p-1.5 rounded-lg hover:bg-indigo-50"
                      >
                        Passport <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Side-by-Side Photographic Evidence */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                          Plantation Baseline
                        </span>
                        <div className="h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 relative group">
                          <img src={tree.initialPhotoUrl} alt="Baseline" className="w-full h-full object-cover grayscale contrast-125" />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-black/70 text-white rounded text-[9px] font-mono">
                            {tree.plantedAt}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                          Current Evidence
                        </span>
                        <div className="h-36 rounded-xl overflow-hidden border-2 border-emerald-500 bg-slate-100 relative shadow-2xs">
                          <img src={tree.currentPhotoUrl} alt="Latest Submission" className="w-full h-full object-cover" />
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-emerald-900/80 text-white rounded text-[9px] font-mono">
                            Latest Photo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Custodian Ownership Info */}
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Custodian: <strong className="text-slate-900">{tree.currentCustodian}</strong></span>
                      </div>
                      <span className="text-[11px] text-slate-400">{tree.organization}</span>
                    </div>

                    {/* CONFLICT OF INTEREST WARNING */}
                    {isTreeCustodianConflict && (
                      <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Conflict of Interest Rule Enforced</strong>
                          You are the assigned custodian for this tree ({tree.currentCustodian}). Independent peer verification requires an unrelated auditor.
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: AI-Assisted Pre-Check & Decision Controls */}
                  <div className="lg:w-1/2 flex flex-col justify-between bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div>
                      {/* AI-Assisted Pre-check */}
                      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>AI-Assisted Pre-Check</span>
                        </span>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full uppercase">
                          Decision Support
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Visual Similarity</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            High (94%)
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Location Consistency</span>
                          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            Review (&lt;12m offset)
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600">Duplicate Evidence</span>
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            Not Detected
                          </span>
                        </div>
                      </div>

                      {/* Verifier Notes Input */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Auditor Verdict Notes
                        </label>
                        <textarea
                          rows={2}
                          value={verifierNotes}
                          onChange={(e) => setVerifierNotes(e.target.value)}
                          placeholder="Add observations on tree health, foliage, bark, or bamboo guard..."
                          className="w-full p-2 rounded-xl bg-white border border-slate-200 text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Decision Actions */}
                    <div className="pt-4 border-t border-slate-200 space-y-2">
                      <p className="text-[11px] text-slate-500 italic text-center mb-1">
                        The peer verifier is the final authority. AI provides advisory support only.
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleDecision(tree.id, 'FLAG')}
                          disabled={isProcessing}
                          className="py-2.5 px-2 bg-white hover:bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Flag Evidence</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDecision(tree.id, 'RECHECK')}
                          disabled={isProcessing}
                          className="py-2.5 px-2 bg-white hover:bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Request Re-check</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDecision(tree.id, 'APPROVE')}
                          disabled={isProcessing || isTreeCustodianConflict}
                          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                            isTreeCustodianConflict
                              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs cursor-pointer'
                          }`}
                          title={isTreeCustodianConflict ? "Conflict of Interest: cannot verify own tree" : "Approve Verification"}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Verification</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* OTHER TABS */}
      {activeNav === 'assignments' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Assigned Verification Audits</h3>
          <p className="text-xs text-slate-500">
            Trees assigned to {currentUser.name} for periodic field verification.
          </p>
          <div className="space-y-2">
            {trees.slice(0, 4).map(tree => (
              <div key={tree.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-xs text-slate-800">{tree.id}</span>
                  <span className="text-xs text-slate-600 ml-2">{tree.speciesName}</span>
                </div>
                <button onClick={() => onOpenTree(tree.id)} className="text-xs text-indigo-700 font-bold hover:underline">
                  View Tree →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeNav === 'passports' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Tree Passports Quick Access</h3>
          <p className="text-xs text-slate-500">Select any tree to review its complete passport and chain of custody.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trees.map(tree => (
              <div 
                key={tree.id} 
                onClick={() => onOpenTree(tree.id)}
                className="p-3 bg-white border border-slate-200 hover:border-indigo-400 rounded-xl cursor-pointer flex items-center gap-3 transition-all"
              >
                <img src={tree.currentPhotoUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                <div className="min-w-0">
                  <span className="font-mono text-xs font-bold text-slate-900">{tree.id}</span>
                  <p className="text-xs text-slate-500 truncate">{tree.speciesName} • {tree.landmark}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeNav === 'map' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Auditor Field Inspection Map</h3>
              <p className="text-xs text-slate-500">Live GPS locations of trees assigned for audit and nearby verification milestones.</p>
            </div>
          </div>
          <div className="h-[550px] rounded-xl overflow-hidden border border-slate-200">
            <InteractiveMap
              trees={trees}
              onSelectTree={(tree) => onOpenTree(tree.id)}
              onOpenPassport={(id) => onOpenTree(id)}
            />
          </div>
        </div>
      )}

      {activeNav === 'history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Audit Verification Log</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
              <div>
                <strong>Tree TG-IND-001</strong> — Verified Alive by {currentUser.name}
                <span className="block text-[11px] text-emerald-700">6-Month Milestone Approved</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Today</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <strong>Tree TN-PALM-005</strong> — Heritage Baseline Verified
                <span className="block text-[11px] text-slate-500">Ramanathapuram Shoreline Belt</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">14 Apr 2024</span>
            </div>
          </div>
        </div>
      )}

      {activeNav === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-xl mx-auto">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-700 text-white flex items-center justify-center text-2xl font-black shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-600 font-medium">{currentUser.roleTitle}</p>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.organization} • {currentUser.location}</p>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-indigo-50/60 p-4 rounded-xl leading-relaxed border border-indigo-100">
            <span className="font-bold text-indigo-950 block mb-1">Auditor Accreditation</span>
            {currentUser.bio}
          </div>
        </div>
      )}
    </div>
  );
};
