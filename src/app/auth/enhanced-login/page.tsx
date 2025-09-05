'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import AuthOptions from '@/components/auth/AuthOptions';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function EnhancedLoginPage() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithSocial,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    verifyMFACode,
    clearError 
  } = useAuth();
  
  const router = useRouter();
  const [showMFA, setShowMFA] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'Admin':
          router.push('/dashboard/admin');
          break;
        case 'Mentor':
          router.push('/dashboard/mentor');
          break;
        case 'Student':
        default:
          router.push('/dashboard/student');
          break;
      }
    }
  }, [isAuthenticated, user, loading, router]);

  // Don't render during SSR
  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
        <div className="text-center">
          <div className="w-8 h-8 bg-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  const handleEmailAuth = async (email: string, password: string, rememberMe?: boolean) => {
    try {
      clearError();
      setPendingEmail(email);
      await signInWithEmail(email, password, rememberMe);
    } catch (error: any) {
      if (error.message === 'MFA_REQUIRED') {
        setShowMFA(true);
      } else {
        throw error;
      }
    }
  };

  const handleSocialAuth = async (provider: 'google' | 'github' | 'linkedin') => {
    try {
      clearError();
      await signInWithSocial(provider);
    } catch (error) {
      throw error;
    }
  };

  const handleMFA = async (code: string) => {
    try {
      clearError();
      await verifyMFACode(code);
    } catch (error) {
      throw error;
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      clearError();
      await forgotPassword(email);
      setShowForgotPassword(false);
    } catch (error) {
      throw error;
    }
  };

  const handleSignUp = async (email: string, password: string, name: string) => {
    try {
      clearError();
      await signUpWithEmail(email, password, name);
      setPendingEmail(email);
    } catch (error) {
      throw error;
    }
  };

  const handleResendConfirmation = async (email: string) => {
    try {
      clearError();
      await resendConfirmationCode(email);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Kalpla</h1>
          <p className="text-white/80">Your Learning Journey Starts Here</p>
        </div>

        {/* Auth Options */}
        <AuthOptions
          onEmailAuth={handleEmailAuth}
          onSocialAuth={handleSocialAuth}
          onMFA={handleMFA}
          onForgotPassword={handleForgotPassword}
          loading={loading}
          error={error?.message}
          showMFA={showMFA}
          showForgotPassword={showForgotPassword}
        />

        {/* Additional Options */}
        <div className="text-center space-y-4">
          <div className="text-white/60 text-sm">
            Need help?{' '}
            <a href="/support" className="text-white hover:underline">
              Contact Support
            </a>
          </div>
          
          <div className="text-white/60 text-sm">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-white hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-white hover:underline">
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-black/20 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Debug Info</h3>
            <div className="text-white/80 text-sm space-y-1">
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
              <div>User: {user ? `${user.name} (${user.role})` : 'None'}</div>
              <div>Error: {error ? error.message : 'None'}</div>
              <div>MFA Required: {showMFA ? 'Yes' : 'No'}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
