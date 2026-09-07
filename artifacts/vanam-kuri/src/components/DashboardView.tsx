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
  Activity,
  Leaf
} from 'lucide-react';
import { TamilNaduSeal } from './TamilNaduSeal';
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
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-12">
      
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <TamilNaduSeal size={44} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {t('dashboard.greeting', { name: 'Admin' })}
              </h1>
              <span className="tn-badge-heritage">தமிழ்நாடு அரசு</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Tamil Nadu Environmental Governance • Monitoring {reliability.totalPlanted} registered trees across 38 districts
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-[#006A4E]" />
          {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </section>

      {/* Tamil Nadu State Tree Flagship Strip */}
      <div className="tn-card-heritage p-4 bg-gradient-to-r from-emerald-50/90 via-white to-amber-50/50 border border-emerald-200/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#004D38] flex items-center justify-center text-white shrink-0">
            <Leaf className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">தமிழ்நாட்டின் பூர்வீக மரங்கள்</span>
              <span className="tn-badge-heritage text-[10px]">State Indigenous Grid</span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Live Heritage Registry: <span className="tn-tree-code">TN-PALM-005</span> (Palmyra • பனை மரம்) & <span className="tn-tree-code">TG-IND-001</span> (Neem • வேம்பு)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => onOpenTree('TN-PALM-005')}
            className="flex-1 md:flex-initial px-3 py-1.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>TN-PALM-005 (பனை மரம்)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onOpenTree('TG-IND-001')}
            className="flex-1 md:flex-initial px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <span>TG-IND-001 (வேம்பு)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Program Health */}
      <ThulirWidget />

      {/* Key Numbers */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <Sprout className="w-4 h-4 text-[#006A4E]" />
            <span className="text-xs font-semibold">{t('common.treesPlanted')}</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{reliability.totalPlanted}</span>
          <span className="text-xs text-[#2E8B57] font-medium block mt-1">+12 this month</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <CheckCircle2 className="w-4 h-4 text-[#006A4E]" />
            <span className="text-xs font-semibold">{t('common.verifiedAlive')}</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{reliability.verifiedAlive}</span>
          <span className="text-xs text-[#2E8B57] font-medium block mt-1">{reliability.verifiedSurvivalRate}% survival</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold">{t('status.needsAttention')}</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{reliability.atRiskCount}</span>
          <span className="text-xs text-amber-600 font-medium block mt-1">Needs care</span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-2">
            <AlertOctagon className="w-4 h-4 text-red-500" />
            <span className="text-xs font-semibold">{t('status.critical')}</span>
          </div>
          <span className="text-2xl font-bold text-slate-900">{reliability.orphanedCount}</span>
          <span className="text-xs text-red-500 font-medium block mt-1">{reliability.failedCount} lost</span>
        </div>
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Chart + Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Survival Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t('common.survivalAccountability')}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Verified survival rate over 6 months</p>
              </div>
              <span className="text-xs font-semibold text-[#006A4E] bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
                +4.2% Growth
              </span>
            </div>
            
            <div className="h-56">
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
                      <stop offset="5%" stopColor="#006A4E" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#006A4E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} domain={[50, 100]} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', fontSize: '12px' }}
                    labelStyle={{ fontWeight: '700', color: '#0f172a' }}
                  />
                  <Area type="monotone" dataKey="health" stroke="#006A4E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorHealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Actions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">{t('common.priorityActions')}</h3>
              <button onClick={onOpenRiskCenter} className="text-xs font-semibold text-[#006A4E] hover:text-[#2E8B57] flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {riskItems.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 hover:border-[#2E8B57] transition-colors cursor-pointer" onClick={onOpenRiskCenter}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    item.severity === 'high' ? 'bg-red-50 text-red-600' :
                    item.severity === 'medium' ? 'bg-amber-50 text-amber-600' :
                    'bg-slate-50 text-slate-600'
                  }`}>
                    {item.severity === 'high' ? <AlertOctagon className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{item.reason}</p>
                  </div>
                  <div className="hidden sm:block text-right shrink-0">
                    <span className="text-xs font-semibold text-slate-800">{item.actionRequired}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.daysOverdue}d overdue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Custody Chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4">{t('dashboard.custodyStatus')}</h3>
            
            <div className="h-44 relative flex items-center justify-center mb-4">
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
                    innerRadius={55}
                    outerRadius={72}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {['#006A4E', '#FF9933', '#D97706', '#EF4444', '#991B1B'].map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    itemStyle={{ fontWeight: '600' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-900">500</span>
                <span className="text-[10px] text-slate-500 font-medium mt-0.5">Total</span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center py-1.5">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#006A4E]"></span> {t('dashboard.activeCustody')}
                </span>
                <span className="font-semibold text-slate-900">88%</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]"></span> {t('dashboard.riskHandoff')}
                </span>
                <span className="font-semibold text-slate-900">9%</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> {t('dashboard.urgent')}
                </span>
                <span className="font-semibold text-slate-900">3%</span>
              </div>
            </div>
          </div>
          
          {/* Platform Status */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm text-center">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mx-auto text-[#006A4E] mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900">{t('dashboard.platformReadiness')}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t('dashboard.systemOperating')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
