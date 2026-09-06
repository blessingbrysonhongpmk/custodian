import React from 'react';
import { Tree, OrganizationReliability, RiskItem } from '../types/custodia';
import { useTranslation } from 'react-i18next';
import { ThulirWidget } from './ThulirWidget';
import { 
  Sprout, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  AlertOctagon,
  Calendar,
  Activity
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';


interface DashboardViewProps {
  reliability: OrganizationReliability;
  riskItems: RiskItem[];
  trees: Tree[];
  onOpenTree: (treeId: string) => void;
  onOpenHandoff: (tree: Tree) => void;
  onOpenRiskCenter: () => void;
  onOpenAutopsy: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  reliability,
  riskItems,
  trees,
  onOpenTree,
  onOpenRiskCenter,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
      {/* Top Section: Greeting & Thulir */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('dashboard.greeting', { name: 'Admin' })}
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Here is your program overview. You are currently tracking {reliability.totalPlanted} trees across all environmental initiatives.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Calendar className="w-3.5 h-3.5" />
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <ThulirWidget />
      </section>

      {/* Unboxed Clean Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-200">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <Sprout className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('common.treesPlanted')}</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{reliability.totalPlanted}</span>
          <span className="text-xs font-semibold text-emerald-600">+12 this month</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('common.verifiedAlive')}</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{reliability.verifiedAlive}</span>
          <span className="text-xs font-semibold text-emerald-600">{reliability.verifiedSurvivalRate}% survival</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('status.needsAttention')}</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{reliability.atRiskCount}</span>
          <span className="text-xs font-semibold text-amber-600">Requires intervention</span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-slate-500 mb-1">
            <AlertOctagon className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">{t('status.critical')}</span>
          </div>
          <span className="text-3xl font-black text-slate-900">{reliability.orphanedCount}</span>
          <span className="text-xs font-semibold text-red-600">{reliability.failedCount} failed</span>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Charts & Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('common.survivalAccountability')}</h3>
                <p className="text-xs text-slate-500 mt-1">Verified survival over 6 months</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                +4.2% Growth
              </span>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Mar', health: 82 },
                    { month: 'Apr', health: 81 },
                    { month: 'May', health: 76 },
                    { month: 'Jun', health: 68 },
                    { month: 'Jul', health: 70 },
                    { month: 'Aug', health: 74 },
                  ]}
                  margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)', fontSize: '12px' }}
                    labelStyle={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}
                  />
                  <Area type="monotone" dataKey="health" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity / Risk List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">{t('common.priorityActions')}</h3>
              <button onClick={onOpenRiskCenter} className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3">
              {riskItems.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start sm:items-center gap-4 hover:border-emerald-300 transition-colors group cursor-pointer" onClick={onOpenRiskCenter}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.severity === 'high' ? 'bg-red-50 text-red-600' :
                    item.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {item.severity === 'high' ? <AlertOctagon className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 truncate">{item.reason}</p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <span className="block text-xs font-bold text-slate-900">{item.actionRequired}</span>
                    <span className="text-[10px] text-slate-400 font-semibold">{item.daysOverdue} days overdue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Custody Distribution & Profile Summary */}
        <div className="space-y-6">
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-6">{t('dashboard.custodyStatus')}</h3>
            
            <div className="h-48 relative flex items-center justify-center mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: 440 },
                      { name: 'Expiring', value: 32 },
                      { name: 'Handoff', value: 14 },
                      { name: 'Urgent', value: 8 },
                      { name: 'Escalated', value: 6 },
                    ]}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {[
                      '#059669', // Emerald 600
                      '#fbbf24', // Amber 400
                      '#f59e0b', // Amber 500
                      '#ef4444', // Red 500
                      '#991b1b', // Red 800
                    ].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.06)', fontSize: '12px' }}
                    itemStyle={{ fontWeight: '600' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">500</span>
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">Total</span>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white transition-colors">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> {t('dashboard.activeCustody')}
                </span>
                <span className="font-bold text-slate-900">88%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white transition-colors">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> {t('dashboard.riskHandoff')}
                </span>
                <span className="font-bold text-slate-900">9%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-white transition-colors">
                <span className="flex items-center gap-2 text-slate-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {t('dashboard.urgent')}
                </span>
                <span className="font-bold text-slate-900">3%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('dashboard.platformReadiness')}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('dashboard.systemOperating')}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
