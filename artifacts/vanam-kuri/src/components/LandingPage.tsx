import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  TreePine,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  ArrowRightLeft,
  ClipboardCheck,
  ChevronRight,
  MapPin,
  Building2,
  Leaf,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

const FLOW_STEPS = [
  { icon: TreePine, label: 'Plant', desc: 'Record a new tree' },
  { icon: ClipboardCheck, label: 'Register', desc: 'Create tree passport' },
  { icon: UserCheck, label: 'Assign', desc: 'Assign custodian' },
  { icon: ShieldCheck, label: 'Verify', desc: 'Field verification' },
  { icon: AlertTriangle, label: 'Detect Risk', desc: 'Monitor custody' },
  { icon: ArrowRightLeft, label: 'Transfer', desc: 'Handoff custody' },
  { icon: Leaf, label: 'Sustain', desc: 'Long-term care' },
];

const FEATURES = [
  {
    icon: MapPin,
    title: 'Tree Identity & Location',
    desc: 'Every tree gets a digital passport with GPS coordinates, QR code, species data, and photo history.',
  },
  {
    icon: UserCheck,
    title: 'Custody Continuity',
    desc: 'When a custodian graduates, leaves, or becomes inactive — the platform finds and assigns a successor before the tree is abandoned.',
  },
  {
    icon: ShieldCheck,
    title: 'Field Verification',
    desc: 'Photo-assisted health assessments and GPS-verified checkpoints ensure trees are actually being maintained.',
  },
  {
    icon: Building2,
    title: 'Institutional Accountability',
    desc: 'Designed for schools, municipalities, NGOs, and government programs that need auditable tree survival records.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDemo }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#FAFCFA]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Seal_of_Tamil_Nadu.svg" alt="Seal of Tamil Nadu" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm tracking-tight flex items-center">
                {t('brand.title')}
              </div>
              <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase mt-0.5 block">
                {t('brand.subtitle')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onViewDemo}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              View Demo
            </button>
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-semibold text-emerald-700">Digital Tree Custody Platform</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                Every planted tree needs someone to remain{' '}
                <span className="text-emerald-700">responsible</span> for it.
              </h1>

              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl">
                TreeGuard helps institutions and communities track trees, verify care,
                manage custodians, and transfer responsibility — before a tree becomes abandoned.
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2"
                >
                  Get Started <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onViewDemo}
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl border border-slate-200 shadow-sm transition-all text-sm"
                >
                  View Demo
                </button>
              </div>

              <p className="text-xs text-slate-400 pt-1">
                Designed for integration with municipal and state environmental programs.
              </p>
            </div>

            {/* Right — Hero Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/40">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
                  alt="Young tree sapling being planted in soil"
                  className="w-full h-[360px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-2xl"></div>
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl p-4 shadow-lg border border-slate-100 max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Custody</span>
                </div>
                <span className="text-2xl font-bold text-slate-900">500+</span>
                <span className="text-xs text-slate-500 block">trees under custodian care</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Flow */}
      <section className="bg-white border-y border-slate-200/60 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              The Tree Custody Lifecycle
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
              From planting to long-term survival — every stage is tracked and every custodian is accountable.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:gap-1">
            {FLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center text-center w-24 sm:w-28">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5 text-emerald-700" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">{step.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{step.desc}</span>
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 hidden lg:block" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Built for Real-World Deployment
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
              A practical platform for institutions, communities, and public-sector programs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 border border-slate-100 hover:border-emerald-200/60 transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/40 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1.5">{feature.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deployment Context */}
      <section className="bg-emerald-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-4">
            Potential Deployment Model
          </h2>
          <p className="text-sm text-emerald-100/80 mb-8 max-w-xl mx-auto">
            Designed for integration with Tamil Nadu municipal and state environmental programs.
            Scalable from a single school campus to state-wide deployment.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-200/70 flex-wrap">
            {['State', 'District', 'Corporation', 'Ward', 'Program', 'Tree', 'Custodian'].map((level, i) => (
              <React.Fragment key={level}>
                <span className="bg-emerald-700/50 px-3 py-1.5 rounded-lg border border-emerald-600/30">
                  {level}
                </span>
                {i < 6 && <ChevronRight className="w-3 h-3 text-emerald-400/50" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/60 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center">
              <TreePine className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-sm">TreeGuard</span>
          </div>
          <p className="text-xs text-slate-400 mb-1">
            Every tree has a caretaker. Every caretaker has a successor.
          </p>
          <p className="text-[10px] text-slate-300">
            © {new Date().getFullYear()} TreeGuard • Designed for Tamil Nadu environmental programs
          </p>
        </div>
      </footer>
    </div>
  );
};
