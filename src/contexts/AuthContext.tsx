'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession, getCurrentUser, signOut as amplifySignOut } from 'aws-amplify/auth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Mentor' | 'Admin';
  avatarUrl?: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      // Extract user attributes from the session
      const userAttributes = session.tokens?.idToken?.payload;
      const groups = (userAttributes?.['cognito:groups'] as string[]) || [];
      
      // Determine user role based on groups
      let role: 'Student' | 'Mentor' | 'Admin' = 'Student';
      if (groups.includes('Admin')) role = 'Admin';
      else if (groups.includes('Mentor')) role = 'Mentor';

      setUser({
        id: currentUser.userId,
        email: userAttributes?.email as string || '',
        name: userAttributes?.name as string || '',
        role,
        avatarUrl: userAttributes?.picture as string,
        isEmailVerified: userAttributes?.email_verified as boolean || false,
      });
    } catch (error) {
      console.log('No authenticated user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { signIn } = await import('aws-amplify/auth');
      await signIn({ username: email, password });
      await checkAuthState();
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { signUp } = await import('aws-amplify/auth');
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      const { confirmSignUp } = await import('aws-amplify/auth');
      await confirmSignUp({ username: email, confirmationCode: code });
    } catch (error) {
      console.error('Confirm sign up error:', error);
      throw error;
    }
  };

  const resendConfirmationCode = async (email: string) => {
    try {
      const { resendSignUpCode } = await import('aws-amplify/auth');
      await resendSignUpCode({ username: email });
    } catch (error) {
      console.error('Resend confirmation code error:', error);
      throw error;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const { resetPassword } = await import('aws-amplify/auth');
      await resetPassword({ username: email });
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    try {
      const { confirmResetPassword } = await import('aws-amplify/auth');
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
