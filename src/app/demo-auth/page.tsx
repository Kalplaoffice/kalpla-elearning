'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function DemoAuthPage() {
  const { user, isAuthenticated, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF804B] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔐 Authentication Demo
            </h1>
            <p className="text-xl text-gray-600">
              Test the authentication system with development mode
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Authentication Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>Status</span>
                  <Badge className={isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Current authentication state
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAuthenticated && user ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-gray-600">{user.email}</p>
                        <Badge variant="outline" className="mt-1">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Button onClick={signOut} variant="outline" className="w-full">
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">You are not signed in</p>
                    <div className="space-y-2">
                      <Link href="/auth/login">
                        <Button className="w-full">Sign In</Button>
                      </Link>
                      <Link href="/auth/register">
                        <Button variant="outline" className="w-full">Sign Up</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Demo Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>How to Test</CardTitle>
                <CardDescription>
                  Development authentication instructions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Create Account</h4>
                  <p className="text-sm text-gray-600">
                    Click "Sign Up" and enter any email/password combination. 
                    The system will accept any valid email format.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">2. Sign In</h4>
                  <p className="text-sm text-gray-600">
                    Use the same email/password you registered with. 
                    The system will remember your session.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">3. Role Testing</h4>
                  <p className="text-sm text-gray-600">
                    • Use "admin@example.com" for Admin role<br/>
                    • Use "mentor@example.com" for Mentor role<br/>
                    • Use any other email for Student role
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">4. Features</h4>
                  <p className="text-sm text-gray-600">
                    • Session persistence (stored in localStorage)<br/>
                    • Automatic role detection<br/>
                    • Avatar generation<br/>
                    • Form validation
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Test Buttons */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Test</CardTitle>
                <CardDescription>
                  Test different user roles quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Student</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Test with student@example.com
                    </p>
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm">
                        Test Login
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Mentor</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Test with mentor@example.com
                    </p>
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm">
                        Test Login
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Admin</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Test with admin@example.com
                    </p>
                    <Link href="/auth/login">
                      <Button variant="outline" size="sm">
                        Test Login
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back to Home */}
          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="outline">
                ← Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
