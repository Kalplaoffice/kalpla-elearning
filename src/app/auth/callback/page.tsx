'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check if we have a valid session
        const session = await fetchAuthSession();
        
        if (session.tokens) {
          setStatus('success');
          // Redirect to dashboard after successful authentication
          setTimeout(() => {
            router.push('/dashboard/student');
          }, 2000);
        } else {
          throw new Error('No valid session found');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed');
        setStatus('error');
        
        // Redirect to login page after error
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center mb-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Completing Sign In</CardTitle>
            <CardDescription>
              Please wait while we complete your authentication...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">✕</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Authentication Failed</CardTitle>
            <CardDescription>
              {error || 'Something went wrong during authentication'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              You will be redirected to the login page shortly.
            </p>
            <button
              onClick={() => router.push('/auth/login')}
              className="text-[#FF804B] hover:text-[#FF804B]/80 font-medium"
            >
              Go to Login Page
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">✓</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Sign In Successful!</CardTitle>
          <CardDescription>
            Welcome to Kalpla! Redirecting you to your dashboard...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <div className="w-8 h-8 bg-white rounded-full animate-spin mx-auto"></div>
        </CardContent>
      </Card>
    </div>
  );
}