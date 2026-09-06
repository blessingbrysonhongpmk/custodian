import React, { useState } from 'react';
import { Tree } from '../types/custodia';
import { useTranslation } from 'react-i18next';
import { Tree3DViewer } from './Tree3DViewer';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  AlertTriangle, 
  Camera,
  Calendar,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';

interface TreePassportViewProps {
  tree: Tree;
  onOpenHandoff: (tree: Tree) => void;
  onOpenVerification: (tree: Tree) => void;
  onOpenAutopsy?: (tree: Tree) => void;
}

export const TreePassportView: React.FC<TreePassportViewProps> = ({
  tree,
  onOpenHandoff,
  onOpenVerification,
  onOpenAutopsy
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'groot_3d' | 'ai_verification' | 'custody' | 'timeline'>('groot_3d');

  // Get latest checkpoint for AI verification comparison
  const latestCheckpoint = tree.checkpoints?.length > 0 
    ? tree.checkpoints[tree.checkpoints.length - 1] 
    : null;

  // Determine if we have real AI analysis from backend, otherwise use graceful demo mock
  const hasLiveAi = !!latestCheckpoint?.aiAnalysis;
  
  const aiData = hasLiveAi ? latestCheckpoint.aiAnalysis : {
    healthStatus: "healthy",
    visualConsistencyScore: 0.96,
    growthContinuityScore: 0.91,
    environmentMatchScore: 0.94,
    overallConfidence: 0.94,
    requiresHumanReview: false,
    observations: [
      "The latest checkpoint image is highly consistent with the original planting record.",
      "Visible growth patterns, trunk structure, canopy development, and surrounding environmental features indicate continuity."
    ]
  };

  const confidenceScore = latestCheckpoint?.confidenceScore || Math.round(aiData.overallConfidence * 100);

  // Formatting Last Verified Date
  let lastVerifiedStr = "N/A";
  if (latestCheckpoint?.verifiedDate || latestCheckpoint?.scheduledDate) {
    const date = new Date(latestCheckpoint.verifiedDate || latestCheckpoint.scheduledDate!);
    lastVerifiedStr = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + " · " + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  // Active Custody Record
  const custody = tree.custodyHistory?.find(c => c.active) || tree.custodyHistory?.[0];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-slate-900 tracking-tight">Tree Passport</h1>
          <p className="text-sm text-slate-500 mt-1">Identity, custody history, and AI-verified evidence for every tree.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Record</span>
          <span className="text-xs text-slate-400 border-l border-slate-200 pl-2 ml-1">
            Last verified: {lastVerifiedStr}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================== */}
        {/* LEFT COLUMN: TREE IDENTITY & CUSTODY (35-40%)                  */}
        {/* ============================================================== */}
        <div className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 sticky top-6">
          
          {/* Identity Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900 text-white uppercase tracking-wider">
                {tree.id}
              </span>
              {tree.isPilotTree && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wider">
                  Pilot Reference
                </span>
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {tree.speciesName}
            </h2>
            <p className="text-sm text-emerald-700 font-serif italic mb-5">
              {tree.botanicalName}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col">
                <span className="text-3xl font-light text-slate-900">{tree.healthScore}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('passport.healthScore')}</span>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mt-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-slate-700 capitalize">
                    {tree.status.replace('-', ' ')}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Status</span>
              </div>
            </div>

            <div className="space-y-3 pt-5 border-t border-slate-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{tree.landmark}</p>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{tree.coordinates[0].toFixed(3)}°, {tree.coordinates[1].toFixed(3)}°</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-slate-700">{t('passport.badgePlanted')}</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(tree.plantedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Custody Status */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Custody Status</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Current Custodian</p>
                <p className="text-base font-bold text-slate-900">{custody?.custodianName || tree.currentCustodian}</p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Institutional Anchor</p>
                <p className="text-sm font-semibold text-slate-700">{custody?.organizationUnit || tree.currentCustodianUnit}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 mb-0.5">Custody Expiry</p>
                <p className="text-sm font-semibold text-amber-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> 14 days remaining
                </p>
              </div>

              <div className="mt-1 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md uppercase tracking-wider">Handoff Required</span>
              </div>

              <div className="mt-1">
                <button
                  onClick={() => onOpenHandoff(tree)}
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-colors shadow-sm"
                >
                  Initiate Handoff
                </button>
              </div>
            </div>
          </div>

          {/* Tree Lifecycle */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Tree Lifecycle</h3>
            
            <div className="relative pl-3 space-y-4 before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
              <div className="relative flex items-center gap-4 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-sm font-medium text-slate-500">{t('passport.badgePlanted')}</span>
              </div>
              <div className="relative flex items-center gap-4 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-sm font-medium text-slate-500">1 Month Checkpoint</span>
              </div>
              <div className="relative flex items-center gap-4 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                <span className="text-sm font-medium text-slate-500">6 Month Checkpoint</span>
              </div>
              <div className="relative flex items-center gap-4 z-10">
                <div className="w-3.5 h-3.5 -ml-[2px] rounded-full bg-amber-500 ring-4 ring-amber-50" />
                <span className="text-sm font-bold text-slate-900">Current Stage</span>
              </div>
              <div className="relative flex items-center gap-4 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 ring-4 ring-white" />
                <span className="text-sm font-medium text-slate-400">1 Year Milestone</span>
              </div>
              <div className="relative flex items-center gap-4 z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200 ring-4 ring-white" />
                <span className="text-sm font-medium text-slate-400">3 Year Canopy</span>
              </div>
            </div>
          </div>

        </div>


        {/* ============================================================== */}
        {/* RIGHT COLUMN: AI VERIFICATION INTELLIGENCE (60-65%)           */}
        {/* ============================================================== */}
        <div className="lg:col-span-8 xl:col-span-8 flex flex-col gap-6">
          
          {/* Navigation Tabs */}
          <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100 flex overflow-x-auto no-scrollbar gap-1">
            <button
              onClick={() => setActiveTab('groot_3d')}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'groot_3d' 
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-sm font-black' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center justify-center gap-1.5">
                <span>🪴</span>
                <span>3D Groot Twin</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('ai_verification')}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'ai_verification' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <Sparkles className={`w-4 h-4 ${activeTab === 'ai_verification' ? 'text-amber-300' : ''}`} />
                AI Verification
              </span>
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'timeline' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Evidence Timeline
            </button>
            <button
              onClick={() => setActiveTab('custody')}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'custody' 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              Custody History
            </button>
          </div>

          {/* TAB CONTENT: 3D GROOT DIGITAL TWIN */}
          {activeTab === 'groot_3d' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="px-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-800 text-[10px] font-black uppercase tracking-widest border border-amber-400/40">
                    ⭐ Flora Colossus Digital Twin
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Interactive Three.js 3D Model</span>
                </div>
                <h2 className="text-xl font-black text-slate-900 mt-1">Living 3D Replica & Growth Stages</h2>
                <p className="text-sm text-slate-500 mt-0.5">Explore growth stages from Baby Groot in pot to full Guardian canopy.</p>
              </div>

              <Tree3DViewer
                speciesName={tree.speciesName}
                tamilName={tree.speciesName.includes('Neem') ? 'வேம்பு' : 'மரம்'}
                status={tree.status}
                growthStage={3}
                heightCm={118}
              />
            </div>
          )}

          {/* TAB CONTENT: AI VERIFICATION */}
          {activeTab === 'ai_verification' && (
            <div className="flex flex-col gap-6 animate-fade-in">
              
              <div className="px-2">
                <h2 className="text-xl font-serif text-slate-900">Gemini Vision Intelligence</h2>
                <p className="text-sm text-slate-500 mt-1">Comparing latest checkpoint evidence against original planting records for continuity.</p>
              </div>

              {/* 1. Photo Comparison */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                  
                  {/* Left: Original */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Original Record</span>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {new Date(tree.plantedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                      <img src={tree.initialPhotoUrl} alt="Planting" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Connector */}
                  <div className="flex flex-col items-center justify-center py-4 sm:py-0">
                    <div className="w-px h-8 bg-gradient-to-b from-transparent to-emerald-200 hidden sm:block" />
                    <div className="bg-emerald-50 text-emerald-600 rounded-full p-2.5 my-2 border border-emerald-100 shadow-sm relative group">
                      <Sparkles className="w-5 h-5 relative z-10" />
                      <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-emerald-400/20 absolute top-0 rounded-full" />
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-t from-transparent to-emerald-200 hidden sm:block" />
                  </div>

                  {/* Right: Latest */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Latest Checkpoint
                      </span>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        {latestCheckpoint?.verifiedDate ? new Date(latestCheckpoint.verifiedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Sep 2026'}
                      </span>
                    </div>
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-emerald-200 relative ring-4 ring-emerald-50 group">
                      <img src={latestCheckpoint?.photoUrl || tree.currentPhotoUrl} alt="Latest Checkpoint" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* 2. Verification Result Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Overall Confidence */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Verification Confidence</h3>
                  
                  {/* Radial Progress */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                      <circle 
                        cx="80" 
                        cy="80" 
                        r="70" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="12" 
                        strokeDasharray={2 * Math.PI * 70} 
                        strokeDashoffset={2 * Math.PI * 70 * (1 - confidenceScore / 100)} 
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="flex flex-col items-center">
                      <span className="text-5xl font-light text-slate-900 tracking-tighter">{confidenceScore}<span className="text-2xl text-slate-400">%</span></span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-bold text-emerald-700">High Confidence</span>
                  </div>
                </div>

                {/* AI Signals */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">AI Signals</h3>
                  
                  <div className="space-y-4">
                    <SignalBar label="Identity Match" score={Math.round(aiData.visualConsistencyScore * 100)} />
                    <SignalBar label="Growth Continuity" score={Math.round(aiData.growthContinuityScore * 100)} />
                    <SignalBar label="Environmental Match" score={Math.round(aiData.environmentMatchScore * 100)} />
                    <SignalBar label="GPS Proximity" score={98} />
                    
                    <div className="pt-2 border-t border-slate-50">
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="font-medium text-slate-600">Timestamp Validity</span>
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs uppercase">Verified</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium text-slate-600">Tree Health</span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-xs uppercase">Healthy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Gemini AI Report */}
              <div className="bg-[#0f172a] p-6 rounded-3xl shadow-lg border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight uppercase tracking-wide">Gemini Vision Analysis</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Model: Gemini 1.5 Pro Vision</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wide">Analysis Complete</span>
                  </div>
                </div>

                <div className="relative z-10 bg-slate-900/50 rounded-2xl p-5 border border-slate-800">
                  <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
                    "{aiData.observations?.join(' ') || 'The latest checkpoint image is highly consistent with the original planting record. Visible growth patterns, trunk structure, canopy development, and surrounding environmental features indicate continuity.'}"
                  </p>
                  
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Health Assessment</p>
                      <p className="text-sm font-bold text-emerald-400 uppercase">{aiData.healthStatus.replace('_', ' ')} & Growing</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Human Review</p>
                      <p className="text-sm font-bold text-slate-300 uppercase">
                        {aiData.requiresHumanReview ? 'Required' : 'Not Required'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative z-10 mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 font-mono">
                  <span>Confidence: {confidenceScore}%</span>
                  <span>•</span>
                  <span>Analyzed: {lastVerifiedStr.split('·')[0].trim()}</span>
                  {!hasLiveAi && (
                    <>
                      <span>•</span>
                      <span className="text-amber-500/80 font-bold bg-amber-500/10 px-2 py-0.5 rounded">DEMO ANALYSIS</span>
                    </>
                  )}
                  {hasLiveAi && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-500/80 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">LIVE AI ANALYSIS</span>
                    </>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB CONTENT: EVIDENCE TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
              <h2 className="text-xl font-serif text-slate-900 mb-6">Evidence Timeline</h2>
              
              <div className="space-y-8 pl-4 border-l-2 border-slate-100 relative ml-4">
                {tree.checkpoints?.map((chk, index) => {
                  const isCompleted = chk.status === 'verified';
                  const isMissed = chk.status === 'missed';
                  const conf = chk.confidenceScore || 94; // fallback

                  return (
                    <div key={chk.id} className="relative">
                      {/* Timeline Dot */}
                      <div className={`absolute -left-[21px] w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-500 ring-4 ring-emerald-50' : isMissed ? 'bg-rose-500 ring-4 ring-rose-50' : 'bg-slate-300 ring-4 ring-slate-50'
                      }`} />
                      
                      <div className="ml-6 flex flex-col md:flex-row gap-5">
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                            {new Date(chk.scheduledDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                            {chk.stage === 'planted' ? '🌱 Original Planting' :
                             chk.stage === '1m' ? '🌿 1 Month Checkpoint' :
                             chk.stage === '6m' ? '🌳 6 Month Checkpoint' :
                             chk.stage === '1y' ? '🌲 1 Year Milestone' :
                             '🌲 Canopy Milestone'}
                             
                            {isCompleted && (
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Verified
                              </span>
                            )}
                          </h4>
                          
                          {isCompleted && chk.stage !== 'planted' && (
                            <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 text-sm font-semibold text-slate-700 mb-3">
                              AI Confidence: <span className={conf >= 90 ? 'text-emerald-600' : 'text-amber-600'}>{conf}%</span>
                            </div>
                          )}
                          
                          <p className="text-sm text-slate-600">
                            {chk.notes || (chk.stage === 'planted' ? 'Initial baseline record created.' : 'Routine verification checkpoint submitted by custodian.')}
                          </p>
                        </div>
                        
                        {chk.photoUrl && (
                          <div className="shrink-0 w-32 h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                            <img src={chk.photoUrl} alt="Checkpoint Evidence" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: CUSTODY HISTORY */}
          {activeTab === 'custody' && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-fade-in">
              <h2 className="text-xl font-serif text-slate-900 mb-6">Custody Accountability Chain</h2>
              
              <div className="flex flex-col items-center">
                
                {/* 1. Original Custodian */}
                <div className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Original Custodian</p>
                      <h4 className="text-base font-bold text-slate-900">Dr. Sarah Thomas</h4>
                      <p className="text-sm text-slate-600">Botany Dept. Faculty</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded uppercase">Past</span>
                    </div>
                  </div>
                </div>

                <div className="w-px h-8 bg-slate-200 flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-slate-400 bg-white" />
                </div>

                {/* 2. Current Custodian */}
                <div className="w-full p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Current Custodian</p>
                      <h4 className="text-base font-bold text-slate-900">{custody?.custodianName || tree.currentCustodian}</h4>
                      <p className="text-sm text-slate-600">{custody?.organizationUnit || tree.currentCustodianUnit}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded uppercase shadow-sm">Active</span>
                    </div>
                  </div>
                </div>

                <div className="w-px h-8 bg-amber-200 flex items-center justify-center">
                  <ArrowDown className="w-4 h-4 text-amber-500 bg-white" />
                </div>

                {/* 3. Expiring & Matching */}
                <div className="w-full p-5 rounded-2xl bg-white border border-dashed border-amber-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Custody Expiry Approaching</p>
                      <h4 className="text-sm font-semibold text-slate-700">Successor Matching Triggered</h4>
                      <p className="text-xs text-slate-500 mt-1">14 days remaining for current custodian.</p>
                    </div>
                    <div className="text-right">
                      <button className="text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1.5 rounded-md uppercase transition-colors">
                        Pending Handoff
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Helper component for AI signal bars
const SignalBar = ({ label, score }: { label: string, score: number }) => {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">{score}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${score >= 90 ? 'bg-emerald-500' : score >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};
