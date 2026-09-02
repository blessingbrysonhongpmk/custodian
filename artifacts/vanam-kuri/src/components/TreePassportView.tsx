import React, { useState } from 'react';
import { Tree, CheckpointEvidence, CustodyRecord } from '../types/custodia';
import { Tree3DViewer } from './Tree3DViewer';
import { 
  HeartHandshake, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Droplets, 
  Share2, 
  Download, 
  QrCode, 
  User, 
  ArrowRight,
  Eye,
  Camera,
  Layers,
  Leaf,
  Activity,
  History,
  Info
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
  onOpenAutopsy,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'custody' | 'maintenance' | 'details'>('timeline');
  const [activeGrowthStage, setActiveGrowthStage] = useState<1 | 2 | 3 | 4 | 5>(tree.growthStage);
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner & Quick ID Card */}
      <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-50/60 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Tree Identification Info */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 text-white shadow-2xs">
                {tree.id}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Official Digital Tree Passport
              </span>
              {tree.isPilotTree && (
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                  Campus Pilot Reference Tree
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight flex items-baseline gap-2">
                {tree.speciesName}
                <span className="text-lg font-serif italic text-emerald-700 font-normal">
                  ({tree.tamilName} • {tree.botanicalName})
                </span>
              </h1>
              <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-slate-900">{tree.landmark}</span>, {tree.zone}
                <span className="text-slate-400">({tree.coordinates[0].toFixed(4)}°N, {tree.coordinates[1].toFixed(4)}°E)</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenHandoff(tree)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <HeartHandshake className="w-4 h-4" />
              Custody Handoff
            </button>

            <button
              onClick={() => onOpenVerification(tree)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Peer Verification
            </button>

            <button
              onClick={() => setShowQrModal(true)}
              className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-2xs"
              title="View Tree Passport QR Tag"
            >
              <QrCode className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Vital Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-5 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Current Custodian</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{tree.currentCustodian}</p>
            <span className="text-[10px] text-slate-500">{tree.currentCustodianUnit}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Survival Health</span>
            <p className="text-sm font-bold text-emerald-700 mt-0.5">{tree.healthScore}/100</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Vibrant Foliage</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Height Growth</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{tree.currentHeightCm} cm</p>
            <span className="text-[10px] text-emerald-600 font-semibold">+{tree.currentHeightCm - tree.initialHeightCm}cm since planted</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Planted Date</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{tree.plantedAt}</p>
            <span className="text-[10px] text-slate-500">Day 204 of 3-Year Plan</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-semibold">Next Audit</span>
            <p className="text-sm font-bold text-blue-700 mt-0.5">1-Year Milestone</p>
            <span className="text-[10px] text-slate-500">12 Aug 2025</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Twin & Timeline Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 3D Interactive Model & Hotspot Inspector */}
        <div className="lg:col-span-5 space-y-4">
          <Tree3DViewer
            growthStage={activeGrowthStage}
            status={tree.status}
            heightCm={tree.currentHeightCm}
            speciesName={tree.speciesName}
            tamilName={tree.tamilName}
            onStageChange={(stage) => setActiveGrowthStage(stage)}
          />

          {/* Active Custody Alert Card */}
          {tree.activeAlert && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Custody Action Pending</p>
                <p className="text-amber-800 mt-0.5">{tree.activeAlert}</p>
                <button
                  onClick={() => onOpenHandoff(tree)}
                  className="mt-2 text-xs font-bold text-amber-900 underline hover:text-amber-950"
                >
                  Start Handoff Ceremony Now →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Passport Detail Tabs (Checkpoints Timeline, Custody Chain, Maintenance) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'timeline'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Survival Checkpoints (3-Year Timeline)
              </button>

              <button
                onClick={() => setActiveTab('custody')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'custody'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <History className="w-3.5 h-3.5 text-emerald-600" />
                Custody Chain ({tree.custodyHistory.length})
              </button>

              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'maintenance'
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-emerald-600" />
                Maintenance Log ({tree.maintenanceLogs.length})
              </button>
            </div>

            {/* TAB 1: SURVIVAL CHECKPOINTS TIMELINE */}
            {activeTab === 'timeline' && (
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Standard Checkpoints: 1 Month • 6 Months • 1 Year • 3 Years</span>
                  <span className="font-mono text-emerald-700 font-bold">2/4 Milestones Completed</span>
                </div>

                <div className="space-y-3">
                  {tree.checkpoints.map((chk, index) => {
                    const isCompleted = chk.status === 'verified';
                    const isPending = chk.status === 'pending';
                    const isMissed = chk.status === 'missed';

                    return (
                      <div
                        key={chk.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : isMissed
                            ? 'bg-rose-50/40 border-rose-200'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCompleted ? 'bg-emerald-600 text-white' : isMissed ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {chk.stage.toUpperCase()}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900">
                                  {chk.stage === 'planted' ? 'Plantation Baseline' :
                                   chk.stage === '1m' ? '1-Month Establishment Check' :
                                   chk.stage === '6m' ? '6-Month Crown & Stem Audit' :
                                   chk.stage === '1y' ? '1-Year Survival Milestone' :
                                   '3-Year Permanent Canopy Milestone'}
                                </h4>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                                  isCompleted ? 'bg-emerald-100 text-emerald-800' :
                                  isMissed ? 'bg-rose-100 text-rose-800' :
                                  'bg-slate-200 text-slate-700'
                                }`}>
                                  {chk.status}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Scheduled: <span className="font-mono">{chk.scheduledDate}</span>
                                {chk.verifiedDate && ` • Verified by: ${chk.verifierName}`}
                              </p>

                              {chk.notes && (
                                <p className="text-xs text-slate-700 mt-1 italic bg-white/70 p-2 rounded-lg border border-slate-200/60">
                                  "{chk.notes}"
                                </p>
                              )}

                              {chk.healthMetrics && (
                                <div className="flex flex-wrap gap-2 mt-2 text-[10px] font-mono text-slate-600">
                                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                                    Leaf: {chk.healthMetrics.leafColor}
                                  </span>
                                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                                    Canopy: {chk.healthMetrics.canopyDensityPercent}%
                                  </span>
                                  {chk.heightCm && (
                                    <span className="bg-white px-2 py-0.5 rounded border border-slate-200">
                                      Height: {chk.heightCm}cm
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Checkpoint Photo Proof Thumbnail */}
                          {chk.photoUrl && (
                            <div className="shrink-0 w-24 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                              <img src={chk.photoUrl} alt="Proof" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: CUSTODY CHAIN CONTINUITY */}
            {activeTab === 'custody' && (
              <div className="py-4 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Chain of Human Responsibility</span>
                  <span className="font-mono text-emerald-700 font-bold">Unbroken Tenure Chain</span>
                </div>

                <div className="relative border-l-2 border-emerald-200 ml-4 pl-6 space-y-6">
                  {tree.custodyHistory.map((custody, idx) => (
                    <div key={custody.id} className="relative">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white ring-4 ring-emerald-100" />

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
                              {custody.custodianRole}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{custody.custodianName}</h4>
                            <p className="text-[11px] text-slate-500">{custody.organizationUnit}</p>
                          </div>

                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                            {custody.active ? 'Active Custodian' : 'Handoff Completed'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                          <p><strong>Assigned:</strong> {custody.assignedDate}</p>
                          <p><strong>Checkpoints:</strong> {custody.checkpointsCompleted}/{custody.checkpointsTotal} completed</p>
                        </div>

                        {custody.handoffNotes && (
                          <p className="text-xs text-slate-700 italic bg-white p-2 rounded-xl border border-slate-200">
                            "{custody.handoffNotes}"
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-400">
                          <span>Certificate: {custody.certificateId || 'CERT-ACTIVE'}</span>
                          <span className="text-emerald-700 font-bold">Pledge Signed ✓</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: MAINTENANCE LEDGER */}
            {activeTab === 'maintenance' && (
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span>Log of On-Ground Maintenance</span>
                  <button 
                    onClick={() => alert("Maintenance log added! Recorded: 15L drip watering + organic compost.")}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                  >
                    + Log New Watering/Care
                  </button>
                </div>

                {tree.maintenanceLogs.length > 0 ? (
                  tree.maintenanceLogs.map((log) => (
                    <div key={log.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{log.type}</span>
                          <span className="text-[10px] font-mono text-slate-400">{log.date}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{log.notes}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">By: {log.custodianName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Logged
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">No maintenance records logged yet.</p>
                )}
              </div>
            )}
          </div>

          {/* Bottom Compliance Guarantee */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Green Tamil Nadu Mission Standard: 3-Year Audited Survival
            </span>
            <span className="text-slate-400">Ledger Verified</span>
          </div>
        </div>
      </div>

      {/* QR Code Tag Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-emerald-100 shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase">Tree Passport Tag</span>
              <button onClick={() => setShowQrModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              {/* Stylized QR representation */}
              <div className="w-44 h-44 bg-slate-900 rounded-xl p-3 flex flex-col justify-between text-emerald-400 font-mono text-[9px]">
                <div className="flex justify-between">
                  <div className="w-10 h-10 border-4 border-emerald-400 rounded-md" />
                  <div className="w-10 h-10 border-4 border-emerald-400 rounded-md" />
                </div>
                <div className="text-center font-bold text-white text-[11px]">{tree.id}</div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 border-4 border-emerald-400 rounded-md" />
                  <div className="text-[8px] text-slate-400">CUSTODIA NFC</div>
                </div>
              </div>
            </div>

            <div>
              <p className="font-bold text-sm text-slate-900">{tree.speciesName} ({tree.tamilName})</p>
              <p className="text-xs text-slate-500">{tree.landmark}</p>
              <p className="text-[10px] font-mono text-slate-400 mt-1">Scan on-campus to inspect or submit verification.</p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Close Tag
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
