import React, { useState } from 'react';
import { Tree } from '../types/custodia';
import { useDemoData } from '../context/DemoDataContext';
import { useAuth } from '../context/AuthContext';
import { uploadApi } from '../lib/api';
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
  Ruler,
  Navigation,
  Calendar,
  FileText,
  AlertCircle
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
  const { registerTree } = useDemoData();
  const { user } = useAuth();

  const generatedId = `TG-IND-${String(existingCount + 1).padStart(3, '0')}`;

  const speciesOptions = [
    { name: 'Neem', bot: 'Azadirachta indica', tam: 'வேம்பு' },
    { name: 'Indian Beech / Pungai', bot: 'Pongamia pinnata', tam: 'புங்கன்' },
    { name: 'Arjun Tree / Marutham', bot: 'Terminalia arjuna', tam: 'மருதம்' },
    { name: 'Jamun / Naval', bot: 'Syzygium cumini', tam: 'நாவல்' },
    { name: 'Sacred Fig / Peepal', bot: 'Ficus religiosa', tam: 'அரசமரம்' },
    { name: 'Indian Almond / Badam', bot: 'Terminalia catappa', tam: 'நாட்டு பாதாம்' },
    { name: 'Tamarind / Puli', bot: 'Tamarindus indica', tam: 'புளியமரம்' },
  ];

  // Form State
  const [treeNickname, setTreeNickname] = useState('Green Campus Sapling #1');
  const [selectedSpecies, setSelectedSpecies] = useState(speciesOptions[0]);
  const [plantationDate, setPlantationDate] = useState(new Date().toISOString().slice(0, 10));
  const [locationLandmark, setLocationLandmark] = useState('Anna University Quadrangle, Near Central Library');
  const [zone, setZone] = useState('Academic Sector North');
  const [latitude, setLatitude] = useState<number>(13.0118);
  const [longitude, setLongitude] = useState<number>(80.2362);
  const [initialHeightCm, setInitialHeightCm] = useState<number>(55);
  const [notes, setNotes] = useState('Pledged for daily drip hydration and protected with a bamboo tree guard.');

  // Photo Upload State
  const [photoUrl, setPhotoUrl] = useState<string>('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // GPS Location State
  const [isLocating, setIsLocating] = useState(false);
  const [gpsStatusMessage, setGpsStatusMessage] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdTree, setCreatedTree] = useState<Tree | null>(null);

  if (!isOpen) return null;

  // Handle Geolocation with fallback
  const handleAcquireLocation = () => {
    if (!navigator.geolocation) {
      setGpsStatusMessage('Geolocation not supported by browser. Enter manually.');
      return;
    }

    setIsLocating(true);
    setGpsStatusMessage('Acquiring high-accuracy GPS coordinates...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Math.round(pos.coords.latitude * 10000) / 10000;
        const lng = Math.round(pos.coords.longitude * 10000) / 10000;
        setLatitude(lat);
        setLongitude(lng);
        setIsLocating(false);
        setGpsStatusMessage(`📍 Lat: ${lat}, Lng: ${lng} (Accuracy: ±${Math.round(pos.coords.accuracy)}m)`);
      },
      (err) => {
        setIsLocating(false);
        setGpsStatusMessage(`GPS unavailable (${err.message}). Using manual coordinates.`);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Handle Real Photo Upload
  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file type. Please upload a JPEG, PNG, or WebP photo.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit. Please compress or select a smaller photo.');
      return;
    }

    try {
      setIsUploadingPhoto(true);
      setUploadError(null);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const uploadRes = await uploadApi.uploadImage(base64, file.name, file.type);
          setPhotoUrl(uploadRes.url);
          setIsUploadingPhoto(false);
        } catch (uploadErr: any) {
          setIsUploadingPhoto(false);
          setUploadError(uploadErr.message || 'Image upload failed. Please try again.');
        }
      };
      reader.onerror = () => {
        setIsUploadingPhoto(false);
        setUploadError('Failed to read selected image file.');
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingPhoto(false);
      setUploadError(err.message || 'Failed to process image.');
    }
  };

  // Handle Form Submission to Backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const custodianName = user?.name || 'Assigned Custodian';
      const custodianEmail = user?.email || 'custodian@pasumaikaval.tn.gov.in';
      const custodianUnit = user?.organization || 'Green Tamil Nadu Initiative';

      const treePayload: Partial<Tree> = {
        id: generatedId,
        speciesName: selectedSpecies.name,
        botanicalName: selectedSpecies.bot,
        tamilName: selectedSpecies.tam,
        plantedAt: plantationDate,
        landmark: locationLandmark,
        zone,
        coordinates: [latitude, longitude],
        initialHeightCm,
        currentHeightCm: initialHeightCm,
        initialPhotoUrl: photoUrl,
        currentPhotoUrl: photoUrl,
        currentCustodian: custodianName,
        currentCustodianEmail: custodianEmail,
        currentCustodianUnit: custodianUnit,
      };

      const result = await registerTree(treePayload);
      setCreatedTree(result);
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        onTreeRegistered(result);
        setIsSuccess(false);
        onClose();
      }, 2000);
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err.message || 'Failed to register tree in central database.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Register New Tree • புதிய மரம் பதிவு
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Mint an official digital tree passport with verifiable custody.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Tree Passport Minted!</h3>
              <p className="text-xs text-slate-500 max-w-md">
                Tree <strong>{createdTree?.id || generatedId}</strong> ({selectedSpecies.name}) is registered in the state database under custodian <strong>{user?.name}</strong>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* ID & Species Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tree Passport ID
                  </label>
                  <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-xs font-bold text-slate-900 border border-slate-200 flex items-center justify-between">
                    <span>{generatedId}</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-sans">
                      AUTO-ASSIGNED
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Botanical Species / மர இனம் *
                  </label>
                  <select
                    value={selectedSpecies.name}
                    onChange={(e) => {
                      const sp = speciesOptions.find(s => s.name === e.target.value);
                      if (sp) setSelectedSpecies(sp);
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-emerald-700/20"
                  >
                    {speciesOptions.map((sp) => (
                      <option key={sp.name} value={sp.name}>
                        {sp.name} ({sp.tam} • {sp.bot})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Local Name & Plantation Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tree Name / Local Identification
                  </label>
                  <input
                    type="text"
                    value={treeNickname}
                    onChange={(e) => setTreeNickname(e.target.value)}
                    placeholder="e.g. North Quadrangle Neem"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Plantation Date / நடவு தேதி *
                  </label>
                  <input
                    type="date"
                    value={plantationDate}
                    onChange={(e) => setPlantationDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>
              </div>

              {/* Landmark & Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Location Landmark / அடையாளம் *
                  </label>
                  <input
                    type="text"
                    value={locationLandmark}
                    onChange={(e) => setLocationLandmark(e.target.value)}
                    placeholder="e.g. Near Library East Entrance"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Campus Sector / Zone
                  </label>
                  <input
                    type="text"
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="e.g. Kaveri East Sector"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              {/* Geolocation Section */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-emerald-700" />
                    <span>GPS Coordinates</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleAcquireLocation}
                    disabled={isLocating}
                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {isLocating ? (
                      <>
                        <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Locating...</span>
                      </>
                    ) : (
                      <>
                        <Navigation className="w-3 h-3" />
                        <span>Use My Current Location</span>
                      </>
                    )}
                  </button>
                </div>

                {gpsStatusMessage && (
                  <p className="text-[11px] text-emerald-800 font-medium">
                    {gpsStatusMessage}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-0.5">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 font-medium mb-0.5">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 text-xs font-mono font-bold"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Baseline Photo Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Initial Planting Photo / ஆரம்ப புகைப்படம் *
                </label>

                {uploadError && (
                  <div className="p-2 bg-red-50 text-red-700 text-xs rounded-lg font-medium">
                    {uploadError}
                  </div>
                )}

                <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  <img src={photoUrl} alt="Planting preview" className="w-full h-full object-cover" />
                  
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-bold gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Uploading to central API...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Choose Photo or Take Picture</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoFileChange}
                    />
                  </label>
                  <span className="text-[11px] text-slate-400">Max size: 5MB (JPEG, PNG, WebP)</span>
                </div>
              </div>

              {/* Custodian Assignment Notice */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-950 font-bold block">Assigned Custodian: {user?.name || 'Current Custodian'}</span>
                  <span className="text-emerald-800 text-[11px]">Direct accountability assigned to your account.</span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold">
                  ACTIVE CUSTODY
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingPhoto}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Minting Passport...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Register Tree & Mint Passport</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
