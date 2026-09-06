import React, { useState } from 'react';
import { ActiveTab, ActiveRole } from '../types/custodia';
import { useLanguage } from '../context/LanguageContext';
import { 
  TreePine,
  LayoutDashboard, 
  FileText, 
  MapPin,
  ShieldCheck, 
  FileSpreadsheet, 
  Plus,
  Building2,
  Users,
  BarChart3,
  AlertTriangle,
  HelpCircle,
  Settings,
  Globe,
  ChevronLeft,
  ChevronRight,
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
  const { language, toggleLanguage, t } = useLanguage();
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

  const isItemActive = (id: string) => {
    if (id === 'custodian-view' && activeTab === 'custodian-view') return true;
    return activeTab === id;
  };

  return (
    <aside 
      className={`sidebar-forest text-white flex flex-col h-full overflow-y-auto overflow-x-hidden transition-all duration-300 ease-out flex-shrink-0 select-none ${
        isCollapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div 
        className={`p-4 pb-3 flex items-center border-b border-white/6 ${isCollapsed ? 'justify-center px-3' : 'gap-3'}`}
      >
        <div className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Seal_of_Tamil_Nadu.svg" alt="Seal of Tamil Nadu" className="w-full h-full object-contain drop-shadow-md" />
        </div>
        <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'}`}>
          <h1 className="font-bold text-white text-sm tracking-tight leading-tight whitespace-nowrap">
            {t('brand.title')}
          </h1>
          <span className="text-[9px] font-bold tracking-wider text-emerald-400/70 whitespace-nowrap block mt-0.5">
            {t('brand.subtitle')}
          </span>
        </div>

        {/* Collapse toggle */}
        {!isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="ml-auto p-1 rounded-lg hover:bg-white/5 text-emerald-400/50 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {isCollapsed && (
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white z-50 shadow-md"
            style={{ display: 'none' }}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className={`py-4 flex-1 space-y-5 overflow-x-hidden ${isCollapsed ? 'px-2' : 'px-3'}`}>
        
        {/* MAIN NAV */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <div className="text-[10px] font-semibold text-white/30 px-3 mb-2 uppercase tracking-wider">
              {t('navigation.main')}
            </div>
          )}

          {[
            { id: 'dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard, role: 'ADMIN' as const },
            { id: 'custodian-view', label: t('navigation.myTrees'), icon: TreePine, role: 'CUSTODIAN' as const },
            { id: 'verification-queue', label: t('navigation.verification'), icon: ShieldCheck, count: 2, role: 'PEER_VERIFIER' as const },
            { id: 'passport', label: t('navigation.treePassport'), icon: FileText, role: null },
            { id: 'map', label: t('navigation.map'), icon: MapPin, role: null },
            { id: 'risk-center', label: t('navigation.riskCenter'), icon: AlertTriangle, count: riskCount, role: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.id);

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.role === 'ADMIN' && activeRole !== 'ADMIN') onSelectRole('ADMIN');
                  if (item.role === 'CUSTODIAN' && activeRole !== 'CUSTODIAN') onSelectRole('CUSTODIAN');
                  if (item.role === 'PEER_VERIFIER' && activeRole !== 'PEER_VERIFIER') onSelectRole('PEER_VERIFIER');
                  onSelectTab(item.id as ActiveTab);
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full py-2 rounded-lg transition-all duration-150 flex items-center justify-between group overflow-hidden ${
                  isActive
                    ? 'bg-emerald-700/80 text-white font-semibold'
                    : 'text-white/50 hover:text-white hover:bg-white/5 font-medium'
                } ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-2.5'}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80 transition-colors'}`} />
                  <span className={`text-[13px] whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
                  }`}>
                    {item.label}
                  </span>
                </div>
                
                {!isCollapsed && item.count !== undefined && item.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-500/80 text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TOOLS */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <div className="text-[10px] font-semibold text-white/30 px-3 mb-2 uppercase tracking-wider">
              {t('navigation.tools')}
            </div>
          )}

          {[
            { id: 'impact-report', label: t('navigation.reports'), icon: FileSpreadsheet },
            { id: 'autopsy', label: 'Failure Insights', icon: BarChart3 },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as ActiveTab)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full py-2 rounded-lg transition-all duration-150 flex items-center group overflow-hidden ${
                  isActive
                    ? 'bg-emerald-700/80 text-white font-semibold'
                    : 'text-white/50 hover:text-white hover:bg-white/5 font-medium'
                } ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-2.5'}`}>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80 transition-colors'}`} />
                  <span className={`text-[13px] whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* SUPPORT */}
        <div className="space-y-0.5">
          {!isCollapsed && (
            <div className="text-[10px] font-semibold text-white/30 px-3 mb-2 uppercase tracking-wider">
              {t('navigation.support')}
            </div>
          )}

          {[
            { id: 'help', label: t('navigation.helpCenter'), icon: HelpCircle },
            { id: 'settings', label: t('navigation.settings'), icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  // Placeholder action
                }}
                title={isCollapsed ? item.label : undefined}
                className={`w-full py-2 rounded-lg transition-all duration-150 flex items-center group overflow-hidden text-white/50 hover:text-white hover:bg-white/5 font-medium ${
                  isCollapsed ? 'px-0 justify-center' : 'px-3'
                }`}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'gap-2.5'}`}>
                  <Icon className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors shrink-0" />
                  <span className={`text-[13px] whitespace-nowrap transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'
                  }`}>
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={`p-3 mt-auto border-t border-white/6 space-y-2.5 ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          title={isCollapsed ? (language === 'ta' ? "Switch to English" : "தமிழுக்கு மாறவும்") : undefined}
          className={`w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/6 text-white/70 text-xs font-medium flex items-center justify-center gap-2 transition-all ${
            isCollapsed ? 'p-2' : ''
          }`}
        >
          <Globe className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && (
            <span className="truncate">
              {language === 'ta' ? 'English' : 'தமிழ்'}
            </span>
          )}
        </button>

        {/* Register Tree */}
        <button
          onClick={onOpenRegisterTree}
          title={isCollapsed ? t('common.registerNewTree') : undefined}
          className={`rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold flex items-center justify-center shadow-sm transition-all ${
            isCollapsed ? 'w-full h-9 p-0' : 'w-full px-3 py-2 gap-2'
          }`}
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span className={`whitespace-nowrap ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
            {t('common.registerNewTree')}
          </span>
        </button>

        {/* Role Switcher (Demo) */}
        <div className={`bg-white/5 rounded-lg border border-white/6 ${isCollapsed ? 'p-1' : 'p-1.5'}`}>
          {!isCollapsed && (
            <span className="text-[9px] text-white/30 uppercase text-center font-semibold tracking-wider block py-0.5">
              Role View
            </span>
          )}
          
          {isCollapsed ? (
            <button
              onClick={toggleSidebar}
              title={`Role: ${activeRole}`}
              className="w-full h-8 rounded bg-white/10 text-white flex items-center justify-center"
            >
              {activeRole === 'ADMIN' && <Building2 className="w-3.5 h-3.5" />}
              {activeRole === 'CUSTODIAN' && <Users className="w-3.5 h-3.5" />}
              {activeRole === 'PEER_VERIFIER' && <ShieldCheck className="w-3.5 h-3.5" />}
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              {[
                { role: 'ADMIN' as const, icon: Building2, label: 'Admin' },
                { role: 'CUSTODIAN' as const, icon: Users, label: 'Cust.' },
                { role: 'PEER_VERIFIER' as const, icon: ShieldCheck, label: 'Verify' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.role}
                    onClick={() => onSelectRole(item.role)}
                    className={`py-1.5 rounded transition-all flex items-center justify-center gap-1 font-medium ${
                      activeRole === item.role
                        ? 'bg-emerald-700 text-white'
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
