import React from 'react';
import { ActiveTab, ActiveRole } from '../types/custodia';
import { 
  Sprout, 
  LayoutDashboard, 
  FileText, 
  Map, 
  ShieldAlert, 
  AlertOctagon, 
  Smartphone, 
  FileSpreadsheet, 
  Plus,
  UserCheck,
  Building2,
  Users,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeRole: ActiveRole;
  onSelectRole: (role: ActiveRole) => void;
  onOpenRegisterTree: () => void;
  riskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  activeRole,
  onSelectRole,
  onOpenRegisterTree,
  riskCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-2xs">
      {/* Top Brand Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center shadow-xs">
              <Sprout className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-950 text-sm tracking-tight">TREEGUARD</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-200">
                  Custody Continuity Platform
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 hidden sm:block">
                Every tree has a caretaker. Every caretaker has a successor.
              </p>
            </div>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase hidden md:inline">Simulate Role:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => onSelectRole('ADMIN')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeRole === 'ADMIN'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Org Admin</span>
            </button>
            <button
              onClick={() => onSelectRole('CUSTODIAN')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeRole === 'CUSTODIAN'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Custodian</span>
            </button>
            <button
              onClick={() => onSelectRole('PEER_VERIFIER')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeRole === 'PEER_VERIFIER'
                  ? 'bg-white text-slate-900 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Peer Verifier</span>
            </button>
          </div>

          <button
            onClick={onOpenRegisterTree}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Register Tree</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar text-xs font-semibold">
          {[
            { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
            { id: 'passport', label: 'Tree Passport (3D)', icon: FileText, badge: 'Pilot' },
            { id: 'map', label: 'Interactive Locator Map', icon: Map },
            { id: 'risk-center', label: 'Survival Risk Center', icon: ShieldAlert, count: riskCount },
            { id: 'autopsy', label: 'Failure Insights', icon: AlertOctagon },
            { id: 'custodian-view', label: 'Custodian Mobile View', icon: Smartphone },
            { id: 'impact-report', label: 'Impact & Audit Report', icon: FileSpreadsheet },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveTab)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-amber-500 text-white font-bold">
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-emerald-600 text-white font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
