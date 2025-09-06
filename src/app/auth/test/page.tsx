'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { PhoneAuthForm } from '@/components/auth/PhoneAuthForm';

export default function AuthTestPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithPhone,
    signUpWithPhone,
    signOut,
    user,
    isAuthenticated,
    loading: authLoading
  } = useAuth();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signIn(email, password);
      setSuccess('Email sign in successful!');
    } catch (err: any) {
      setError(err.message || 'Email sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signUp(email, password, name);
      setSuccess('Email sign up successful!');
    } catch (err: any) {
      setError(err.message || 'Email sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signInWithGoogle();
      setSuccess('Google sign in initiated!');
    } catch (err: any) {
      setError(err.message || 'Google sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignIn = async (phone: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signInWithPhone(phone);
      setSuccess('Phone sign in successful!');
    } catch (err: any) {
      setError(err.message || 'Phone sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignUp = async (phone: string) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signUpWithPhone(phone, name);
      setSuccess('Phone sign up successful!');
    } catch (err: any) {
      setError(err.message || 'Phone sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signOut();
      setSuccess('Sign out successful!');
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
        <div className="text-center">
          <div className="w-8 h-8 bg-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2C4E41] to-[#FF804B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Authentication Test Page</h1>
          <p className="text-white/80">Test all authentication methods for Kalpla e-learning platform</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current User Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current User Status</CardTitle>
            </CardHeader>
            <CardContent>
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Provider:</strong> {user.provider}</p>
                  <p><strong>Phone:</strong> {user.phoneNumber || 'N/A'}</p>
                  <p><strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</p>
                  <Button onClick={handleSignOut} disabled={loading} className="w-full mt-4">
                    {loading ? 'Signing Out...' : 'Sign Out'}
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500">No user signed in</p>
              )}
            </CardContent>
          </Card>

          {/* Email Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Email Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleEmailSignIn} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Signing In...' : 'Sign In with Email'}
                </Button>
              </form>

              <div className="border-t pt-4">
                <form onSubmit={handleEmailSignUp} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? 'Signing Up...' : 'Sign Up with Email'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>

          {/* Google Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Google Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <GoogleAuthButton
                onClick={handleGoogleSignIn}
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Signing In...' : 'Sign In with Google'}
              </GoogleAuthButton>
            </CardContent>
          </Card>

          {/* Phone Authentication */}
          <Card>
            <CardHeader>
              <CardTitle>Phone Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sign In with Phone</label>
                  <PhoneAuthForm
                    mode="signin"
                    onSuccess={handlePhoneSignIn}
                    onError={setError}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium mb-2">Sign Up with Phone</label>
                  <div className="mb-3">
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <PhoneAuthForm
                    mode="signup"
                    onSuccess={handlePhoneSignUp}
                    onError={setError}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Messages */}
        {(error || success) && (
          <div className="mt-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Email Authentication:</strong> Test with valid email and password</p>
              <p><strong>Google Authentication:</strong> Click the Google button to test OAuth flow</p>
              <p><strong>Phone Authentication:</strong> Enter a valid phone number (e.g., +1234567890)</p>
              <p><strong>Note:</strong> Phone authentication is simulated - no actual SMS will be sent</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}