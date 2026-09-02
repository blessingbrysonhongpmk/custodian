import React, { useState } from 'react';
import { Tree } from '../types/custodia';
import { eligibleCustodians } from '../data/mockData';
import { 
  Sprout, 
  MapPin, 
  Camera, 
  User, 
  CheckCircle2, 
  X, 
  Sparkles,
  QrCode
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

  const [selectedSpecies, setSelectedSpecies] = useState(speciesOptions[0]);
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [landmark, setLandmark] = useState('Near Basketball Court East Gate');
  const [selectedCustodian, setSelectedCustodian] = useState(eligibleCustodians[0]);
  const [initialHeight, setInitialHeight] = useState(48);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newTree: Tree = {
        id: generatedId,
        speciesName: selectedSpecies.name,
        botanicalName: selectedSpecies.bot,
        tamilName: selectedSpecies.tam,
        plantedAt: new Date().toISOString().slice(0, 10),
        zone: selectedZone,
        landmark,
        coordinates: [13.0630 + (Math.random() - 0.5) * 0.005, 80.2340 + (Math.random() - 0.5) * 0.005],
        status: 'healthy',
        healthScore: 95,
        initialHeightCm: initialHeight,
        currentHeightCm: initialHeight,
        initialPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
        currentPhotoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
        currentCustodian: selectedCustodian.name,
        currentCustodianUnit: selectedCustodian.unit,
        currentCustodianEmail: selectedCustodian.email,
        organization: "Loyola Sustainability Initiative / Green Tamil Nadu",
        growthStage: 1,
        custodyHistory: [
          {
            id: `CUST-${Date.now().toString().slice(-4)}`,
            custodianName: selectedCustodian.name,
            custodianRole: "Lead Custodian",
            custodianEmail: selectedCustodian.email,
            organizationUnit: selectedCustodian.unit,
            assignedDate: new Date().toISOString().slice(0, 10),
            checkpointsCompleted: 0,
            checkpointsTotal: 4,
            pledgeSigned: true,
            active: true,
          }
        ],
        checkpoints: [
          {
            id: `CHK-${generatedId}-1`,
            stage: "planted",
            scheduledDate: new Date().toISOString().slice(0, 10),
            submittedDate: new Date().toISOString().slice(0, 10),
            verifiedDate: new Date().toISOString().slice(0, 10),
            status: "verified",
            photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
            custodianName: selectedCustodian.name,
            verifierName: "Dr. Malathi V.",
            consistencyScore: "HIGH_CONSISTENCY",
            locationMatched: true,
            timestampVerified: true,
            heightCm: initialHeight,
            notes: "Initial plantation logged with QR identity tag.",
          }
        ],
        maintenanceLogs: [
          {
            id: `MNT-${Date.now().toString().slice(-4)}`,
            date: new Date().toISOString().slice(0, 10),
            custodianName: selectedCustodian.name,
            type: "Watering",
            notes: "15L initial deep hydration and bamboo guard placed.",
          }
        ]
      };

      setIsSubmitting(false);
      onTreeRegistered(newTree);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-emerald-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                New Living Identity
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-0.5">
                Register Living Tree Passport
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-slate-400">Assigned Unique Tree ID</span>
              <p className="font-mono font-bold text-slate-900 text-sm">{generatedId}</p>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
              ✓ NFC / QR Ready
            </span>
          </div>

          {/* Species Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Native Species
            </label>
            <select
              value={selectedSpecies.name}
              onChange={(e) => {
                const s = speciesOptions.find(sp => sp.name === e.target.value);
                if (s) setSelectedSpecies(s);
              }}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500/20"
            >
              {speciesOptions.map(sp => (
                <option key={sp.name} value={sp.name}>
                  {sp.name} ({sp.tam} • {sp.bot})
                </option>
              ))}
            </select>
          </div>

          {/* Zone & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">Campus Zone</label>
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
              >
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">Precise Landmark</label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
                placeholder="e.g. Behind Basketball Court Pillar #4"
                required
              />
            </div>
          </div>

          {/* Custodian Assignment */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Assign Responsible Custodian
            </label>
            <select
              value={selectedCustodian.email}
              onChange={(e) => {
                const c = eligibleCustodians.find(cd => cd.email === e.target.value);
                if (c) setSelectedCustodian(c);
              }}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
            >
              {eligibleCustodians.map(cd => (
                <option key={cd.email} value={cd.email}>
                  {cd.name} ({cd.unit}) — Trust Score: {cd.trustScore}%
                </option>
              ))}
            </select>
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Initial Sapling Height (cm)
            </label>
            <input
              type="number"
              value={initialHeight}
              onChange={(e) => setInitialHeight(Number(e.target.value))}
              min={20}
              max={200}
              className="w-full text-xs p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800"
            />
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs"
            >
              {isSubmitting ? 'Registering...' : 'Create Tree Passport'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
