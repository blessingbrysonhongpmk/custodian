import React from 'react';
import { useProgramHealth } from '../context/ProgramHealthContext';
import { useTranslation } from 'react-i18next';
import { Leaf, Droplets, Users, Camera } from 'lucide-react';

export const ThulirWidget: React.FC = () => {
  const { healthData } = useProgramHealth();
  const { t } = useTranslation();

  const getStatusInfo = () => {
    switch (healthData.state) {
      case 'thriving': return { label: 'Thriving', color: 'text-green-700', bg: 'bg-green-50 border-green-200' };
      case 'healthy': return { label: 'Healthy', color: 'text-green-700', bg: 'bg-green-50 border-green-200' };
      case 'attention': return { label: 'Needs Attention', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' };
      case 'at_risk': return { label: 'At Risk', color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
      case 'critical': return { label: 'Critical', color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
      default: return { label: 'Active', color: 'text-green-700', bg: 'bg-green-50 border-green-200' };
    }
  };

  const status = getStatusInfo();

  const metrics = [
    { icon: Leaf, label: 'Tree Health', value: healthData.treeHealthPercent, color: 'text-green-700' },
    { icon: Droplets, label: 'Verified', value: healthData.verificationRate, color: 'text-blue-700' },
    { icon: Users, label: 'Caretakers', value: healthData.custodyStability, color: 'text-emerald-700' },
    { icon: Camera, label: 'Photo Checks', value: healthData.checkpointCompletion, color: 'text-amber-700' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Score + Status */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#006A4E] text-white flex flex-col items-center justify-center shrink-0">
            <span className="text-xl font-bold leading-none">{healthData.score}</span>
            <span className="text-[9px] font-medium text-green-200 mt-0.5">/ 100</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{t('dashboard.programHealth')}</h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">
              {t(`dashboard.thulirMessages.${healthData.messageKey}`)}
            </p>
          </div>
        </div>

        {/* Right: 4 Metrics */}
        <div className="flex items-center gap-3 sm:gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.label} className="text-center">
                <div className={`flex items-center justify-center gap-1 mb-1 ${m.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-lg font-bold text-slate-900 block">{m.value}%</span>
                <span className="text-[10px] text-slate-500 font-medium">{m.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
