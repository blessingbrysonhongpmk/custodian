import React, { useState, useMemo } from 'react';
import { useDemoData, type DemoUser } from '../context/DemoDataContext';
import { Tree } from '../types/custodia';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  Users,
  TreePine,
  ShieldCheck,
  MapPin,
  CheckCircle2,
  Calendar,
  ChevronRight,
  X,
  Building2,
  Leaf,
  Activity,
  Award,
  ArrowRight
} from 'lucide-react';

interface CustodianDiscoverProps {
  onOpenTree: (treeId: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

export const CustodianDiscoverModal: React.FC<CustodianDiscoverProps> = ({
  onOpenTree,
  onClose,
  isModal = false,
}) => {
  const { trees, users, searchAll } = useDemoData();
  const { language } = useLanguage();
  const [query, setQuery] = useState('');
  const [selectedCustodian, setSelectedCustodian] = useState<DemoUser | null>(null);

  // Live search results
  const searchResults = useMemo(() => {
    return searchAll(query);
  }, [searchAll, query]);

  // If a custodian profile is selected, fetch their trees from the shared database
  const selectedCustodianTrees = useMemo(() => {
    if (!selectedCustodian) return [];
    return trees.filter(t => 
      t.currentCustodian.toLowerCase().includes(selectedCustodian.name.toLowerCase()) ||
      selectedCustodian.name.toLowerCase().includes(t.currentCustodian.toLowerCase())
    );
  }, [trees, selectedCustodian]);

  const verifiedCount = selectedCustodianTrees.filter(t => t.status === 'healthy').length;
  const checkpointsDueCount = selectedCustodianTrees.filter(t => 
    t.checkpoints.some(c => c.status === 'pending') || t.status === 'verification-pending'
  ).length;

  const content = (
    <div className="flex flex-col h-full space-y-5 font-sans">
      {/* Search Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'பாதுகாவலர்களைக் கண்டறிக' : 'Discover Custodians'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {language === 'ta' 
                ? 'பொது பராமரிப்பு செயல்பாடுகள் மற்றும் மர விவரங்களை தேடவும்' 
                : 'Search custodian stewardship, public tree records, and district locations'}
            </p>
          </div>
          {onClose && isModal && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'ta' ? 'பாதுகாவலர் பெயர், மர எண் (TG-IND-001), மாவட்டம்...' : 'Search custodians, tree IDs, locations, organizations...'}
            className="w-full bg-white pl-10 pr-10 py-3 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition-all placeholder:text-slate-400 shadow-2xs"
            autoFocus={isModal}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Split: Results vs Profile Modal/Pane */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 min-h-[420px]">
        {/* Left / Main: Search Results */}
        <div className={`space-y-4 ${selectedCustodian ? 'md:col-span-6' : 'md:col-span-12'}`}>
          {/* Custodians Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>{language === 'ta' ? 'பாதுகாவலர்கள்' : 'Custodians'} ({searchResults.custodians.length})</span>
              <span className="text-[10px] text-emerald-700 font-semibold lowercase">click to view profile</span>
            </div>

            {searchResults.custodians.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                No custodians match "{query}"
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {searchResults.custodians.map((c) => {
                  const isSelected = selectedCustodian?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCustodian(c)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected 
                          ? 'bg-emerald-50 border-emerald-600 shadow-xs' 
                          : 'bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60 shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-full ${c.avatarBg} text-white flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 shadow-2xs`}>
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate flex items-center gap-1.5">
                            <span>{c.name}</span>
                          </h4>
                          <p className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{c.location}</span>
                          </p>
                          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-emerald-800">
                            <span className="px-2 py-0.5 bg-emerald-100/70 rounded-md">
                              {c.assignedTreesCount} {c.assignedTreesCount === 1 ? 'tree' : 'trees'}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="text-emerald-700">
                              {c.verifiedTreesCount} verified
                            </span>
                          </div>
                        </div>
                      </div>

                      <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isSelected ? 'rotate-90 text-emerald-700' : ''}`} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Trees Section */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
              <span>{language === 'ta' ? 'மரங்கள்' : 'Trees Found'} ({searchResults.trees.length})</span>
              <span className="text-[10px] text-emerald-700 font-semibold lowercase">click to open passport</span>
            </div>

            {searchResults.trees.length === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center">
                No tree records match "{query}"
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.trees.map((tree) => (
                  <div
                    key={tree.id}
                    onClick={() => onOpenTree(tree.id)}
                    className="p-3 bg-white border border-slate-200 hover:border-emerald-400 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                        <img src={tree.currentPhotoUrl} alt={tree.speciesName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="tn-tree-code text-[11px] font-mono px-2 py-0.5 rounded font-bold">
                            {tree.id}
                          </span>
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {tree.speciesName}
                          </span>
                          {tree.tamilName && (
                            <span className="text-[11px] text-slate-500 truncate hidden sm:inline">
                              ({tree.tamilName})
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{tree.landmark}</span>
                          <span className="text-slate-300">•</span>
                          <span>Custodian: <strong className="text-slate-700">{tree.currentCustodian}</strong></span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        tree.status === 'healthy' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : tree.status === 'at-risk' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {tree.status === 'healthy' ? 'VERIFIED ALIVE' : tree.status.toUpperCase()}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Selected Custodian Public Profile */}
        {selectedCustodian && (
          <div className="md:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col animate-fade-in">
            {/* Profile Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl ${selectedCustodian.avatarBg} text-white flex items-center justify-center text-xl font-black shadow-sm`}>
                  {selectedCustodian.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {selectedCustodian.name}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Custodian
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {selectedCustodian.roleTitle}
                  </p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{selectedCustodian.organization}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCustodian(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
                title="Close Profile Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Responsibility Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-1.5">
                <span className="block text-lg font-black text-slate-900">{selectedCustodianTrees.length}</span>
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Under Care</span>
              </div>
              <div className="p-1.5 border-x border-slate-200">
                <span className="block text-lg font-black text-emerald-700">{verifiedCount}</span>
                <span className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Verified</span>
              </div>
              <div className="p-1.5">
                <span className="block text-lg font-black text-amber-700">{checkpointsDueCount}</span>
                <span className="block text-[10px] font-bold text-amber-600 uppercase tracking-wider">Audits Due</span>
              </div>
            </div>

            {/* Bio / Verification Note */}
            <div className="text-xs text-slate-600 bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl leading-relaxed">
              <p className="font-semibold text-emerald-950 mb-0.5 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                Stewardship Bio & Oath
              </p>
              <p>{selectedCustodian.bio}</p>
            </div>

            {/* MY TREE ACTIVITY */}
            <div className="space-y-2 flex-1 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-700" />
                <span>Tree Stewardship Activity ({selectedCustodianTrees.length})</span>
              </h4>

              {selectedCustodianTrees.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-3 text-center">
                  No trees currently assigned to this custodian.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedCustodianTrees.map((tree) => (
                    <div
                      key={tree.id}
                      onClick={() => onOpenTree(tree.id)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white transition-all cursor-pointer flex items-center justify-between gap-2 shadow-2xs group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={tree.currentPhotoUrl} 
                          alt={tree.speciesName} 
                          className="w-9 h-9 rounded-lg object-cover shrink-0 border border-slate-200" 
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                              {tree.id}
                            </span>
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {tree.speciesName}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">
                            {tree.landmark}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          tree.status === 'healthy' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tree.status === 'healthy' ? 'VERIFIED ALIVE' : 'CHECKPOINT DUE'}
                        </span>
                        <span className="block text-[10px] text-emerald-700 font-bold group-hover:underline mt-0.5">
                          View Tree →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-center">
              🔒 Public Environmental Accountability Profile • Demo Environment
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!isModal) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {content}
      </div>
    </div>
  );
};
