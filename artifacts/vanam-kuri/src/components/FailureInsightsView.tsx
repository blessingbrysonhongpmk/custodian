import React from 'react';
import { failureCausesStats } from '../data/mockData';
import { Tree } from '../types/custodia';
import { 
  AlertOctagon, 
  Droplets, 
  ShieldAlert, 
  UserX, 
  Bug, 
  Lightbulb, 
  BarChart3, 
  TrendingDown, 
  MapPin, 
  ArrowRight,
  Eye
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
  const failedTrees = trees.filter(t => t.status === 'failed' || t.failureAutopsy);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-900 border border-rose-200">
              Mortality Intelligence Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">“Why Trees Fail”</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 mt-1">
            Failure Autopsy & Systemic Insights
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Turn tree mortality data into systemic planning intelligence. Prevent repeated mistakes in upcoming plantation drives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-[10px] font-mono text-rose-800 uppercase font-bold">Total Autopsies</span>
            <p className="text-xl font-extrabold text-rose-900 font-mono">80 Failed Trees</p>
          </div>
        </div>
      </div>

      {/* Main Cause Breakdown & Hotspot Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cause Percentage Bars */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Root-Cause Analysis</span>
              <h3 className="text-base font-bold text-slate-900">Distribution of Mortality Factors</h3>
            </div>
            <span className="text-xs font-mono text-slate-500">Pilot Campus Sample</span>
          </div>

          <div className="space-y-3.5 pt-2">
            {failureCausesStats.map((item) => (
              <div key={item.cause} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{item.cause}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-500 text-[11px]">{item.count} trees</span>
                    <span className="font-bold text-slate-900">{item.percentage}%</span>
                  </div>
                </div>

                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${item.percentage}%`, backgroundColor: item.color }} 
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{item.classification}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Systemic Actionable Takeaways */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 via-white to-amber-50/60 rounded-3xl border border-amber-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Lightbulb className="w-5 h-5 text-amber-600" />
              Key Systemic Findings for Next Drive
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                <p className="font-bold text-rose-900">🚨 Zone B Irrigation Deficit (42%)</p>
                <p className="text-slate-600 text-[11px]">
                  Water shortages in Zone B (Kaveri East) accounted for almost half of all failures due to broken trench canal and manual hose delays.
                </p>
                <span className="text-[10px] font-bold text-emerald-700 block mt-1">
                  Recommendation: Install solar drip lines before monsoon end.
                </span>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                <p className="font-bold text-amber-900">🐄 Boundary Fence Breaches (25%)</p>
                <p className="text-slate-600 text-[11px]">
                  Stray cattle from neighboring village grazed saplings lacking heavy gauge iron tree guards.
                </p>
                <span className="text-[10px] font-bold text-emerald-700 block mt-1">
                  Recommendation: Mandate 1.8m steel cages for all perimeter zones.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200 text-xs font-mono text-amber-900 flex items-center justify-between">
            <span>Autopsy Classification:</span>
            <span className="font-bold">67% Systemic • 33% Custodial</span>
          </div>
        </div>
      </div>

      {/* Failed Tree Case Studies / Autopsy Records */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">
              Detailed Tree Mortality Autopsy Records
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Showing investigated records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {failedTrees.map((tree) => {
            const autopsy = tree.failureAutopsy;
            if (!autopsy) return null;

            return (
              <div 
                key={tree.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-rose-300 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {tree.id}
                      </span>
                      <span className="text-xs font-bold text-rose-700">
                        {autopsy.primaryCause}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium mt-1">
                      {tree.speciesName} ({tree.tamilName}) • {tree.zone}
                    </p>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                    {autopsy.classification}
                  </span>
                </div>

                <div className="text-xs space-y-1 text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                  <p className="italic">"{autopsy.autopsyNotes}"</p>
                  <p className="text-emerald-700 font-semibold pt-1">
                    Lesson: {autopsy.preventiveLesson}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Audited: {autopsy.recordedDate}
                  </span>
                  <button
                    onClick={() => onOpenAutopsyModal(tree)}
                    className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center gap-1"
                  >
                    View Autopsy Record
                    <ArrowRight className="w-3 h-3" />
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
