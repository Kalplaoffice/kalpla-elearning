'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const { signIn, resendConfirmationCode, isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.push('/dashboard/student');
    }
  }, [isAuthenticated, user, router, authLoading]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
        <div className="text-center">
          <div className="w-8 h-8 bg-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowResendConfirmation(false);
    setResendMessage('');

    try {
      await signIn(email, password);
      router.push('/dashboard/student');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'An error occurred during sign in');
      
      // Show resend confirmation option if user needs to confirm email
      if (errorObj.message?.includes('confirm your account') || errorObj.message?.includes('email and confirm')) {
        setShowResendConfirmation(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setResendMessage('Please enter your email address first');
      return;
    }

    setResendLoading(true);
    setResendMessage('');

    try {
      await resendConfirmationCode(email);
      setResendMessage('Confirmation code sent! Please check your email.');
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setResendMessage(errorObj.message || 'Failed to send confirmation code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to your Kalpla account to continue your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {showResendConfirmation && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription className="text-blue-800">
                    <div className="space-y-3">
                      <p>Your account needs to be confirmed before you can sign in.</p>
                      <div className="flex flex-col space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleResendConfirmation}
                          disabled={resendLoading || !email}
                          className="w-full"
                        >
                          {resendLoading ? 'Sending...' : 'Resend Confirmation Email'}
                        </Button>
                        {resendMessage && (
                          <p className="text-sm text-blue-700">{resendMessage}</p>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-[#FF804B] hover:text-[#FF804B]/80 font-medium"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/auth/register" 
                  className="font-medium text-[#2C4E41] hover:text-[#2C4E41]/80"
                >
                  Sign up here
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Need to verify your account?{' '}
                <Link 
                  href="/auth/verify" 
                  className="font-medium text-[#FF804B] hover:text-[#FF804B]/80"
                >
                  Verify here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}