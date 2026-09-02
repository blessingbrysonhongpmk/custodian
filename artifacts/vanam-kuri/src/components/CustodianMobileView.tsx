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
  Plus
} from 'lucide-react';

interface CustodianMobileViewProps {
  trees: Tree[];
  onOpenTree: (treeId: string) => void;
  onOpenHandoff: (tree: Tree) => void;
  onOpenVerification: (tree: Tree) => void;
}

export const CustodianMobileView: React.FC<CustodianMobileViewProps> = ({
  trees,
  onOpenTree,
  onOpenHandoff,
  onOpenVerification,
}) => {
  const [quickUpdateSuccess, setQuickUpdateSuccess] = useState<string | null>(null);

  // Simulated logged-in custodian: Arun K. (responsible for Pilot Tree) + sample assigned trees
  const arunTrees = trees.filter(t => t.currentCustodian.includes('Arun') || t.isPilotTree);

  const handleQuickWaterLog = (treeId: string) => {
    setQuickUpdateSuccess(treeId);
    setTimeout(() => {
      setQuickUpdateSuccess(null);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in">
      {/* Mobile Shell Card */}
      <div className="bg-gradient-to-b from-emerald-50 via-white to-slate-50 rounded-3xl border border-emerald-200 p-6 shadow-sm space-y-5">
        {/* Custodian Profile Banner */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              AK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Arun K.</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Lead Custodian
                </span>
              </div>
              <p className="text-xs text-slate-500">NSS Unit 4 • 3rd Year B.Sc</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Trust Score</span>
            <p className="text-lg font-extrabold text-emerald-700 font-mono">98%</p>
          </div>
        </div>

        {/* Graduation Handoff Reminder Banner */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 text-xs text-amber-950 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <Clock className="w-4 h-4 text-amber-600" />
              Graduation Responsibility Notice
            </p>
            <p className="text-slate-700 text-[11px]">
              Your academic tenure ends in 14 days. Hand off your assigned trees to ensure zero orphaned trees.
            </p>
          </div>
          {arunTrees.length > 0 && (
            <button
              onClick={() => onOpenHandoff(arunTrees[0])}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shrink-0 transition-colors shadow-2xs"
            >
              Start Handoff
            </button>
          )}
        </div>

        {/* Assigned Trees List ("My Trees") */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
              My Assigned Trees ({arunTrees.length})
            </h3>
            <span className="text-[11px] font-mono text-emerald-700">All Checkpoints Up to Date</span>
          </div>

          {arunTrees.map((tree) => (
            <div
              key={tree.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <img
                    src={tree.currentPhotoUrl}
                    alt={tree.speciesName}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{tree.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Health: {tree.healthScore}/100
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                      {tree.speciesName} <span className="text-emerald-700 font-serif font-normal text-xs">({tree.tamilName})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {tree.landmark}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Action Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => handleQuickWaterLog(tree.id)}
                  className="py-2 px-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 text-center font-bold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px]">Log Water</span>
                </button>

                <button
                  onClick={() => onOpenVerification(tree)}
                  className="py-2 px-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 text-center font-bold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span className="text-[10px]">Photo Audit</span>
                </button>

                <button
                  onClick={() => onOpenHandoff(tree)}
                  className="py-2 px-2 rounded-xl bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 text-center font-bold flex flex-col items-center justify-center gap-1 transition-colors"
                >
                  <HeartHandshake className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px]">Handoff</span>
                </button>
              </div>

              {quickUpdateSuccess === tree.id && (
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-semibold text-center animate-fade-in flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Hydration & Soil Maintenance logged to Tree Passport!
                </div>
              )}

              <button
                onClick={() => onOpenTree(tree.id)}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Open Full 3D Passport
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
