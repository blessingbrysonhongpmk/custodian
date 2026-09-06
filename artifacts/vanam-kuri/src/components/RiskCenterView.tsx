import React, { useState, useMemo } from 'react';
import { RiskItem, Tree } from '../types/custodia';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Filter, 
  Search, 
  Droplets, 
  HeartHandshake, 
  CheckCircle2, 
  Eye, 
  AlertOctagon,
  Activity,
  ArrowRight
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
  const { t } = useTranslation();
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
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

  const severityData = useMemo(() => {
    const high = riskItems.filter(r => r.severity === 'high').length;
    const medium = riskItems.filter(r => r.severity === 'medium').length;
    const low = riskItems.filter(r => r.severity === 'low').length;
    return [
      { name: 'High Priority', value: high, color: '#f43f5e' }, // rose-500
      { name: 'Medium Priority', value: medium, color: '#f59e0b' }, // amber-500
      { name: 'Low Priority', value: low, color: '#94a3b8' } // slate-400
    ];
  }, [riskItems]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif text-slate-900 tracking-tight">{t('navigation.riskCenter')}</h1>
        <p className="text-sm text-slate-500 mt-1">Intervene before a tree loses its caretaker.</p>
      </div>

      {/* Top Urgent Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Large Urgent Summary Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-rose-50/50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
              <span className="text-rose-600">{riskItems.length} Trees</span> Need Attention
            </h2>
            <p className="text-slate-500 text-sm max-w-md">
              Immediate interventions required for custody expirations, missed checkpoints, and reported health declines. 
              Action taken now prevents permanent asset loss.
            </p>
          </div>
        </div>

        {/* Risk Distribution Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Risk Distribution</h3>
            <div className="space-y-2">
              {severityData.map(item => (
                <div key={item.name} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}: <strong className="text-slate-900 ml-auto">{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="w-28 h-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Priority Interventions Title & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" /> Priority Interventions
        </h3>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID or Zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-xl bg-white shadow-sm border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-48 sm:w-64 transition-all"
            />
          </div>

          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 flex items-center gap-1">
            {['ALL', 'high', 'medium', 'low'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterSeverity === sev
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Operational List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50/50 text-xs text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Tree ID / Location</th>
                <th className="px-6 py-4 font-medium">Risk Type & Urgency</th>
                <th className="px-6 py-4 font-medium">Current Custodian</th>
                <th className="px-6 py-4 font-medium">Recommended Action</th>
                <th className="px-6 py-4 font-medium text-right">Intervene</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRisks.map((risk) => {
                const associatedTree = trees.find(t => t.id === risk.treeId) || trees[0];
                const isHigh = risk.severity === 'high';
                const isMedium = risk.severity === 'medium';

                return (
                  <tr key={risk.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => onOpenTree(risk.treeId)}
                          className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                          {risk.treeId}
                        </button>
                        <span className="text-xs text-slate-500">{risk.zone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-rose-500' : isMedium ? 'bg-amber-500' : 'bg-slate-400'}`} />
                        <div>
                          <p className={`font-semibold ${isHigh ? 'text-rose-900' : isMedium ? 'text-amber-900' : 'text-slate-700'}`}>
                            {risk.title}
                          </p>
                          {risk.daysOverdue > 0 && (
                            <p className="text-[10px] text-rose-600 font-bold mt-0.5">{risk.daysOverdue} Days Overdue</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">{risk.custodianName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-700 font-medium">{risk.actionRequired}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {risk.suggestedActionType === 'REASSIGN' && (
                          <button
                            onClick={() => onOpenHandoff(associatedTree)}
                            className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                            title="Reassign Custody"
                          >
                            <HeartHandshake className="w-4 h-4" />
                          </button>
                        )}
                        {(risk.suggestedActionType === 'VERIFY' || risk.suggestedActionType === 'INSPECT') && (
                          <button
                            onClick={() => onOpenVerification(associatedTree)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                            title="Verify Now"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {risk.suggestedActionType === 'WATER_EMERGENCY' && (
                          <button
                            onClick={() => alert(`Emergency dispatch sent for ${risk.treeId}`)}
                            className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors"
                            title="Dispatch Water Care"
                          >
                            <Droplets className="w-4 h-4" />
                          </button>
                        )}
                        {risk.suggestedActionType === 'AUTOPSY' && (
                          <button
                            onClick={() => onOpenAutopsy(associatedTree)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white transition-colors"
                            title="View Autopsy"
                          >
                            <AlertOctagon className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenTree(risk.treeId)}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          title="View Passport"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredRisks.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No risk items match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
