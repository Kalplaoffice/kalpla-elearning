'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

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
          router.push('/dashboard/student');
          break;
        default:
          router.push('/dashboard/student');
      }
    }
  }, [isAuthenticated, user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
        <div className="text-center">
          <div className="w-8 h-8 bg-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Access Required</CardTitle>
            <CardDescription>
              Please sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push('/auth/login')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show role selection if user role is not properly set
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#2C4E41] to-[#FF804B]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Select Dashboard</CardTitle>
          <CardDescription>
            Choose your dashboard based on your role
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={() => router.push('/dashboard/admin')} 
            className="w-full"
            variant="outline"
          >
            👨‍💼 Admin Dashboard
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/mentor')} 
            className="w-full"
            variant="outline"
          >
            👨‍🏫 Mentor Dashboard
          </Button>
          <Button 
            onClick={() => router.push('/dashboard/student')} 
            className="w-full"
            variant="outline"
          >
            🎓 Student Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
