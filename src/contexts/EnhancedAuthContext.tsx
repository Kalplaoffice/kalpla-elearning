'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, User, AuthError } from '@/lib/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  session: any;
  error: AuthError | null;
  
  // Authentication methods
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signInWithSocial: (provider: 'google' | 'github' | 'linkedin') => Promise<void>;
  signOut: () => Promise<void>;
  
  // Email verification
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  
  // Password reset
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  
  // MFA
  enableMFA: () => Promise<void>;
  verifyMFACode: (code: string) => Promise<void>;
  
  // Session management
  refreshSession: () => Promise<void>;
  isSessionValid: () => boolean;
  
  // Error handling
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Safe version that doesn't throw an error
export const useAuthSafe = () => {
  const context = useContext(AuthContext);
  return context || {
    user: null,
    loading: true,
    isAuthenticated: false,
    session: null,
    error: null,
    signInWithEmail: async () => {},
    signUpWithEmail: async () => {},
    signInWithSocial: async () => {},
    signOut: async () => {},
    confirmSignUp: async () => {},
    resendConfirmationCode: async () => {},
    forgotPassword: async () => {},
    resetPassword: async () => {},
    enableMFA: async () => {},
    verifyMFACode: async () => {},
    refreshSession: async () => {},
    isSessionValid: () => false,
    clearError: () => {},
  };
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    initializeAuth();
    
    // Listen for auth state changes
    const unsubscribe = authService.addAuthListener((newUser) => {
      setUser(newUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      const currentSession = await authService.getSession();
      
      setUser(currentUser);
      setSession(currentSession);
    } catch (error) {
      console.error('Error initializing auth:', error);
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: any) => {
    console.error('Auth error:', error);
    setError(error);
  };

  const clearError = () => {
    setError(null);
  };

  const signInWithEmail = async (email: string, password: string, rememberMe: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.signInWithEmail(email, password, rememberMe);
      setUser(user);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signUpWithEmail(email, password, name);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithSocial = async (provider: 'google' | 'github' | 'linkedin') => {
    try {
      setLoading(true);
      setError(null);
      await authService.signInWithSocial(provider);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
      setSession(null);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.confirmSignUp(email, code);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resendConfirmationCode(email);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.forgotPassword(email);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(email, code, newPassword);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const enableMFA = async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.enableMFA();
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyMFACode = async (code: string) => {
    try {
      setLoading(true);
      setError(null);
      const user = await authService.verifyMFACode(code);
      setUser(user);
    } catch (error: any) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      const newSession = await authService.refreshSession();
      setSession(newSession);
    } catch (error: any) {
      handleError(error);
      throw error;
    }
  };

  const isSessionValid = () => {
    return authService.isSessionValid();
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    session,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithSocial,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    resetPassword,
    enableMFA,
    verifyMFACode,
    refreshSession,
    isSessionValid,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext };
