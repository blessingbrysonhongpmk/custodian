import React from 'react';
import { useProgramHealth } from '../context/ProgramHealthContext';
import { useTranslation } from 'react-i18next';
import { Leaf, AlertTriangle, ShieldCheck, HeartPulse, Activity } from 'lucide-react';

export const ThulirWidget: React.FC = () => {
  const { healthData } = useProgramHealth();
  const { t } = useTranslation();

  // Helper to map state to colors
  const getStateColors = () => {
    switch (healthData.state) {
      case 'thriving': return 'from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800';
      case 'healthy': return 'from-green-50 to-green-100 border-green-200 text-green-800';
      case 'attention': return 'from-amber-50 to-amber-100 border-amber-200 text-amber-800';
      case 'at_risk': return 'from-orange-50 to-orange-100 border-orange-200 text-orange-800';
      case 'critical': return 'from-red-50 to-red-100 border-red-200 text-red-800';
      default: return 'from-slate-50 to-slate-100 border-slate-200 text-slate-800';
    }
  };

  const getMascotIcon = () => {
    switch (healthData.state) {
      case 'thriving': return <Leaf className="w-12 h-12 text-emerald-500 animate-pulse" />;
      case 'healthy': return <Leaf className="w-12 h-12 text-green-500" />;
      case 'attention': return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      case 'at_risk': return <Activity className="w-12 h-12 text-orange-500" />;
      case 'critical': return <HeartPulse className="w-12 h-12 text-red-500 animate-pulse" />;
      default: return <Leaf className="w-12 h-12 text-slate-500" />;
    }
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border bg-gradient-to-br shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start ${getStateColors()}`}>
      {/* Mascot Placeholder */}
      <div className="w-32 h-32 shrink-0 bg-white/50 backdrop-blur-md rounded-2xl border border-white/40 shadow-sm flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for 3D Thulir Asset */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent z-0" />
        <div className="relative z-10 flex flex-col items-center gap-2">
          {getMascotIcon()}
          <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Thulir</span>
        </div>
      </div>

      <div className="flex-1 space-y-4 text-center md:text-left">
        <div>
          <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
            <span className="text-sm font-bold uppercase tracking-widest opacity-80">
              {t('dashboard.programHealth')}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/60 text-xs font-black shadow-sm">
              {healthData.score} / 100
            </span>
          </div>
          <p className="text-lg md:text-xl font-medium leading-relaxed">
            “{t(`dashboard.thulirMessages.${healthData.messageKey}`)}”
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm">
            <span className="block text-xl font-black">{healthData.treeHealthPercent}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Tree Health</span>
          </div>
          <div className="bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm">
            <span className="block text-xl font-black">{healthData.verificationRate}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Verification</span>
          </div>
          <div className="bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm">
            <span className="block text-xl font-black">{healthData.custodyStability}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Custody</span>
          </div>
          <div className="bg-white/60 p-3 rounded-xl border border-white/40 shadow-sm">
            <span className="block text-xl font-black">{healthData.checkpointCompletion}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Checkpoints</span>
          </div>
        </div>

        <button className="mt-2 text-sm font-bold opacity-80 hover:opacity-100 flex items-center justify-center md:justify-start gap-1 transition-opacity">
          {t('dashboard.viewHealth')} →
        </button>
      </div>
    </div>
  );
};
