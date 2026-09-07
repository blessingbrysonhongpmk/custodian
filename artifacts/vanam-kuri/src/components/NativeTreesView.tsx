import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TamilNaduSeal } from './TamilNaduSeal';
import {
  Leaf,
  Droplets,
  Sun,
  ShieldCheck,
  Search,
  ExternalLink,
  Award,
  Sparkles,
  MapPin,
  CheckCircle2,
  TreePine
} from 'lucide-react';

export interface NativeTreeInfo {
  code: string;
  nameEn: string;
  nameTa: string;
  botanicalName: string;
  category: 'state-symbol' | 'medicinal' | 'canopy' | 'coastal' | 'dryland' | 'wetland';
  droughtTolerance: 'Extreme' | 'High' | 'Medium';
  lifespan: string;
  oxygenRating: string;
  tamilNaduDistricts: string;
  culturalSignificance: string;
  ecologicalRole: string;
  photoUrl: string;
  linkedTreeId?: string;
}

export const TN_NATIVE_TREES: NativeTreeInfo[] = [
  {
    code: "TN-PALM-005",
    nameEn: "Palmyra Palm",
    nameTa: "பனை மரம்",
    botanicalName: "Borassus flabellifer",
    category: "state-symbol",
    droughtTolerance: "Extreme",
    lifespan: "100+ Years",
    oxygenRating: "High Carbon Sinking",
    tamilNaduDistricts: "Ramanathapuram, Thoothukudi, Tirunelveli, Kanyakumari, Virudhunagar",
    culturalSignificance: "Official State Tree of Tamil Nadu (தமிழ்நாட்டின் மாநில மரம், 1978). Revered in Sangam literature; every part has practical utility.",
    ecologicalRole: "Deep taproots bind soil against erosion, retain coastal aquifer water, and shield against cyclones.",
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TN-PALM-005"
  },
  {
    code: "TG-IND-001",
    nameEn: "Neem",
    nameTa: "வேம்பு",
    botanicalName: "Azadirachta indica",
    category: "medicinal",
    droughtTolerance: "High",
    lifespan: "150–200 Years",
    oxygenRating: "Maximum Daytime O₂",
    tamilNaduDistricts: "Madurai, Trichy, Salem, Chennai, Coimbatore, Karur",
    culturalSignificance: "The supreme village guardian tree of Tamil Nadu. Associated with Goddess Mariamman; natural disinfectant used for thousands of years.",
    ecologicalRole: "Purifies ambient air, natural bio-pesticide, enriches nitrogen-depleted soils through fallen foliage.",
    photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TG-IND-001"
  },
  {
    code: "TN-BAN-012",
    nameEn: "Banyan Tree",
    nameTa: "ஆலமரம்",
    botanicalName: "Ficus benghalensis",
    category: "canopy",
    droughtTolerance: "High",
    lifespan: "250+ Years",
    oxygenRating: "Continuous Oxygen Release",
    tamilNaduDistricts: "Adyar (Chennai), Thanjavur, Dindigul, Tiruvannamalai",
    culturalSignificance: "Traditional village meeting council tree (பஞ்சாயத்து மரம்). Symbol of eternal continuity and wisdom across Tamil Nadu.",
    ecologicalRole: "Keystone species sustaining birds, bats, and pollinators with massive aerial root canopies.",
    photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TG-IND-001"
  },
  {
    code: "TN-COL-00084",
    nameEn: "Indian Beech / Pungai",
    nameTa: "புங்க மரம்",
    botanicalName: "Millettia pinnata (Pongamia)",
    category: "canopy",
    droughtTolerance: "High",
    lifespan: "80–100 Years",
    oxygenRating: "High Urban Microclimate Cooler",
    tamilNaduDistricts: "Chennai, Kanchipuram, Tiruvallur, Vellore, Cuddalore",
    culturalSignificance: "Classic Tamil roadside avenue tree offering dense cool shade. Seeds used traditionally for lamp oil.",
    ecologicalRole: "Nitrogen-fixing legumes that regenerate degraded soil and absorb urban vehicular particulate matter.",
    photoUrl: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TN-COL-00084"
  },
  {
    code: "TN-PEEP-027",
    nameEn: "Peepal / Sacred Fig",
    nameTa: "அரசமரம்",
    botanicalName: "Ficus religiosa",
    category: "medicinal",
    droughtTolerance: "High",
    lifespan: "300+ Years",
    oxygenRating: "24-Hour Oxygen Emitter",
    tamilNaduDistricts: "Across all 38 districts near temple water tanks (குளங்கள்)",
    culturalSignificance: "Planted alongside neem near temple ponds; circumambulation is traditional in Tamil wellness customs.",
    ecologicalRole: "Attracts over 40 species of native birds and butterflies; purifies air within 200m perimeter.",
    photoUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TG-IND-001"
  },
  {
    code: "TN-COL-00042",
    nameEn: "Arjun Tree / Marutham",
    nameTa: "மருத மரம்",
    botanicalName: "Terminalia arjuna",
    category: "coastal",
    droughtTolerance: "Medium",
    lifespan: "120+ Years",
    oxygenRating: "High Riverine Carbon Sink",
    tamilNaduDistricts: "Kaveri Basin, Thanjavur, Karur, Tiruchirappalli, Erode",
    culturalSignificance: "Namesake of the ancient Sangam landscape 'Marutham' (மருத நிலம் - fertile agricultural plains).",
    ecologicalRole: "Reinforces riverbanks and canal bunds against floods with subterranean anchor root systems.",
    photoUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TN-COL-00042"
  },
  {
    code: "TN-COL-00192",
    nameEn: "Jamun / Black Plum",
    nameTa: "நாவல் மரம்",
    botanicalName: "Syzygium cumini",
    category: "wetland",
    droughtTolerance: "Medium",
    lifespan: "100+ Years",
    oxygenRating: "High Biophilic Value",
    tamilNaduDistricts: "Nilgiris foothills, Coimbatore, Dharmapuri, Theni",
    culturalSignificance: "Sangam literature celebrates the sweet purple fruit offered to legendary poet Avvaiyar.",
    ecologicalRole: "Stabilizes wetlands and lake perimeters; high nutritional provider for avifauna and communities.",
    photoUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TN-COL-00192"
  },
  {
    code: "TN-ILUP-210",
    nameEn: "Mahua / Indian Butter Tree",
    nameTa: "இலுப்பை மரம்",
    botanicalName: "Madhuca longifolia",
    category: "medicinal",
    droughtTolerance: "High",
    lifespan: "100+ Years",
    oxygenRating: "Dense Biosphere Enricher",
    tamilNaduDistricts: "Pudukkottai, Sivagangai, Ariyalur, Perambalur",
    culturalSignificance: "Sacred temple tree (ஸ்தல விருட்சம்). Seeds yield oil traditionally burnt in stone temple lamps.",
    ecologicalRole: "Provides nectar for pollinators during peak dry summer months when few other species flower.",
    photoUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TG-IND-001"
  },
  {
    code: "TN-TAM-033",
    nameEn: "Tamarind",
    nameTa: "புளியமரம்",
    botanicalName: "Tamarindus indica",
    category: "dryland",
    droughtTolerance: "Extreme",
    lifespan: "200+ Years",
    oxygenRating: "High Windbreak & Shade",
    tamilNaduDistricts: "Krishnagiri, Dharmapuri, Salem, Dindigul, Theni",
    culturalSignificance: "Lining thousands of kilometers of Tamil Nadu highways; staple seasoning of Tamil culinary heritage.",
    ecologicalRole: "Functions as a robust windbreaker, shields crops against cyclonic gusts, and survives intense heatwaves.",
    photoUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
    linkedTreeId: "TG-IND-001"
  }
];

interface NativeTreesViewProps {
  onOpenPassport: (treeId: string) => void;
}

export const NativeTreesView: React.FC<NativeTreesViewProps> = ({ onOpenPassport }) => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filteredTrees = TN_NATIVE_TREES.filter((tree) => {
    const matchesSearch = 
      tree.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.nameTa.includes(searchTerm) ||
      tree.botanicalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.tamilNaduDistricts.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedFilter === 'state-symbol') return tree.category === 'state-symbol';
    if (selectedFilter === 'medicinal') return tree.category === 'medicinal';
    if (selectedFilter === 'canopy') return tree.category === 'canopy';
    if (selectedFilter === 'extreme-drought') return tree.droughtTolerance === 'Extreme';

    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner with Official Tamil Nadu Government Seal & Heritage Theme */}
      <div className="tn-card-heritage p-6 bg-gradient-to-r from-[#004D38] via-[#006A4E] to-[#0A5A43] text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <TamilNaduSeal size={56} className="bg-white/10 p-1 rounded-full border border-amber-400/40" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[#FFD700] text-[11px] font-bold tracking-wide uppercase mb-1">
                <Sparkles className="w-3 h-3" />
                <span>Green Tamil Nadu Mission • Species Master Registry</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>{language === 'ta' ? 'தமிழ்நாட்டின் பூர்வீக மரங்கள்' : 'Native Trees of Tamil Nadu'}</span>
              </h1>
              <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
                {language === 'ta'
                  ? 'தமிழ்நாட்டின் காலநிலை மற்றும் மண்ணிற்கு ஏற்ற பூர்வீக மரங்கள், அவற்றின் அடையாள குறியீடுகள் (Codes) மற்றும் வாழ்வியல் பயன்கள்.'
                  : 'Official registry of indigenous Tamil Nadu tree species with standardized registry codes, botanical classification, drought resilience ratings, and ecological functions.'}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/15 px-4 py-2.5 rounded-xl text-right shrink-0">
            <div className="text-lg font-black text-[#FFD700]">9+ Key Species</div>
            <div className="text-[11px] text-emerald-100 font-medium">38 Districts Grid</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={language === 'ta' ? 'மரம், குறியீடு அல்லது மாவட்டம் தேடு...' : 'Search tree code, Tamil/English name...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#006A4E]/30 focus:border-[#006A4E] transition-all bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: language === 'ta' ? 'அனைத்தும்' : 'All Species' },
            { id: 'state-symbol', label: language === 'ta' ? 'மாநில மரம்' : 'State Tree' },
            { id: 'medicinal', label: language === 'ta' ? 'மூலிகை மரங்கள்' : 'Medicinal' },
            { id: 'canopy', label: language === 'ta' ? 'நிழல் மரங்கள்' : 'Dense Canopy' },
            { id: 'extreme-drought', label: language === 'ta' ? 'வறட்சி தாங்கும்' : 'Drought Hardy' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedFilter(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === filter.id
                  ? 'bg-[#006A4E] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Native Tamil Nadu Trees with Codes and Names */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrees.map((tree) => (
          <div
            key={tree.code}
            className="tn-card-heritage hover:shadow-md hover:border-[#006A4E]/50 transition-all flex flex-col justify-between"
          >
            {/* Tree Image & State Badges */}
            <div className="relative h-44 bg-emerald-950 overflow-hidden">
              <img
                src={tree.photoUrl}
                alt={`${tree.nameEn} tree`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              
              {/* Tree Code Tag */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="tn-tree-code bg-white/95 backdrop-blur-md text-[#004D38] border-[#006A4E] shadow-sm px-2.5 py-1 text-xs font-mono font-black">
                  {tree.code}
                </span>
                {tree.category === 'state-symbol' && (
                  <span className="bg-[#D97706] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <Award className="w-3 h-3" />
                    <span>State Tree of TN</span>
                  </span>
                )}
              </div>

              {/* Names on Image Bottom */}
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-extrabold text-lg text-white drop-shadow-sm">
                    {tree.nameEn}
                  </h3>
                  <span className="text-sm font-bold text-[#FFD700] drop-shadow-sm">
                    {tree.nameTa}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 italic font-serif">
                  {tree.botanicalName}
                </p>
              </div>
            </div>

            {/* Tree Information Body */}
            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between bg-white">
              {/* Key Indicators */}
              <div className="grid grid-cols-3 gap-2 text-center py-2 border-b border-slate-100 bg-slate-50/70 rounded-lg p-2">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Drought</div>
                  <div className="text-xs font-bold text-[#006A4E]">{tree.droughtTolerance}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Lifespan</div>
                  <div className="text-xs font-bold text-slate-800">{tree.lifespan}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Oxygen</div>
                  <div className="text-xs font-bold text-emerald-700">Prime O₂</div>
                </div>
              </div>

              {/* Cultural & Ecological Role */}
              <div className="space-y-2 text-xs text-slate-600 flex-1">
                <div>
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide text-[#006A4E]">
                    {language === 'ta' ? 'பண்பாட்டு சிறப்பு:' : 'Cultural & State Role:'}
                  </span>
                  <p className="line-clamp-2 leading-relaxed mt-0.5 text-slate-700 font-medium">
                    {tree.culturalSignificance}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide text-slate-500">
                    {language === 'ta' ? 'சுற்றுச்சூழல் பயன்:' : 'Ecological Function:'}
                  </span>
                  <p className="line-clamp-2 leading-relaxed mt-0.5">
                    {tree.ecologicalRole}
                  </p>
                </div>
              </div>

              {/* Districts Tag */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#006A4E] shrink-0" />
                <span className="truncate">{tree.tamilNaduDistricts}</span>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenPassport(tree.linkedTreeId || 'TG-IND-001')}
                className="w-full mt-2 py-2.5 rounded-lg bg-emerald-50 hover:bg-[#006A4E] text-[#006A4E] hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-emerald-200/80 cursor-pointer"
              >
                <span>{language === 'ta' ? `மர அட்டை பார்க்க (${tree.code})` : `Inspect Tree Passport (${tree.code})`}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
