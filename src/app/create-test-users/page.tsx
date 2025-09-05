'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';

const testUsers = [
  {
    email: 'admin@kalpla.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'Admin',
    membershipType: 'admin',
    description: 'Full platform administrator with access to all features',
    icon: '👨‍💼',
    color: 'bg-red-100 border-red-300 text-red-800'
  },
  {
    email: 'student@kalpla.com',
    password: 'Student123!',
    name: 'Regular Student',
    role: 'Student',
    membershipType: 'basic',
    description: 'Standard student account with course access',
    icon: '🎓',
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  },
  {
    email: 'instructor@kalpla.com',
    password: 'Instructor123!',
    name: 'Course Instructor',
    role: 'Instructor',
    membershipType: 'instructor',
    description: 'Course creator and instructor with content management',
    icon: '👨‍🏫',
    color: 'bg-green-100 border-green-300 text-green-800'
  },
  {
    email: 'premium@kalpla.com',
    password: 'Premium123!',
    name: 'Premium Student',
    role: 'Student',
    membershipType: 'premium',
    description: '12-month membership with premium community access',
    icon: '💎',
    color: 'bg-purple-100 border-purple-300 text-purple-800'
  }
];

export default function CreateTestUsers() {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { success: boolean; message: string }>>({});

  const createUser = async (user: typeof testUsers[0]) => {
    setLoading(user.email);
    try {
      await signUp(user.email, user.password, user.name, user.role, user.membershipType);
      setResults(prev => ({
        ...prev,
        [user.email]: {
          success: true,
          message: 'User created successfully! Check email for verification.'
        }
      }));
    } catch (error: any) {
      setResults(prev => ({
        ...prev,
        [user.email]: {
          success: false,
          message: error.message || 'Failed to create user'
        }
      }));
    } finally {
      setLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // Visual feedback could be added here
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧪 Create Test Users
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Create test user accounts with different roles for development and testing purposes.
            These accounts will be created in your AWS Cognito User Pool.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {testUsers.map((user) => (
            <Card key={user.email} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{user.icon}</span>
                  <Badge className={user.color}>
                    {user.role}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{user.name}</CardTitle>
                <CardDescription className="text-sm">
                  {user.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={user.email}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user.email)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      value={user.password}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(user.password)}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={() => createUser(user)}
                  disabled={loading === user.email}
                  className="w-full bg-[#FF804B] hover:bg-[#FF804B]/90"
                >
                  {loading === user.email ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </Button>

                {results[user.email] && (
                  <Alert className={results[user.email].success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                    <AlertDescription className={results[user.email].success ? 'text-green-800' : 'text-red-800'}>
                      {results[user.email].message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>📋 Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Click "Create User" for each test account you want to create</li>
              <li>Check your email for verification codes (if email verification is enabled)</li>
              <li>Go to the <a href="/auth/login" className="text-[#FF804B] hover:underline">login page</a> to test the accounts</li>
              <li>Test different dashboard access based on user roles</li>
              <li>Verify that role-based permissions are working correctly</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔗 Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a href="/auth/login" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-[#FF804B]">Login Page</div>
                <div className="text-sm text-gray-600">Test user authentication</div>
              </a>
              <a href="/dashboard/student" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-[#FF804B]">Student Dashboard</div>
                <div className="text-sm text-gray-600">Test student features</div>
              </a>
              <a href="/dashboard/admin" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-[#FF804B]">Admin Dashboard</div>
                <div className="text-sm text-gray-600">Test admin features</div>
              </a>
              <a href="/courses" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="font-semibold text-[#FF804B]">Courses</div>
                <div className="text-sm text-gray-600">Browse course catalog</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
