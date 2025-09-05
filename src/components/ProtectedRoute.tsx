'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'Student' | 'Mentor' | 'Admin';
  allowedRoles?: ('Student' | 'Mentor' | 'Admin')[];
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole,
  allowedRoles,
  fallback 
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Access Required</CardTitle>
            <CardDescription>
              Please sign in to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access
  const hasRequiredRole = requiredRole ? user?.role === requiredRole : true;
  const hasAllowedRole = allowedRoles ? allowedRoles.includes(user?.role as any) : true;
  
  if (!hasRequiredRole || !hasAllowedRole) {
    const requiredRoles = requiredRole ? [requiredRole] : allowedRoles || [];
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page. Required role: {requiredRoles.join(' or ')}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Your current role: <span className="font-semibold">{user?.role}</span>
            </p>
            <Link href="/dashboard/student">
              <Button variant="outline" className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
