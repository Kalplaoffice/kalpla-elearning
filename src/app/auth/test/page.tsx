'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  Github, 
  Chrome, 
  Linkedin, 
  Shield, 
  Key, 
  User, 
  Settings,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';

export default function AuthTestPage() {
  const { 
    user, 
    isAuthenticated, 
    loading, 
    error, 
    session,
    signInWithEmail, 
    signUpWithEmail, 
    signInWithSocial,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    forgotPassword,
    resetPassword,
    enableMFA,
    verifyMFACode,
    refreshSession,
    isSessionValid,
    clearError
  } = useAuth();

  const [testEmail, setTestEmail] = useState('test@kalpla.com');
  const [testPassword, setTestPassword] = useState('TestPassword123!');
  const [testName, setTestName] = useState('Test User');
  const [mfaCode, setMfaCode] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const handleEmailSignIn = async () => {
    try {
      addTestResult('Starting email sign in...');
      await signInWithEmail(testEmail, testPassword, true);
      addTestResult('✅ Email sign in successful');
    } catch (error: any) {
      addTestResult(`❌ Email sign in failed: ${error.message}`);
    }
  };

  const handleEmailSignUp = async () => {
    try {
      addTestResult('Starting email sign up...');
      await signUpWithEmail(testEmail, testPassword, testName);
      addTestResult('✅ Email sign up successful');
    } catch (error: any) {
      addTestResult(`❌ Email sign up failed: ${error.message}`);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github' | 'linkedin') => {
    try {
      addTestResult(`Starting ${provider} sign in...`);
      await signInWithSocial(provider);
      addTestResult(`✅ ${provider} sign in initiated`);
    } catch (error: any) {
      addTestResult(`❌ ${provider} sign in failed: ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      addTestResult('Starting sign out...');
      await signOut();
      addTestResult('✅ Sign out successful');
    } catch (error: any) {
      addTestResult(`❌ Sign out failed: ${error.message}`);
    }
  };

  const handleConfirmSignUp = async () => {
    try {
      addTestResult('Starting email confirmation...');
      await confirmSignUp(testEmail, '123456'); // Mock code
      addTestResult('✅ Email confirmation successful');
    } catch (error: any) {
      addTestResult(`❌ Email confirmation failed: ${error.message}`);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      addTestResult('Starting resend confirmation...');
      await resendConfirmationCode(testEmail);
      addTestResult('✅ Resend confirmation successful');
    } catch (error: any) {
      addTestResult(`❌ Resend confirmation failed: ${error.message}`);
    }
  };

  const handleForgotPassword = async () => {
    try {
      addTestResult('Starting forgot password...');
      await forgotPassword(testEmail);
      addTestResult('✅ Forgot password successful');
    } catch (error: any) {
      addTestResult(`❌ Forgot password failed: ${error.message}`);
    }
  };

  const handleResetPassword = async () => {
    try {
      addTestResult('Starting password reset...');
      await resetPassword(testEmail, resetCode, newPassword);
      addTestResult('✅ Password reset successful');
    } catch (error: any) {
      addTestResult(`❌ Password reset failed: ${error.message}`);
    }
  };

  const handleEnableMFA = async () => {
    try {
      addTestResult('Starting MFA setup...');
      await enableMFA();
      addTestResult('✅ MFA setup successful');
    } catch (error: any) {
      addTestResult(`❌ MFA setup failed: ${error.message}`);
    }
  };

  const handleVerifyMFA = async () => {
    try {
      addTestResult('Starting MFA verification...');
      await verifyMFACode(mfaCode);
      addTestResult('✅ MFA verification successful');
    } catch (error: any) {
      addTestResult(`❌ MFA verification failed: ${error.message}`);
    }
  };

  const handleRefreshSession = async () => {
    try {
      addTestResult('Starting session refresh...');
      await refreshSession();
      addTestResult('✅ Session refresh successful');
    } catch (error: any) {
      addTestResult(`❌ Session refresh failed: ${error.message}`);
    }
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Authentication Test Dashboard</h1>
          <p className="text-gray-600 mt-2">Test all authentication methods and features</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Auth Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={isAuthenticated ? "default" : "secondary"}>
                  {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Loading:</span>
                <Badge variant={loading ? "default" : "secondary"}>
                  {loading ? 'Yes' : 'No'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Session Valid:</span>
                <Badge variant={isSessionValid() ? "default" : "destructive"}>
                  {isSessionValid() ? 'Valid' : 'Invalid'}
                </Badge>
              </div>

              {user && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Name:</span>
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Role:</span>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Provider:</span>
                    <Badge variant="outline">{user.provider || 'email'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">MFA Enabled:</span>
                    <Badge variant={user.mfaEnabled ? "default" : "secondary"}>
                      {user.mfaEnabled ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error.message}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Test Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Email</Label>
                    <Input
                      id="test-email"
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="test-password">Password</Label>
                    <Input
                      id="test-password"
                      type="password"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="test-name">Name</Label>
                    <Input
                      id="test-name"
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleEmailSignIn} disabled={loading}>
                      <Mail className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                    <Button onClick={handleEmailSignUp} variant="outline" disabled={loading}>
                      <User className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleConfirmSignUp} variant="outline" disabled={loading}>
                      Confirm Email
                    </Button>
                    <Button onClick={handleResendConfirmation} variant="outline" disabled={loading}>
                      Resend Code
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="space-y-2">
                    <Button onClick={() => handleSocialSignIn('google')} className="w-full" disabled={loading}>
                      <Chrome className="w-4 h-4 mr-2" />
                      Sign in with Google
                    </Button>
                    
                    <Button onClick={() => handleSocialSignIn('github')} className="w-full" disabled={loading}>
                      <Github className="w-4 h-4 mr-2" />
                      Sign in with GitHub
                    </Button>
                    
                    <Button onClick={() => handleSocialSignIn('linkedin')} className="w-full" disabled={loading}>
                      <Linkedin className="w-4 h-4 mr-2" />
                      Sign in with LinkedIn
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mfa-code">MFA Code</Label>
                    <Input
                      id="mfa-code"
                      type="text"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      placeholder="000000"
                    />
                    <Button onClick={handleVerifyMFA} className="w-full" disabled={loading}>
                      <Shield className="w-4 h-4 mr-2" />
                      Verify MFA
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reset-code">Reset Code</Label>
                    <Input
                      id="reset-code"
                      type="text"
                      value={resetCode}
                      onChange={(e) => setResetCode(e.target.value)}
                      placeholder="123456"
                    />
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="NewPassword123!"
                    />
                    <Button onClick={handleResetPassword} className="w-full" disabled={loading}>
                      <Key className="w-4 h-4 mr-2" />
                      Reset Password
                    </Button>
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleEnableMFA} variant="outline" disabled={loading}>
                      Enable MFA
                    </Button>
                    <Button onClick={handleRefreshSession} variant="outline" disabled={loading}>
                      Refresh Session
                    </Button>
                  </div>

                  <Button onClick={handleForgotPassword} variant="outline" className="w-full" disabled={loading}>
                    Forgot Password
                  </Button>
                </TabsContent>
              </Tabs>

              <div className="mt-4 pt-4 border-t">
                <Button onClick={handleSignOut} variant="destructive" className="w-full" disabled={loading}>
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Results */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Test Results
              </CardTitle>
              <Button onClick={clearTestResults} variant="outline" size="sm">
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-gray-500">No test results yet...</div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
