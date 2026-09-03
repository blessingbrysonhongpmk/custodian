import React, { useState } from 'react';
import { Tree, TreeStatus } from '../types/custodia';
import { 
  MapPin, 
  Navigation, 
  Compass, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  XCircle, 
  ChevronRight,
  ExternalLink,
  Layers,
  Sparkles,
  Eye,
  X,
  Activity,
  Camera,
  User
} from 'lucide-react';

interface InteractiveMapProps {
  trees: Tree[];
  selectedTreeId?: string;
  onSelectTree: (tree: Tree) => void;
  onOpenPassport: (treeId: string) => void;
  onOpenVerification?: (tree: Tree) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trees,
  selectedTreeId = 'TN-COL-00125',
  onSelectTree,
  onOpenPassport,
  onOpenVerification,
}) => {
  const [activeZone, setActiveZone] = useState<string>('ALL');
  const [activeStatus, setActiveStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<'campus' | 'satellite' | 'heatmap'>('campus');
  const [currentSelectedTree, setCurrentSelectedTree] = useState<Tree | null>(
    trees.find(t => t.id === selectedTreeId) || null
  );

  const zones = ['ALL', 'Playground North', 'Zone B — Kaveri East', 'Hostel Grove South', 'Lake Bund Perimeter', 'Library Quadrangle'];

  const filteredTrees = trees.filter(tree => {
    const matchesZone = activeZone === 'ALL' || tree.zone === activeZone;
    const matchesStatus = activeStatus === 'ALL' || tree.status === activeStatus;
    const matchesSearch = 
      tree.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.speciesName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.currentCustodian.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tree.landmark.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesZone && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: TreeStatus) => {
    switch (status) {
      case 'healthy': return { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-500', ring: 'ring-emerald-200' };
      case 'at-risk': return { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-500', ring: 'ring-amber-200' };
      case 'orphaned': return { bg: 'bg-orange-500', text: 'text-orange-700', border: 'border-orange-500', ring: 'ring-orange-200' };
      case 'failed': return { bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-500', ring: 'ring-rose-200' };
      default: return { bg: 'bg-blue-500', text: 'text-blue-700', border: 'border-blue-500', ring: 'ring-blue-200' };
    }
  };

  const getMapPosition = (coords: [number, number], index: number) => {
    const lat = coords[0];
    const lng = coords[1];
    
    // Spread coordinates naturally inside grid
    const x = ((lng - 80.2290) / 0.0100) * 80 + 10;
    const y = (1 - (lat - 13.0605) / 0.0065) * 75 + 12;

    return {
      left: `${Math.max(8, Math.min(92, x))}%`,
      top: `${Math.max(8, Math.min(88, y))}%`,
    };
  };

  return (
    <div className="w-full h-[700px] relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm animate-fade-in bg-slate-900 select-none">
      
      {/* Background Layer */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${
          activeLayer === 'satellite' 
            ? 'bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px] bg-slate-950' 
            : activeLayer === 'heatmap'
            ? 'bg-gradient-to-tr from-slate-950 via-emerald-950/30 to-amber-950/30'
            : 'bg-slate-900 bg-[radial-gradient(#334155_1px,transparent_1px)] bg-[size:24px_24px]'
        }`}
      >
        {/* Campus Landmark Areas */}
        <div className="absolute top-[18%] left-[22%] border border-emerald-500/20 bg-emerald-900/10 rounded-2xl px-3 py-2 text-[11px] font-mono text-emerald-400/80 pointer-events-none">
          🏀 Playground North (Court #1)
        </div>
        <div className="absolute top-[50%] left-[15%] border border-blue-500/20 bg-blue-900/10 rounded-2xl px-3 py-2 text-[11px] font-mono text-blue-400/80 pointer-events-none">
          💧 Zone B — Kaveri East Trench
        </div>
        <div className="absolute top-[28%] right-[18%] border border-amber-500/20 bg-amber-900/10 rounded-2xl px-3 py-2 text-[11px] font-mono text-amber-400/80 pointer-events-none">
          🏫 Library Quadrangle Central Lawn
        </div>
        <div className="absolute bottom-[18%] left-[45%] border border-slate-500/20 bg-slate-800/20 rounded-2xl px-3 py-2 text-[11px] font-mono text-slate-400/80 pointer-events-none">
          🌊 Lake Bund Perimeter & Watchpost
        </div>

        {/* Roads & Pathways SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M 50 150 Q 250 100 450 200 T 800 350" fill="none" stroke="#94A3B8" strokeWidth="6" strokeDasharray="8 6" />
          <path d="M 300 50 L 300 450" fill="none" stroke="#94A3B8" strokeWidth="4" />
          <path d="M 100 300 L 700 300" fill="none" stroke="#94A3B8" strokeWidth="4" />
        </svg>
      </div>

      {/* Floating Controls (Top Left) */}
      <div className="absolute top-4 left-4 z-40 flex flex-col gap-3">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-2 shadow-sm border border-slate-100 flex flex-col gap-2">
          
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Tree ID, Custodian..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-64 md:w-72"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={activeZone}
              onChange={(e) => setActiveZone(e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {zones.map(z => (
                <option key={z} value={z}>{z === 'ALL' ? 'All Zones' : z}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Status Filters */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-1.5 shadow-sm border border-slate-100 flex items-center gap-1">
          {['ALL', 'healthy', 'at-risk', 'orphaned', 'failed'].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                activeStatus === st 
                  ? 'bg-slate-900 text-white shadow-sm' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'ALL' ? 'All' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Floating View Toggles (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-40 flex flex-col gap-3">
        <div className="bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-1">
          <button
            onClick={() => setActiveLayer('campus')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${activeLayer === 'campus' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <MapPin className="w-3.5 h-3.5" /> Campus Map
          </button>
          <button
            onClick={() => setActiveLayer('satellite')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${activeLayer === 'satellite' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Layers className="w-3.5 h-3.5" /> Satellite
          </button>
          <button
            onClick={() => setActiveLayer('heatmap')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 ${activeLayer === 'heatmap' ? 'bg-amber-50 text-amber-700' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Activity className="w-3.5 h-3.5" /> Risk Heatmap
          </button>
        </div>

        {/* Legend */}
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Alive ({trees.filter(t => t.status === 'healthy').length})</span>
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-500" /> At Risk ({trees.filter(t => t.status === 'at-risk').length})</span>
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Orphaned ({trees.filter(t => t.status === 'orphaned').length})</span>
          <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Failed ({trees.filter(t => t.status === 'failed').length})</span>
        </div>
      </div>

      {/* Compass (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-40 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2 text-xs font-medium text-slate-700">
        <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
        <span>N 13.0628°</span>
      </div>

      {/* Tree Pins */}
      {filteredTrees.map((tree, idx) => {
        const pos = getMapPosition(tree.coordinates, idx);
        const isSelected = currentSelectedTree?.id === tree.id;
        const style = getStatusColor(tree.status);

        return (
          <div
            key={tree.id}
            style={pos}
            onClick={() => {
              setCurrentSelectedTree(tree);
              onSelectTree(tree);
            }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-all duration-300 ${isSelected ? 'z-50' : 'z-20 hover:z-30'}`}
          >
            {(tree.isPilotTree || tree.status === 'at-risk' || tree.status === 'orphaned') && (
              <span className={`absolute -inset-2 rounded-full ${style.bg} opacity-30 animate-ping`} />
            )}
            
            <div 
              className={`relative flex items-center justify-center rounded-full border-2 transition-transform ${
                isSelected 
                  ? `${style.bg} border-white shadow-lg ring-4 ${style.ring} scale-125 w-8 h-8` 
                  : `bg-slate-900 border-white text-white shadow-sm w-6 h-6 hover:scale-125`
              }`}
            >
              {isSelected && <MapPin className={`w-3.5 h-3.5 text-white`} />}
            </div>

            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
              {tree.id}
            </div>
          </div>
        );
      })}

      {/* Floating Selected Tree Detail Card (Top Right) */}
      {currentSelectedTree && (
        <div className="absolute top-4 right-4 z-50 w-80 animate-slide-in-right">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-xl border border-slate-100 flex flex-col gap-4">
            
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider bg-slate-100 text-slate-500 uppercase">
                  {currentSelectedTree.zone}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {currentSelectedTree.id}
                </h3>
                <p className="text-sm font-medium text-emerald-700 italic font-serif">
                  {currentSelectedTree.speciesName}
                </p>
              </div>
              <button 
                onClick={() => setCurrentSelectedTree(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 relative">
              <img 
                src={currentSelectedTree.currentPhotoUrl} 
                alt="Current State" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-medium flex items-center gap-1">
                <Camera className="w-3 h-3" /> Latest
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-slate-600">Health</span>
                </div>
                <span className="text-sm font-bold text-slate-900">{currentSelectedTree.healthScore}/100</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-600">Custodian</span>
                </div>
                <span className="text-sm font-bold text-slate-900 text-right">{currentSelectedTree.currentCustodian}</span>
              </div>
            </div>

            <button
              onClick={() => onOpenPassport(currentSelectedTree.id)}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm mt-1"
            >
              <Eye className="w-4 h-4" />
              Open Tree Passport
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
