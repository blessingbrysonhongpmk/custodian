import React, { useState, useEffect } from 'react';
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
  Building2,
  Users,
  ShieldCheck
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

  return (
    <aside 
      className={`bg-[#0B211A] text-white flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] flex-shrink-0 ${
        isCollapsed ? 'w-[76px]' : 'w-[310px]'
      }`}
    >
      {/* Brand Header */}
      <div 
        className={`p-6 pb-2 cursor-pointer transition-colors hover:bg-white/5 flex items-center ${isCollapsed ? 'justify-center px-0' : ''}`}
        onClick={toggleSidebar}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-[#10B981] to-[#047857] text-white flex items-center justify-center shadow-md">
            <Sprout className="w-5 h-5" />
          </div>
          <div className={`transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
            <h1 className="font-extrabold text-white text-lg tracking-tight leading-tight whitespace-nowrap">TREEGUARD</h1>
            <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider whitespace-nowrap block">
              Custody System
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className={`py-6 flex-1 space-y-1 overflow-x-hidden ${isCollapsed ? 'px-3' : 'px-4'}`}>
        <div className={`text-[11px] font-semibold text-[#8B9D96] mb-3 uppercase tracking-wider transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${isCollapsed ? 'opacity-0 w-0 px-0 h-0 overflow-hidden mb-0' : 'opacity-100 w-auto px-3 h-auto mb-3'}`}>
          Navigation
        </div>
        
        {[
          { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard, roles: ['ADMIN'] },
          { id: 'passport', label: 'Tree Passport (3D)', icon: FileText, roles: ['ADMIN', 'CUSTODIAN', 'PEER_VERIFIER'] },
          { id: 'map', label: 'Interactive Locator', icon: Map, roles: ['ADMIN'] },
          { id: 'risk-center', label: 'Risk Center', icon: ShieldAlert, count: riskCount, roles: ['ADMIN'] },
          { id: 'autopsy', label: 'Failure Insights', icon: AlertOctagon, roles: ['ADMIN'] },
          { id: 'custodian-view', label: 'My Trees', icon: Smartphone, roles: ['CUSTODIAN'] },
          { id: 'verification-queue', label: 'Verification Queue', icon: ShieldCheck, roles: ['PEER_VERIFIER'], count: 2 },
          { id: 'impact-report', label: 'Impact Report', icon: FileSpreadsheet, roles: ['ADMIN'] },
        ].filter(item => item.roles.includes(activeRole)).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id as ActiveTab);
              }}
              title={isCollapsed ? item.label : undefined}
              className={`w-full py-2.5 rounded-2xl transition-all duration-300 flex items-center justify-between group overflow-hidden ${
                isActive
                  ? 'bg-white/10 text-white font-medium shadow-sm'
                  : 'text-[#8B9D96] hover:text-white hover:bg-white/5'
              } ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}
            >
              <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-3'}`}>
                <div className="relative flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#10B981]' : 'text-[#8B9D96] group-hover:text-white transition-colors'}`} />
                  {isCollapsed && item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#F59E0B] border-2 border-[#0B211A]"></span>
                  )}
                </div>
                <span className={`text-sm whitespace-nowrap transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
                }`}>
                  {item.label}
                </span>
              </div>
              
              {!isCollapsed && (
                <div className="flex items-center gap-2 shrink-0">
                  {item.count !== undefined && item.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F59E0B] text-white">
                      {item.count}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action Button & Role Switcher */}
      <div className={`p-4 mt-auto border-t border-white/5 space-y-4 overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${isCollapsed ? 'px-2' : 'px-4'}`}>
        {activeRole === 'ADMIN' && (
          <button
            onClick={onOpenRegisterTree}
            title={isCollapsed ? "Register New Tree" : undefined}
            className={`rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold flex items-center justify-center shadow-lg transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              isCollapsed ? 'w-12 h-12 mx-auto p-0' : 'w-full px-4 py-3 gap-2'
            }`}
          >
            <Plus className="w-5 h-5 shrink-0" />
            <span className={`whitespace-nowrap transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
              Register New Tree
            </span>
          </button>
        )}

        <div className={`bg-white/5 rounded-2xl font-medium flex flex-col gap-1.5 border border-white/5 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${isCollapsed ? 'p-1' : 'p-2'}`}>
          <span className={`text-[10px] text-[#8B9D96] uppercase text-center tracking-wider transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${isCollapsed ? 'opacity-0 h-0 py-0 hidden' : 'opacity-100 h-auto py-1'}`}>
            Simulate Role
          </span>
          
          <div className="flex flex-col gap-1">
            {/* When collapsed, ONLY show the active role and make it act as an expand trigger */}
            {isCollapsed ? (
              <button
                onClick={() => setIsCollapsed(false)}
                title={`Active Role: ${activeRole.replace('_', ' ')} (Click to switch)`}
                className="w-10 h-10 mx-auto rounded-xl bg-white/10 text-white shadow-sm transition-all duration-300 flex items-center justify-center"
              >
                {activeRole === 'ADMIN' && <Building2 className="w-4 h-4 text-[#10B981]" />}
                {activeRole === 'CUSTODIAN' && <Users className="w-4 h-4 text-[#3B82F6]" />}
                {activeRole === 'PEER_VERIFIER' && <ShieldCheck className="w-4 h-4 text-[#8B5CF6]" />}
              </button>
            ) : (
              // When expanded, show all roles
              <>
                <button
                  onClick={() => onSelectRole('ADMIN')}
                  className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeRole === 'ADMIN'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-[#8B9D96] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Building2 className={`w-3.5 h-3.5 shrink-0 ${activeRole === 'ADMIN' ? 'text-[#10B981]' : ''}`} />
                  <span className="whitespace-nowrap">Org Admin</span>
                </button>
                <button
                  onClick={() => onSelectRole('CUSTODIAN')}
                  className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeRole === 'CUSTODIAN'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-[#8B9D96] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Users className={`w-3.5 h-3.5 shrink-0 ${activeRole === 'CUSTODIAN' ? 'text-[#3B82F6]' : ''}`} />
                  <span className="whitespace-nowrap">Custodian</span>
                </button>
                <button
                  onClick={() => onSelectRole('PEER_VERIFIER')}
                  className={`px-3 py-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    activeRole === 'PEER_VERIFIER'
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-[#8B9D96] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${activeRole === 'PEER_VERIFIER' ? 'text-[#8B5CF6]' : ''}`} />
                  <span className="whitespace-nowrap">Peer Verifier</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
