import React from 'react';
import { useTranslation } from 'react-i18next';
import { failureCausesStats } from '../data/mockData';
import { Tree } from '../types/custodia';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  AlertOctagon, 
  Lightbulb, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

interface FailureInsightsViewProps {
  trees: Tree[];
  onOpenTree: (treeId: string) => void;
  onOpenAutopsyModal: (tree: Tree) => void;
}

export const FailureInsightsView: React.FC<FailureInsightsViewProps> = ({
  trees,
  onOpenTree,
  onOpenAutopsyModal,
}) => {
  const { t } = useTranslation();
  const failedTrees = trees.filter(t => t.status === 'failed' || t.failureAutopsy);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-slate-900 tracking-tight">{t('failureInsights.title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('failureInsights.subtitle')}</p>
      </div>

      {/* Top Urgent Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Metric Card */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
          <div className="relative z-10 text-center lg:text-left">
            <span className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 block">{t('failureInsights.totalAutopsies')}</span>
            <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
              80 <span className="text-xl text-slate-500 font-medium tracking-normal">{t('failureInsights.trees')}</span>
            </h2>
            <p className="text-slate-500 text-sm">
              {t('failureInsights.analyzedFailures')}
            </p>
          </div>
        </div>

        {/* {t('failureInsights.systemicTakeaways')} */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-800 flex flex-col justify-center text-white relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Lightbulb className="w-48 h-48" />
          </div>
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
              <Lightbulb className="w-5 h-5" />
              {t('failureInsights.keyFindings')}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div className="space-y-1 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                <p className="font-bold text-amber-300">🚨 Zone B Irrigation Deficit</p>
                <p className="text-slate-300 text-xs">
                  Water shortages in Kaveri East accounted for 42% of failures.
                </p>
                <span className="text-[10px] font-bold text-emerald-400 block mt-2 uppercase tracking-wider">
                  Recommendation: Solar Drip Lines
                </span>
              </div>
              <div className="space-y-1 bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                <p className="font-bold text-rose-300">🐄 Fence Breaches</p>
                <p className="text-slate-300 text-xs">
                  Stray cattle grazing accounted for 25% of perimeter failures.
                </p>
                <span className="text-[10px] font-bold text-emerald-400 block mt-2 uppercase tracking-wider">
                  Recommendation: 1.8m Steel Cages
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cause Breakdown Chart */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">{t('failureInsights.distribution')}</h3>
            <span className="text-sm text-slate-500">{t('failureInsights.rootCause')}</span>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={failureCausesStats}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis 
                dataKey="cause" 
                type="category" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                width={150}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
              />
              <Bar dataKey="percentage" radius={[0, 8, 8, 0]} barSize={24}>
                {failureCausesStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Failed Tree Case Studies / Autopsy Records */}
      <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-500" />
              {t('failureInsights.detailedRecords')}
            </h3>
            <p className="text-sm text-slate-500 mt-1">{t('failureInsights.investigatedCases')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {failedTrees.map((tree) => {
            const autopsy = tree.failureAutopsy;
            if (!autopsy) return null;

            return (
              <div 
                key={tree.id}
                className="p-5 rounded-3xl bg-slate-50 border border-slate-100 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-slate-900">
                          {tree.id}
                        </span>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full">
                          {autopsy.primaryCause}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {tree.speciesName} • {tree.zone}
                      </p>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-slate-200 text-slate-700 uppercase tracking-wide">
                      {autopsy.classification}
                    </span>
                  </div>

                  <div className="text-sm text-slate-700 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-4">
                    <p className="italic mb-2">"{autopsy.autopsyNotes}"</p>
                    <div className="flex items-start gap-2 pt-2 border-t border-slate-50">
                      <Info className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <p className="text-emerald-800 font-medium text-xs">
                        {autopsy.preventiveLesson}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                    {t('failureInsights.audited')}: {autopsy.recordedDate}
                  </span>
                  <button
                    onClick={() => onOpenAutopsyModal(tree)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors"
                  >
                    {t('failureInsights.viewFullRecord')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
