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
  const [activeTab, setActiveTab] = useState<'timeline' | 'custody' | 'maintenance'>('timeline');
  const [activeGrowthStage, setActiveGrowthStage] = useState<1 | 2 | 3 | 4 | 5>(tree.growthStage);
  const [showQrModal, setShowQrModal] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-serif text-slate-900 tracking-tight">Tree Passport</h1>
        <p className="text-sm text-slate-500 mt-1">Every tree has an identity, history, and accountable caretaker.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Primary Identity & 3D Viewer */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                    {tree.id}
                  </span>
                  {tree.isPilotTree && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                      Pilot Reference
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {tree.speciesName}
                </h2>
                <p className="text-sm text-emerald-700 font-serif italic">
                  {tree.tamilName} • {tree.botanicalName}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-light text-emerald-600">{tree.healthScore}</span>
                <span className="text-xs font-medium text-slate-500">Health Score</span>
              </div>
            </div>

            <div className="relative mb-5">
              <Tree3DViewer
                growthStage={activeGrowthStage}
                status={tree.status}
                heightCm={tree.currentHeightCm}
                speciesName={tree.speciesName}
                tamilName={tree.tamilName}
                onStageChange={(stage) => setActiveGrowthStage(stage)}
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button
                onClick={() => onOpenHandoff(tree)}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <HeartHandshake className="w-4 h-4" />
                Handoff
              </button>
              <button
                onClick={() => onOpenVerification(tree)}
                className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                Verify
              </button>
            </div>
            
            {tree.activeAlert && (
              <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-900">Action Required</p>
                  <p className="text-xs text-amber-800 mt-1">{tree.activeAlert}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Details & Custody Timeline */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Metadata Grid */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-6 hover:-translate-y-1 transition-transform duration-300">
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">Planting Date</span>
              <span className="block text-sm font-bold text-slate-900">{tree.plantedAt}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="block text-xs font-medium text-slate-500 mb-1">Location</span>
              <span className="block text-sm font-bold text-slate-900">{tree.landmark}</span>
              <span className="block text-xs text-slate-500 mt-0.5">{tree.coordinates[0].toFixed(3)}°, {tree.coordinates[1].toFixed(3)}°</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">Custodian</span>
              <span className="block text-sm font-bold text-slate-900">{tree.currentCustodian}</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-1">Institution</span>
              <span className="block text-sm font-bold text-slate-900">{tree.currentCustodianUnit}</span>
            </div>
          </div>

          {/* Timeline & History */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1 hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4 mb-6">
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                  activeTab === 'timeline' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Verification History
              </button>
              <button
                onClick={() => setActiveTab('custody')}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                  activeTab === 'custody' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Custody Timeline
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-4 py-2.5 rounded-2xl text-sm font-medium transition-colors ${
                  activeTab === 'maintenance' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                Maintenance Log
              </button>
            </div>

            {/* TAB 1: Verification History */}
            {activeTab === 'timeline' && (
              <div className="space-y-8">
                {tree.checkpoints.map((chk, index) => {
                  const isCompleted = chk.status === 'verified';
                  const isMissed = chk.status === 'missed';

                  return (
                    <div key={chk.id} className="relative flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`w-4 h-4 rounded-full z-10 flex items-center justify-center border-2 border-white shadow-sm ${
                          isCompleted ? 'bg-emerald-500 ring-4 ring-emerald-50' : isMissed ? 'bg-rose-500 ring-4 ring-rose-50' : 'bg-slate-200 ring-4 ring-slate-50'
                        }`} />
                        {index < tree.checkpoints.length - 1 && (
                          <div className="w-0.5 h-full bg-slate-100 my-2" />
                        )}
                      </div>

                      <div className={`flex-1 pb-2 ${index === tree.checkpoints.length - 1 ? 'pb-0' : ''}`}>
                        <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h4 className="text-base font-bold text-slate-900">
                                {chk.stage === 'planted' ? 'Plantation Baseline' :
                                 chk.stage === '1m' ? '1-Month Establishment' :
                                 chk.stage === '6m' ? '6-Month Audit' :
                                 chk.stage === '1y' ? '1-Year Milestone' :
                                 '3-Year Canopy Milestone'}
                              </h4>
                              {isCompleted && (
                                <span className="flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wide">
                                  <Sparkles className="w-3 h-3" />
                                  AI Verified
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-500 mb-3">
                              {chk.scheduledDate} {chk.verifiedDate && `• Verified by ${chk.verifierName}`}
                            </p>

                            {chk.healthMetrics && (
                              <div className="flex flex-wrap gap-2">
                                <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">Leaf: {chk.healthMetrics.leafColor}</span>
                                <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">Canopy: {chk.healthMetrics.canopyDensityPercent}%</span>
                                {chk.heightCm && <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1.5 rounded-xl">Height: {chk.heightCm}cm</span>}
                              </div>
                            )}
                          </div>
                          
                          {chk.photoUrl && (
                            <div className="shrink-0 w-32 h-24 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                              <img src={chk.photoUrl} alt="Verification" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: CUSTODY TIMELINE */}
            {activeTab === 'custody' && (
              <div className="space-y-8">
                {tree.custodyHistory.map((custody, index) => (
                  <div key={custody.id} className="relative flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full z-10 flex items-center justify-center border-2 border-white shadow-sm ${
                        custody.active ? 'bg-emerald-500 ring-4 ring-emerald-50' : 'bg-slate-300 ring-4 ring-slate-50'
                      }`} />
                      {index < tree.custodyHistory.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-100 my-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-base font-bold text-slate-900">{custody.custodianName}</h4>
                        {custody.active && <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase tracking-wide">Active Custodian</span>}
                      </div>
                      <p className="text-sm text-slate-500 mb-3">{custody.organizationUnit}</p>
                      <div className="flex gap-4 text-sm font-medium text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <span>Assigned: <span className="text-slate-900">{custody.assignedDate}</span></span>
                        <span>Completed: <span className="text-slate-900">{custody.checkpointsCompleted}/{custody.checkpointsTotal}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: MAINTENANCE LOG */}
            {activeTab === 'maintenance' && (
              <div className="space-y-4">
                <div className="flex justify-end mb-2">
                  <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    + Log Maintenance
                  </button>
                </div>
                {tree.maintenanceLogs.length > 0 ? (
                  tree.maintenanceLogs.map((log) => (
                    <div key={log.id} className="p-5 rounded-3xl bg-slate-50 border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-base font-bold text-slate-900">{log.type}</span>
                        <span className="text-sm text-slate-500">{log.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{log.notes}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                          {log.custodianName.substring(0, 2).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-slate-500">Logged by {log.custodianName}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 text-center py-8">No maintenance records logged yet.</p>
                )}
              </div>
            )}
          </div>

          <div className="text-center text-xs text-slate-400 mt-2">
            Verified digitally immutable on the TreeGuard network
          </div>
        </div>
      </div>
    </div>
  );
};
