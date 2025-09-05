'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ProtectedRoute from '@/components/ProtectedRoute';

interface CourseAnalytics {
  id: string;
  title: string;
  totalStudents: number;
  totalRevenue: number;
  completionRate: number;
  averageRating: number;
  totalRatings: number;
  totalDuration: number;
  totalViews: number;
  totalEnrollments: number;
  totalCompletions: number;
  dropOffRate: number;
  engagementScore: number;
  revenueByMonth: { month: string; revenue: number }[];
  enrollmentsByMonth: { month: string; enrollments: number }[];
  completionBySection: { section: string; completionRate: number }[];
  studentDemographics: {
    ageGroups: { age: string; count: number }[];
    countries: { country: string; count: number }[];
    devices: { device: string; count: number }[];
  };
  popularLectures: { lecture: string; views: number; completionRate: number }[];
  studentFeedback: {
    rating: number;
    comment: string;
    student: string;
    date: string;
  }[];
}

const CourseAnalyticsPage = () => {
  const [selectedCourse, setSelectedCourse] = useState<string>('1');
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [viewType, setViewType] = useState<string>('overview');

  const courses = [
    { id: '1', title: 'Complete Web Development Bootcamp' },
    { id: '2', title: 'Advanced React Patterns' },
    { id: '3', title: 'Introduction to Data Science' }
  ];

  const mockAnalytics: CourseAnalytics = {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    totalStudents: 1250,
    totalRevenue: 125000,
    completionRate: 78,
    averageRating: 4.8,
    totalRatings: 342,
    totalDuration: 1200,
    totalViews: 15600,
    totalEnrollments: 1250,
    totalCompletions: 975,
    dropOffRate: 22,
    engagementScore: 85,
    revenueByMonth: [
      { month: 'Jan', revenue: 15000 },
      { month: 'Feb', revenue: 18000 },
      { month: 'Mar', revenue: 22000 },
      { month: 'Apr', revenue: 19000 },
      { month: 'May', revenue: 25000 },
      { month: 'Jun', revenue: 26000 }
    ],
    enrollmentsByMonth: [
      { month: 'Jan', enrollments: 120 },
      { month: 'Feb', enrollments: 150 },
      { month: 'Mar', enrollments: 180 },
      { month: 'Apr', enrollments: 160 },
      { month: 'May', enrollments: 200 },
      { month: 'Jun', enrollments: 210 }
    ],
    completionBySection: [
      { section: 'Introduction', completionRate: 95 },
      { section: 'HTML & CSS', completionRate: 88 },
      { section: 'JavaScript', completionRate: 82 },
      { section: 'React', completionRate: 75 },
      { section: 'Backend', completionRate: 68 },
      { section: 'Database', completionRate: 72 },
      { section: 'Deployment', completionRate: 65 },
      { section: 'Final Project', completionRate: 78 }
    ],
    studentDemographics: {
      ageGroups: [
        { age: '18-24', count: 450 },
        { age: '25-34', count: 520 },
        { age: '35-44', count: 200 },
        { age: '45+', count: 80 }
      ],
      countries: [
        { country: 'United States', count: 400 },
        { country: 'India', count: 350 },
        { country: 'United Kingdom', count: 150 },
        { country: 'Canada', count: 120 },
        { country: 'Australia', count: 100 },
        { country: 'Other', count: 130 }
      ],
      devices: [
        { device: 'Desktop', count: 750 },
        { device: 'Mobile', count: 350 },
        { device: 'Tablet', count: 150 }
      ]
    },
    popularLectures: [
      { lecture: 'Introduction to HTML', views: 1200, completionRate: 95 },
      { lecture: 'CSS Flexbox Masterclass', views: 1150, completionRate: 92 },
      { lecture: 'JavaScript Fundamentals', views: 1100, completionRate: 88 },
      { lecture: 'React Hooks Explained', views: 1050, completionRate: 85 },
      { lecture: 'Node.js Backend Setup', views: 980, completionRate: 82 }
    ],
    studentFeedback: [
      {
        rating: 5,
        comment: 'Excellent course! The instructor explains everything clearly and the projects are very practical.',
        student: 'John Doe',
        date: '2024-01-15'
      },
      {
        rating: 5,
        comment: 'Best web development course I\'ve taken. Highly recommended!',
        student: 'Jane Smith',
        date: '2024-01-20'
      },
      {
        rating: 4,
        comment: 'Great content but could use more advanced examples in the later sections.',
        student: 'Mike Johnson',
        date: '2024-01-25'
      }
    ]
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Mentor']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Analytics</h1>
            <p className="text-gray-600">Track performance, engagement, and revenue for your courses</p>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Course</label>
                    <select
                      value={selectedCourse}
                      onChange={(e) => setSelectedCourse(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Range</label>
                    <select
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="7d">Last 7 days</option>
                      <option value="30d">Last 30 days</option>
                      <option value="90d">Last 90 days</option>
                      <option value="1y">Last year</option>
                      <option value="all">All time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">View Type</label>
                    <select
                      value={viewType}
                      onChange={(e) => setViewType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="overview">Overview</option>
                      <option value="revenue">Revenue</option>
                      <option value="engagement">Engagement</option>
                      <option value="demographics">Demographics</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#2C4E41]">{formatCurrency(mockAnalytics.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#2C4E41]/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-[#FF804B]">{mockAnalytics.totalStudents.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FF804B]/10 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className={`text-2xl font-bold ${getCompletionColor(mockAnalytics.completionRate)}`}>
                      {mockAnalytics.completionRate}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Engagement Score</p>
                    <p className={`text-2xl font-bold ${getEngagementColor(mockAnalytics.engagementScore)}`}>
                      {mockAnalytics.engagementScore}%
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.revenueByMonth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#2C4E41] h-2 rounded-full"
                            style={{ width: `${(item.revenue / 26000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-20 text-right">{formatCurrency(item.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enrollments Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollments Over Time</CardTitle>
                <CardDescription>Monthly enrollment trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalytics.enrollmentsByMonth.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center gap-2 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FF804B] h-2 rounded-full"
                            style={{ width: `${(item.enrollments / 210) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-16 text-right">{item.enrollments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Completion Rates */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Section Completion Rates</CardTitle>
              <CardDescription>Track where students drop off in your course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.completionBySection.map((section, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{section.section}</span>
                    <div className="flex items-center gap-2 flex-1 ml-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            section.completionRate >= 80 ? 'bg-green-500' :
                            section.completionRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${section.completionRate}%` }}
                        ></div>
                      </div>
                      <span className={`text-sm font-medium w-16 text-right ${getCompletionColor(section.completionRate)}`}>
                        {section.completionRate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Age Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.studentDemographics.ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{group.age}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#FF804B] h-2 rounded-full"
                            style={{ width: `${(group.count / 520) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{group.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.studentDemographics.countries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{country.country}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#2C4E41] h-2 rounded-full"
                            style={{ width: `${(country.count / 400) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{country.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalytics.studentDemographics.devices.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{device.device}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(device.count / 750) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{device.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Popular Lectures */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Popular Lectures</CardTitle>
              <CardDescription>Most viewed and completed lectures</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.popularLectures.map((lecture, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{lecture.lecture}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-sm text-gray-600">{lecture.views} views</span>
                        <span className="text-sm text-gray-600">{lecture.completionRate}% completion</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{lecture.views} views</Badge>
                      <Badge className={lecture.completionRate >= 80 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {lecture.completionRate}% complete
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Student Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Student Feedback</CardTitle>
              <CardDescription>Recent reviews and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalytics.studentFeedback.map((feedback, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{feedback.student}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{feedback.date}</span>
                    </div>
                    <p className="text-gray-700">{feedback.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CourseAnalyticsPage;
