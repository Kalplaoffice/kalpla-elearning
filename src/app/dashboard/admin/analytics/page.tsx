'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock analytics data
const mockAnalytics = {
  totalUsers: 1250,
  totalCourses: 45,
  totalRevenue: 2500000,
  activeStudents: 890,
  completionRate: 78.5,
  averageRating: 4.7,
  monthlyGrowth: 12.5,
  topCourses: [
    { name: 'Full-Stack Web Development', students: 2500, revenue: 750000 },
    { name: 'AI & Machine Learning', students: 1800, revenue: 720000 },
    { name: 'Digital Marketing Mastery', students: 3200, revenue: 640000 }
  ],
  userGrowth: [
    { month: 'Jan', users: 1000, revenue: 200000 },
    { month: 'Feb', users: 1100, revenue: 220000 },
    { month: 'Mar', users: 1200, revenue: 240000 },
    { month: 'Apr', users: 1250, revenue: 250000 }
  ],
  coursePerformance: [
    { course: 'React Fundamentals', completion: 85, rating: 4.8, revenue: 150000 },
    { course: 'Python Basics', completion: 92, rating: 4.9, revenue: 180000 },
    { course: 'Data Science', completion: 78, rating: 4.6, revenue: 200000 }
  ]
};

export default function AnalyticsDashboard() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600">Comprehensive platform insights and metrics</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <Button variant="outline">
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
                <div className="text-2xl">👥</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2C4E41]">{mockAnalytics.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-green-600">+{mockAnalytics.monthlyGrowth}% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                <div className="text-2xl">💰</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2C4E41]">₹{mockAnalytics.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-green-600">+8.2% from last month</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Completion Rate</CardTitle>
                <div className="text-2xl">📈</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2C4E41]">{mockAnalytics.completionRate}%</div>
                <p className="text-xs text-blue-600">Course completion rate</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Rating</CardTitle>
                <div className="text-2xl">⭐</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#2C4E41]">{mockAnalytics.averageRating}</div>
                <p className="text-xs text-yellow-600">Out of 5.0</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Courses */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Top Performing Courses</CardTitle>
                <CardDescription>Revenue and enrollment metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.topCourses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{course.name}</h4>
                        <p className="text-sm text-gray-600">{course.students.toLocaleString()} students</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-[#2C4E41]">₹{course.revenue.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Revenue</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Course Performance</CardTitle>
                <CardDescription>Completion rates and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.coursePerformance.map((course, index) => (
                    <div key={index} className="p-3 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{course.course}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-sm font-medium">{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Completion: {course.completion}%</span>
                        <span>Revenue: ₹{course.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Growth Chart Placeholder */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-[#2C4E41]">User Growth & Revenue</CardTitle>
              <CardDescription>Monthly growth trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600">Chart visualization would be here</p>
                  <p className="text-sm text-gray-500">Integration with Chart.js or similar library</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Server Uptime</span>
                    <Badge variant="default">99.9%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database Performance</span>
                    <Badge variant="default">Excellent</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CDN Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">API Response Time</span>
                    <Badge variant="outline">120ms</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Content Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Videos</span>
                    <span className="font-medium">1,250</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Duration</span>
                    <span className="font-medium">2,500 hrs</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Storage Used</span>
                    <span className="font-medium">850 GB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bandwidth</span>
                    <span className="font-medium">2.5 TB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Community Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Groups</span>
                    <span className="font-medium">25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Daily Posts</span>
                    <span className="font-medium">150</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Live Sessions</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Engagement Rate</span>
                    <span className="font-medium">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#2C4E41]">Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="text-2xl mb-2">📊</div>
                  <span>Generate Report</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="text-2xl mb-2">📧</div>
                  <span>Send Newsletter</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="text-2xl mb-2">🔧</div>
                  <span>System Settings</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <div className="text-2xl mb-2">💾</div>
                  <span>Backup Data</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
