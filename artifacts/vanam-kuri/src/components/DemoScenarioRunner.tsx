import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  ShieldCheck, 
  ChevronRight, 
  ChevronLeft,
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface DemoScenarioRunnerProps {
  onStepChange: (stepIndex: number) => void;
  currentStep: number;
}

export const DemoScenarioRunner: React.FC<DemoScenarioRunnerProps> = ({
  onStepChange,
  currentStep,
}) => {
  const { language } = useLanguage();

  const operationalSteps = [
    {
      num: 1,
      title: language === 'ta' ? '1. 500 மரங்கள் மேலாண்மை — நேரடி கண்காணிப்பு' : '1. 500 Native Trees Registered — Live Grid Overview',
      subtitle: language === 'ta' ? 'அனைத்து மரங்களுக்கும் செயலில் உள்ள பாதுகாவலர் உறுதி செய்யப்பட்டுள்ளது.' : 'Executive dashboard confirms 100% active custodian assignment across the sector.',
      badge: language === 'ta' ? 'கண்காணிப்பு' : 'Active Grid',
    },
    {
      num: 2,
      title: language === 'ta' ? '2. பாதுகாவலர் மாற்றம் தேவை — 14 நாட்கள் முன்கூட்டிய எச்சரிக்கை' : '2. Custodian Transition Due — 14-Day Advance Alert',
      subtitle: language === 'ta' ? 'அருண் குமார் கல்வி நிறைவு செய்கிறார். TG-IND-001 மரம் பராமரிப்பு மாற்றம் தேவை.' : 'Arun Kumar graduating. Early warning flags TG-IND-001 custody expiration in 14 days.',
      badge: language === 'ta' ? 'எச்சரிக்கை' : 'Advance Alert',
    },
    {
      num: 3,
      title: language === 'ta' ? '3. அடுத்த பாதுகாவலர் பரிந்துரை — தகுதி சரிபார்ப்பு' : '3. Successor Matching — Pre-Qualified Guardian Verification',
      subtitle: language === 'ta' ? 'அருகிலுள்ள தகுதியான பாதுகாவலராக பிரியா நாயர் (94% பொருத்தம்) பரிந்துரை.' : 'Automated proximity matching recommends Priya Nair (94% readiness match).',
      badge: language === 'ta' ? 'பொருத்தம்' : 'Candidate Match',
    },
    {
      num: 4,
      title: language === 'ta' ? '4. புதிய பாதுகாவலர் ஏற்பு — டிஜிட்டல் உறுதிமொழி' : '4. Custody Transfer Executed — Digital Pledge Recorded',
      subtitle: language === 'ta' ? 'பிரியா நாயர் பொறுப்பை ஏற்றுக்கொண்டார். இடைவெளியற்ற மரப் பாதுகாப்பு உறுதி.' : 'Priya signs caretaker pledge. Tamper-evident custody handoff completed without gaps.',
      badge: language === 'ta' ? 'மாற்றம் நிறைவு' : 'Handoff Certified',
    },
    {
      num: 5,
      title: language === 'ta' ? '5. மர இழப்பு ஆய்வு — அறிவியல் மூலக் காரண தணிக்கை' : '5. Loss Investigation Audit — Scientific Root-Cause Analysis',
      subtitle: language === 'ta' ? 'மண்டல மர இழப்புக்கான காரணங்கள் ஆய்வு செய்யப்பட்டு அரசு கொள்கை குறிப்பு பதிவு.' : 'Drought stress diagnosed. Automated irrigation policy alert dispatched to field teams.',
      badge: language === 'ta' ? 'தணிக்கை' : 'Root Cause Audit',
    },
    {
      num: 6,
      title: language === 'ta' ? '6. மாநில தணிக்கை அறிக்கை — 100% தொடர் பராமரிப்பு' : '6. State Impact Certification — 94.2% Verified Survival',
      subtitle: language === 'ta' ? 'அரசு தணிக்கை குழுவிற்கான முழுமையான சுற்றுச்சூழல் அறிக்கை தயார்.' : 'Official environmental compliance report ready for departmental submission.',
      badge: language === 'ta' ? 'அறிக்கை' : 'Audit Dossier',
    }
  ];

  return (
    <div className="w-full bg-white border border-slate-200/90 py-3 px-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 min-w-0">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-[#006A4E] font-bold uppercase tracking-wider text-[10px] shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'செயல்முறை ஓட்டம்' : 'Operational Flow'}</span>
        </div>
        <div className="min-w-0">
          <span className="font-bold text-slate-900 block sm:inline truncate">
            {operationalSteps[currentStep].title}
          </span>
          <span className="hidden lg:inline text-slate-500 text-[11px] ml-2">
            — {operationalSteps[currentStep].subtitle}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
        <span className="text-[11px] text-slate-500 font-semibold mr-1">
          {language === 'ta' ? `படி ${currentStep + 1} / ${operationalSteps.length}` : `Step ${currentStep + 1} of ${operationalSteps.length}`}
        </span>
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs font-semibold cursor-pointer"
          title="Previous Step"
        >
          <span className="hidden sm:inline">{language === 'ta' ? 'முந்தையது' : 'Previous'}</span>
          <ChevronLeft className="w-3.5 h-3.5 sm:hidden" />
        </button>
        <button
          onClick={() => onStepChange((currentStep + 1) % operationalSteps.length)}
          className="p-1.5 sm:px-3 sm:py-1 rounded-lg bg-[#006A4E] hover:bg-[#00523C] text-white transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
        >
          <span>
            {currentStep === operationalSteps.length - 1 
              ? (language === 'ta' ? 'மீண்டும் தொடங்கு' : 'Restart Flow') 
              : (language === 'ta' ? 'அடுத்த படி' : 'Next Step')}
          </span>
          {currentStep === operationalSteps.length - 1 ? (
            <RotateCcw className="w-3.5 h-3.5" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
