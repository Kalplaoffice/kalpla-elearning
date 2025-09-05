'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredRole="Student">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <p className="text-gray-600">
              Continue your learning journey and track your progress
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-[#FF804B]/10 rounded-lg">
                    <span className="text-2xl">📚</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Courses</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-[#2C4E41]/10 rounded-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Assignments</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Points</p>
                    <p className="text-2xl font-bold text-gray-900">2,450</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">📜</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900">5</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Courses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Courses</CardTitle>
                    <Link href="/dashboard/student/courses">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "React Fundamentals",
                        progress: 75,
                        instructor: "Sarah Johnson",
                        nextLesson: "State Management"
                      },
                      {
                        title: "Node.js Backend Development",
                        progress: 45,
                        instructor: "Mike Chen",
                        nextLesson: "Database Integration"
                      },
                      {
                        title: "UI/UX Design Principles",
                        progress: 90,
                        instructor: "Emma Davis",
                        nextLesson: "Final Project"
                      }
                    ].map((course, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-sm">R</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">by {course.instructor}</p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Next: {course.nextLesson}</p>
                        </div>
                        <Button size="sm">Continue</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Assignments */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Assignments</CardTitle>
                    <Link href="/dashboard/student/assignments">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Build a Todo App", course: "React Fundamentals", due: "2 days", status: "pending" },
                      { title: "API Integration Project", course: "Node.js Backend", due: "5 days", status: "in-progress" },
                      { title: "Design System Creation", course: "UI/UX Design", due: "1 week", status: "completed" }
                    ].map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                          <p className="text-sm text-gray-600">{assignment.course}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={assignment.status === 'completed' ? 'success' : assignment.status === 'in-progress' ? 'warning' : 'outline'}>
                            {assignment.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{assignment.due}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Live Q&A Session", time: "Today, 3:00 PM", type: "live" },
                      { title: "Mentorship Meeting", time: "Tomorrow, 2:00 PM", type: "meeting" },
                      { title: "Project Review", time: "Friday, 10:00 AM", type: "review" }
                    ].map((event, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-3 h-3 rounded-full ${event.type === 'live' ? 'bg-red-500' : event.type === 'meeting' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/dashboard/student/courses" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      📚 Browse Courses
                    </Button>
                  </Link>
                  <Link href="/dashboard/student/assignments" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      📝 View Assignments
                    </Button>
                  </Link>
                  <Link href="/dashboard/student/leaderboard" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      🏆 Leaderboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/student/community" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      👥 Community
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Progress Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>68%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] h-2 rounded-full" style={{ width: '68%' }}></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">12</p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">5</p>
                        <p className="text-sm text-gray-600">In Progress</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}