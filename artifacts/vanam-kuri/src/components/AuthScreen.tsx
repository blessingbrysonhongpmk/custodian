import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { TamilNaduSeal } from './TamilNaduSeal';
import {
  Users,
  ShieldCheck,
  Building2,
  ChevronRight,
  ArrowLeft,
  Globe,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

interface AuthScreenProps {
  onBack: () => void;
  onSuccess?: (role: UserRole) => void;
  defaultRole?: UserRole;
}

type AuthMode = 'select-role' | 'custodian-choice' | 'login' | 'register';

export const AuthScreen: React.FC<AuthScreenProps> = ({ 
  onBack, 
  onSuccess,
  defaultRole = 'custodian' 
}) => {
  const { signIn, signUp } = useAuth();
  const { language, toggleLanguage } = useLanguage();

  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [authMode, setAuthMode] = useState<AuthMode>('select-role');

  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('Chennai, Tamil Nadu');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);

    if (role === 'custodian') {
      // Show "Are you already registered?" step
      setAuthMode('custodian-choice');
    } else {
      // For Admin & Verifier, show direct authenticated login
      setAuthMode('login');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const user = await signIn(identifier, password, selectedRole);
      if (onSuccess) {
        onSuccess(user.role);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const user = await signUp({
        name: fullName,
        email: identifier,
        phone,
        password,
        role: selectedRole,
        organization,
        location,
      });

      if (onSuccess) {
        onSuccess(user.role);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  const rolesList: { id: UserRole; title: string; titleTa: string; desc: string; descTa: string; icon: any }[] = [
    {
      id: 'custodian',
      title: 'Tree Custodian',
      titleTa: 'மரப் பாதுகாவலர்',
      desc: 'Manage your assigned trees, log watering, and submit milestone checkpoints.',
      descTa: 'ஒதுக்கப்பட்ட மரங்களை நிர்வகித்தல், பராமரிப்பு சான்றுகளை சமர்ப்பித்தல்.',
      icon: Users,
    },
    {
      id: 'verifier',
      title: 'Peer Verifier',
      titleTa: 'கள சரிபார்ப்பாளர்',
      desc: 'Review photographic evidence, inspect coordinates, and verify tree survival milestones.',
      descTa: 'மரங்களின் வளர்ச்சி புகைப்பட சான்றுகளை ஆய்வு செய்து உறுதிப்படுத்துதல்.',
      icon: ShieldCheck,
    },
    {
      id: 'admin',
      title: 'State Administrator',
      titleTa: 'அரசு நிர்வாகி',
      desc: 'Central governance command center: trees, custodians, risk queue, and reports.',
      descTa: 'மரங்கள், பொறுப்புகள், கள தணிக்கை மற்றும் முழு கணினி செயல்பாட்டை மேற்பார்வையிடுதல்.',
      icon: Building2,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col justify-between p-4 sm:p-8 font-sans selection:bg-[#006A4E] selection:text-white">
      {/* Top Header */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-4">
        <button
          onClick={() => {
            if (authMode !== 'select-role') {
              setAuthMode('select-role');
              setErrorMessage(null);
            } else {
              onBack();
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#006A4E] transition-colors p-2 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{authMode !== 'select-role' ? (language === 'ta' ? 'பின்னே செல்' : 'Change Role') : (language === 'ta' ? 'முகப்பு' : 'Back to Home')}</span>
        </button>

        {/* Bilingual Language Switcher */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-200 text-slate-700 hover:border-emerald-600 hover:text-emerald-700 transition-all shadow-2xs cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-[#006A4E]" />
          <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
        </button>
      </header>

      {/* Main Form Container */}
      <main className="max-w-md mx-auto w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 my-auto">
        {/* Brand & Seal */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <TamilNaduSeal size={52} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {language === 'ta' ? 'பசுமை காவல்' : 'Pasumai Kaval'}
          </h1>
          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            {language === 'ta' ? 'தமிழ்நாடு அரசு சுற்றுச்சூழல் ஆளுகை' : 'Government of Tamil Nadu Environmental Governance'}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 flex items-start gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SCREEN 1: SELECT YOUR ROLE */}
        {authMode === 'select-role' && (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <h2 className="text-base font-bold text-slate-800">
                {language === 'ta' ? 'உங்கள் பொறுப்பைத் தேர்ந்தெடுக்கவும்' : 'Select your role to continue'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {language === 'ta' 
                  ? 'பாதுகாவலர், சரிபார்ப்பாளர் அல்லது நிர்வாகி கணக்கில் நுழையவும்'
                  : 'Enter as an assigned custodian, field auditor, or state administrator'}
              </p>
            </div>

            <div className="space-y-2.5">
              {rolesList.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleRoleSelect(r.id)}
                    className="w-full p-4 rounded-xl border border-slate-200 hover:border-[#006A4E] hover:bg-emerald-50/40 text-left transition-all cursor-pointer flex items-start justify-between gap-3 shadow-2xs group"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#006A4E] group-hover:text-white text-slate-600 flex items-center justify-center shrink-0 transition-colors mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#004D38] transition-colors">
                          {language === 'ta' ? r.titleTa : r.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed font-medium">
                          {language === 'ta' ? r.descTa : r.desc}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#006A4E] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* SCREEN 2: CUSTODIAN ENTRY CHOICE ("Already registered?") */}
        {authMode === 'custodian-choice' && (
          <div className="space-y-5 animate-fade-in text-center">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006A4E] flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-slate-900">
                {language === 'ta' ? 'மரப் பாதுகாவலர் தளம்' : 'Tree Custodian Access'}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {language === 'ta' ? 'நீங்கள் ஏற்கனவே பதிவு செய்துள்ளீர்களா?' : 'Are you already registered with Pasumai Kaval?'}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full py-3.5 px-4 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ta' ? 'ஆம், ஏற்கனவே கணக்கு உள்ளது' : 'Yes, I already have an account'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{language === 'ta' ? 'இல்லை, நான் புதிய பாதுகாவலர்' : "No, I'm a new custodian"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              New custodians can register their institution, student club, or local neighborhood responsibility.
            </p>
          </div>
        )}

        {/* SCREEN 3: AUTHENTICATED LOGIN */}
        {authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
            <div className="text-center mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {selectedRole.toUpperCase()} LOGIN
              </span>
              <h2 className="text-base font-bold text-slate-800 mt-1">
                {language === 'ta' ? 'கணக்கில் உள்நுழைக' : 'Sign in to your account'}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'மின்னஞ்சல் அல்லது தொலைபேசி' : 'Email or Phone Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. arun.kumar@campus.edu.in"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#006A4E]/30 focus:border-[#006A4E]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  {language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password recovery link dispatched to your registered contact.')}
                  className="text-[10px] text-slate-500 hover:text-[#006A4E] font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-[#006A4E]/30 focus:border-[#006A4E]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-70"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In'}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {selectedRole === 'custodian' && (
              <p className="text-center text-xs text-slate-500 pt-2">
                New custodian?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className="text-[#006A4E] font-bold hover:underline"
                >
                  Create an account
                </button>
              </p>
            )}
          </form>
        )}

        {/* SCREEN 4: NEW CUSTODIAN REGISTRATION */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 animate-fade-in">
            <div className="text-center mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                NEW CUSTODIAN REGISTRATION
              </span>
              <h2 className="text-base font-bold text-slate-800 mt-1">
                {language === 'ta' ? 'புதிய பாதுகாவலர் பதிவு' : 'Create Custodian Account'}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'முழுப் பெயர்' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Arun Kumar"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மின்னஞ்சல்' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="arun@campus.edu"
                    className="w-full pl-9 pr-2 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'தொலைபேசி' : 'Phone'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-9 pr-2 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'நிறுவனம் / கல்லூரி / சங்கம்' : 'Organization / Institution / NSS Club'}
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Loyola Green Club • NSS Unit 4"
                className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'ta' ? 'மாவட்டம் / இடம்' : 'Location / District'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Chennai, Tamil Nadu"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confirm</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-[#006A4E] hover:bg-[#00523C] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-70"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>{language === 'ta' ? 'கணக்கை உருவாக்கவும்' : 'Create Custodian Account'}</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-500 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="text-[#006A4E] font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}
      </main>

      {/* Official Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-500 pt-4">
        <p>
          Pasumai Kaval • Department of Environment, Climate Change & Forests • Government of Tamil Nadu
        </p>
      </footer>
    </div>
  );
};
