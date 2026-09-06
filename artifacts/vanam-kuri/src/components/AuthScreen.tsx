import React, { useState } from 'react';
import { useAuth, type UserRole } from '../context/AuthContext';
import { isFirebaseConfigured } from '../lib/firebase';
import { useTranslation } from 'react-i18next';
import {
  Users,
  ShieldCheck,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  ArrowLeft,
  Leaf
} from 'lucide-react';

interface AuthScreenProps {
  onBack: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const { signIn, signUp, signInWithGoogle, enterDemoMode } = useAuth();
  const { t } = useTranslation();
  
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const firebaseReady = isFirebaseConfigured();

  const ROLES: { id: UserRole; icon: typeof Users; titleKey: string; descKey: string }[] = [
    {
      id: 'custodian',
      icon: Users,
      titleKey: 'roles.custodian.title',
      descKey: 'roles.custodian.description',
    },
    {
      id: 'verifier',
      icon: ShieldCheck,
      titleKey: 'roles.verifier.title',
      descKey: 'roles.verifier.description',
    },
    {
      id: 'admin',
      icon: Building2,
      titleKey: 'roles.admin.title',
      descKey: 'roles.admin.description',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, selectedRole);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!selectedRole) return;
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle(selectedRole);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoMode = () => {
    enterDemoMode(selectedRole || 'admin');
  };

  return (
    <div className="min-h-screen bg-[#F8FAF8] flex flex-col md:flex-row">
      {/* Left Side: Realistic Environmental Imagery (Hidden on small screens) */}
      <div className="hidden md:flex w-1/2 bg-emerald-900 relative overflow-hidden items-end p-12">
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=2000" 
          alt="Lush green forest" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#062817] via-[#062817]/60 to-transparent" />
        
        <div className="relative z-10 text-emerald-50 max-w-lg">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            {t('common.subtitle')}
          </h2>
          <p className="text-emerald-200 text-lg leading-relaxed">
            A platform designed for scalable environmental programs, urban greenery management, and public-sector deployment.
          </p>
        </div>
      </div>

      {/* Right Side: Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              {t('common.welcome')}
            </h1>
            <p className="text-sm text-slate-500">
              Select your role to continue
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3 mb-8">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? 'text-emerald-900' : 'text-slate-900'}`}>
                        {t(role.titleKey)}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                          <span className="w-2 h-2 rounded-full bg-white"></span>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{t(role.descKey)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Auth Form — only if Firebase is configured */}
          {selectedRole && firebaseReady && (
            <form onSubmit={handleSubmit} className="space-y-4 mb-6 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">{t('auth.passwordLabel')}</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all bg-white shadow-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200 font-medium">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : isSignUp ? 'Create Account' : 'Sign In'}
                {!loading && <ChevronRight className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-xs text-slate-500 hover:text-emerald-700 font-bold transition-colors text-center"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>

              {/* Google Sign In */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#F8FAF8] px-3 text-slate-400 font-bold uppercase tracking-wider">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Continue with Google
              </button>
            </form>
          )}

          {/* Demo Mode Button */}
          <div className={`${firebaseReady && selectedRole ? 'mt-6 pt-6 border-t border-slate-200' : 'mt-4'}`}>
            <button
              onClick={handleDemoMode}
              className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              Continue in Demo Mode
              <ChevronRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-wider font-bold">
              No login required. Explore mock data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
