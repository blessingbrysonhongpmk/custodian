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
      title: "1. Campus Overview & Verification Gap",
      subtitle: "500 planted, 318 verified alive. 25.4% verification gap exposed.",
      badge: "Accountability",
    },
    {
      num: 2,
      title: "2. Inspect Pilot Tree TN-COL-00125",
      subtitle: "3D digital passport, growth timeline, and Arun's tenure ledger.",
      badge: "Digital Twin",
    },
    {
      num: 3,
      title: "3. Arun Graduating → Handoff to Priya",
      subtitle: "Prevent ownerless trees with mandatory custody handoff ceremony.",
      badge: "Custody Chain",
    },
    {
      num: 4,
      title: "4. Independent Peer Verification",
      subtitle: "Divya captures ground photo with AI anomaly consistency check.",
      badge: "Anti-Fraud Audit",
    },
    {
      num: 5,
      title: "5. Failure Autopsy & Mortality Intelligence",
      subtitle: "Classify why trees died in Zone B (Water shortage & cattle breach).",
      badge: "Root-Cause AI",
    },
    {
      num: 6,
      title: "6. Executive Audit & Impact Statement",
      subtitle: "“Don’t count trees planted. Count trees alive.”",
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
                3-Minute Judge Demo Tour
              </span>
              <span className="text-xs font-semibold text-slate-300">
                Step {currentStep + 1} of 6
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
            {currentStep === demoSteps.length - 1 ? 'Restart Demo' : 'Next Step'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
