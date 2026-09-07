import React, { useState, useRef, useEffect } from 'react';
import { useDemoData, PRESET_DEMO_USERS, type DemoUser } from '../context/DemoDataContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  ShieldCheck, 
  Building2, 
  ChevronDown, 
  Check, 
  Sparkles,
  ArrowRightLeft,
  UserCheck
} from 'lucide-react';

export const DemoUserSwitcher: React.FC = () => {
  const { currentUser, switchUser } = useDemoData();
  const { setActiveRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = (user: DemoUser) => {
    switchUser(user.id);
    setActiveRole(user.role);
    setIsOpen(false);
  };

  const getRoleBadgeColor = (role: DemoUser['role']) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CUSTODIAN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'PEER_VERIFIER':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    }
  };

  const getRoleIcon = (role: DemoUser['role']) => {
    switch (role) {
      case 'ADMIN':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'CUSTODIAN':
        return <Users className="w-3.5 h-3.5" />;
      case 'PEER_VERIFIER':
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        type="button"
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-600 shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
        title="Switch Demo Identity & Role"
      >
        <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          DEMO MODE
        </span>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div className="text-left leading-none hidden sm:block">
            <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-800 transition-colors">
              {currentUser.name}
            </span>
            <span className="block text-[10px] text-slate-500 font-medium capitalize mt-0.5">
              {currentUser.role === 'ADMIN' ? 'State Admin' : currentUser.role === 'PEER_VERIFIER' ? 'Peer Verifier' : 'Custodian'}
            </span>
          </div>
        </div>

        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-fade-in font-sans">
          <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-900">Switch Demo Perspective</p>
              <p className="text-[10px] text-slate-500">Shared database • Instant role switch</p>
            </div>
            <ArrowRightLeft className="w-4 h-4 text-emerald-700" />
          </div>

          <div className="p-2 space-y-1 max-h-[380px] overflow-y-auto">
            {PRESET_DEMO_USERS.map((user) => {
              const isCurrent = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start justify-between gap-2.5 cursor-pointer ${
                    isCurrent 
                      ? 'bg-emerald-50/80 border border-emerald-300' 
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`w-8 h-8 rounded-full ${user.avatarBg} text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{user.name}</span>
                        {isCurrent && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-700 text-white">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">
                        {user.roleTitle}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[170px]">
                        {user.organization}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shrink-0 ${getRoleBadgeColor(user.role)}`}>
                    {getRoleIcon(user.role)}
                    <span>{user.role === 'ADMIN' ? 'Admin' : user.role === 'PEER_VERIFIER' ? 'Verifier' : 'Custodian'}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-3 pt-2 pb-1 border-t border-slate-100 text-[10px] text-slate-500 bg-slate-50/50 rounded-b-2xl">
            💡 All roles read/write the same live tree records and custody chain.
          </div>
        </div>
      )}
    </div>
  );
};
