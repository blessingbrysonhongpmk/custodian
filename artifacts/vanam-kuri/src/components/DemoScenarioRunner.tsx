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
    <div className="w-full bg-slate-50 border border-slate-200 py-2.5 px-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span className="font-mono font-bold uppercase tracking-wider text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
          Demo Scenario
        </span>
        <span className="font-semibold text-slate-900">
          {demoSteps[currentStep].title}
        </span>
        <span className="hidden sm:inline text-slate-500">
          — {demoSteps[currentStep].subtitle}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-slate-400 font-bold uppercase mr-2">
          Step {currentStep + 1} / {demoSteps.length}
        </span>
        <button
          onClick={() => onStepChange(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="px-2 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={() => onStepChange((currentStep + 1) % demoSteps.length)}
          className="px-2 py-1 rounded bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          {currentStep === demoSteps.length - 1 ? 'Restart' : 'Next Step'}
        </button>
      </div>
    </div>
  );
};
