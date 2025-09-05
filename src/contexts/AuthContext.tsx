'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser, confirmSignUp as amplifyConfirmSignUp, resendSignUpCode as amplifyResendSignUpCode, resetPassword as amplifyResetPassword, confirmResetPassword as amplifyConfirmResetPassword } from 'aws-amplify/auth';
import { getUserRoleInfo, UserRoleInfo } from '@/lib/roleManager';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Mentor' | 'Admin';
  membershipType?: 'basic' | 'premium' | 'admin' | 'instructor';
  subscriptionStatus?: 'active' | 'expired' | 'trial';
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
        const userId = currentUser.userId;
        
        // Get role information using the role manager
        const roleInfo = getUserRoleInfo(email, userId);

        const userData: User = {
          id: userId,
          email,
          name,
          role: roleInfo.role,
          membershipType: roleInfo.membershipType,
          subscriptionStatus: roleInfo.subscriptionStatus,
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

      console.log('Sign in result:', { isSignedIn, nextStep });

      if (isSignedIn) {
        await checkAuthState();
      } else {
        // Handle different sign-in steps
        if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          throw new Error('Please check your email and confirm your account before signing in.');
        } else if (nextStep?.signInStep === 'RESET_PASSWORD') {
          throw new Error('Password reset required. Please use the forgot password feature.');
        } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
          throw new Error('Please set a new password. Check your email for instructions.');
        } else {
          throw new Error(`Sign in incomplete. Next step: ${nextStep?.signInStep || 'Unknown'}`);
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Provide more specific error messages
      if (error.name === 'NotAuthorizedException') {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.name === 'UserNotConfirmedException') {
        throw new Error('Please check your email and confirm your account before signing in.');
      } else if (error.name === 'UserNotFoundException') {
        throw new Error('No account found with this email address. Please sign up first.');
      } else if (error.name === 'TooManyRequestsException') {
        throw new Error('Too many sign-in attempts. Please try again later.');
      } else {
        throw new Error(error.message || 'Sign in failed. Please try again.');
      }
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
          },
        },
      });

      console.log('Sign up result:', { isSignUpComplete, userId, nextStep });

      if (isSignUpComplete) {
        // Store role information locally using the role manager
        const roleInfo = getUserRoleInfo(email, userId);
        
        // User is automatically signed in after successful signup
        await checkAuthState();
      } else {
        // Handle different sign-up steps
        if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
          throw new Error('Please check your email and confirm your account to complete registration.');
        } else {
          throw new Error(`Sign up incomplete. Next step: ${nextStep?.signUpStep || 'Unknown'}`);
        }
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      
      // Provide more specific error messages
      if (error.name === 'UsernameExistsException') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (error.name === 'InvalidPasswordException') {
        throw new Error('Password does not meet requirements. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.');
      } else if (error.name === 'InvalidParameterException') {
        throw new Error('Invalid email format. Please enter a valid email address.');
      } else if (error.name === 'TooManyRequestsException') {
        throw new Error('Too many sign-up attempts. Please try again later.');
      } else {
        throw new Error(error.message || 'Sign up failed. Please try again.');
      }
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