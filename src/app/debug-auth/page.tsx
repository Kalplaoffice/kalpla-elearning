'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DebugAuth() {
  const { signIn, signUp, user, isAuthenticated, loading } = useAuth();
  const [email, setEmail] = useState('test@kalpla.com');
  const [password, setPassword] = useState('Test123!');
  const [name, setName] = useState('Test User');
  const [result, setResult] = useState<string>('');
  const [action, setAction] = useState<'signin' | 'signup'>('signin');

  const handleSignIn = async () => {
    try {
      setResult('Signing in...');
      await signIn(email, password);
      setResult('Sign in successful!');
    } catch (error: any) {
      setResult(`Sign in error: ${error.message}`);
    }
  };

  const handleSignUp = async () => {
    try {
      setResult('Signing up...');
      await signUp(email, password, name);
      setResult('Sign up successful!');
    } catch (error: any) {
      setResult(`Sign up error: ${error.message}`);
    }
  };

  const handleTestUser = async (testEmail: string, testPassword: string, testName: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    setName(testName);
    
    try {
      setResult('Testing sign up...');
      await signUp(testEmail, testPassword, testName);
      setResult('Test user created successfully!');
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        setResult('User already exists, trying to sign in...');
        try {
          await signIn(testEmail, testPassword);
          setResult('Sign in successful!');
        } catch (signInError: any) {
          setResult(`Sign in error: ${signInError.message}`);
        }
      } else {
        setResult(`Sign up error: ${error.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🔧 Auth Debug Tool
          </h1>
          <p className="text-xl text-gray-600">
            Debug authentication issues and test user creation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Manual Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Manual Testing</CardTitle>
              <CardDescription>
                Test authentication with custom credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Action</label>
                <div className="flex gap-2">
                  <Button
                    variant={action === 'signin' ? 'default' : 'outline'}
                    onClick={() => setAction('signin')}
                    size="sm"
                  >
                    Sign In
                  </Button>
                  <Button
                    variant={action === 'signup' ? 'default' : 'outline'}
                    onClick={() => setAction('signup')}
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="test@kalpla.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Test123!"
                />
              </div>

              {action === 'signup' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Test User"
                  />
                </div>
              )}

              <Button
                onClick={action === 'signin' ? handleSignIn : handleSignUp}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : action === 'signin' ? 'Sign In' : 'Sign Up'}
              </Button>
            </CardContent>
          </Card>

          {/* Test Users */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Test Users</CardTitle>
              <CardDescription>
                Test with pre-configured user accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleTestUser('admin@kalpla.com', 'Admin123!', 'Admin User')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                👨‍💼 Admin User (admin@kalpla.com)
              </Button>
              
              <Button
                onClick={() => handleTestUser('student@kalpla.com', 'Student123!', 'Regular Student')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                🎓 Regular Student (student@kalpla.com)
              </Button>
              
              <Button
                onClick={() => handleTestUser('instructor@kalpla.com', 'Instructor123!', 'Course Instructor')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                👨‍🏫 Instructor (instructor@kalpla.com)
              </Button>
              
              <Button
                onClick={() => handleTestUser('premium@kalpla.com', 'Premium123!', 'Premium Student')}
                disabled={loading}
                className="w-full justify-start"
                variant="outline"
              >
                💎 Premium Student (premium@kalpla.com)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result && (
              <Alert className={result.includes('error') || result.includes('failed') ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                <AlertDescription className={result.includes('error') || result.includes('failed') ? 'text-red-800' : 'text-green-800'}>
                  {result}
                </AlertDescription>
              </Alert>
            )}

            {/* Current User Info */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Current User Status</h3>
              <div className="text-sm space-y-1">
                <div><strong>Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}</div>
                <div><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</div>
                {user && (
                  <>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Name:</strong> {user.name}</div>
                    <div><strong>Role:</strong> {user.role}</div>
                    <div><strong>Membership:</strong> {user.membershipType || 'basic'}</div>
                    <div><strong>Email Verified:</strong> {user.isEmailVerified ? 'Yes' : 'No'}</div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Debug Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Try creating a test user with the "Quick Test Users" buttons</li>
              <li>If user already exists, the system will try to sign in instead</li>
              <li>Check the browser console for detailed error logs</li>
              <li>Verify that the AWS Amplify configuration is correct</li>
              <li>Check that the Cognito User Pool is properly configured</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
