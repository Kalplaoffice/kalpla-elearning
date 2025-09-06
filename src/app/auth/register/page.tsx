'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';
import { PhoneAuthForm } from '@/components/auth/PhoneAuthForm';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const { signUp, signUpWithPhone, signInWithGoogle } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, formData.name);
      setSuccess(true);
      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/student');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignUp = async (phoneNumber: string) => {
    setLoading(true);
    setError('');

    try {
      await signUpWithPhone(phoneNumber, formData.name);
      setSuccess(true);
      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push('/dashboard/student');
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with phone number');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Account Created!</CardTitle>
              <CardDescription>
                Welcome to Kalpla, {formData.name}! Your account has been created successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                You can now access all features of the platform. Start your learning journey today!
              </p>
              <div className="space-y-3">
                <Link href="/dashboard/student">
                  <Button className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button variant="outline" className="w-full">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Your Account</CardTitle>
            <CardDescription>
              Join thousands of students building the next unicorn
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Authentication Method Selection */}
            <div className="mb-6">
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  type="button"
                  onClick={() => setAuthMethod('email')}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    authMethod === 'email'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    authMethod === 'phone'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Phone
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {authMethod === 'email' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="w-full"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="mt-1 h-4 w-4 text-[#FF804B] focus:ring-[#FF804B] border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the{' '}
                    <Link href="/terms" className="text-[#FF804B] hover:text-[#FF804B]/80">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-[#FF804B] hover:text-[#FF804B]/80">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="w-full"
                  />
                </div>
                
                <PhoneAuthForm
                  mode="signup"
                  onSuccess={handlePhoneSignUp}
                  onError={setError}
                />
              </div>
            )}

            {/* Social Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <GoogleAuthButton
                  onClick={handleGoogleSignUp}
                  loading={loading}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="font-medium text-[#2C4E41] hover:text-[#2C4E41]/80"
                >
                  Sign in here
                </Link>
              </p>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Benefits of joining</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Badge variant="outline" className="text-xs">
                  🚀 Free Courses
                </Badge>
                <Badge variant="outline" className="text-xs">
                  👥 Community Access
                </Badge>
                <Badge variant="outline" className="text-xs">
                  🎓 Certificates
                </Badge>
                <Badge variant="outline" className="text-xs">
                  💼 Job Placement
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}