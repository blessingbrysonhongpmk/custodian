import React, { useState, useEffect, useMemo } from 'react';
import { Tree, TreeStatus } from '../types/custodia';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Search, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

// Fix for Leaflet default icon issues in some bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  trees: Tree[];
  selectedTreeId?: string;
  onSelectTree: (tree: Tree) => void;
  onOpenPassport: (treeId: string) => void;
  onOpenVerification?: (tree: Tree) => void;
}

// Component to handle map resizing issues when sidebar toggles
const MapResizeHandler = () => {
  const map = useMap();
  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    
    // Also trigger on mount and shortly after (for initial layout settling)
    map.invalidateSize();
    const timer = setTimeout(() => map.invalidateSize(), 300);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [map]);
  return null;
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trees,
  selectedTreeId,
  onSelectTree,
  onOpenPassport,
}) => {
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTrees = useMemo(() => {
    return trees.filter(tree => {
      // Mapping custody statuses to simple UI filters for the demo
      let mappedStatus = 'active';
      const custody = tree.custodyHistory?.find(c => c.active) || tree.custodyHistory?.[0];
      const custodyActive = custody?.active;
      
      if (!custodyActive) mappedStatus = 'orphaned';
      else if (tree.status === 'at-risk') mappedStatus = 'urgent';
      else if (tree.status === 'orphaned') mappedStatus = 'handoff_required';
      else if (tree.status === 'failed') mappedStatus = 'escalated';
      
      const matchesStatus = activeStatus === 'ALL' || mappedStatus === activeStatus || tree.status === activeStatus;
      const matchesSearch = 
        tree.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tree.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tree.currentCustodian || '').toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesStatus && matchesSearch;
    });
  }, [trees, activeStatus, searchQuery]);

  const mapCenter = useMemo((): [number, number] => {
    if (filteredTrees.length > 0) {
      // Find average lat/lng of all filtered trees
      const sumLat = filteredTrees.reduce((acc, t) => acc + t.coordinates[0], 0);
      const sumLng = filteredTrees.reduce((acc, t) => acc + t.coordinates[1], 0);
      return [sumLat / filteredTrees.length, sumLng / filteredTrees.length];
    }
    // Fallback to Chennai coordinates if no trees
    return [13.0605, 80.2290];
  }, [filteredTrees]);

  // Create a custom DivIcon based on tree status
  const createCustomIcon = (tree: Tree) => {
    let colorClass = 'bg-emerald-500 shadow-emerald-500/50';
    let ringClass = 'ring-emerald-200';
    
    // Determine color based on custody and health
    if (tree.status === 'at-risk') {
      colorClass = 'bg-red-500 shadow-red-500/50';
      ringClass = 'ring-red-200';
    } else if (tree.status === 'orphaned') {
      colorClass = 'bg-gray-400 shadow-gray-400/50';
      ringClass = 'ring-gray-200';
    } else if (tree.healthScore < 80) {
      colorClass = 'bg-orange-500 shadow-orange-500/50';
      ringClass = 'ring-orange-200';
    } else if (tree.healthScore < 90) {
      colorClass = 'bg-amber-500 shadow-amber-500/50';
      ringClass = 'ring-amber-200';
    }

    const htmlString = `
      <div class="relative flex items-center justify-center">
        <div class="absolute -inset-1 rounded-full ${colorClass} opacity-25 animate-ping"></div>
        <div class="relative w-5 h-5 rounded-full border-2 border-white ${colorClass} shadow-lg ring-2 ${ringClass} transition-transform hover:scale-125 z-10"></div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-tree-marker',
      html: htmlString,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Top Map Summary Panel */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-slate-900">{trees.length}</span>
          <span className="text-slate-500">Trees Mapped</span>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-emerald-700">{trees.filter(t => t.healthScore >= 90).length} Active Custody</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-amber-700">{trees.filter(t => t.healthScore >= 80 && t.healthScore < 90).length} Custody Expiring</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
          <span className="text-orange-700">{trees.filter(t => t.healthScore < 80).length} Handoff Required</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="text-red-700">{trees.filter(t => t.status === 'at-risk').length} Urgent</span>
        </div>
      </div>

      <div className="w-full min-h-[500px] lg:h-[650px] relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
        
        {/* React Leaflet Map Container */}
        <MapContainer 
          center={mapCenter} 
          zoom={14} 
          scrollWheelZoom={true} 
          className="w-full h-full z-0"
        >
          <MapResizeHandler />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredTrees.map((tree) => (
            <Marker 
              key={tree.id} 
              position={tree.coordinates} 
              icon={createCustomIcon(tree)}
              eventHandlers={{
                click: () => onSelectTree(tree),
              }}
            >
              <Popup className="rounded-2xl shadow-xl border-0">
                <div className="flex flex-col min-w-[200px] p-1 gap-3">
                  <div>
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider mb-1 inline-block">
                      {tree.id}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{tree.speciesName}</h3>
                    <p className="text-xs text-slate-500 italic font-serif">{tree.botanicalName}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">Health Score</p>
                      <p className="font-bold text-slate-900">{tree.healthScore} / 100</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[9px] mb-0.5">AI Confidence</p>
                      <p className="font-bold text-emerald-600">
                        {tree.checkpoints?.[0]?.confidenceScore || 94}%
                      </p>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between border-b border-slate-100 pb-1">
                      <span className="text-slate-500 font-medium">Custody Status</span>
                      <span className="font-bold text-amber-600 uppercase">Handoff Required</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1 pt-1">
                      <span className="text-slate-500 font-medium">Custodian</span>
                      <span className="font-bold text-slate-900">{tree.currentCustodian}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onOpenPassport(tree.id)}
                    className="mt-1 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Open Tree Passport <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Controls (Top Right) over Map Container */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-3">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-md border border-slate-100 flex flex-col gap-2">
            
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Tree ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64"
              />
            </div>

            <div className="flex flex-wrap gap-1 max-w-[256px]">
              {['ALL', 'active', 'healthy', 'at-risk', 'orphaned', 'failed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveStatus(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all flex-1 ${
                    activeStatus === st 
                      ? 'bg-slate-900 text-white shadow-sm' 
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {st === 'ALL' ? 'All Trees' : st}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
