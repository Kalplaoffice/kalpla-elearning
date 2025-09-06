'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { signIn as amplifySignIn, signUp as amplifySignUp, signOut as amplifySignOut, getCurrentUser, confirmSignUp as amplifyConfirmSignUp, resendSignUpCode as amplifyResendSignUpCode, resetPassword as amplifyResetPassword, confirmResetPassword as amplifyConfirmResetPassword, signInWithRedirect, fetchAuthSession } from 'aws-amplify/auth';
import { getUserRoleInfo } from '@/lib/roleManager';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Mentor' | 'Admin';
  membershipType?: 'basic' | 'premium' | 'admin' | 'instructor';
  subscriptionStatus?: 'active' | 'expired' | 'trial';
  avatarUrl?: string;
  isEmailVerified: boolean;
  phoneNumber?: string;
  provider?: 'email' | 'google' | 'phone';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signUpWithPhone: (phoneNumber: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  confirmPhoneSignUp: (phoneNumber: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  resendPhoneConfirmationCode: (phoneNumber: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // During SSR or when AuthProvider is not available, return safe defaults
    return {
      user: null,
      loading: true,
      isAuthenticated: false,
      signIn: async () => {},
      signUp: async () => {},
      signOut: async () => {},
      confirmSignUp: async () => {},
      resendConfirmationCode: async () => {},
      forgotPassword: async () => {},
      resetPassword: async () => {},
    };
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
    signIn: async () => {},
    signUp: async () => {},
    signOut: async () => {},
    confirmSignUp: async () => {},
    resendConfirmationCode: async () => {},
    forgotPassword: async () => {},
    resetPassword: async () => {},
  };
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const checkAuthState = useCallback(async () => {
    if (!mounted) return;
    
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // Extract user attributes
        const email = currentUser.signInDetails?.loginId || currentUser.username || '';
        const name = currentUser.username || email.split('@')[0];
        const userId = currentUser.userId;
        const phoneNumber = (currentUser as { attributes?: { phone_number?: string } }).attributes?.phone_number;
        
        // Detect provider
        let provider: 'email' | 'google' | 'phone' = 'email';
        if (currentUser.signInDetails?.loginId?.includes('@')) {
          provider = 'email';
        } else if (phoneNumber) {
          provider = 'phone';
        } else if (currentUser.signInDetails?.loginId?.includes('google')) {
          provider = 'google';
        }
        
        // Get role information using the role manager
        const roleInfo = getUserRoleInfo(email || phoneNumber, userId);

        const userData: User = {
          id: userId,
          email: email || phoneNumber || '',
          name,
          role: roleInfo.role,
          membershipType: roleInfo.membershipType,
          subscriptionStatus: roleInfo.subscriptionStatus,
          isEmailVerified: (currentUser as { attributes?: { email_verified?: string } }).attributes?.email_verified === 'true' || false,
          phoneNumber,
          provider,
        };

        setUser(userData);
      }
    } catch (error) {
      console.log('No authenticated user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuthState();
    }
  }, [mounted, checkAuthState]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Check if user is already signed in
      if (user) {
        // If trying to sign in with the same user, just refresh the state
        if (user.email === email) {
          await checkAuthState();
          return;
        } else {
          // If trying to sign in with a different user, sign out first
          await signOut();
        }
      }

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
    } catch (error: unknown) {
      console.error('Sign in error:', error);
      
      // Provide more specific error messages
      const errorObj = error as { name?: string; message?: string };
      if (errorObj.name === 'UserAlreadyAuthenticatedException') {
        // If user is already authenticated, refresh the auth state
        await checkAuthState();
        return;
      } else if (errorObj.name === 'NotAuthorizedException') {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (errorObj.name === 'UserNotConfirmedException') {
        throw new Error('Please check your email and confirm your account before signing in.');
      } else if (errorObj.name === 'UserNotFoundException') {
        throw new Error('No account found with this email address. Please sign up first.');
      } else if (errorObj.name === 'TooManyRequestsException') {
        throw new Error('Too many sign-in attempts. Please try again later.');
      } else {
        throw new Error(errorObj.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, _role: string = 'Student', _membershipType: string = 'basic') => {
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
    } catch (error: unknown) {
      console.error('Sign up error:', error);
      
      // Provide more specific error messages
      const errorObj = error as { name?: string; message?: string };
      if (errorObj.name === 'UsernameExistsException') {
        throw new Error('An account with this email already exists. Please sign in instead.');
      } else if (errorObj.name === 'InvalidPasswordException') {
        throw new Error('Password does not meet requirements. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.');
      } else if (errorObj.name === 'InvalidParameterException') {
        throw new Error('Invalid email format. Please enter a valid email address.');
      } else if (errorObj.name === 'TooManyRequestsException') {
        throw new Error('Too many sign-up attempts. Please try again later.');
      } else {
        throw new Error(errorObj.message || 'Sign up failed. Please try again.');
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
    } catch (error: unknown) {
      console.error('Sign out error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Sign out failed');
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
    } catch (error: unknown) {
      console.error('Confirm sign up error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Confirmation failed');
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
    } catch (error: unknown) {
      console.error('Resend confirmation code error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Failed to resend confirmation code');
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
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Failed to send password reset code');
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
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithRedirect({
        provider: 'Google'
      });
    } catch (error: unknown) {
      console.error('Google sign in error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber: string) => {
    setLoading(true);
    try {
      // For phone number sign in, we need to use the phone number as username
      const { isSignedIn, nextStep } = await amplifySignIn({
        username: phoneNumber,
        password: '', // Phone number sign in doesn't use password
      });

      if (isSignedIn) {
        await checkAuthState();
      } else {
        // Handle different sign-in steps for phone
        if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
          throw new Error('Please verify your phone number before signing in.');
        } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
          throw new Error('SMS_CODE_REQUIRED');
        } else {
          throw new Error(`Sign in incomplete. Next step: ${nextStep?.signInStep || 'Unknown'}`);
        }
      }
    } catch (error: unknown) {
      console.error('Phone sign in error:', error);
      const errorObj = error as { name?: string; message?: string };
      
      if (errorObj.name === 'NotAuthorizedException') {
        throw new Error('Invalid phone number or verification code.');
      } else if (errorObj.name === 'UserNotFoundException') {
        throw new Error('No account found with this phone number. Please sign up first.');
      } else {
        throw new Error(errorObj.message || 'Phone sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpWithPhone = async (phoneNumber: string, name: string) => {
    setLoading(true);
    try {
      // Generate a temporary password for phone sign up
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
        username: phoneNumber,
        password: tempPassword,
        options: {
          userAttributes: {
            phone_number: phoneNumber,
            name,
          },
        },
      });

      console.log('Phone sign up result:', { isSignUpComplete, userId, nextStep });

      if (isSignUpComplete) {
        // User is automatically signed in after successful signup
        await checkAuthState();
      } else {
        // Handle different sign-up steps
        if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
          throw new Error('Please verify your phone number to complete registration.');
        } else {
          throw new Error(`Sign up incomplete. Next step: ${nextStep?.signUpStep || 'Unknown'}`);
        }
      }
    } catch (error: unknown) {
      console.error('Phone sign up error:', error);
      const errorObj = error as { name?: string; message?: string };
      
      if (errorObj.name === 'UsernameExistsException') {
        throw new Error('An account with this phone number already exists. Please sign in instead.');
      } else if (errorObj.name === 'InvalidParameterException') {
        throw new Error('Invalid phone number format. Please enter a valid phone number.');
      } else {
        throw new Error(errorObj.message || 'Phone sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmPhoneSignUp = async (phoneNumber: string, code: string) => {
    setLoading(true);
    try {
      const { isSignUpComplete } = await amplifyConfirmSignUp({
        username: phoneNumber,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        await checkAuthState();
      } else {
        throw new Error('Phone verification failed');
      }
    } catch (error: unknown) {
      console.error('Confirm phone sign up error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Phone verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendPhoneConfirmationCode = async (phoneNumber: string) => {
    setLoading(true);
    try {
      await amplifyResendSignUpCode({
        username: phoneNumber,
      });
    } catch (error: unknown) {
      console.error('Resend phone confirmation code error:', error);
      const errorObj = error as { message?: string };
      throw new Error(errorObj.message || 'Failed to resend phone confirmation code');
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
    signInWithGoogle,
    signInWithPhone,
    signUpWithPhone,
    signOut,
    confirmSignUp,
    confirmPhoneSignUp,
    resendConfirmationCode,
    resendPhoneConfirmationCode,
    forgotPassword,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};