import React, { useState } from 'react';
import { RiskItem, Tree } from '../types/custodia';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Filter, 
  Search, 
  Droplets, 
  HeartHandshake, 
  CheckCircle2, 
  UserPlus, 
  Eye, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  AlertOctagon
} from 'lucide-react';

interface RiskCenterViewProps {
  riskItems: RiskItem[];
  trees: Tree[];
  onOpenTree: (treeId: string) => void;
  onOpenHandoff: (tree: Tree) => void;
  onOpenVerification: (tree: Tree) => void;
  onOpenAutopsy: (tree: Tree) => void;
}

export const RiskCenterView: React.FC<RiskCenterViewProps> = ({
  riskItems,
  trees,
  onOpenTree,
  onOpenHandoff,
  onOpenVerification,
  onOpenAutopsy,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredRisks = riskItems.filter((item) => {
    const matchesSeverity = filterSeverity === 'ALL' || item.severity === filterSeverity;
    const matchesSearch = 
      item.treeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.treeSpecies.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-amber-100 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
              Survival Risk & Escalation Engine
            </span>
            <span className="text-xs text-slate-500 font-mono">Triage Queue</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 mt-1">
            Active Survival Risk Center
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Identify stressed trees, orphaned saplings, and evidence anomalies before permanent tree mortality occurs.
          </p>
        </div>

        {/* Action summary badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span className="text-[10px] font-mono text-amber-800 uppercase font-bold">Total In Queue</span>
            <p className="text-xl font-extrabold text-amber-900 font-mono">{riskItems.length}</p>
          </div>
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-[10px] font-mono text-rose-800 uppercase font-bold">High Severity</span>
            <p className="text-xl font-extrabold text-rose-900 font-mono">
              {riskItems.filter(r => r.severity === 'high').length}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Tree ID, Zone, Issue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-60"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['ALL', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg font-medium capitalize transition-colors ${
                  filterSeverity === sev
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sev === 'ALL' ? 'All Severities' : `${sev} Severity`}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-slate-500">
          Showing {filteredRisks.length} of {riskItems.length} risk items
        </span>
      </div>

      {/* Risk Queue Table / Cards */}
      <div className="space-y-3">
        {filteredRisks.map((risk) => {
          const associatedTree = trees.find(t => t.id === risk.treeId) || trees[0];

          return (
            <div
              key={risk.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-900 text-white">
                    {risk.treeId}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    risk.severity === 'high' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    risk.severity === 'medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-800 border border-slate-200'
                  }`}>
                    {risk.severity} Priority
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">{risk.zone} • {risk.landmark}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900">{risk.title}</h3>
                <p className="text-xs text-slate-600 max-w-2xl">{risk.reason}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1 font-mono">
                  <span>Custodian: <strong>{risk.custodianName}</strong></span>
                  {risk.daysOverdue > 0 && (
                    <span className="text-rose-700 font-bold">Overdue: {risk.daysOverdue} days</span>
                  )}
                  <span className="text-emerald-700">Directive: {risk.actionRequired}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => onOpenTree(risk.treeId)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Passport
                </button>

                {risk.suggestedActionType === 'REASSIGN' && (
                  <button
                    onClick={() => onOpenHandoff(associatedTree)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    Reassign Custody
                  </button>
                )}

                {risk.suggestedActionType === 'VERIFY' || risk.suggestedActionType === 'INSPECT' ? (
                  <button
                    onClick={() => onOpenVerification(associatedTree)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verify Now
                  </button>
                ) : null}

                {risk.suggestedActionType === 'WATER_EMERGENCY' && (
                  <button
                    onClick={() => alert(`Emergency hydration dispatch sent to grounds team for Tree ${risk.treeId} at ${risk.landmark}!`)}
                    className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    Dispatch Water Care
                  </button>
                )}

                {risk.suggestedActionType === 'AUTOPSY' && (
                  <button
                    onClick={() => onOpenAutopsy(associatedTree)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <AlertOctagon className="w-3.5 h-3.5" />
                    View Autopsy
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
