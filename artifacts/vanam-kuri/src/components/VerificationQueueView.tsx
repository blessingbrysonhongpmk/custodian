import React from 'react';
import { Tree } from '../types/custodia';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  MapPin, 
  Eye, 
  Camera, 
  AlertTriangle,
  FileCheck2,
  Clock,
  ArrowRight,
  User,
  CheckCircle2
} from 'lucide-react';

interface VerificationQueueViewProps {
  trees: Tree[];
  onOpenTree: (treeId: string) => void;
  onOpenVerification: (tree: Tree) => void;
}

export const VerificationQueueView: React.FC<VerificationQueueViewProps> = ({
  trees,
  onOpenTree,
  onOpenVerification,
}) => {
  const { t } = useTranslation();
  // Use trees that have pending checkpoints, or if demo has none, grab the pilot tree to show
  const pendingVerifications = trees.filter(t => 
    t.checkpoints.some(c => c.status === 'pending') || t.isPilotTree
  );

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Peer Verifier
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Verification Queue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md">
              Review custodian evidence against reference landmarks to ensure custody continuity.
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-center">
            <div className="bg-slate-50 px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-3xl font-black text-slate-900">{pendingVerifications.length}</span>
              <span className="block text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-widest">{t('verification.pending')}</span>
            </div>
            <div className="bg-emerald-50 px-5 py-3.5 rounded-2xl border border-emerald-100 shadow-sm">
              <span className="text-3xl font-black text-emerald-700">14</span>
              <span className="block text-[10px] font-bold text-emerald-600 mt-0.5 uppercase tracking-widest">{t('verification.verifiedToday')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-6">
        {pendingVerifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-xl text-slate-900 font-bold mb-1">{t('verification.inboxZero')}</h3>
            <p className="text-slate-500 text-sm">{t('verification.inboxZeroSub')}</p>
          </div>
        ) : (
          pendingVerifications.map((tree) => (
            <div key={tree.id} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row gap-8">
              
              {/* Tree Identity & Comparison */}
              <div className="lg:w-5/12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md tracking-wider">
                      {tree.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      6-Month Audit
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">{tree.speciesName}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mb-6">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {tree.landmark}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{t('verification.baseline')}</span>
                    <div className="h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={tree.initialPhotoUrl} alt="Baseline" className="w-full h-full object-cover grayscale opacity-80" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700">{t('verification.submission')}</span>
                    <div className="h-32 rounded-2xl overflow-hidden border-2 border-emerald-200 bg-slate-50 shadow-sm relative">
                      <img src={tree.currentPhotoUrl} alt="Latest" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-md p-1.5">
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <User className="w-4 h-4 text-slate-400" />
                    Custodian: <strong className="text-slate-900">{tree.currentCustodian}</strong>
                  </div>
                  <button
                    onClick={() => onOpenTree(tree.id)}
                    className="text-emerald-700 font-bold hover:text-emerald-800 flex items-center gap-1 transition-colors"
                  >
                    Passport <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Pre-Screening & Actions */}
              <div className="lg:w-7/12 flex flex-col justify-between">
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-inner h-full flex flex-col">
                  
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                      Automated Pre-check
                    </span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
                      Review Required
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                    The submitted photo matches the {tree.speciesName} profile with healthy foliage. However, GPS coordinates indicate a <strong className="text-amber-700">42m offset</strong> from the original plantation location.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase">Canopy</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Pass</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600 uppercase">Species Match</span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Pass</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-between col-span-2">
                      <span className="text-xs font-bold text-slate-600 uppercase">Location Match</span>
                      <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Flagged Offset
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button
                      onClick={() => alert('Flagged for Custodian to retake photo at correct location.')}
                      className="py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Flag & Reject
                    </button>
                    <button
                      onClick={() => onOpenVerification(tree)}
                      className="py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4" />
                      Review & Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
