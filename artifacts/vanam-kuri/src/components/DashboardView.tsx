import React from 'react';
import { Tree, OrganizationReliability, RiskItem } from '../types/custodia';
import { 
  Sprout, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Droplets, 
  Eye, 
  HeartHandshake,
  AlertOctagon,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  ArrowRightCircle,
  FileCheck2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  PieChart,
  Pie
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
  onOpenHandoff,
  onOpenRiskCenter,
  onOpenAutopsy,
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      {/* Dashboard Command Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-emerald-600/20 bg-[#071810] min-h-[185px] flex items-center">
        <img 
          src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=1600" 
          alt="Lush green forest canopy" 
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.55] contrast-[1.15]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071810]/98 via-[#0A261A]/85 to-transparent" />

        {/* Ambient decoration */}
        <div className="absolute top-2 right-12 w-24 h-24 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-2 right-32 w-28 h-28 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
          <div className="space-y-2 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-black uppercase tracking-widest border border-emerald-400/40 flex items-center gap-1">
                🌿 PASUMAI KAVAL COMMAND CENTER
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">Tamil Nadu • பசுமை காவல்</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-sm">
              Tree Custody Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl font-medium leading-relaxed">
              Every tree has a caretaker. Every caretaker has a successor. <strong className="text-white">{reliability.totalPlanted} trees</strong> protected under active custody.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-emerald-950/80 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-400/30 text-right shadow-lg">
              <span className="text-[10px] text-emerald-300 uppercase font-black block">Canopy Survival</span>
              <span className="text-2xl font-black text-white">{reliability.verifiedSurvivalRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Caretaker Achievement Stats */}
      <div className="bg-white rounded-3xl border border-emerald-200/60 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-emerald-600">🏆</span>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Caretaker Achievements
            </h3>
          </div>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Active Caretakers: {reliability.verifiedAlive}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🌱', title: 'First Planting', desc: 'Planted & Adopted 1st Tree', color: 'from-emerald-50 to-green-50', border: 'border-emerald-200/60' },
            { icon: '🛡️', title: 'Verified Guardian', desc: '5 Checkpoints Verified', color: 'from-teal-50 to-emerald-50', border: 'border-teal-200/60' },
            { icon: '🤝', title: 'Seamless Handoff', desc: 'Zero-Gap Custody Transfer', color: 'from-sky-50 to-teal-50', border: 'border-sky-200/60' },
            { icon: '🌟', title: 'Top Guardian', desc: '95%+ Canopy Survival', color: 'from-amber-50 to-yellow-50', border: 'border-amber-200/60' },
          ].map((badge) => (
            <div key={badge.title} className={`bg-gradient-to-br ${badge.color} rounded-xl p-3 border ${badge.border} hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-xs font-bold text-slate-800">{badge.title}</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium">{badge.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Asymmetric Metrics Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Primary Metric */}
        <div className="md:col-span-5 greenery-card leaf-pattern-overlay rounded-3xl p-8 shadow-sm flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 animate-canopy-glow">
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
              <Sprout className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-4xl font-light text-slate-900 mb-1">{reliability.totalPlanted}</h2>
            <p className="text-sm font-medium text-slate-500">Trees Planted</p>
          </div>
          <div className="relative z-10 mt-8 pt-4 border-t border-emerald-200/40 flex items-center justify-between text-xs text-slate-400">
            <span>Tamil Nadu Green Drive</span>
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3 text-emerald-500" /> 100% Traceable</span>
          </div>
        </div>

        {/* Secondary Metrics Grid */}
        <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified Alive</span>
              <span className="text-xs font-medium text-slate-400">({reliability.verifiedSurvivalRate}%)</span>
            </div>
            <span className="text-3xl font-light text-slate-900">{reliability.verifiedAlive}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-600 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Interventions</span>
            </div>
            <span className="text-3xl font-light text-slate-900">{reliability.atRiskCount}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5"><AlertOctagon className="w-4 h-4" /> Failed</span>
            </div>
            <span className="text-3xl font-light text-slate-900">{reliability.failedCount}</span>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-orange-600 flex items-center gap-1.5"><Users className="w-4 h-4" /> Orphaned</span>
            </div>
            <span className="text-3xl font-light text-slate-900">{reliability.orphanedCount}</span>
          </div>
        </div>
      </div>

      {/* Data Visualization Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Tree Health Trend */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">System Health</h3>
              <p className="text-sm text-slate-500">Verified survival over 6 months</p>
            </div>
            <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              +4.2% Stability
            </div>
          </div>
          
          <div className="h-48 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={[
                  { month: 'Mar', health: 82 },
                  { month: 'Apr', health: 81 },
                  { month: 'May', health: 76 },
                  { month: 'Jun', health: 68 }, // Summer dip
                  { month: 'Jul', health: 70 },
                  { month: 'Aug', health: 74 },
                ]}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[50, 100]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="health" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorHealth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Survival Accountability (Modern Gap Visualization) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Survival Accountability</h3>
            <p className="text-sm text-slate-500">Claimed vs Independently Verified</p>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-full max-w-[200px] h-48 flex items-center justify-center">
              {/* Outer Ring (Claimed) */}
              <div className="absolute inset-0 rounded-full border-[12px] border-slate-100 border-b-transparent border-l-transparent rotate-45"></div>
              <div className="absolute inset-0 rounded-full border-[12px] border-slate-200 border-t-transparent border-r-transparent -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 89%, 0 89%)'}}></div>
              
              {/* Inner Ring (Verified) */}
              <div className="absolute inset-4 rounded-full border-[12px] border-emerald-50 border-b-transparent border-l-transparent rotate-45"></div>
              <div className="absolute inset-4 rounded-full border-[12px] border-emerald-500 border-t-transparent border-r-transparent -rotate-45" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 63.6%, 0 63.6%)'}}></div>
              
              {/* Center Text */}
              <div className="text-center z-10 flex flex-col items-center mt-4">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-full mb-1">Gap</span>
                <span className="text-4xl font-light text-amber-600">25.4<span className="text-lg font-medium">pp</span></span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm px-2">
            <div className="flex flex-col">
              <span className="text-slate-500 text-xs font-medium">Claimed</span>
              <span className="font-bold text-slate-900 text-lg">89.0%</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-500 text-xs font-medium">Verified</span>
              <span className="font-bold text-emerald-600 text-lg">63.6%</span>
            </div>
          </div>
        </div>

        {/* Custody Continuity Donut */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Custody Continuity</h3>
            <p className="text-sm text-slate-500">Real-time caretaker status</p>
          </div>
          
          <div className="h-48 relative flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Active', value: 440, color: '#10b981' },
                    { name: 'Expiring', value: 32, color: '#fbbf24' },
                    { name: 'Handoff', value: 14, color: '#f59e0b' },
                    { name: 'Urgent', value: 8, color: '#ef4444' },
                    { name: 'Escalated', value: 6, color: '#991b1b' },
                  ]}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {[
                    { color: '#10b981' },
                    { color: '#fbbf24' },
                    { color: '#f59e0b' },
                    { color: '#ef4444' },
                    { color: '#991b1b' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-light text-slate-900">500</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Active Custody</span>
              <span className="font-semibold text-slate-900">88%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Risk / Handoff</span>
              <span className="font-semibold text-slate-900">9%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-2 text-slate-600"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Urgent / Escalated</span>
              <span className="font-semibold text-slate-900">3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Organization Scorecard (Horizontal Progress) */}
      <div className="space-y-4">
        <div className="border-b border-emerald-200/40 pb-2">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="text-emerald-600">🌿</span> Performance Scorecard
          </h3>
          <p className="text-xs text-slate-500 mt-1">Tamil Nadu institutional operational metrics</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {[
            { label: 'Custody Continuity', value: reliability.custodyContinuityRate },
            { label: 'Checkpoint Compliance', value: reliability.checkpointComplianceRate },
            { label: 'Risk Recovery Rate', value: reliability.riskRecoveryRate },
            { label: 'Verification Rate', value: 74 },
          ].map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-slate-700">{metric.label}</span>
                <span className="font-mono font-bold text-slate-900">{metric.value}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-slate-800" style={{ width: `${metric.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Operational Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Actions Feed */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Priority Actions</h3>
              <p className="text-sm text-slate-500">Items requiring immediate intervention</p>
            </div>
            <button
              onClick={onOpenRiskCenter}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              View All ({riskItems.length}) <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {riskItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-50 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer"
                onClick={() => onOpenTree(item.treeId)}
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {item.severity === 'high' ? (
                      <span className="flex w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]"></span>
                    ) : (
                      <span className="flex w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                      <span>{item.treeId}</span>
                      <span>•</span>
                      <span>{item.zone}</span>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                    <p className="text-slate-500 text-xs">{item.reason}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end shrink-0">
                  <span className="text-[11px] font-bold text-slate-600 group-hover:text-emerald-600 flex items-center gap-1.5 transition-colors">
                    [ Review ]
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Featured Insights */}
        <div className="lg:col-span-1 space-y-6">
          {/* Pilot Tree TG-IND-001 Focus Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">
                Featured Handoff
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">Health: 92</span>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <img 
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80" 
                alt="Pilot Tree" 
                className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm" 
              />
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Tree TG-IND-001</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Playground North</p>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">Graduation Handoff</p>
              </div>
            </div>

            <button
              onClick={() => {
                const pTree = trees.find(t => t.id === 'TG-IND-001');
                if (pTree) onOpenHandoff(pTree);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              Execute Handoff <HeartHandshake className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Failure Insights Snapshot */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-semibold text-rose-600 tracking-wide uppercase">
                Mortality Factors
              </span>
              <button 
                onClick={onOpenAutopsy}
                className="text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors"
              >
                Report →
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-slate-600 font-medium">1. Water shortage</span>
                <span className="font-semibold text-slate-800">42%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-slate-600 font-medium">2. Grazing breach</span>
                <span className="font-semibold text-slate-800">25%</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="text-slate-600 font-medium">3. Orphaned</span>
                <span className="font-semibold text-slate-800">17%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
