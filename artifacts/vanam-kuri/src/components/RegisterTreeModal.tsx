import React, { useState } from 'react';
import { Tree } from '../types/custodia';
import { treeService } from '../services/treeService';
import { isFirebaseConfigured } from '../lib/firebase';
import { eligibleCustodians } from '../data/mockData';
import { 
  Sprout, 
  MapPin, 
  Camera, 
  User, 
  CheckCircle2, 
  X, 
  Sparkles,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Ruler
} from 'lucide-react';

interface RegisterTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTreeRegistered: (newTree: Tree) => void;
  existingCount: number;
}

export const RegisterTreeModal: React.FC<RegisterTreeModalProps> = ({
  isOpen,
  onClose,
  onTreeRegistered,
  existingCount,
}) => {
  const generatedId = `TN-COL-${String(existingCount + 1).padStart(5, '0')}`;

  const speciesOptions = [
    { name: 'Neem', bot: 'Azadirachta indica', tam: 'வேம்பு' },
    { name: 'Indian Beech / Pungai', bot: 'Pongamia pinnata', tam: 'புங்கன்' },
    { name: 'Arjun Tree / Marutham', bot: 'Terminalia arjuna', tam: 'மருதம்' },
    { name: 'Jamun / Naval', bot: 'Syzygium cumini', tam: 'நாவல்' },
    { name: 'Sacred Fig / Peepal', bot: 'Ficus religiosa', tam: 'அரசமரம்' },
    { name: 'Indian Almond / Badam', bot: 'Terminalia catappa', tam: 'நாட்டு பாதாம்' },
  ];

  const zones = ['Playground North', 'Zone B — Kaveri East', 'Hostel Grove South', 'Lake Bund Perimeter', 'Library Quadrangle'];

  const [step, setStep] = useState(1);
  const [selectedSpecies, setSelectedSpecies] = useState(speciesOptions[0]);
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [landmark, setLandmark] = useState('Near Basketball Court East Gate');
  const [selectedCustodian, setSelectedCustodian] = useState(eligibleCustodians[0]);
  const [initialHeight, setInitialHeight] = useState(48);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const treeDataDb = {
        tree_code: generatedId,
        species: selectedSpecies.name,
        nickname: landmark,
        latitude: 13.0630 + (Math.random() - 0.5) * 0.005,
        longitude: 80.2340 + (Math.random() - 0.5) * 0.005,
        planting_date: new Date().toISOString().slice(0, 10),
        planting_photo_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
        institutional_anchor_id: 'a7d89020-f4ca-43bc-9106-9bd94291c78e',
        current_status: 'healthy',
        health_score: 95
      };

      if (isFirebaseConfigured()) {
        treeService.createTree(treeDataDb).catch(console.error);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onTreeRegistered({ id: generatedId, speciesName: selectedSpecies.name } as any);
        setIsSuccess(false);
        setStep(1);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-8 pt-8 pb-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-emerald-100/50 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-serif">
                Register New Tree
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">Mint a new immutable digital passport.</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-700 bg-white shadow-xs border border-slate-100 relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Progress */}
        {!isSuccess && (
          <div className="px-8 pt-6 pb-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex-1 flex items-center gap-2">
                  <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= s ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">
              <span className={step >= 1 ? 'text-emerald-700' : ''}>Identity</span>
              <span className={step >= 2 ? 'text-emerald-700' : ''}>Biometrics</span>
              <span className={step >= 3 ? 'text-emerald-700' : ''}>Custody</span>
              <span className={step >= 4 ? 'text-emerald-700' : ''}>Review</span>
            </div>
          </div>
        )}

        {/* Form Body */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Passport Minted!</h3>
                <p className="text-sm text-slate-500">Tree {generatedId} has been added to the registry.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-in-right">
              {/* STEP 1: IDENTITY */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Generated Passport ID</span>
                      <p className="font-mono font-black text-emerald-950 text-xl tracking-tight mt-1">{generatedId}</p>
                    </div>
                    <QrCode className="w-8 h-8 text-emerald-600/50" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Botanical Species
                    </label>
                    <select
                      value={selectedSpecies.name}
                      onChange={(e) => {
                        const s = speciesOptions.find(sp => sp.name === e.target.value);
                        if (s) setSelectedSpecies(s);
                      }}
                      className="w-full text-sm p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 focus:ring-2 focus:ring-emerald-500/20 font-medium shadow-sm transition-shadow"
                    >
                      {speciesOptions.map(sp => (
                        <option key={sp.name} value={sp.name}>
                          {sp.name} ({sp.tam} • {sp.bot})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campus Zone</label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full text-sm p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium shadow-sm"
                    >
                      {zones.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: BIOMETRICS */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Precise Landmark</label>
                    <div className="relative">
                      <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full text-sm pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium shadow-sm"
                        placeholder="e.g. Behind Basketball Court Pillar #4"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Baseline Height (cm)
                    </label>
                    <div className="relative">
                      <Ruler className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={initialHeight}
                        onChange={(e) => setInitialHeight(Number(e.target.value))}
                        min={20}
                        max={200}
                        className="w-full text-sm pl-11 pr-4 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                    <Camera className="w-8 h-8 text-slate-400" />
                    <div>
                      <p className="text-sm font-bold text-slate-700">Capture Baseline Photo</p>
                      <p className="text-xs text-slate-500 mt-1">Required for AI verification</p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: CUSTODY */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 mb-4">
                    <h3 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                      <User className="w-4 h-4" /> Chain of Custody Initialization
                    </h3>
                    <p className="text-xs text-blue-700 mt-1">
                      Every tree must have an accountable human caretaker assigned at registration.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Select Custodian
                    </label>
                    <div className="space-y-2">
                      {eligibleCustodians.map(cd => (
                        <div 
                          key={cd.email} 
                          onClick={() => setSelectedCustodian(cd)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedCustodian.email === cd.email 
                              ? 'border-emerald-500 bg-emerald-50' 
                              : 'border-slate-100 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-slate-900">{cd.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{cd.unit}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Trust Score</span>
                              <p className="text-sm font-bold text-emerald-700">{cd.trustScore}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Species</span>
                      <p className="text-sm font-bold text-slate-900">{selectedSpecies.name}</p>
                      <p className="text-xs text-slate-500 italic">{selectedSpecies.bot}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                      <p className="text-sm font-bold text-slate-900">{selectedZone}</p>
                      <p className="text-xs text-slate-500 truncate">{landmark}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Height</span>
                      <p className="text-sm font-bold text-slate-900">{initialHeight} cm</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-600">Custodian</span>
                      <p className="text-sm font-bold text-emerald-900">{selectedCustodian.name}</p>
                      <p className="text-xs text-emerald-700">{selectedCustodian.unit}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center gap-4">
                    <Sparkles className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold">Immutable Ledger Entry</p>
                      <p className="text-xs text-slate-400 mt-1">Once minted, the identity of this tree and its initial custodian cannot be deleted.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        {!isSuccess && (
          <div className="p-6 bg-white border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              {step > 1 ? <><ArrowLeft className="w-4 h-4"/> Back</> : 'Cancel'}
            </button>

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
              >
                {isSubmitting ? (
                  <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"/> Minting...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4"/> Confirm & Mint Passport</>
                )}
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
