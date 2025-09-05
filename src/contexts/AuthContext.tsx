'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser, confirmSignUp as amplifyConfirmSignUp, resendSignUpCode as amplifyResendSignUpCode, resetPassword as amplifyResetPassword, confirmResetPassword as amplifyConfirmResetPassword } from 'aws-amplify/auth';

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
      if (currentUser) {
        // Extract user attributes
        const email = currentUser.signInDetails?.loginId || currentUser.username || '';
        const name = currentUser.username || email.split('@')[0];
        
        // Get custom attributes from user attributes
        const customRole = currentUser.attributes?.['custom:role'] as 'Student' | 'Mentor' | 'Admin' | 'Instructor' || 'Student';
        const membershipType = currentUser.attributes?.['custom:membership_type'] || 'basic';
        
        // Determine role - map Instructor to Mentor for now, or create separate handling
        let role: 'Student' | 'Mentor' | 'Admin' = 'Student';
        if (customRole === 'Admin') {
          role = 'Admin';
        } else if (customRole === 'Instructor' || customRole === 'Mentor') {
          role = 'Mentor';
        } else {
          role = 'Student';
        }

        const userData: User = {
          id: currentUser.userId,
          email,
          name,
          role,
          isEmailVerified: currentUser.attributes?.email_verified === 'true' || false,
        };

        setUser(userData);
      }
    } catch (error) {
      console.log('No authenticated user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { isSignedIn, nextStep } = await amplifySignIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        await checkAuthState();
      } else {
        throw new Error('Sign in failed');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: string = 'Student', membershipType: string = 'basic') => {
    setLoading(true);
    try {
      const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
            'custom:role': role,
            'custom:membership_type': membershipType,
            'custom:subscription_status': 'active'
          },
        },
      });

      if (isSignUpComplete) {
        // User is automatically signed in after successful signup
        await checkAuthState();
      } else {
        throw new Error('Sign up failed');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await amplifySignOut();
      setUser(null);
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    setLoading(true);
    try {
      const { isSignUpComplete } = await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        await checkAuthState();
      } else {
        throw new Error('Confirmation failed');
      }
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      throw new Error(error.message || 'Confirmation failed');
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email: string) => {
    setLoading(true);
    try {
      await amplifyResendSignUpCode({
        username: email,
      });
    } catch (error: any) {
      console.error('Resend confirmation code error:', error);
      throw new Error(error.message || 'Failed to resend confirmation code');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    try {
      await amplifyResetPassword({
        username: email,
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw new Error(error.message || 'Failed to send password reset code');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    setLoading(true);
    try {
      await amplifyConfirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
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