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
  Layers
} from 'lucide-react';

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
    <div className="space-y-6 animate-fade-in">
      {/* Executive Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle leaf overlay */}
        <div className="absolute top-0 right-0 w-96 h-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              CUSTODIA CLIMATE-TECH OS
            </span>
            <span className="text-xs text-slate-300">
              Pilot: Loyola Green Campus 2024–2027
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            “Don’t count trees planted. <span className="text-emerald-400">Count trees alive.</span>”
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Plantation is an event. Survival is the outcome. CUSTODIA replaces one-time plantation photo vanity with continuous custody tracking, independent peer verification, and root-cause failure autopsies.
          </p>
        </div>
      </div>

      {/* Main KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Planted */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">Total Planted</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{reliability.totalPlanted}</span>
              <span className="text-xs text-slate-400">Trees</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sprout className="w-3.5 h-3.5 text-slate-400" />
            <span>Aug 2024 Drive</span>
          </div>
        </div>

        {/* Verified Alive */}
        <div className="p-4 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs flex flex-col justify-between ring-2 ring-emerald-500/20">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold">Verified Alive</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">{reliability.verifiedAlive}</span>
              <span className="text-xs font-bold text-emerald-700 font-mono">({reliability.verifiedSurvivalRate}%)</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Independently Audited</span>
          </div>
        </div>

        {/* At Risk */}
        <div className="p-4 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">At Risk</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-900">{reliability.atRiskCount}</span>
              <span className="text-xs font-semibold text-amber-700 font-mono">({((reliability.atRiskCount/reliability.totalPlanted)*100).toFixed(1)}%)</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-amber-200/60 flex items-center gap-1.5 text-[11px] text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Intervention Required</span>
          </div>
        </div>

        {/* Failed (Autopsy Done) */}
        <div className="p-4 rounded-3xl bg-rose-50/70 border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 font-bold">Failed Trees</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-900">{reliability.failedCount}</span>
              <span className="text-xs font-semibold text-rose-700 font-mono">({((reliability.failedCount/reliability.totalPlanted)*100).toFixed(1)}%)</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-rose-200/60 flex items-center gap-1.5 text-[11px] text-rose-800">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>Autopsies Logged</span>
          </div>
        </div>

        {/* Orphaned Trees */}
        <div className="p-4 rounded-3xl bg-orange-50/70 border border-orange-200/80 shadow-xs flex flex-col justify-between col-span-2 lg:col-span-1">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-orange-800 font-bold">Orphaned</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-orange-900">{reliability.orphanedCount}</span>
              <span className="text-xs font-semibold text-orange-700 font-mono">Trees</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-orange-200/60 flex items-center gap-1.5 text-[11px] text-orange-800">
            <Users className="w-3.5 h-3.5 text-orange-600" />
            <span>No Active Custodian</span>
          </div>
        </div>
      </div>

      {/* CORE INNOVATION 1: The Verification Gap Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Verification Gap Visual Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Accountability Index
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Claimed Survival vs Verified Survival
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-100 text-rose-800 border border-rose-200">
              Gap: -{reliability.verificationGap}%
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Self-reported plantation statistics claimed an <strong>89%</strong> survival rate. Independent peer verification audits reveal the ground reality is <strong>63.6%</strong> alive, exposing a <strong>25.4 percentage point gap</strong>.
          </p>

          {/* Progress Comparison Bars */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-600 font-medium">Claimed Survival (Self-Reported)</span>
                <span className="font-bold text-slate-900 font-mono">89.0% (445 trees)</span>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '89%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Alive (Ground Audit)
                </span>
                <span className="font-bold text-emerald-800 font-mono">63.6% (318 trees)</span>
              </div>
              <div className="h-3 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '63.6%' }} />
              </div>
            </div>
          </div>

          {/* Survival Outcome Flow (Planted -> Alive -> Risk -> Failed) */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
              Survival Outcome Flow
            </span>
            <div className="grid grid-cols-4 gap-1.5 mt-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-800">
                <span className="text-[10px] block font-mono text-slate-500">Planted</span>
                <strong>500</strong>
              </div>
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold border border-emerald-200">
                <span className="text-[10px] block font-mono text-emerald-700">Alive</span>
                <strong>318</strong>
              </div>
              <div className="p-2 rounded-xl bg-amber-100 text-amber-900 font-bold border border-amber-200">
                <span className="text-[10px] block font-mono text-amber-700">At Risk</span>
                <strong>102</strong>
              </div>
              <div className="p-2 rounded-xl bg-rose-100 text-rose-900 font-bold border border-rose-200">
                <span className="text-[10px] block font-mono text-rose-700">Failed</span>
                <strong>80</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Organization Reliability Scorecard */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Operational Metrics
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  Organization Reliability Scorecard
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Grade: A- (Compliant)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Custody Continuity</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">{reliability.custodyContinuityRate}%</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Clean handoffs executed</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Checkpoint Compliance</span>
                <span className="text-xl font-extrabold text-slate-900 font-mono mt-0.5 block">{reliability.checkpointComplianceRate}%</span>
                <span className="text-[10px] text-emerald-600 font-semibold">Timely photo updates</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Risk Recovery Rate</span>
                <span className="text-xl font-extrabold text-amber-700 font-mono mt-0.5 block">{reliability.riskRecoveryRate}%</span>
                <span className="text-[10px] text-slate-500">Trees saved via alert</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] text-slate-500 block">Top Mortality Factor</span>
                <span className="text-sm font-extrabold text-rose-700 mt-0.5 block">{reliability.topFailureCause}</span>
                <span className="text-[10px] text-slate-500">Zone B water deficit</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Green Tamil Nadu Climate Framework Compliance:</span>
            <span className="font-bold text-emerald-700 font-mono">100% Traceable</span>
          </div>
        </div>
      </div>

      {/* Active Urgent Risk Queue Preview & Upcoming Checkpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Urgent Risk Triage */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-emerald-100 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                Survival Risk Center & Escalation Queue
              </h3>
            </div>
            <button
              onClick={onOpenRiskCenter}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              View All ({riskItems.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {riskItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {item.treeId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      item.severity === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.severity} Severity
                    </span>
                    <span className="text-slate-500 font-semibold">{item.zone}</span>
                  </div>

                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-slate-600 text-[11px]">{item.reason}</p>
                  <p className="text-emerald-700 text-[11px] font-medium">Action: {item.actionRequired}</p>
                </div>

                <button
                  onClick={() => onOpenTree(item.treeId)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-200 text-xs font-bold shrink-0 transition-colors shadow-2xs"
                >
                  Inspect Tree
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pilot Tree Quick Passport Card & Mortality Intelligence */}
        <div className="lg:col-span-5 space-y-4">
          {/* Pilot Tree TN-COL-00125 Focus Card */}
          <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/60 rounded-3xl border border-emerald-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Featured Pilot Tree
              </span>
              <span className="text-xs font-bold text-emerald-700">Health: 92/100</span>
            </div>

            <div className="flex items-start gap-3">
              <img 
                src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&auto=format&fit=crop&q=80" 
                alt="Pilot Tree" 
                className="w-20 h-20 rounded-2xl object-cover border border-emerald-200 shrink-0 shadow-2xs" 
              />
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Tree TN-COL-00125</h4>
                <p className="text-xs text-slate-600 font-medium">Neem (Azadirachta indica • வேம்பு)</p>
                <p className="text-[11px] text-slate-500 mt-1">Playground North, Behind Basketball Court</p>
                <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">Custodian: Arun K. (Graduation Handoff)</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-emerald-100">
              <button
                onClick={() => onOpenTree('TN-COL-00125')}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Open 3D Passport
              </button>
              <button
                onClick={() => {
                  const pTree = trees.find(t => t.id === 'TN-COL-00125');
                  if (pTree) onOpenHandoff(pTree);
                }}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-800 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
              >
                <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                Execute Handoff
              </button>
            </div>
          </div>

          {/* Failure Insights Snapshot */}
          <div className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Why Trees Fail (Top Causes)
              </div>
              <button 
                onClick={onOpenAutopsy}
                className="text-[11px] font-bold text-rose-700 hover:underline"
              >
                Failure Intelligence →
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">1. Water shortage (Zone B)</span>
                <span className="font-mono font-bold text-rose-700">42% (34 trees)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">2. Cattle & grazing breach</span>
                <span className="font-mono font-bold text-amber-700">25% (20 trees)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">3. Orphaned / No Custodian</span>
                <span className="font-mono font-bold text-orange-700">17% (14 trees)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
