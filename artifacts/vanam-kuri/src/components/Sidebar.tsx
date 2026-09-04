import React, { useState } from 'react';
import { ActiveTab, ActiveRole } from '../types/custodia';
import { 
  Sprout, 
  LayoutDashboard, 
  FileText, 
  Map, 
  ShieldCheck, 
  Smartphone, 
  FileSpreadsheet, 
  Plus,
  Building2,
  Users,
  BarChart3,
  Bell,
  HelpCircle,
  Settings,
  TreePine,
  MapPin,
  Leaf
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  activeRole: ActiveRole;
  onSelectRole: (role: ActiveRole) => void;
  onOpenRegisterTree: () => void;
  riskCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeRole,
  onSelectRole,
  onOpenRegisterTree,
  riskCount,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('treeguard_sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('treeguard_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Check if item is active
  const isItemActive = (id: string) => {
    if (id === 'custodian-view' && (activeTab === 'custodian-view' || activeRole === 'CUSTODIAN')) {
      return activeTab === 'custodian-view';
    }
    return activeTab === id;
  };

  return (
    <aside 
      className={`sidebar-forest text-white flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] flex-shrink-0 select-none ${
        isCollapsed ? 'w-[76px]' : 'w-[280px]'
      }`}
    >
      {/* Brand Header with TN Gov Logo */}
      <div 
        className={`p-5 pb-4 cursor-pointer transition-colors hover:bg-white/5 flex items-center border-b border-white/5 ${isCollapsed ? 'justify-center px-0' : ''}`}
        onClick={toggleSidebar}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center shadow-md overflow-hidden p-1">
            <img src="/tn-gov-logo.svg" alt="Tamil Nadu Government" className="w-full h-full object-contain filter brightness-110" />
          </div>
          <div className={`transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <h1 className="font-extrabold text-white text-base tracking-wide leading-tight whitespace-nowrap">
              VANAM KURI
            </h1>
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest whitespace-nowrap block mt-0.5">
              GOVT. OF TAMIL NADU
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className={`py-4 flex-1 space-y-5 overflow-x-hidden ${isCollapsed ? 'px-3' : 'px-3.5'}`}>
        
        {/* 1. MAIN */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-emerald-500/70 px-3 mb-2 uppercase tracking-widest">
              MAIN
            </div>
          )}

          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, role: 'ADMIN' },
            { id: 'passport', label: 'Tree Passport (3D)', icon: FileText, role: 'ALL' },
            { id: 'custodian-view', label: 'My Trees', icon: TreePine, role: 'CUSTODIAN' },
            { id: 'custodian-view-full', label: 'Custodian', icon: Users, role: 'CUSTODIAN' },
            { id: 'verification-queue', label: 'Peer Verifier', icon: ShieldCheck, count: 2, role: 'PEER_VERIFIER' },
            { id: 'map', label: 'Map View', icon: MapPin, role: 'ALL' },
          ].map((item) => {
            const Icon = item.icon;
            const targetTab = item.id === 'custodian-view-full' ? 'custodian-view' : item.id;
            const isActive = isItemActive(targetTab);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.role === 'ADMIN' && activeRole !== 'ADMIN') onSelectRole('ADMIN');
                  if (item.role === 'CUSTODIAN' && activeRole !== 'CUSTODIAN') onSelectRole('CUSTODIAN');
                  if (item.role === 'PEER_VERIFIER' && activeRole !== 'PEER_VERIFIER') onSelectRole('PEER_VERIFIER');
                  onSelectTab(targetTab as ActiveTab);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group overflow-hidden ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/5 font-medium'
                } ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                  <div className="relative flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-300/70 group-hover:text-white transition-colors'}`} />
                  </div>
                  <span className={`text-xs whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                {!isCollapsed && item.count !== undefined && item.count > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-emerald-700' : 'bg-amber-500 text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2. TOOLS */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-emerald-500/70 px-3 mb-2 uppercase tracking-widest">
              TOOLS
            </div>
          )}

          {[
            { id: 'impact-report', label: 'Reports', icon: FileSpreadsheet },
            { id: 'autopsy', label: 'Analytics', icon: BarChart3 },
            { id: 'notifications', label: 'Notifications', icon: Bell, count: 3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'notifications') {
                    // Open notifications or switch to recent alerts
                    onSelectTab('risk-center');
                  } else {
                    onSelectTab(item.id as ActiveTab);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group overflow-hidden ${
                  isActive
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                    : 'text-emerald-100/70 hover:text-white hover:bg-white/5 font-medium'
                } ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                  <div className="relative flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-300/70 group-hover:text-white transition-colors'}`} />
                  </div>
                  <span className={`text-xs whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                {!isCollapsed && item.count !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 3. SUPPORT */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="text-[10px] font-bold text-emerald-500/70 px-3 mb-2 uppercase tracking-widest">
              SUPPORT
            </div>
          )}

          {[
            { id: 'help', label: 'Help Center', icon: HelpCircle },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  // Trigger helpful toast or info
                  alert("Government of Tamil Nadu • Vanam Kuri Support Desk is available at support@vanamkuri.tn.gov.in");
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group overflow-hidden text-emerald-100/70 hover:text-white hover:bg-white/5 font-medium ${
                  isCollapsed ? 'px-0 justify-center' : 'px-3'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                  <Icon className="w-4 h-4 text-emerald-300/70 group-hover:text-white transition-colors shrink-0" />
                  <span className={`text-xs whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* 4. Promotional Nature Card (from reference image!) */}
        {!isCollapsed && (
          <div className="pt-2">
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-emerald-500/20 group">
              <img 
                src="https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80" 
                alt="Forest Canopy" 
                className="w-full h-36 object-cover filter brightness-[0.75] group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-3.5 text-white">
                <p className="font-bold text-xs leading-snug tracking-tight text-emerald-100 mb-2">
                  Every Tree We Protect, Protects Us.
                </p>
                <div className="inline-flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-[10px] font-bold text-white px-2.5 py-1 rounded-full w-fit transition-colors">
                  <span>Plant. Protect. Preserve.</span>
                  <Leaf className="w-3 h-3 text-emerald-300" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button & Role Switcher */}
      <div className={`p-3.5 mt-auto border-t border-white/5 space-y-3 overflow-hidden transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-3.5'}`}>
        <button
          onClick={onOpenRegisterTree}
          title={isCollapsed ? "Register Tree" : undefined}
          className={`rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-md transition-all ${
            isCollapsed ? 'w-10 h-10 mx-auto p-0' : 'w-full px-3 py-2.5 gap-2'
          }`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
            Register New Tree
          </span>
        </button>

        {/* Role Simulator */}
        <div className={`bg-white/5 rounded-xl font-medium flex flex-col gap-1 border border-white/5 ${isCollapsed ? 'p-1' : 'p-1.5'}`}>
          <span className={`text-[9px] text-emerald-300/60 uppercase text-center font-bold tracking-wider ${isCollapsed ? 'opacity-0 h-0 py-0 hidden' : 'opacity-100 h-auto py-0.5'}`}>
            Simulate Role
          </span>
          
          <div className="flex flex-col gap-1">
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                title={`Active Role: ${activeRole.replace('_', ' ')} (Click to switch)`}
                className="w-9 h-9 mx-auto rounded-lg bg-white/10 text-white shadow-sm flex items-center justify-center"
              >
                {activeRole === 'ADMIN' && <Building2 className="w-4 h-4 text-emerald-400" />}
                {activeRole === 'CUSTODIAN' && <Users className="w-4 h-4 text-emerald-300" />}
                {activeRole === 'PEER_VERIFIER' && <ShieldCheck className="w-4 h-4 text-emerald-200" />}
              </button>
            ) : (
              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <button
                  onClick={() => onSelectRole('ADMIN')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 font-semibold ${
                    activeRole === 'ADMIN'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building2 className="w-3 h-3" />
                  <span>Admin</span>
                </button>
                <button
                  onClick={() => onSelectRole('CUSTODIAN')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 font-semibold ${
                    activeRole === 'CUSTODIAN'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>Cust</span>
                </button>
                <button
                  onClick={() => onSelectRole('PEER_VERIFIER')}
                  className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 font-semibold ${
                    activeRole === 'PEER_VERIFIER'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-emerald-200/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>Peer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

