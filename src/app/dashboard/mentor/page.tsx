'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Upload, 
  Calendar,
  MessageSquare,
  Award,
  Settings
} from 'lucide-react';

export default function MentorDashboard() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'Mentor') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Access Denied</CardTitle>
            <CardDescription>
              You need mentor permissions to access this dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">Go to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mentorStats = [
    { label: 'Total Courses', value: '12', icon: BookOpen, color: 'text-blue-600' },
    { label: 'Active Students', value: '1,247', icon: Users, color: 'text-green-600' },
    { label: 'Total Revenue', value: '$24,580', icon: BarChart3, color: 'text-purple-600' },
    { label: 'Completion Rate', value: '94%', icon: Award, color: 'text-orange-600' },
  ];

  const quickActions = [
    {
      title: 'Create New Course',
      description: 'Start building your next course',
      icon: BookOpen,
      href: '/dashboard/mentor/courses/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Upload Content',
      description: 'Add videos, documents, and resources',
      icon: Upload,
      href: '/dashboard/mentor/uploads',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'View Students',
      description: 'Manage your enrolled students',
      icon: Users,
      href: '/dashboard/mentor/students',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Schedule Classes',
      description: 'Plan your live sessions',
      icon: Calendar,
      href: '/dashboard/mentor/schedule',
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Grade Assignments',
      description: 'Review and grade student work',
      icon: Award,
      href: '/dashboard/mentor/grading',
      color: 'bg-red-500 hover:bg-red-600'
    },
    {
      title: 'View Reports',
      description: 'Analyze your course performance',
      icon: BarChart3,
      href: '/dashboard/mentor/reports',
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mentor Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-[#2C4E41] border-[#2C4E41]">
                👨‍🏫 Mentor
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mentorStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${action.color} text-white`}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-[#FF804B]" />
                Recent Messages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    JD
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-600">Asked about React hooks in your course</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    SM
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Sarah Miller</p>
                    <p className="text-sm text-gray-600">Submitted assignment for review</p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#2C4E41]" />
                Course Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">React Mastery Course</span>
                  <span className="text-sm font-bold text-green-600">94% completion</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">JavaScript Fundamentals</span>
                  <span className="text-sm font-bold text-blue-600">87% completion</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
