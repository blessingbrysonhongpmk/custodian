import React, { useState, useMemo } from 'react';
import { useDemoData, type AppUser } from '../context/DemoDataContext';
import { Tree, OrganizationReliability, RiskItem } from '../types/custodia';
import { useLanguage } from '../context/LanguageContext';
import { DashboardView } from './DashboardView';
import { RiskCenterView } from './RiskCenterView';
import { FailureInsightsView } from './FailureInsightsView';
import { ImpactReportView } from './ImpactReportView';
import { InteractiveMap } from './InteractiveMap';
import { NativeTreesView } from './NativeTreesView';
import {
  LayoutDashboard,
  TreePine,
  Users,
  ShieldCheck,
  AlertTriangle,
  FileText,
  ArrowRightLeft,
  BarChart3,
  FileSpreadsheet,
  Settings as SettingsIcon,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Edit,
  UserCheck,
  ChevronRight,
  X,
  Sparkles,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface AdminPortalProps {
  onOpenTree: (treeId: string) => void;
  onOpenRegisterTree: () => void;
  onOpenHandoff: (tree: Tree) => void;
  onOpenVerification: (tree: Tree) => void;
  onOpenAutopsy: (tree: Tree) => void;
}

type AdminNavTab = 
  | 'dashboard' 
  | 'trees' 
  | 'custodians' 
  | 'verifiers' 
  | 'verification' 
  | 'risk-center' 
  | 'passports' 
  | 'handovers' 
  | 'autopsy' 
  | 'reports' 
  | 'map'
  | 'settings';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onOpenTree,
  onOpenRegisterTree,
  onOpenHandoff,
  onOpenVerification,
  onOpenAutopsy,
}) => {
  const { 
    trees, 
    users, 
    currentUser, 
    reliability, 
    riskItems, 
    handoffRequests,
    assignCustodian,
    assignVerifier,
    refreshData
  } = useDemoData();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<AdminNavTab>('dashboard');
  const [treeSearch, setTreeSearch] = useState('');
  const [treeStatusFilter, setTreeStatusFilter] = useState<string>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Assignment Modal State
  const [assignModalTree, setAssignModalTree] = useState<Tree | null>(null);
  const [newCustodianName, setNewCustodianName] = useState<string>('Arun Kumar');
  const [newCustodianUnit, setNewCustodianUnit] = useState<string>('Loyola Green Club • NSS Unit 4');
  const [assignModalType, setAssignModalType] = useState<'custodian' | 'verifier'>('custodian');
  const [newVerifierName, setNewVerifierName] = useState<string>('Suresh R');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter trees
  const filteredTrees = useMemo(() => {
    return trees.filter(t => {
      const matchesQuery = 
        t.id.toLowerCase().includes(treeSearch.toLowerCase()) ||
        t.speciesName.toLowerCase().includes(treeSearch.toLowerCase()) ||
        t.currentCustodian.toLowerCase().includes(treeSearch.toLowerCase()) ||
        t.landmark.toLowerCase().includes(treeSearch.toLowerCase());
      
      const matchesStatus = 
        treeStatusFilter === 'ALL' ||
        (treeStatusFilter === 'healthy' && t.status === 'healthy') ||
        (treeStatusFilter === 'at-risk' && (t.status === 'at-risk' || t.status === 'orphaned')) ||
        (treeStatusFilter === 'failed' && t.status === 'failed');

      return matchesQuery && matchesStatus;
    });
  }, [trees, treeSearch, treeStatusFilter]);

  // Custodians Directory
  const custodiansList = useMemo(() => {
    return (users || []).filter(u => u.role === 'CUSTODIAN').map(c => {
      const assignedTrees = trees.filter(t => t.currentCustodian.toLowerCase().includes(c.name.toLowerCase()));
      return {
        ...c,
        assignedCount: assignedTrees.length,
        verifiedCount: assignedTrees.filter(t => t.status === 'healthy').length,
        atRiskCount: assignedTrees.filter(t => t.status === 'at-risk').length,
      };
    });
  }, [trees, users]);

  // Peer Verifiers Directory
  const verifiersList = useMemo(() => {
    return (users || []).filter(u => u.role === 'PEER_VERIFIER').map(v => {
      const pendingAudits = trees.filter(t => t.checkpoints.some(c => c.status === 'pending')).length;
      return {
        ...v,
        pendingAudits,
        verifiedTotal: 14,
      };
    });
  }, [trees, users]);

  const handleExecuteAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalTree) return;

    if (assignModalType === 'custodian') {
      assignCustodian(assignModalTree.id, newCustodianName, newCustodianUnit);
      showToast(`✅ Assigned ${newCustodianName} as Custodian for Tree ${assignModalTree.id}.`);
    } else {
      assignVerifier(assignModalTree.id, newVerifierName);
      showToast(`✅ Assigned ${newVerifierName} as Peer Verifier for Tree ${assignModalTree.id}.`);
    }

    setAssignModalTree(null);
  };

  const navItems: { id: AdminNavTab; labelEn: string; labelTa: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { id: 'dashboard', labelEn: 'Dashboard', labelTa: 'கட்டுப்பாட்டகம்', icon: LayoutDashboard },
    { id: 'trees', labelEn: 'Trees', labelTa: 'மரங்கள்', icon: TreePine, count: trees.length },
    { id: 'custodians', labelEn: 'Custodians', labelTa: 'பாதுகாவலர்கள்', icon: Users, count: custodiansList.length },
    { id: 'verifiers', labelEn: 'Peer Verifiers', labelTa: 'சரிபார்ப்பாளர்கள்', icon: ShieldCheck, count: verifiersList.length },
    { id: 'risk-center', labelEn: 'Risk Center', labelTa: 'அபாய மையம்', icon: AlertTriangle, count: riskItems.length },
    { id: 'handovers', labelEn: 'Handovers', labelTa: 'பொறுப்பு மாற்றங்கள்', icon: ArrowRightLeft, count: handoffRequests.length },
    { id: 'autopsy', labelEn: 'Failure Insights', labelTa: 'இழப்பு பகுப்பாய்வு', icon: BarChart3 },
    { id: 'reports', labelEn: 'Reports', labelTa: 'அறிக்கைகள்', icon: FileSpreadsheet },
    { id: 'map', labelEn: 'Map View', labelTa: 'வரைபடம்', icon: MapPin },
    { id: 'settings', labelEn: 'Settings', labelTa: 'அமைப்புகள்', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-12">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2 animate-rise max-w-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Control Center Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-900 text-white flex items-center justify-center text-xl font-black shrink-0 shadow-sm mt-0.5">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-200">
                Central Control Center
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Admin ID: {currentUser.id.toUpperCase()}
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {language === 'ta' ? 'மாநில ஆளுகை கட்டுப்பாட்டகம்' : 'Program Directorate Command Center'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Full administrative authority over trees, custodians, verification audits, and custody handovers.
            </p>
          </div>
        </div>

        {/* Primary Admin Action */}
        <div className="flex items-center gap-2.5 self-end md:self-center">
          <button
            onClick={onOpenRegisterTree}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ta' ? 'புதிய மரம் பதிவு' : 'Register New Tree'}</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-200">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? item.labelTa : item.labelEn}</span>
              {item.count !== undefined && item.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE DASHBOARD */}
      {activeTab === 'dashboard' && (
        <DashboardView
          reliability={reliability}
          riskItems={riskItems}
          trees={trees}
          onOpenTree={onOpenTree}
          onOpenHandoff={onOpenHandoff}
          onOpenRiskCenter={() => setActiveTab('risk-center')}
          onOpenAutopsy={() => setActiveTab('autopsy')}
        />
      )}

      {/* TAB 2: TREES MANAGEMENT */}
      {activeTab === 'trees' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search trees, custodians, locations..."
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                className="w-full bg-slate-50 pl-9 pr-4 py-2 rounded-xl text-xs font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs text-slate-500 font-semibold">Filter:</span>
              {['ALL', 'healthy', 'at-risk', 'failed'].map((s) => (
                <button
                  key={s}
                  onClick={() => setTreeStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all uppercase cursor-pointer ${
                    treeStatusFilter === s
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s === 'healthy' ? 'Verified Alive' : s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Tree ID</th>
                    <th className="py-3 px-4">Species</th>
                    <th className="py-3 px-4">Custodian</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Health / Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredTrees.map((tree) => (
                    <tr key={tree.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {tree.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{tree.speciesName}</div>
                        <div className="text-[11px] text-slate-400 italic">{tree.botanicalName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{tree.currentCustodian}</span>
                        <div className="text-[10px] text-slate-400">{tree.currentCustodianUnit}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {tree.landmark}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tree.status === 'healthy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tree.status === 'at-risk'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {tree.status === 'healthy' ? 'VERIFIED ALIVE' : tree.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => {
                            setAssignModalTree(tree);
                            setAssignModalType('custodian');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-all cursor-pointer"
                          title="Assign or reassign custodian"
                        >
                          Assign Custodian
                        </button>
                        <button
                          onClick={() => {
                            setAssignModalTree(tree);
                            setAssignModalType('verifier');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition-all cursor-pointer"
                          title="Assign peer verifier"
                        >
                          Assign Verifier
                        </button>
                        <button
                          onClick={() => onOpenTree(tree.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-all cursor-pointer"
                        >
                          Passport →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTODIANS DIRECTORY */}
      {activeTab === 'custodians' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">
              Registered Program Custodians ({custodiansList.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {custodiansList.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${c.avatarBg} text-white flex items-center justify-center text-base font-black shrink-0`}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-500">{c.roleTitle}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{c.location}</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-xl text-center text-xs">
                  <div>
                    <span className="block font-black text-slate-900">{c.assignedCount}</span>
                    <span className="text-[10px] text-slate-400 uppercase">Assigned</span>
                  </div>
                  <div>
                    <span className="block font-black text-emerald-700">{c.verifiedCount}</span>
                    <span className="text-[10px] text-emerald-600 uppercase">Verified</span>
                  </div>
                  <div>
                    <span className="block font-black text-amber-700">{c.atRiskCount}</span>
                    <span className="text-[10px] text-amber-600 uppercase">At Risk</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                  {c.organization}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PEER VERIFIERS DIRECTORY */}
      {activeTab === 'verifiers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">
              Field Auditors & Peer Verifiers ({verifiersList.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {verifiersList.map((v) => (
              <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-xl ${v.avatarBg} text-white flex items-center justify-center text-base font-black shrink-0`}>
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{v.name}</h3>
                    <p className="text-xs text-indigo-700 font-semibold">{v.roleTitle}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{v.organization}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-indigo-50/40 p-2.5 rounded-xl text-center text-xs">
                  <div>
                    <span className="block font-black text-slate-900">{v.pendingAudits}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Pending Audits</span>
                  </div>
                  <div>
                    <span className="block font-black text-indigo-700">{v.verifiedTotal}</span>
                    <span className="text-[10px] text-indigo-600 uppercase">Total Audited</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 italic">{v.bio}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RISK CENTER */}
      {activeTab === 'risk-center' && (
        <RiskCenterView
          riskItems={riskItems}
          trees={trees}
          onOpenTree={onOpenTree}
          onOpenHandoff={onOpenHandoff}
          onOpenVerification={onOpenVerification}
          onOpenAutopsy={onOpenAutopsy}
        />
      )}

      {/* TAB 6: HANDOVERS HISTORY */}
      {activeTab === 'handovers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 tracking-tight uppercase">
              Custody Transfer Log & Chain of Responsibility ({handoffRequests.length})
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm divide-y divide-slate-100">
            {handoffRequests.map((req) => (
              <div key={req.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="tn-tree-code font-mono font-bold px-2 py-0.5 rounded">
                      {req.treeId}
                    </span>
                    <span className="font-bold text-slate-900">{req.treeSpecies}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    From: <strong>{req.fromCustodianName}</strong> → Successor: <strong>{req.toCustodianName}</strong>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">Reason: {req.reason} • Landmark: {req.landmark}</p>
                </div>

                <button
                  onClick={() => onOpenTree(req.treeId)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold self-end sm:self-center cursor-pointer"
                >
                  View Custody Chain →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: FAILURE INSIGHTS */}
      {activeTab === 'autopsy' && (
        <FailureInsightsView
          trees={trees}
          onOpenTree={onOpenTree}
          onOpenAutopsyModal={onOpenAutopsy}
        />
      )}

      {/* TAB 8: REPORTS */}
      {activeTab === 'reports' && (
        <ImpactReportView
          reliability={reliability}
          trees={trees}
        />
      )}

      {/* TAB 9: MAP VIEW */}
      {activeTab === 'map' && (
        <InteractiveMap
          trees={trees}
          selectedTreeId={trees[0]?.id || 'TG-IND-001'}
          onSelectTree={(t) => onOpenTree(t.id)}
          onOpenPassport={onOpenTree}
          onOpenVerification={onOpenVerification}
        />
      )}

      {/* TAB 10: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-5">
          <h3 className="text-base font-bold text-slate-900">Program Directorate Settings</h3>
          <p className="text-xs text-slate-500">
            Statewide platform configuration, backend synchronization, and system parameters.
          </p>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-900">Database & Registry Synchronization</h4>
            <p className="text-xs text-emerald-800 leading-relaxed">
              Synchronize live tree records, verified checkpoints, custody transfers, and user credentials from the central state database.
            </p>
            <button
              onClick={async () => {
                await refreshData();
                showToast("🔄 State database synchronized successfully.");
              }}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Synchronize Backend State</span>
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-slate-800">State Environmental Registry Info</h4>
            <div className="space-y-1 text-slate-600 font-mono text-[11px]">
              <div>• Authority: Government of Tamil Nadu (DECC&F)</div>
              <div>• Backend: PostgreSQL (Drizzle ORM) + Express API</div>
              <div>• Total Registered Trees: {trees.length}</div>
              <div>• Registered Network Users: {(users || []).length}</div>
              <div>• Active Admin: {currentUser.name} ({currentUser.email})</div>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGNMENT MODAL */}
      {assignModalTree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {assignModalType === 'custodian' ? 'Assign Tree Custodian' : 'Assign Field Verifier'}
                </h3>
                <p className="text-xs text-slate-500">Tree {assignModalTree.id} • {assignModalTree.speciesName}</p>
              </div>
              <button onClick={() => setAssignModalTree(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAssignment} className="space-y-3.5 text-xs">
              {assignModalType === 'custodian' ? (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Select Custodian</label>
                    <select
                      value={newCustodianName}
                      onChange={(e) => {
                        setNewCustodianName(e.target.value);
                        const found = (users || []).find(u => u.name === e.target.value);
                        if (found) setNewCustodianUnit(found.organization);
                      }}
                      className="w-full p-2.5 rounded-lg border border-slate-200 font-medium"
                    >
                      {(users || []).filter(u => u.role === 'CUSTODIAN').map(u => (
                        <option key={u.id} value={u.name}>{u.name} ({u.location})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Organization / Campus Unit</label>
                    <input
                      type="text"
                      value={newCustodianUnit}
                      onChange={(e) => setNewCustodianUnit(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Peer Verifier</label>
                  <select
                    value={newVerifierName}
                    onChange={(e) => setNewVerifierName(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 font-medium"
                  >
                    {(users || []).filter(u => u.role === 'PEER_VERIFIER').map(u => (
                      <option key={u.id} value={u.name}>{u.name} ({u.location})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalTree(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
