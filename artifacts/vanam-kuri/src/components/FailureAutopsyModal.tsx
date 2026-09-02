import React, { useState } from 'react';
import { Tree, FailureAutopsy, FailureCause, FailureClassification } from '../types/custodia';
import { 
  AlertOctagon, 
  FileSpreadsheet, 
  HelpCircle, 
  Droplets, 
  ShieldAlert, 
  UserX, 
  Bug, 
  Hammer, 
  MapPin, 
  CheckCircle2, 
  X,
  Lightbulb,
  Sparkles
} from 'lucide-react';

interface FailureAutopsyModalProps {
  tree: Tree;
  isOpen: boolean;
  onClose: () => void;
  onAutopsySaved: (treeId: string, autopsy: FailureAutopsy) => void;
}

export const FailureAutopsyModal: React.FC<FailureAutopsyModalProps> = ({
  tree,
  isOpen,
  onClose,
  onAutopsySaved,
}) => {
  const existingAutopsy = tree.failureAutopsy;
  
  const [primaryCause, setPrimaryCause] = useState<FailureCause>(
    existingAutopsy?.primaryCause || 'Water shortage'
  );
  const [classification, setClassification] = useState<FailureClassification>(
    existingAutopsy?.classification || 'Environmental / Systemic'
  );
  const [autopsyNotes, setAutopsyNotes] = useState<string>(
    existingAutopsy?.autopsyNotes || 
    'Severe soil moisture deficit observed across root zone. Dry cracked earth around base with no protective mulching layer.'
  );
  const [preventiveLesson, setPreventiveLesson] = useState<string>(
    existingAutopsy?.preventiveLesson || 
    'Zone B requires automated solar drip irrigation and weekly mandatory soil moisture checkpoint alerts before summer.'
  );

  if (!isOpen) return null;

  const causesList: { cause: FailureCause; icon: any; desc: string; defaultClass: FailureClassification }[] = [
    { cause: 'Water shortage', icon: Droplets, desc: 'Drought, pipeline breach, dry soil', defaultClass: 'Environmental / Systemic' },
    { cause: 'Cattle damage', icon: ShieldAlert, desc: 'Grazing animals, broken guard', defaultClass: 'Environmental / Systemic' },
    { cause: 'No custodian', icon: UserX, desc: 'Orphaned tree, owner graduated', defaultClass: 'Custodial Failure' },
    { cause: 'Disease / Pests', icon: Bug, desc: 'Termite, root rot, fungal blight', defaultClass: 'Biological / Pathogen' },
    { cause: 'Maintenance failure', icon: Hammer, desc: 'Missed watering, poor weeding', defaultClass: 'Custodial Failure' },
    { cause: 'Wrong species/site', icon: MapPin, desc: 'Unsuitable soil or shade', defaultClass: 'Environmental / Systemic' },
  ];

  const handleSaveAutopsy = () => {
    const newAutopsy: FailureAutopsy = {
      autopsyId: existingAutopsy?.autopsyId || `AUT-${Date.now().toString().slice(-6)}`,
      treeId: tree.id,
      recordedDate: new Date().toISOString().slice(0, 10),
      reportedBy: 'Sustainability Office & Peer Auditor',
      primaryCause,
      contributingFactors: [
        'Prolonged dry season in Zone B',
        'Tree guard reinforcement needed'
      ],
      classification,
      lastVerifiedAliveDate: tree.plantedAt,
      custodianAtFailure: tree.currentCustodian,
      autopsyNotes,
      preventiveLesson,
      zone: tree.zone,
    };

    onAutopsySaved(tree.id, newAutopsy);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-rose-100 bg-gradient-to-r from-rose-50/80 via-white to-amber-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full font-bold">
                  Tree Mortality Investigation
                </span>
                <span className="text-xs font-mono text-slate-400">Tree ID: {tree.id}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Failure Autopsy & Root Cause Analysis
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Philosophy Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white text-xs space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertOctagon className="w-4 h-4" />
              “Never let a tree fail silently without learning why.”
            </div>
            <p className="text-slate-300 text-[11px]">
              Classifying every failed tree transforms mortality data into systemic intelligence for future plantation drives and resource allocation.
            </p>
          </div>

          {/* Primary Cause Grid */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Primary Cause of Tree Failure
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {causesList.map((item) => {
                const isSelected = primaryCause === item.cause;
                const Icon = item.icon;
                return (
                  <button
                    key={item.cause}
                    type="button"
                    onClick={() => {
                      setPrimaryCause(item.cause);
                      setClassification(item.defaultClass);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                    <p className="text-xs font-bold text-slate-900 mt-1.5">{item.cause}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Classification: Systemic vs Custodial */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Failure Responsibility Classification
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { type: 'Environmental / Systemic', desc: 'Drought, canal failure, stray cattle breach', color: 'amber' },
                { type: 'Custodial Failure', desc: 'Abandoned custody, zero check-ins', color: 'rose' },
                { type: 'Biological / Pathogen', desc: 'Incurable blight, root fungal rot', color: 'purple' },
              ].map((cl) => {
                const isSelected = classification === cl.type;
                return (
                  <button
                    key={cl.type}
                    type="button"
                    onClick={() => setClassification(cl.type as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{cl.type}</p>
                    <p className={`text-[10px] mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>{cl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Observations */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Field Investigation Findings
            </label>
            <textarea
              value={autopsyNotes}
              onChange={(e) => setAutopsyNotes(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-800"
            />
          </div>

          {/* Preventive Lesson for Future Planning */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Actionable Lesson for Next Season
            </div>
            <textarea
              value={preventiveLesson}
              onChange={(e) => setPreventiveLesson(e.target.value)}
              rows={2}
              className="w-full text-xs p-2.5 rounded-xl bg-white border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-800"
              placeholder="What must be changed in this zone to prevent similar failure?"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Cancel
          </button>

          <button
            onClick={handleSaveAutopsy}
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Autopsy to Mortality Intelligence
          </button>
        </div>
      </div>
    </div>
  );
};
