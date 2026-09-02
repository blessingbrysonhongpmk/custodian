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
  Eye
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
  const [currentSelectedTree, setCurrentSelectedTree] = useState<Tree>(
    trees.find(t => t.id === selectedTreeId) || trees[0]
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

  // Convert GPS Coordinates to map percentage coordinates for smooth canvas representation
  const getMapPosition = (coords: [number, number], index: number) => {
    // Relative mock campus bounding box [13.0600 - 13.0670, 80.2300 - 80.2380]
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
    <div className="w-full space-y-4">
      {/* Map Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-emerald-100 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Tree ID, Custodian, Landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-64"
            />
          </div>

          {/* Zone Filter */}
          <select
            value={activeZone}
            onChange={(e) => setActiveZone(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {zones.map(z => (
              <option key={z} value={z}>{z === 'ALL' ? 'All Campus Zones' : z}</option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
            {['ALL', 'healthy', 'at-risk', 'orphaned', 'failed'].map((st) => (
              <button
                key={st}
                onClick={() => setActiveStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                  activeStatus === st 
                    ? 'bg-white text-slate-900 shadow-2xs font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'ALL' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Map Layers */}
        <div className="flex items-center gap-2 self-end lg:self-auto">
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            View:
          </span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white text-xs">
            <button
              onClick={() => setActiveLayer('campus')}
              className={`px-2.5 py-1 font-medium ${activeLayer === 'campus' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Campus Map
            </button>
            <button
              onClick={() => setActiveLayer('satellite')}
              className={`px-2.5 py-1 font-medium border-l border-slate-200 ${activeLayer === 'satellite' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Satellite
            </button>
            <button
              onClick={() => setActiveLayer('heatmap')}
              className={`px-2.5 py-1 font-medium border-l border-slate-200 ${activeLayer === 'heatmap' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Risk Heatmap
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Interactive Map Visual Surface */}
        <div className="lg:col-span-8 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md relative h-[520px] overflow-hidden select-none">
          {/* Base Map Graphic */}
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

          {/* Tree Pins */}
          {filteredTrees.map((tree, idx) => {
            const pos = getMapPosition(tree.coordinates, idx);
            const isSelected = currentSelectedTree.id === tree.id;
            const style = getStatusColor(tree.status);

            return (
              <div
                key={tree.id}
                style={pos}
                onClick={() => {
                  setCurrentSelectedTree(tree);
                  onSelectTree(tree);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                {/* Ping Animation for Pilot Tree or At-Risk / Orphaned */}
                {(tree.isPilotTree || tree.status === 'at-risk' || tree.status === 'orphaned') && (
                  <span className={`absolute -inset-2 rounded-full ${style.bg} opacity-40 animate-ping`} />
                )}

                {/* Marker Button */}
                <div 
                  className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all transform hover:scale-125 ${
                    isSelected 
                      ? `${style.bg} border-white shadow-lg ring-4 ${style.ring} scale-125 z-30` 
                      : `bg-slate-900/90 ${style.border} text-white shadow-sm hover:z-30`
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : style.text}`} />
                </div>

                {/* Hover Label */}
                <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-950/95 text-white text-[10px] font-mono px-2 py-1 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-slate-700 z-40">
                  <span className="font-bold">{tree.id}</span> • {tree.speciesName}
                </div>
              </div>
            );
          })}

          {/* Map Legend Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex flex-wrap items-center gap-3 z-30">
            <span className="font-mono uppercase text-slate-500 text-[10px]">Legend:</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Alive ({trees.filter(t => t.status === 'healthy').length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> At Risk ({trees.filter(t => t.status === 'at-risk').length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Orphaned ({trees.filter(t => t.status === 'orphaned').length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Failed ({trees.filter(t => t.status === 'failed').length})</span>
          </div>

          {/* Compass Rose */}
          <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md p-2 rounded-xl border border-slate-800 flex items-center gap-1.5 text-xs font-mono text-slate-400">
            <Compass className="w-4 h-4 text-emerald-400 animate-spin-slow" />
            <span>N 13.0628°</span>
          </div>
        </div>

        {/* Tree Locator Card & Ground Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          {currentSelectedTree ? (
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-4 flex flex-col justify-between h-full">
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      Selected Digital Passport
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                      {currentSelectedTree.id}
                      {currentSelectedTree.isPilotTree && (
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          Pilot Tree
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {currentSelectedTree.speciesName} <span className="italic text-emerald-700 font-serif">({currentSelectedTree.tamilName})</span>
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize border ${
                    currentSelectedTree.status === 'healthy' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    currentSelectedTree.status === 'at-risk' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    currentSelectedTree.status === 'orphaned' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {currentSelectedTree.status}
                  </span>
                </div>

                {/* Ground Location / Landmark Card */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Precise Ground Landmark</span>
                      <p className="text-xs font-bold text-slate-900">{currentSelectedTree.landmark}</p>
                      <p className="text-[11px] text-slate-500">{currentSelectedTree.zone}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs font-mono text-slate-600">
                    <span>GPS: {currentSelectedTree.coordinates[0].toFixed(4)}°N, {currentSelectedTree.coordinates[1].toFixed(4)}°E</span>
                    <span className="text-emerald-700 font-semibold">Dist: ~24m</span>
                  </div>
                </div>

                {/* Reference Baseline Photo vs Last Verification */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                    <div className="p-1.5 bg-slate-200/80 text-[10px] font-mono text-slate-600 font-bold">
                      Planted Reference (Day 0)
                    </div>
                    <img 
                      src={currentSelectedTree.initialPhotoUrl} 
                      alt="Baseline" 
                      className="w-full h-24 object-cover" 
                    />
                  </div>
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-100">
                    <div className="p-1.5 bg-emerald-100/80 text-[10px] font-mono text-emerald-800 font-bold">
                      Latest Verified State
                    </div>
                    <img 
                      src={currentSelectedTree.currentPhotoUrl} 
                      alt="Current" 
                      className="w-full h-24 object-cover" 
                    />
                  </div>
                </div>

                {/* Custody & Checkpoint Summary */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Active Custodian:</span>
                    <span className="font-bold text-slate-900">{currentSelectedTree.currentCustodian}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Survival Health Score:</span>
                    <span className="font-bold text-emerald-700">{currentSelectedTree.healthScore}/100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Next Scheduled Checkpoint:</span>
                    <span className="font-mono text-slate-800">1 Year Audit (Aug 2025)</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => onOpenPassport(currentSelectedTree.id)}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Inspect Full Tree Passport
                </button>

                {onOpenVerification && (
                  <button
                    onClick={() => onOpenVerification(currentSelectedTree)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Perform Peer Verification
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 flex flex-col items-center justify-center h-full">
              <MapPin className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-semibold">Select a tree pin on the map to inspect locator details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
