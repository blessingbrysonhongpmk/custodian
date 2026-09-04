import React, { useState } from 'react';
import { Tree, CustodyRecord } from '../types/custodia';
import { custodyService } from '../services/custodyService';
import { isSupabaseConfigured } from '../lib/supabase';
import { eligibleCustodians } from '../data/mockData';
import confetti from 'canvas-confetti';

import { 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  FileText, 
  Download, 
  AlertCircle,
  X,
  HeartHandshake,
  Clock,
  QrCode
} from 'lucide-react';

interface CustodyHandoffModalProps {
  tree: Tree;
  isOpen: boolean;
  onClose: () => void;
  onHandoffSuccess: (treeId: string, newCustodianName: string, newUnit: string) => void;
}

export const CustodyHandoffModal: React.FC<CustodyHandoffModalProps> = ({
  tree,
  isOpen,
  onClose,
  onHandoffSuccess,
}) => {
  const [step, setStep] = useState<'summary' | 'select' | 'pledge' | 'success'>('summary');
  const [selectedCandidate, setSelectedCandidate] = useState(eligibleCustodians[0]);
  const [handoffReason, setHandoffReason] = useState<'Graduation' | 'Transfer' | 'Semester Leave' | 'Role Change'>('Graduation');
  const [custodianNotes, setCustodianNotes] = useState('Tree is in robust health. Bamboo guard is firm. Bi-weekly watering on Tuesdays and Fridays.');
  const [pledgeAccepted, setPledgeAccepted] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);

  if (!isOpen) return null;

  const handleExecuteHandoff = async () => {
    setIsTransferring(true);
    
    try {
      if (isSupabaseConfigured()) {
        await custodyService.initiateHandoff(tree.id, 'dummy-previous-id', handoffReason);
      }
    } catch (error) {
      console.error("Failed to handoff via Supabase", error);
    }

    setTimeout(() => {
      setIsTransferring(false);
      setStep('success');

      // Trigger Confetti Celebration
      
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#F59E0B', '#34D399', '#38BDF8', '#FBBF24'],
      });

      onHandoffSuccess(tree.id, selectedCandidate.name, selectedCandidate.unit);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-emerald-700 text-white flex items-center justify-center shadow-sm">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full font-bold border border-amber-300">
                  ✅ CUSTODY HANDOFF CEREMONY
                </span>
                <span className="text-xs font-mono text-slate-400">Tree ID: {tree.id}</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-0.5">
                Custody Handoff & Guardian Oath
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

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STEP 1: SUMMARY OF CUSTODIANSHIP */}
          {step === 'summary' && (
            <div className="space-y-5">
              {/* Context Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Responsibility Transfer Protocol</p>
                  <p className="text-emerald-800 mt-0.5">
                    Outgoing custodian <span className="font-bold underline">{tree.currentCustodian}</span> is completing their tenure.
                    Every tree requires an unbroken chain of human responsibility to guarantee 3-year survival.
                  </p>
                </div>
              </div>

              {/* Tree Tenure Report Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                  Tenure Performance Summary
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Custodian</span>
                    <p className="text-sm font-bold text-slate-900">{tree.currentCustodian}</p>
                    <span className="text-[10px] text-slate-500">{tree.currentCustodianUnit}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Checkpoints</span>
                    <p className="text-sm font-bold text-emerald-700">2 / 2 Verified</p>
                    <span className="text-[10px] text-slate-500">100% Compliance</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Growth Progress</span>
                    <p className="text-sm font-bold text-slate-900">45cm → 118cm</p>
                    <span className="text-[10px] text-emerald-600 font-medium">+162% Growth</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 uppercase font-mono">Current Health</span>
                    <p className="text-sm font-bold text-emerald-700">92/100</p>
                    <span className="text-[10px] text-slate-500">Zero Active Risk</span>
                  </div>
                </div>
              </div>

              {/* Reason Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Reason for Responsibility Transfer
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Graduation', 'Transfer', 'Semester Leave', 'Role Change'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setHandoffReason(r)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                        handoffReason === r
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custodian Handoff Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Maintenance Advice for Next Custodian
                </label>
                <textarea
                  value={custodianNotes}
                  onChange={(e) => setCustodianNotes(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SELECT NEW CUSTODIAN */}
          {step === 'select' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Incoming Responsible Custodian</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose an eligible student or community volunteer with proven responsibility score.
                </p>
              </div>

              <div className="space-y-2.5">
                {eligibleCustodians.map((cand) => {
                  const isSelected = selectedCandidate.email === cand.email;
                  return (
                    <div
                      key={cand.email}
                      onClick={() => setSelectedCandidate(cand)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200'
                          : 'bg-white border-slate-200 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {cand.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{cand.name}</p>
                          <p className="text-[11px] text-slate-500">{cand.unit}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-mono text-slate-400">Trust Score</span>
                          <p className="font-bold text-emerald-700">{cand.trustScore}%</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL CUSTODY PLEDGE */}
          {step === 'pledge' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Mandatory Custody Acceptance Pledge
                </div>
                <p>
                  I, <span className="font-bold text-slate-900">{selectedCandidate.name}</span>, hereby accept official custody of Tree <span className="font-mono font-bold text-slate-900">{tree.id}</span> ({tree.speciesName}) located at <span className="font-semibold text-slate-900">{tree.landmark}</span>.
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-700 pt-1">
                  <li>Maintain regular watering and protective guard inspection.</li>
                  <li>Submit 6-month & 1-year photo survival checkpoints on time.</li>
                  <li>Initiate a custody handoff ceremony if I graduate or relocate.</li>
                </ul>
              </div>

              {/* Visual Chain Progression */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-3 text-xs">
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 font-mono">Outgoing Custodian</span>
                  <p className="font-bold text-slate-900">{tree.currentCustodian}</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <span className="h-0.5 w-8 bg-emerald-400" />
                  <ArrowRight className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-emerald-600 font-mono font-bold">New Custodian</span>
                  <p className="font-bold text-emerald-900">{selectedCandidate.name}</p>
                </div>
              </div>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/80 border-2 border-amber-300/80 cursor-pointer shadow-xs">
                <input
                  type="checkbox"
                  checked={pledgeAccepted}
                  onChange={(e) => setPledgeAccepted(e.target.checked)}
                  className="mt-1 rounded border-amber-400 text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <div className="text-xs text-slate-800 space-y-1">
                  <p className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <span>🌟 THE GUARDIAN'S OATH</span>
                  </p>
                  <p className="italic text-slate-700 leading-relaxed">
                    "I accept full custodianship and pledge accountability to nurture this living tree, protect its canopy, and ensure it is <strong>never abandoned or left orphaned</strong>. Every tree deserves a guardian."
                  </p>
                </div>
              </label>
            </div>
          )}

          {/* STEP 4: SUCCESS CEREMONY */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-emerald-600 border-2 border-amber-300 text-white flex items-center justify-center mx-auto shadow-xl animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[11px] font-mono text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest font-black border border-amber-300">
                  ✅ CUSTODY HANDOFF SEALED
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Responsibility Transferred Successfully
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                  The custody ledger has been updated. <span className="font-bold text-emerald-800">{selectedCandidate.name}</span> is now the official custodian of Tree <span className="font-mono font-bold">{tree.id}</span>.
                </p>
              </div>

              {/* Digital Handoff Certificate Badge */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-white to-emerald-50/90 border-2 border-amber-400/60 max-w-md mx-auto text-left shadow-md relative overflow-hidden">
                {/* Groot Sacred Leaf Seal */}
                <div className="absolute top-3 right-3 w-12 h-12 rounded-full border-2 border-amber-400 bg-amber-100/60 flex flex-col items-center justify-center text-[8px] font-black text-amber-900 shadow-inner rotate-12">
                  <span>🍃</span>
                  <span className="text-[7px] tracking-tighter">VERIFIED</span>
                </div>

                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <span className="text-[10px] font-mono font-black text-amber-900">✅ CUSTODY TRANSFER CERTIFICATE</span>
                  <span className="text-[10px] font-mono text-slate-400">VK-2025-HO</span>
                </div>
                <div className="pt-2 text-xs space-y-1.5 text-slate-700">
                  <p><span className="text-slate-400">Previous Custodian:</span> <span className="font-semibold">{tree.currentCustodian}</span> (Honorary Guardian Alumnus)</p>
                  <p><span className="text-slate-400">New Active Custodian:</span> <span className="font-extrabold text-emerald-800">{selectedCandidate.name}</span></p>
                  <p><span className="text-slate-400">Motto:</span> <span className="font-bold text-amber-800">"Every tree deserves a guardian. No tree left behind."</span></p>
                  <p><span className="text-slate-400">Timestamp:</span> {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                  <p className="text-[10px] font-mono text-slate-400 pt-1">Ledger Hash: 0x8a92f...vk25...c31b9d</p>
                </div>
              </div>

              {/* Production Notification Note */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-center">
                <p className="text-[11px] text-slate-500">
                  📱 In production, notifications are delivered through <strong className="text-slate-700">WhatsApp / SMS</strong> to both outgoing and incoming custodians.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
          {step !== 'success' ? (
            <>
              {step !== 'summary' ? (
                <button
                  onClick={() => setStep(step === 'pledge' ? 'select' : 'summary')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Back
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}

              {step === 'summary' && (
                <button
                  onClick={() => setStep('select')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  Next: Select Custodian
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 'select' && (
                <button
                  onClick={() => setStep('pledge')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  Proceed to Pledge
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 'pledge' && (
                <button
                  onClick={handleExecuteHandoff}
                  disabled={!pledgeAccepted || isTransferring}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  {isTransferring ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Executing Transfer...
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-4 h-4" />
                      Transfer Responsibility
                    </>
                  )}
                </button>
              )}
            </>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs"
            >
              Done & Return to Passport
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
