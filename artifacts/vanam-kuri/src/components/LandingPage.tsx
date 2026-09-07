import React from 'react';
import { useLanguage } from '../context/LanguageContext';
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
  Globe,
  Award,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { TamilNaduSeal } from './TamilNaduSeal';

interface LandingPageProps {
  onGetStarted: () => void;
  onViewDemo: () => void;
}

/* Custom SVG Tree Emblem */
const TNShieldEmblem = ({ size = 38 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2 L36 10 L36 22 C36 30 28 37 20 38 C12 37 4 30 4 22 L4 10 L20 2Z" fill="#006A4E" stroke="#2E8B57" strokeWidth="1.5"/>
    <rect x="18.5" y="24" width="3" height="8" rx="1" fill="#8B6914"/>
    <path d="M20 10 L26 18 L24 18 L28 24 L12 24 L16 18 L14 18 L20 10Z" fill="#2E8B57"/>
    <path d="M20 8 L25 15 L23 15 L27 21 L13 21 L17 15 L15 15 L20 8Z" fill="#4ADE80" opacity="0.9"/>
  </svg>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onViewDemo }) => {
  const { language, toggleLanguage, t } = useLanguage();

  const FLOW_STEPS = [
    { icon: TreePine, label: language === 'ta' ? 'நடவு' : 'Planting', desc: language === 'ta' ? 'புதிய மரம் பதிவு' : 'Geo-tag planting' },
    { icon: ClipboardCheck, label: language === 'ta' ? 'அடையாள அட்டை' : 'Passport', desc: language === 'ta' ? 'டிஜிட்டல் பாஸ்போர்ட்' : 'Digital tree identity' },
    { icon: UserCheck, label: language === 'ta' ? 'பாதுகாவலர்' : 'Custodian', desc: language === 'ta' ? 'பொறுப்பாளர் நியமனம்' : 'Direct accountability' },
    { icon: ShieldCheck, label: language === 'ta' ? 'கள ஆய்வு' : 'Field Audit', desc: language === 'ta' ? 'புகைப்பட சரிபார்ப்பு' : 'Photo verification' },
    { icon: AlertTriangle, label: language === 'ta' ? 'ஆபத்து கண்டறிதல்' : 'Risk Detection', desc: language === 'ta' ? 'தானியங்கி எச்சரிக்கை' : 'Early warning system' },
    { icon: ArrowRightLeft, label: language === 'ta' ? 'பொறுப்பு மாற்றம்' : 'Handoff', desc: language === 'ta' ? 'தொடர் பராமரிப்பு' : 'Custody continuity' },
    { icon: Leaf, label: language === 'ta' ? 'நீடித்த வளர்ச்சி' : 'Sustained Canopy', desc: language === 'ta' ? '10+ ஆண்டுகள் பாதுகாப்பு' : 'Decade-long survival' },
  ];

  const FEATURES = [
    {
      icon: MapPin,
      title: language === 'ta' ? 'துல்லியமான புவிசார் மர அடையாள அட்டை' : 'Geo-Tagged Tree Digital Identity',
      desc: language === 'ta' 
        ? 'ஒவ்வொரு மரத்திற்கும் தனித்துவமான QR குறியீடு, GPS ஆயத்தொலைவுகள், பூர்வீக மர இனம் மற்றும் வரலாற்று புகைப்படங்கள்.' 
        : 'Every planted tree receives a verified tamper-evident digital record with GPS coordinates, QR access, and growth telemetry.',
    },
    {
      icon: UserCheck,
      title: language === 'ta' ? 'பாதுகாவலர் தொடர்ச்சி கட்டமைப்பு' : 'Zero-Gap Custody Continuity',
      desc: language === 'ta' 
        ? 'மாணவர் கல்வி முடிக்கும்போதோ அல்லது பணியாளர் மாறும்போதோ, மரம் கைவிடப்படாமல் உடனடி அடுத்த பாதுகாவலர் நியமனம்.' 
        : 'When custodians graduate or relocate, the system triggers proactive handoff protocols before a tree is neglected.',
    },
    {
      icon: ShieldCheck,
      title: language === 'ta' ? 'கள அடிப்படையிலான சரிபார்ப்பு' : 'Peer Field Verification',
      desc: language === 'ta' 
        ? 'தனித்துவ புகைப்பட ஒப்பீடுகள் மற்றும் மேற்பார்வையாளர் ஆய்வுகள் மூலம் மரங்கள் உண்மையிலேயே வளர்வதை உறுதி செய்கிறது.' 
        : 'Periodic photographic audits and peer verifier reviews validate real canopy growth against baseline planting records.',
    },
    {
      icon: Building2,
      title: language === 'ta' ? 'அரசு மற்றும் நிறுவன பொறுப்புடைமை' : 'State & Institutional Governance',
      desc: language === 'ta' 
        ? 'பள்ளிகள், கல்லூரிகள், நகராட்சிகள் மற்றும் வனத்துறையின் ஒருங்கிணைந்த தணிக்கை மற்றும் அறிக்கையிடல் அமைப்பு.' 
        : 'Built for Tamil Nadu municipal corporations, educational institutions, and CSR partners requiring audited survival metrics.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] text-slate-900 font-sans selection:bg-[#006A4E] selection:text-white">
      {/* Official State Banner */}
      <div className="bg-[#004D38] text-white py-1.5 px-4 text-[11px] font-medium border-b border-emerald-900/40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></span>
            <span>
              {language === 'ta'
                ? 'தமிழ்நாடு அரசு • சுற்றுச்சூழல், காலநிலை மாற்றம் மற்றும் வனத்துறை'
                : 'Government of Tamil Nadu • Department of Environment, Climate Change & Forests'}
            </span>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 hover:text-emerald-200 transition-colors font-semibold cursor-pointer"
          >
            <Globe className="w-3 h-3 text-[#FFB347]" />
            <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TamilNaduSeal size={38} />
            <div>
              <div className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
                {t('brand.title')}
              </div>
              <span className="text-[10px] font-bold tracking-wider text-[#006A4E] uppercase block">
                {t('brand.subtitle')}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGetStarted}
              className="px-5 py-2.5 bg-[#006A4E] hover:bg-[#00523C] text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>{language === 'ta' ? 'தளத்தில் நுழைக' : 'Enter Official Portal'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left — Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#006A4E]"></span>
                <span className="text-xs font-bold text-[#006A4E] tracking-wide uppercase">
                  {language === 'ta' ? 'மாநில மரப் பாதுகாப்பு திட்டம்' : 'State Tree Governance Initiative'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[46px] font-black text-slate-900 leading-[1.15] tracking-tight">
                {language === 'ta' ? (
                  <>
                    நடப்பட்ட ஒவ்வொரு மரத்திற்கும் <span className="text-[#006A4E]">பொறுப்புமிக்க</span> பாதுகாவலர்.
                  </>
                ) : (
                  <>
                    Every planted tree in Tamil Nadu deserves an <span className="text-[#006A4E]">accountable</span> guardian.
                  </>
                )}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                {language === 'ta'
                  ? 'பசுமை காவல் தளம் மரங்களின் நடவு முதல் பல ஆண்டுகள் உயிர்வாழ்வை உறுதி செய்கிறது. பாதுகாவலர்களை நியமித்தல், கள ஆய்வுகள் மற்றும் தொடர் பராமரிப்பு இடைவெளியின்றி நிர்வகிக்கப்படுகிறது.'
                  : 'Pasumai Kaval is Tamil Nadu’s official digital platform monitoring tree survival, preventing abandonment through seamless custodian handoffs and auditable field verification.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={onGetStarted}
                  className="px-7 py-3.5 bg-[#006A4E] hover:bg-[#00523C] active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>{language === 'ta' ? 'அரசு தளத்தில் நுழைக' : 'Enter Government Portal'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#006A4E]"></span>
                  <span>{language === 'ta' ? '38 மாவட்டங்களிலும் நேரடி ஆளுகை' : 'Live Across All 38 Districts'}</span>
                </div>
              </div>

              {/* State Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-md">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">500+</div>
                  <div className="text-xs text-slate-500 font-medium">Verified Trees</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#006A4E]">94.2%</div>
                  <div className="text-xs text-slate-500 font-medium">Survival Rate</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-slate-900">0%</div>
                  <div className="text-xs text-slate-500 font-medium">Custody Gaps</div>
                </div>
              </div>
            </div>

            {/* Right — Realistic Tree & Environmental Card */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-white">
                <div className="relative h-[320px] bg-emerald-950">
                  <img
                    src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80"
                    alt="Healthy native tree sapling planted with bamboo guard"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-[#006A4E] shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#006A4E]"></span>
                    <span>TG-IND-001 • Neem (வேம்பு)</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs text-emerald-200 font-medium">Active Custody Record</div>
                    <div className="text-sm font-bold">Anna University Green Campus, Chennai</div>
                  </div>
                </div>

                {/* Card details */}
                <div className="p-4 space-y-3 bg-white">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Assigned Custodian:</span>
                    <span className="font-bold text-slate-900">Arun Kumar (Lead Guardian)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Field Verification:</span>
                    <span className="font-bold text-[#006A4E] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Certified Alive (95/100)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#006A4E] h-full rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Flow */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'ta' ? 'அரசு மரப் பாதுகாப்பு செயல்முறை' : 'State Tree Custody Lifecycle'}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              {language === 'ta'
                ? 'நடவு முதல் மரத்தின் 10+ ஆண்டு வளர்ச்சி வரை ஒவ்வொரு நிலையும் டிஜிட்டல் முறையில் கண்காணிக்கப்படுகிறது.'
                : 'From planting to decade-long maturity — every milestone is audited with uninterrupted guardian succession.'}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {FLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.label}
                  className="bg-[#F8FAF8] rounded-xl p-4 border border-slate-200 flex flex-col items-center text-center hover:border-emerald-300 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#006A4E]" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 mb-1">{step.label}</span>
                  <span className="text-[11px] text-slate-500 leading-snug">{step.desc}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'ta' ? 'நடைமுறை ஆளுகைக்கான கட்டமைப்பு' : 'Built for Real-World Environmental Governance'}
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto">
              {language === 'ta'
                ? 'தமிழ்நாட்டின் நகராட்சிகள், கல்வி நிறுவனங்கள் மற்றும் அரசுத் துறைகளுக்காக வடிவமைக்கப்பட்டது.'
                : 'Engineered for public-sector scale, transparent institutional reporting, and citizen stewardship.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400/80 transition-all shadow-2xs hover:shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#006A4E]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Administrative Grid Hierarchy */}
      <section className="bg-[#004D38] text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
            {language === 'ta' ? 'அரசு நிர்வாக கட்டமைப்பு' : 'State Administrative Grid'}
          </h2>
          <p className="text-sm text-emerald-100/90 mb-8 max-w-xl mx-auto">
            {language === 'ta'
              ? 'மாநிலம் முதல் தனிநபர் பாதுகாவலர் வரை முழுமையான ஒருங்கிணைந்த மேலாண்மை அமைப்பு.'
              : 'Scalable from individual school campuses and ward committees up to statewide departmental governance.'}
          </p>
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-200 flex-wrap">
            {['State / மாநிலம்', 'District / மாவட்டம்', 'Corporation / மாநகராட்சி', 'Ward / வார்டு', 'Zone / மண்டலம்', 'Tree / மரம்', 'Custodian / பாதுகாவலர்'].map((level, i) => (
              <React.Fragment key={level}>
                <span className="bg-white/10 px-3.5 py-2 rounded-lg border border-white/15">
                  {level}
                </span>
                {i < 6 && <ChevronRight className="w-3.5 h-3.5 text-emerald-300" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2.5">
            <TamilNaduSeal size={32} />
            <span className="font-extrabold text-slate-900 text-sm tracking-tight">
              {t('brand.title')} • தமிழ்நாடு அரசு
            </span>
          </div>
          <p className="text-xs text-slate-600">
            {language === 'ta'
              ? 'நடப்பட்ட ஒவ்வொரு மரத்திற்கும் ஒரு பாதுகாவலர். ஒவ்வொரு பாதுகாவலருக்கும் ஒரு தொடர்ச்சி.'
              : 'Every tree has a caretaker. Every caretaker has a designated successor.'}
          </p>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Government of Tamil Nadu • Department of Environment, Climate Change & Forests
          </p>
        </div>
      </footer>
    </div>
  );
};
