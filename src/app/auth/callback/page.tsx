'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const { user, isAuthenticated, loading, error } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        setStatus('loading');
        setMessage('Processing authentication...');

        // Wait for authentication to complete
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout

        while (attempts < maxAttempts) {
          if (isAuthenticated && user) {
            setStatus('success');
            setMessage('Authentication successful! Redirecting...');
            
            // Redirect based on user role
            setTimeout(() => {
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
            }, 2000);
            return;
          }

          if (error) {
            setStatus('error');
            setMessage(error.message || 'Authentication failed');
            return;
          }

          // Wait 1 second before checking again
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        }

        // Timeout
        setStatus('error');
        setMessage('Authentication timeout. Please try again.');
      } catch (error) {
        console.error('Callback error:', error);
        setStatus('error');
        setMessage('An unexpected error occurred during authentication.');
      }
    };

    handleCallback();
  }, [isAuthenticated, user, error, router]);

  const handleRetry = () => {
    router.push('/auth/enhanced-login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 mb-4">
            {status === 'loading' && (
              <Loader2 className="w-16 h-16 text-[#FF804B] animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-16 h-16 text-green-500" />
            )}
            {status === 'error' && (
              <XCircle className="w-16 h-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="text-center">
              <div className="w-8 h-8 bg-[#FF804B] rounded-full animate-pulse mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">
                Please wait while we complete your authentication...
              </p>
            </div>
          )}

          {status === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                You have been successfully authenticated. You will be redirected shortly.
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button onClick={handleRetry} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleGoHome} variant="outline" className="flex-1">
                  Go Home
                </Button>
              </div>
            </div>
          )}

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Debug Info</h4>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Status: {status}</div>
                <div>Loading: {loading ? 'Yes' : 'No'}</div>
                <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
                <div>User: {user ? `${user.name} (${user.role})` : 'None'}</div>
                <div>Error: {error ? error.message : 'None'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
