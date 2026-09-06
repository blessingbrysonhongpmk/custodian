import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { auth, isFirebaseConfigured } from '../lib/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { ActiveRole } from '../types/custodia';

export type UserRole = 'custodian' | 'verifier' | 'admin';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isDemo: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signInWithGoogle: (role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  enterDemoMode: (role: UserRole) => void;
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ROLE_TO_ACTIVE: Record<UserRole, ActiveRole> = {
  custodian: 'CUSTODIAN',
  verifier: 'PEER_VERIFIER',
  admin: 'ADMIN',
};

const DEMO_USERS: Record<UserRole, AuthUser> = {
  custodian: {
    uid: 'demo-custodian',
    email: 'arun.k@campus.edu',
    displayName: 'Arun Kumar',
    role: 'custodian',
    photoURL: null,
  },
  verifier: {
    uid: 'demo-verifier',
    email: 'suresh.r@campus.edu',
    displayName: 'Suresh R.',
    role: 'verifier',
    photoURL: null,
  },
  admin: {
    uid: 'demo-admin',
    email: 'admin@treeguard.in',
    displayName: 'Program Admin',
    role: 'admin',
    photoURL: null,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [activeRole, setActiveRole] = useState<ActiveRole>('ADMIN');

  // Listen for Firebase auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // For now, default role to admin. In production, fetch from Firestore.
        const role: UserRole = 'admin';
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          role,
          photoURL: firebaseUser.photoURL,
        });
        setActiveRole(ROLE_TO_ACTIVE[role]);
        setIsDemo(false);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not configured');
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, _role: UserRole) => {
    if (!auth) throw new Error('Firebase not configured');
    await createUserWithEmailAndPassword(auth, email, password);
    // TODO: Store role in Firestore users/{uid} document
  }, []);

  const signInWithGoogle = useCallback(async (_role: UserRole) => {
    if (!auth) throw new Error('Firebase not configured');
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // TODO: Store role in Firestore
  }, []);

  const signOut = useCallback(async () => {
    if (isDemo) {
      setUser(null);
      setIsDemo(false);
      return;
    }
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
  }, [isDemo]);

  const enterDemoMode = useCallback((role: UserRole) => {
    setUser(DEMO_USERS[role]);
    setActiveRole(ROLE_TO_ACTIVE[role]);
    setIsDemo(true);
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDemo,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        enterDemoMode,
        activeRole,
        setActiveRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
