import React, { useState, useMemo } from 'react';
import { useDemoData, type AppUser } from '../context/DemoDataContext';
import { Tree, MaintenanceLog } from '../types/custodia';
import { useLanguage } from '../context/LanguageContext';
import { CustodianDiscoverModal } from './CustodianDiscoverModal';
import { InteractiveMap } from './InteractiveMap';
import { uploadApi } from '../lib/api';
import {
  TreePine,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  HeartHandshake,
  Calendar,
  Camera,
  Droplets,
  ArrowRightLeft,
  MapPin,
  FileText,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  UserCheck,
  X,
  Sparkles,
  Award,
  Activity,
  User,
  Info
} from 'lucide-react';

interface CustodianPortalProps {
  onOpenTree: (treeId: string) => void;
  onOpenRegisterTree?: () => void;
}

type CustodianNavTab = 'home' | 'my-trees' | 'discover' | 'map' | 'checkpoints' | 'handover' | 'activity' | 'profile';

export const CustodianPortal: React.FC<CustodianPortalProps> = ({
  onOpenTree,
  onOpenRegisterTree,
}) => {
  const { 
    trees, 
    currentUser, 
    users,
    handoffRequests, 
    acceptHandover, 
    declineHandover, 
    requestHandover,
    submitCheckpointEvidence,
    addMaintenanceLog
  } = useDemoData();
  const { language } = useLanguage();

  const [activeNav, setActiveNav] = useState<CustodianNavTab>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals inside Custodian Portal
  const [isSubmitEvidenceOpen, setIsSubmitEvidenceOpen] = useState(false);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [selectedTreeForEvidence, setSelectedTreeForEvidence] = useState<Tree | null>(null);
  const [evidencePhoto, setEvidencePhoto] = useState<string>('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80');
  const [evidenceNotes, setEvidenceNotes] = useState<string>('Bi-weekly watering completed. Healthy new leaf flushes visible.');
  const [evidenceHeight, setEvidenceHeight] = useState<number>(65);
  const [evidenceMoisture, setEvidenceMoisture] = useState<number>(70);

  // Maintenance Log Modal
  const [isLogCareOpen, setIsLogCareOpen] = useState(false);
  const [selectedTreeForLog, setSelectedTreeForLog] = useState<Tree | null>(null);
  const [logType, setLogType] = useState<string>('Watering');
  const [logLiters, setLogLiters] = useState<string>('15');
  const [logNotes, setLogNotes] = useState<string>('Root basin hydrated and cleared of weeds.');

  // Request Handover Modal
  const [isRequestHandoverOpen, setIsRequestHandoverOpen] = useState(false);
  const [selectedTreeForHandover, setSelectedTreeForHandover] = useState<Tree | null>(null);
  const [handoverSuccessor, setHandoverSuccessor] = useState<string>('Priya S');
  const [handoverReason, setHandoverReason] = useState<string>('Graduation transition — handoff of campus tree care');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter trees belonging to current logged-in custodian
  const myTrees = useMemo(() => {
    return trees.filter(t => 
      t.currentCustodian.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      currentUser.name.toLowerCase().includes(t.currentCustodian.toLowerCase())
    );
  }, [trees, currentUser]);

  // Compute metrics for My Responsibility
  const verifiedAliveCount = myTrees.filter(t => t.status === 'healthy').length;
  const atRiskCount = myTrees.filter(t => t.status === 'at-risk' || t.status === 'orphaned').length;
  
  // Pending actions: upcoming checkpoints or pending handover requests
  const pendingCheckpoints = useMemo(() => {
    return myTrees.flatMap(t => 
      t.checkpoints
        .filter(c => c.status === 'pending')
        .map(c => ({ tree: t, checkpoint: c }))
    );
  }, [myTrees]);

  // Incoming handover requests directed to current user
  const incomingHandovers = useMemo(() => {
    return handoffRequests.filter(h => 
      h.toCustodianName.toLowerCase().includes(currentUser.name.toLowerCase()) && 
      h.status === 'PENDING'
    );
  }, [handoffRequests, currentUser]);

  // Outgoing handovers initiated by current user
  const outgoingHandovers = useMemo(() => {
    return handoffRequests.filter(h => 
      h.fromCustodianName.toLowerCase().includes(currentUser.name.toLowerCase())
    );
  }, [handoffRequests, currentUser]);

  const handleEvidenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTreeForEvidence) return;

    submitCheckpointEvidence(selectedTreeForEvidence.id, '6-month', {
      photoUrl: evidencePhoto,
      notes: evidenceNotes,
      heightCm: evidenceHeight,
      soilMoisture: evidenceMoisture,
    });

    setIsSubmitEvidenceOpen(false);
    showToast(`✅ Evidence submitted for ${selectedTreeForEvidence.id}! Transferred to Peer Verifier Queue.`);
  };

  const handleMaintenanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTreeForLog) return;

    addMaintenanceLog(selectedTreeForLog.id, {
      type: logType,
      notes: logNotes,
      liters: logLiters,
    });

    setIsLogCareOpen(false);
    showToast(`💧 Care log recorded for ${selectedTreeForLog.id}.`);
  };

  const handleHandoverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTreeForHandover) return;

    requestHandover(selectedTreeForHandover.id, handoverSuccessor, handoverReason);
    setIsRequestHandoverOpen(false);
    showToast(`📋 Handover requested to ${handoverSuccessor}. Awaiting their acceptance.`);
  };

  const handleAcceptIncoming = (handoffId: string, treeId: string) => {
    acceptHandover(handoffId);
    showToast(`🎉 Responsibility accepted for ${treeId}! Added to your active trees.`);
  };

  const navItems: { id: CustodianNavTab; labelEn: string; labelTa: string; count?: number }[] = [
    { id: 'home', labelEn: 'Home', labelTa: 'முகப்பு' },
    { id: 'my-trees', labelEn: 'My Trees', labelTa: 'என் மரங்கள்', count: myTrees.length },
    { id: 'discover', labelEn: 'Discover', labelTa: 'கண்டறிக' },
    { id: 'map', labelEn: 'Map', labelTa: 'வரைபடம்' },
    { id: 'checkpoints', labelEn: 'Checkpoints', labelTa: 'தணிக்கைகள்', count: pendingCheckpoints.length },
    { id: 'handover', labelEn: 'Handover', labelTa: 'பொறுப்பு மாற்றம்', count: incomingHandovers.length },
    { id: 'activity', labelEn: 'Activity', labelTa: 'செயல்பாடுகள்' },
    { id: 'profile', labelEn: 'Profile', labelTa: 'சுயவிவரம்' },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-rise">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Custodian Workspace Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-2xl ${currentUser.avatarBg} text-white flex items-center justify-center text-xl font-black shrink-0 shadow-sm mt-0.5`}>
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Custodian Workspace
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: CUST-{currentUser.id.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {language === 'ta' ? 'எனது பொறுப்பு' : 'My Responsibility'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {currentUser.name} • {currentUser.organization} • {currentUser.location}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={() => setActiveNav('discover')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'தேடல்' : 'Discover'}</span>
          </button>

          {onOpenRegisterTree && (
            <button
              onClick={onOpenRegisterTree}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'மரம் பதிவு' : 'Register Tree'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Custodian Navigation Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200">
        {navItems.map((item) => {
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                isActive 
                  ? 'bg-emerald-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{language === 'ta' ? item.labelTa : item.labelEn}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  isActive ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* INCOMING HANDOVERS ALERT BANNER (If any pending) */}
      {incomingHandovers.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-amber-900 flex items-center gap-2">
                  <span>{language === 'ta' ? 'உள்வரும் பொறுப்பு மாற்றம்' : 'Incoming Custody Transfer'}</span>
                  <span className="text-[10px] font-mono bg-amber-200 px-2 py-0.5 rounded font-bold">
                    Action Required
                  </span>
                </h3>
                <p className="text-xs text-amber-800 mt-0.5 font-medium">
                  Another custodian has requested to transfer care of their tree to you.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {incomingHandovers.map((req) => (
              <div key={req.id} className="bg-white rounded-xl p-3 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="tn-tree-code text-xs font-mono font-bold px-2 py-0.5 rounded">
                      {req.treeId}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{req.treeSpecies}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    From: <strong className="text-slate-800">{req.fromCustodianName}</strong> • Reason: {req.reason}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => declineHandover(req.id)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleAcceptIncoming(req.id, req.treeId)}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'பொறுப்பை ஏற்கவும்' : 'Accept Responsibility'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HOME / MY RESPONSIBILITY */}
      {activeNav === 'home' && (
        <div className="space-y-6">
          {/* Responsibility Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Under My Care</span>
                <TreePine className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{myTrees.length}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Trees assigned</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verified Alive</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              </div>
              <p className="text-2xl font-black text-emerald-700 mt-2">{verifiedAliveCount}</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Peer verified alive</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Checkpoints Due</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-amber-700 mt-2">{pendingCheckpoints.length}</p>
              <p className="text-[11px] text-amber-600 font-semibold mt-0.5">Evidence needed</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">At-Risk Trees</span>
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-2xl font-black text-red-700 mt-2">{atRiskCount}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Requires hydration/care</p>
            </div>
          </div>

          {/* Trees Under My Care Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">
                {language === 'ta' ? 'என் பராமரிப்பிலுள்ள மரங்கள்' : 'Trees Under My Care'} ({myTrees.length})
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Live database records
              </span>
            </div>

            {myTrees.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-2">
                <TreePine className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-700">No trees currently under your care</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Ask the State Administrator to assign trees to {currentUser.name}, or accept an incoming custody handoff.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTrees.map((tree) => {
                  const isVerifiedAlive = tree.status === 'healthy';
                  const nextCheckpoint = tree.checkpoints.find(c => c.status === 'pending') || tree.checkpoints[1] || tree.checkpoints[0];

                  return (
                    <div 
                      key={tree.id} 
                      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <img 
                            src={tree.currentPhotoUrl} 
                            alt={tree.speciesName} 
                            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="tn-tree-code text-xs font-mono font-bold px-2 py-0.5 rounded">
                                {tree.id}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isVerifiedAlive 
                                  ? 'bg-emerald-100 text-emerald-800' 
                                  : tree.status === 'at-risk' 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {isVerifiedAlive ? 'VERIFIED ALIVE' : tree.status.toUpperCase()}
                              </span>
                            </div>

                            <h3 className="text-sm font-bold text-slate-900 mt-1 truncate">
                              {tree.speciesName.toUpperCase()}
                              {tree.tamilName && (
                                <span className="text-slate-500 font-normal ml-1">({tree.tamilName})</span>
                              )}
                            </h3>

                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>{tree.landmark}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Checkpoint Status Banner */}
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                          <Clock className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Next checkpoint: <strong>14 days</strong></span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {tree.checkpoints.filter(c => c.status === 'verified').length}/{tree.checkpoints.length} verified
                        </span>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        <button
                          onClick={() => onOpenTree(tree.id)}
                          className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all text-center cursor-pointer"
                        >
                          View Tree
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTreeForEvidence(tree);
                            setIsSubmitEvidenceOpen(true);
                          }}
                          className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Camera className="w-3 h-3 text-emerald-700" />
                          <span>Audit Photo</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedTreeForHandover(tree);
                            setIsRequestHandoverOpen(true);
                          }}
                          className="py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition-all text-center cursor-pointer flex items-center justify-center gap-1"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                          <span>Handover</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: MY TREES */}
      {activeNav === 'my-trees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              My Trees Under Custody ({myTrees.length})
            </h2>
            <button
              onClick={() => {
                if (myTrees.length > 0) {
                  setSelectedTreeForEvidence(myTrees[0]);
                  setIsSubmitEvidenceOpen(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Submit Checkpoint Evidence</span>
            </button>
          </div>

          <div className="space-y-3">
            {myTrees.map((tree) => (
              <div 
                key={tree.id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <img src={tree.currentPhotoUrl} alt={tree.speciesName} className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="tn-tree-code text-xs font-mono font-bold px-2 py-0.5 rounded">
                        {tree.id}
                      </span>
                      <span className="text-sm font-bold text-slate-900">{tree.speciesName}</span>
                      {tree.tamilName && (
                        <span className="text-xs text-slate-500">({tree.tamilName})</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{tree.landmark}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      <span className="text-slate-500">Planted: {tree.plantedAt}</span>
                      <span className="text-slate-300">•</span>
                      <span className="font-semibold text-emerald-800">Health: {tree.healthScore}/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => {
                      setSelectedTreeForLog(tree);
                      setIsLogCareOpen(true);
                    }}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                    title="Log Care / Watering"
                  >
                    <Droplets className="w-4 h-4 text-emerald-700" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTreeForEvidence(tree);
                      setIsSubmitEvidenceOpen(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Submit Evidence</span>
                  </button>

                  <button
                    onClick={() => onOpenTree(tree.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>View Tree</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DISCOVER */}
      {activeNav === 'discover' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <CustodianDiscoverModal onOpenTree={onOpenTree} isModal={false} />
        </div>
      )}

      {/* TAB CONTENT: MAP */}
      {activeNav === 'map' && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {language === 'ta' ? 'மரங்களின் இருப்பிட வரைபடம்' : 'Custodian Field & Community Map'}
              </h3>
              <p className="text-xs text-slate-500">
                {language === 'ta' ? 'உங்கள் மரங்கள் மற்றும் அருகிலுள்ள பொது மரங்களின் நேரடி இருப்பிடம்' : 'Visual geo-telemetry of your assigned trees and nearby community trees.'}
              </p>
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

      {/* TAB CONTENT: CHECKPOINTS */}
      {activeNav === 'checkpoints' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Audit Checkpoint Obligations
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              Submit verified photos for peer review
            </span>
          </div>

          <div className="space-y-3">
            {myTrees.flatMap(tree => 
              tree.checkpoints.map(chk => ({ tree, chk }))
            ).map(({ tree, chk }, idx) => (
              <div 
                key={`${tree.id}-${chk.id || idx}`} 
                className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    chk.status === 'verified' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : chk.status === 'pending' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {chk.status === 'verified' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="tn-tree-code text-xs font-mono font-bold px-1.5 py-0.2 rounded">
                        {tree.id}
                      </span>
                      <span className="text-xs font-bold text-slate-900 capitalize">
                        {chk.stage} Milestone Checkpoint
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        chk.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {chk.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {tree.speciesName} • Scheduled: {chk.scheduledDate} {chk.verifierName ? `• Verifier: ${chk.verifierName}` : ''}
                    </p>
                  </div>
                </div>

                {chk.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedTreeForEvidence(tree);
                      setIsSubmitEvidenceOpen(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Evidence</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: HANDOVER */}
      {activeNav === 'handover' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-900">Custody Handover Center</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Transfer tree stewardship smoothly to another custodian while preserving the complete chain of custody.
              </p>
            </div>

            <button
              onClick={() => {
                if (myTrees.length > 0) {
                  setSelectedTreeForHandover(myTrees[0]);
                  setIsRequestHandoverOpen(true);
                } else {
                  showToast("You don't have any trees assigned to handover.");
                }
              }}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Request Handover</span>
            </button>
          </div>

          {/* Outgoing requests */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              Outgoing Handover Requests ({outgoingHandovers.length})
            </h4>

            {outgoingHandovers.length === 0 ? (
              <div className="p-6 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-400">
                No outgoing handover requests initiated.
              </div>
            ) : (
              <div className="space-y-2">
                {outgoingHandovers.map(req => (
                  <div key={req.id} className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="tn-tree-code text-xs font-mono font-bold px-2 py-0.5 rounded">
                          {req.treeId}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{req.treeSpecies}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Transferred to: <strong>{req.toCustodianName}</strong> • {req.reason}
                      </p>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {new Date(req.requestedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ACTIVITY */}
      {activeNav === 'activity' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-700" />
            <span>Custodian Care & Activity Stream</span>
          </h3>

          <div className="space-y-3">
            {myTrees.flatMap(t => (t.maintenanceLogs || []).map(l => ({ treeId: t.id, ...l }))).length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No care logs recorded yet.</p>
            ) : (
              myTrees.flatMap(t => (t.maintenanceLogs || []).map(l => ({ treeId: t.id, ...l }))).map((log, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                  <Droplets className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-900">
                      {log.type} on Tree {log.treeId}
                    </span>
                    <p className="text-xs text-slate-600 mt-0.5">{log.notes}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{log.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeNav === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className={`w-16 h-16 rounded-2xl ${currentUser.avatarBg} text-white flex items-center justify-center text-2xl font-black shadow-sm`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-600 font-medium">{currentUser.roleTitle}</p>
              <p className="text-xs text-slate-500 mt-0.5">{currentUser.organization} • {currentUser.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-2xl font-black text-slate-900">{myTrees.length}</span>
              <span className="text-[10px] font-bold uppercase text-slate-500">Trees Cared For</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="block text-2xl font-black text-emerald-800">{verifiedAliveCount}</span>
              <span className="text-[10px] font-bold uppercase text-emerald-700">Verified Alive</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="block text-2xl font-black text-slate-900">{pendingCheckpoints.length}</span>
              <span className="text-[10px] font-bold uppercase text-slate-500">Audits Due</span>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">Stewardship Pledge</span>
            {currentUser.bio}
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT CHECKPOINT EVIDENCE */}
      {isSubmitEvidenceOpen && selectedTreeForEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Submit Checkpoint Evidence</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Tree {selectedTreeForEvidence.id} • {selectedTreeForEvidence.speciesName}
                </p>
              </div>
              <button onClick={() => setIsSubmitEvidenceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEvidenceSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Evidence Photo</label>
                <div className="relative h-44 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 mb-2">
                  {evidencePhoto ? (
                    <img src={evidencePhoto} alt="Evidence" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Camera className="w-8 h-8 mb-1" />
                      <span className="text-xs">No photo selected</span>
                    </div>
                  )}
                  {isUploadingEvidence && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Uploading to state registry...</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Upload Real Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!file.type.startsWith('image/')) {
                          showToast('❌ Only image files (JPEG, PNG, WebP) are allowed.');
                          return;
                        }
                        if (file.size > 5 * 1024 * 1024) {
                          showToast('❌ Image size exceeds 5MB limit.');
                          return;
                        }
                        try {
                          setIsUploadingEvidence(true);
                          const reader = new FileReader();
                          reader.onload = async () => {
                            try {
                              const base64 = reader.result as string;
                              const res = await uploadApi.uploadImage(base64, file.name, file.type);
                              setEvidencePhoto(res.url);
                              setIsUploadingEvidence(false);
                              showToast('✅ Photo uploaded successfully to central registry.');
                            } catch (uploadErr: any) {
                              setIsUploadingEvidence(false);
                              showToast(`❌ Upload failed: ${uploadErr.message || 'Server error'}`);
                            }
                          };
                          reader.readAsDataURL(file);
                        } catch (err: any) {
                          setIsUploadingEvidence(false);
                          showToast(`❌ Processing failed: ${err.message}`);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Measured Height (cm)</label>
                  <input
                    type="number"
                    value={evidenceHeight}
                    onChange={(e) => setEvidenceHeight(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Soil Moisture (%)</label>
                  <input
                    type="number"
                    value={evidenceMoisture}
                    onChange={(e) => setEvidenceMoisture(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Custodian Observation Notes</label>
                <textarea
                  rows={3}
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-800 text-[11px] leading-relaxed">
                ℹ Submitting will mark the milestone as <strong>SUBMITTED</strong>. It will immediately appear in the Field Verifier's audit queue.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitEvidenceOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-xs cursor-pointer"
                >
                  Submit for Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REQUEST HANDOVER */}
      {isRequestHandoverOpen && selectedTreeForHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
                  <span>Request Custody Handover</span>
                </h3>
                <p className="text-xs text-slate-500">Tree {selectedTreeForHandover.id}</p>
              </div>
              <button onClick={() => setIsRequestHandoverOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleHandoverSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Successor Custodian</label>
                <select
                  value={handoverSuccessor}
                  onChange={(e) => setHandoverSuccessor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 font-medium"
                >
                  {(users || []).filter(u => u.role === 'CUSTODIAN' && u.name !== currentUser.name).map(u => (
                    <option key={u.id} value={u.name}>{u.name} ({u.location})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Reason for Transfer</label>
                <select
                  value={handoverReason}
                  onChange={(e) => setHandoverReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 font-medium"
                >
                  <option value="Graduation transition — handoff of campus tree care">Graduation transition</option>
                  <option value="Relocation / Transfer to another district">Relocation / Transfer</option>
                  <option value="Semester break leave">Semester break leave</option>
                  <option value="Community handoff to Junior NSS Guardian">Junior NSS Guardian handoff</option>
                </select>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-lg text-amber-900 text-[11px]">
                ⚠️ When the successor accepts, you will transfer active care. The Tree Passport will permanently preserve your custody history.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRequestHandoverOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer shadow-xs"
                >
                  Initiate Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: LOG MAINTENANCE */}
      {isLogCareOpen && selectedTreeForLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-emerald-700" />
                  <span>Log Tree Care</span>
                </h3>
                <p className="text-xs text-slate-500">Tree {selectedTreeForLog.id}</p>
              </div>
              <button onClick={() => setIsLogCareOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMaintenanceSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Care Action Type</label>
                <select
                  value={logType}
                  onChange={(e) => setLogType(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                >
                  <option value="Watering">Watering & Hydration</option>
                  <option value="Mulch & Weeding">Mulching & Weed Removal</option>
                  <option value="Soil Aeration">Soil Basin Aeration</option>
                  <option value="Tree Guard Repair">Tree Guard Reinforcement</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Water Amount (Liters)</label>
                <input
                  type="text"
                  value={logLiters}
                  onChange={(e) => setLogLiters(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogCareOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Record Care Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
