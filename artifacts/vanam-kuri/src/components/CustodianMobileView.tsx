import React, { useState } from 'react';
import { Tree } from '../types/custodia';
import { 
  Smartphone, 
  Sprout, 
  HeartHandshake, 
  Camera, 
  Droplets, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  Eye,
  Plus,
  TreePine,
  User
} from 'lucide-react';

interface CustodianMobileViewProps {
  trees: Tree[];
  onOpenTree: (treeId: string) => void;
  onOpenHandoff: (tree: Tree) => void;
  onOpenVerification: (tree: Tree) => void;
  simulatedCustodian?: string;
}

export const CustodianMobileView: React.FC<CustodianMobileViewProps> = ({
  trees,
  onOpenTree,
  onOpenHandoff,
  onOpenVerification,
  simulatedCustodian = "Arun K.",
}) => {
  const [quickUpdateSuccess, setQuickUpdateSuccess] = useState<string | null>(null);

  const arunTrees = trees.filter(t => 
    t.currentCustodian.includes(simulatedCustodian.split(' ')[0]) || 
    (simulatedCustodian === "Arun K." && t.isPilotTree)
  );

  const handleQuickWaterLog = (treeId: string) => {
    setQuickUpdateSuccess(treeId);
    setTimeout(() => {
      setQuickUpdateSuccess(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto animate-fade-in bg-slate-50 min-h-screen pb-24">
      {/* Sleek Profile Header */}
      <div className="bg-slate-900 text-white p-6 rounded-b-[2rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex items-center justify-between mt-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-800 border border-slate-700 text-emerald-400 flex items-center justify-center font-bold text-xl shadow-inner">
              {simulatedCustodian.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-400">Welcome back,</p>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {simulatedCustodian}
              </h2>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest block mb-0.5">Trust Score</span>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-bold text-white">98%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide relative z-10">
          <div className="shrink-0 w-32 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
            <TreePine className="w-5 h-5 text-emerald-400 mb-2" />
            <p className="text-2xl font-bold text-white">{arunTrees.length}</p>
            <p className="text-xs text-emerald-300 font-medium mt-1">Trees Assigned</p>
          </div>
          <div className="shrink-0 w-32 p-4 rounded-2xl bg-blue-500/20 border border-blue-500/30">
            <CheckCircle2 className="w-5 h-5 text-blue-400 mb-2" />
            <p className="text-2xl font-bold text-white">0</p>
            <p className="text-xs text-blue-300 font-medium mt-1">Pending Tasks</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Graduation Handoff Reminder Banner */}
        <div className="p-5 rounded-[1.5rem] bg-gradient-to-br from-amber-50 to-white border border-amber-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="font-bold text-amber-900 text-sm">Graduation Handoff Required</p>
              <p className="text-amber-800/80 text-xs mt-1 leading-relaxed">
                Your academic tenure ends in 14 days. Reassign your trees to a junior custodian.
              </p>
            </div>
          </div>
          {arunTrees.length > 0 && (
            <button
              onClick={() => onOpenHandoff(arunTrees[0])}
              className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-colors shadow-sm"
            >
              Start Handover Process
            </button>
          )}
        </div>

        {/* Assigned Trees List ("My Trees") */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TreePine className="w-4 h-4 text-emerald-600" /> My Trees
            </h3>
          </div>

          <div className="space-y-4">
            {arunTrees.map((tree) => (
              <div
                key={tree.id}
                className="p-5 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm space-y-4"
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={tree.currentPhotoUrl}
                      alt={tree.speciesName}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shadow-sm"
                    />
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-bold text-white leading-none">{tree.healthScore}</span>
                    </div>
                  </div>
                  <div className="pt-1 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono font-bold text-xs text-slate-400 uppercase tracking-wider">{tree.id}</span>
                      {tree.isPilotTree && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    </div>
                    <h4 className="text-base font-bold text-slate-900">
                      {tree.speciesName}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {tree.landmark}
                    </p>
                  </div>
                </div>

                {/* Quick Action Grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => handleQuickWaterLog(tree.id)}
                    className="py-3 px-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-center flex flex-col items-center justify-center gap-1.5 transition-colors"
                  >
                    <Droplets className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Water</span>
                  </button>

                  <button
                    onClick={() => onOpenVerification(tree)}
                    className="py-3 px-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-center flex flex-col items-center justify-center gap-1.5 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Photo</span>
                  </button>

                  <button
                    onClick={() => onOpenTree(tree.id)}
                    className="py-3 px-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-center flex flex-col items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Passport</span>
                  </button>
                </div>

                {quickUpdateSuccess === tree.id && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    Log synced to network ledger!
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
