import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle,
  Award,
  X
} from 'lucide-react';

interface DemoScenarioRunnerProps {
  onStepChange: (stepIndex: number) => void;
  currentStep: number;
}

export const DemoScenarioRunner: React.FC<DemoScenarioRunnerProps> = ({
  onStepChange,
  currentStep,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const demoSteps = [
    {
      num: 1,
      title: "1. 500 Trees Planted — Healthy System",
      subtitle: "Dashboard shows active custody across campus. Every tree has a caretaker.",
      badge: "Overview",
    },
    {
      num: 2,
      title: "2. Student Graduating — Custody Expiring",
      subtitle: "Arun Kumar's custody of TG-IND-001 expires in 14 days.",
      badge: "Risk Detected",
    },
    {
      num: 3,
      title: "3. Successor Matching Activated",
      subtitle: "TreeGuard identifies nearby candidates and recommends Priya Nair (94% match).",
      badge: "AI Matching",
    },
    {
      num: 4,
      title: "4. Priya Accepts Responsibility",
      subtitle: "Custody pledge signed. Digital handoff ceremony completed.",
      badge: "Handoff",
    },
    {
      num: 5,
      title: "5. Failure Autopsy — Learning from Loss",
      subtitle: "Zone B tree death analyzed. Water shortage identified as root cause.",
      badge: "Root-Cause",
    },
    {
      num: 6,
      title: "6. Custody Gap Prevented — Impact Report",
      subtitle: "\"No tree left behind.\" Executive dashboard confirms continuity.",
      badge: "Final Outcome",
    }
  ];

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-3 shadow-lg border border-emerald-500/30 overflow-hidden relative">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-full bg-emerald-500/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Title & Status */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold text-xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold bg-emerald-900/50 px-2 py-0.5 rounded border border-emerald-500/30">
                ▶ TreeGuard 3-Minute Demo
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Step {currentStep + 1} of {demoSteps.length}
              </span>
            </div>
            <p className="text-xs font-bold text-white mt-0.5">
              {demoSteps[currentStep].title}: <span className="text-slate-300 font-normal">{demoSteps[currentStep].subtitle}</span>
            </p>
          </div>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {demoSteps.map((step, idx) => {
            const isCurrent = currentStep === idx;
            const isCompleted = currentStep > idx;
            return (
              <button
                key={step.num}
                onClick={() => onStepChange(idx)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 border ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-bold ring-2 ring-emerald-400/40'
                    : isCompleted
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60 hover:bg-emerald-900/60'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-700/60'
                }`}
              >
                <span>{step.num}</span>
                {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </button>
            );
          })}

          <button
            onClick={() => onStepChange((currentStep + 1) % demoSteps.length)}
            className="ml-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-xs shrink-0"
          >
            {currentStep === demoSteps.length - 1 ? '🔄 Restart Demo' : 'Next Step →'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
