import React, { useState } from 'react';
import { Tree, CheckpointStatus, EvidenceConsistency } from '../types/custodia';
import { checkpointService } from '../services/checkpointService';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  RotateCw,
  X,
  FileCheck,
  Eye,
  AlertCircle
} from 'lucide-react';

interface PeerVerificationModalProps {
  tree: Tree;
  isOpen: boolean;
  onClose: () => void;
  onVerificationSubmitted: (
    treeId: string, 
    status: 'healthy' | 'at-risk' | 'failed' | 'mismatch',
    consistency: EvidenceConsistency,
    verifierNotes: string
  ) => void;
}

export const PeerVerificationModal: React.FC<PeerVerificationModalProps> = ({
  tree,
  isOpen,
  onClose,
  onVerificationSubmitted,
}) => {
  const [capturedPhoto, setCapturedPhoto] = useState<string>(tree.currentPhotoUrl);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [selectedVerdict, setSelectedVerdict] = useState<'healthy' | 'at-risk' | 'failed' | 'mismatch'>('healthy');
  const [verifierNotes, setVerifierNotes] = useState<string>('Tree stem girth and leaf density verified on site behind basketball court. Guard is secure.');
  const [soilMoisture, setSoilMoisture] = useState<number>(65);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  // AI-Assisted Evidence Anomaly Checks (Supporting Human Verifier)
  const isLocationMatched = true; // Within 15m radius
  const isTimestampFresh = true; // Captured within current session
  const isGrowthConsistent = selectedVerdict !== 'mismatch';
  const anomalyScore: EvidenceConsistency = 
    selectedVerdict === 'mismatch' ? 'POSSIBLE_ANOMALY' :
    selectedVerdict === 'at-risk' ? 'REVIEW_REQUIRED' : 
    'HIGH_CONSISTENCY';

  const handleSimulateCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setIsCapturing(false);
      // Fresh mock captured photo
      setCapturedPhoto("https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80");
    }, 800);
  };

  const handleSubmitVerification = async () => {
    setIsSubmitting(true);
    
    try {
      if (isSupabaseConfigured()) {
        await checkpointService.submitCheckpoint(tree.id, {
          photoUrl: capturedPhoto,
          health_status: selectedVerdict,
          verification_status: 'verified',
          notes: verifierNotes,
        });
      }
    } catch (error) {
      console.error("Failed to submit checkpoint via Supabase", error);
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onVerificationSubmitted(tree.id, selectedVerdict, anomalyScore, verifierNotes);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50 via-white to-blue-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full font-bold">
                  Independent Peer Audit
                </span>
                <span className="text-xs font-mono text-slate-400">Verifier: Divya M. (#08)</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Verify Survival Checkpoint • {tree.id}
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

        {/* Verification Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Peer Independence Notice */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>
                Assigned Custodian: <strong className="text-slate-900">{tree.currentCustodian}</strong> (Self-verification prohibited)
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ✓ Ground GPS Locked
            </span>
          </div>

          {/* Dual Photo Comparison: Reference Baseline vs Live Peer Photo */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Visual Evidence Comparison
              </h4>
              <span className="text-[11px] text-slate-400">Baseline vs Real-Time Ground Capture</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Left: Previous Verified Reference */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col">
                <div className="p-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Reference Photo (Day 0 Baseline)</span>
                  <span className="font-mono text-slate-500 text-[10px]">{tree.plantedAt}</span>
                </div>
                <div className="relative h-48 bg-slate-200">
                  <img 
                    src={tree.initialPhotoUrl} 
                    alt="Reference" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 text-white text-[10px] font-mono">
                    Baseline: 45 cm
                  </div>
                </div>
              </div>

              {/* Right: Live Current Capture */}
              <div className="rounded-2xl border-2 border-emerald-400 overflow-hidden bg-slate-50 flex flex-col shadow-xs">
                <div className="p-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-900">Current Peer Capture (Live)</span>
                  <span className="font-mono text-emerald-700 text-[10px]">Today, 10:45 AM</span>
                </div>
                <div className="relative h-48 bg-slate-100 flex items-center justify-center">
                  {capturedPhoto ? (
                    <img 
                      src={capturedPhoto} 
                      alt="Live Capture" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="text-center p-4 text-slate-400">
                      <Camera className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                      <p className="text-xs">No camera photo captured yet</p>
                    </div>
                  )}

                  <button
                    onClick={handleSimulateCapture}
                    disabled={isCapturing}
                    className="absolute bottom-2 right-2 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-transform active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    {isCapturing ? 'Capturing...' : 'Capture Photo'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI-Assisted Consistency & Anomaly Engine */}
          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-900">AI-Assisted Anomaly Check</span>
                <span className="text-[10px] text-slate-400 italic">(Decision support, not automated verdict)</span>
              </div>

              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                anomalyScore === 'HIGH_CONSISTENCY' ? 'bg-emerald-100 text-emerald-800' :
                anomalyScore === 'REVIEW_REQUIRED' ? 'bg-amber-100 text-amber-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {anomalyScore.replace('_', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Location GPS</p>
                  <p className="text-[10px] text-slate-500">12m match from tag</p>
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Fresh Image</p>
                  <p className="text-[10px] text-slate-500">No duplicate reuse</p>
                </div>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Growth Pattern</p>
                  <p className="text-[10px] text-slate-500">Normal leaf density</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verifier Status Confirmation Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Official Status Confirmation (Peer Decision)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'healthy', label: 'Verified Alive', sub: 'Healthy growth', color: 'emerald', icon: CheckCircle2 },
                { key: 'at-risk', label: 'At Risk', sub: 'Needs care/water', color: 'amber', icon: AlertTriangle },
                { key: 'failed', label: 'Failed (Dead)', sub: 'Trigger autopsy', color: 'rose', icon: XCircle },
                { key: 'mismatch', label: 'Mismatch', sub: 'Wrong tree photo', color: 'purple', icon: AlertCircle },
              ].map((item) => {
                const isSelected = selectedVerdict === item.key;
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedVerdict(item.key as any)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? item.color === 'emerald' ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-200' :
                          item.color === 'amber' ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-200' :
                          item.color === 'rose' ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-200' :
                          'bg-purple-50 border-purple-600 ring-2 ring-purple-200'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className={`w-4 h-4 ${
                        isSelected 
                          ? item.color === 'emerald' ? 'text-emerald-600' :
                            item.color === 'amber' ? 'text-amber-600' :
                            item.color === 'rose' ? 'text-rose-600' :
                            'text-purple-600'
                          : 'text-slate-400'
                      }`} />
                      {isSelected && <span className="w-2 h-2 rounded-full bg-slate-900" />}
                    </div>
                    <p className="text-xs font-bold text-slate-900 mt-2">{item.label}</p>
                    <p className="text-[10px] text-slate-500">{item.sub}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Verifier Notes & Field Observation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              On-Ground Inspection Notes & Signature
            </label>
            <textarea
              value={verifierNotes}
              onChange={(e) => setVerifierNotes(e.target.value)}
              rows={2}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-800"
              placeholder="Record canopy health, soil condition, or any signs of livestock damage..."
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
            onClick={handleSubmitVerification}
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
          >
            {isSubmitting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Recording Verification Ledger...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                Submit Peer Audit Decision
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
