'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock data for dashboard stats
const dashboardStats = {
  totalUsers: 1250,
  totalCourses: 45,
  totalRevenue: 2500000,
  activeStudents: 890,
  pendingAssignments: 23,
  communityPosts: 156,
  upcomingEvents: 5,
  monthlyGrowth: 12.5
};

const recentActivities = [
  { id: 1, type: 'user', message: 'New student registered: Priya Sharma', time: '2 minutes ago', status: 'success' },
  { id: 2, type: 'course', message: 'Course "AI Fundamentals" published', time: '15 minutes ago', status: 'success' },
  { id: 3, type: 'payment', message: 'Payment received: ₹25,000 from Rahul Kumar', time: '1 hour ago', status: 'success' },
  { id: 4, type: 'assignment', message: 'Assignment "React Project" needs grading', time: '2 hours ago', status: 'warning' },
  { id: 5, type: 'community', message: 'Inappropriate content reported in #general', time: '3 hours ago', status: 'error' }
];

const quickActions = [
  { title: 'Add New User', description: 'Create student or mentor account', href: '/dashboard/admin/users/new', icon: '👤' },
  { title: 'Create Course', description: 'Add new course or program', href: '/dashboard/admin/courses/new', icon: '📚' },
  { title: 'View Reports', description: 'Analytics and insights', href: '/dashboard/admin/reports', icon: '📊' },
  { title: 'Manage Community', description: 'Moderate posts and users', href: '/dashboard/admin/community', icon: '💬' },
  { title: 'Payment Overview', description: 'Financial transactions', href: '/dashboard/admin/payments', icon: '💳' },
  { title: 'System Settings', description: 'Platform configuration', href: '/dashboard/admin/settings', icon: '⚙️' }
];

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need admin permissions to access this dashboard</p>
          <a href="/dashboard" className="text-[#FF804B] hover:underline">Go to Dashboard</a>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search users, courses, payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <Button className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">
                  Export Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <div className="text-2xl">👥</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2C4E41]">{dashboardStats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600">+{dashboardStats.monthlyGrowth}% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <div className="text-2xl">💰</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2C4E41]">₹{dashboardStats.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600">+8.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Students</CardTitle>
                <div className="text-2xl">🎓</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2C4E41]">{dashboardStats.activeStudents.toLocaleString()}</div>
                <p className="text-xs text-blue-600">Currently learning</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pending Tasks</CardTitle>
                <div className="text-2xl">📋</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#FF804B]">{dashboardStats.pendingAssignments}</div>
                <p className="text-xs text-orange-600">Assignments to grade</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2C4E41]">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="text-2xl mr-3">{action.icon}</div>
                        <div>
                          <div className="font-medium text-gray-900">{action.title}</div>
                          <div className="text-sm text-gray-600">{action.description}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2C4E41]">Recent Activity</CardTitle>
                  <CardDescription>Latest platform activities and notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-green-500' :
                          activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <Badge variant={activity.status === 'error' ? 'destructive' : 'outline'}>
                          {activity.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Feature Categories */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User & Role Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#2C4E41] flex items-center">
                    <span className="text-2xl mr-2">👥</span>
                    User & Role Management
                  </CardTitle>
                  <CardDescription>Manage students, mentors, and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'Add/Edit/Delete users',
                      'Assign roles & permissions',
                      'Suspend/ban accounts',
                      'Bulk user upload',
                      'Session tracking'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-4 bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">
                    <Link href="/dashboard/admin/users">Manage Users</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Course Management */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#2C4E41] flex items-center">
                    <span className="text-2xl mr-2">📚</span>
                    Course & Program Management
                  </CardTitle>
                  <CardDescription>Create and manage educational content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'Add/Edit/Delete courses',
                      'Upload curriculum & materials',
                      'Drip content scheduling',
                      'Set pricing & trials',
                      'Track completion analytics'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-4 bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">
                    <Link href="/dashboard/admin/courses">Manage Courses</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Assignments & Assessments */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#2C4E41] flex items-center">
                    <span className="text-2xl mr-2">📝</span>
                    Assignments & Assessments
                  </CardTitle>
                  <CardDescription>Create and grade student work</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'Create/manage assignments',
                      'Auto/manual grading',
                      'Upload quizzes & tests',
                      'Generate report cards',
                      'Export grades & reports'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-4 bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">
                    <Link href="/dashboard/admin/assignments">Manage Assignments</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Community & Engagement */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#2C4E41] flex items-center">
                    <span className="text-2xl mr-2">💬</span>
                    Community & Engagement
                  </CardTitle>
                  <CardDescription>Moderate and manage community features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'Create/manage groups',
                      'Moderate posts & comments',
                      'Send announcements',
                      'Monitor flagged content',
                      'Track engagement stats'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-4 bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">
                    <Link href="/dashboard/admin/community">Manage Community</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Payments & Finance */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#2C4E41] flex items-center">
                    <span className="text-2xl mr-2">💳</span>
                    Payments & Finance
                  </CardTitle>
                  <CardDescription>Handle financial transactions and reporting</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'View transactions & refunds',
                      'Manage discounts & codes',
                      'Generate financial reports',
                      'Track revenue by program',
                      'Monitor payment status'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-4 bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">
                    <Link href="/dashboard/admin/payments">Manage Payments</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* System & Analytics */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#2C4E41] flex items-center">
                    <span className="text-2xl mr-2">📊</span>
                    System & Analytics
                  </CardTitle>
                  <CardDescription>Platform insights and configuration</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      'View detailed analytics',
                      'Export data & reports',
                      'System configuration',
                      'Monitor performance',
                      'Backup & maintenance'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button asChild className="w-full mt-4 bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">
                    <Link href="/dashboard/admin/analytics">View Analytics</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
