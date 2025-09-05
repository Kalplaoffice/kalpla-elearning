'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock course data - replace with actual GraphQL queries
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  subtitle: 'From Zero to Hero',
  description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack developer.',
  instructor: {
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/40/40'
  },
  thumbnailUrl: '/api/placeholder/400/225',
  progress: 35,
  totalLessons: 120,
  completedLessons: 42,
  estimatedTimeRemaining: '25 hours',
  lastAccessed: '2024-01-15',
  modules: [
    {
      id: '1',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of web development',
      progress: 100,
      duration: '8 hours',
      lessons: 24,
      isCompleted: true,
      lessons: [
        {
          id: '1',
          title: 'Introduction to HTML',
          duration: '15 min',
          type: 'video',
          isCompleted: true,
          isLocked: false,
          videoUrl: '/api/placeholder/video'
        },
        {
          id: '2',
          title: 'HTML Elements and Attributes',
          duration: '20 min',
          type: 'video',
          isCompleted: true,
          isLocked: false,
          videoUrl: '/api/placeholder/video'
        },
        {
          id: '3',
          title: 'CSS Basics and Styling',
          duration: '25 min',
          type: 'video',
          isCompleted: true,
          isLocked: false,
          videoUrl: '/api/placeholder/video'
        }
      ]
    },
    {
      id: '2',
      title: 'JavaScript Basics',
      description: 'Master JavaScript programming fundamentals',
      progress: 60,
      duration: '12 hours',
      lessons: 36,
      isCompleted: false,
      lessons: [
        {
          id: '4',
          title: 'Variables and Data Types',
          duration: '18 min',
          type: 'video',
          isCompleted: true,
          isLocked: false,
          videoUrl: '/api/placeholder/video'
        },
        {
          id: '5',
          title: 'Functions and Scope',
          duration: '22 min',
          type: 'video',
          isCompleted: true,
          isLocked: false,
          videoUrl: '/api/placeholder/video'
        },
        {
          id: '6',
          title: 'Arrays and Objects',
          duration: '20 min',
          type: 'video',
          isCompleted: false,
          isLocked: false,
          videoUrl: '/api/placeholder/video'
        },
        {
          id: '7',
          title: 'DOM Manipulation',
          duration: '30 min',
          type: 'video',
          isCompleted: false,
          isLocked: true,
          videoUrl: '/api/placeholder/video'
        }
      ]
    },
    {
      id: '3',
      title: 'React Development',
      description: 'Build modern web applications with React',
      progress: 0,
      duration: '15 hours',
      lessons: 45,
      isCompleted: false,
      lessons: [
        {
          id: '8',
          title: 'React Components',
          duration: '25 min',
          type: 'video',
          isCompleted: false,
          isLocked: true,
          videoUrl: '/api/placeholder/video'
        }
      ]
    }
  ],
  assignments: [
    {
      id: '1',
      title: 'Build a Personal Portfolio Website',
      description: 'Create a responsive portfolio website using HTML and CSS',
      dueDate: '2024-01-25',
      status: 'submitted',
      grade: 95,
      maxGrade: 100
    },
    {
      id: '2',
      title: 'JavaScript Calculator',
      description: 'Build a functional calculator using JavaScript',
      dueDate: '2024-02-01',
      status: 'in-progress',
      grade: null,
      maxGrade: 100
    }
  ],
  resources: [
    {
      id: '1',
      title: 'HTML Cheat Sheet',
      type: 'pdf',
      size: '2.3 MB',
      downloadUrl: '/api/placeholder/file.pdf'
    },
    {
      id: '2',
      title: 'CSS Properties Reference',
      type: 'pdf',
      size: '1.8 MB',
      downloadUrl: '/api/placeholder/file.pdf'
    }
  ]
};

export default function StudentCoursePage({ params }: { params: { courseId: string } }) {
  const { user } = useAuth();
  const [course, setCourse] = useState(mockCourse);
  const [activeTab, setActiveTab] = useState('curriculum');

  const tabs = [
    { id: 'curriculum', label: 'Curriculum', count: course.modules.length },
    { id: 'assignments', label: 'Assignments', count: course.assignments.length },
    { id: 'resources', label: 'Resources', count: course.resources.length },
    { id: 'discussions', label: 'Discussions', count: 0 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '▶️';
      case 'quiz': return '📝';
      case 'assignment': return '📋';
      case 'pdf': return '📄';
      case 'doc': return '📄';
      default: return '📄';
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Student']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">{course.subtitle}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-2xl font-bold text-[#FF804B]">{course.progress}%</div>
                <Progress value={course.progress} className="w-32 mt-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8">
                <nav className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                        activeTab === tab.id
                          ? 'border-[#FF804B] text-[#FF804B]'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <Badge variant="outline" className="text-xs">
                        {tab.count}
                      </Badge>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'curriculum' && (
                <div className="space-y-6">
                  {course.modules.map((module, index) => (
                    <Card key={module.id} className="overflow-hidden">
                      <CardHeader className="bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg flex items-center">
                              <span className="mr-3">
                                {module.isCompleted ? '✅' : '📚'}
                              </span>
                              {module.title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {module.description}
                            </CardDescription>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>{module.duration}</span>
                              <span>{module.lessons} lessons</span>
                              <span>{module.progress}% complete</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <Progress value={module.progress} className="w-24" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 ${
                              lesson.isLocked ? 'opacity-50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center flex-1">
                              <span className="text-gray-400 mr-3 text-lg">
                                {getTypeIcon(lesson.type)}
                              </span>
                              <div className="flex-1">
                                <div className="font-medium">{lesson.title}</div>
                                <div className="text-sm text-gray-500">{lesson.duration}</div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {lesson.isLocked && (
                                <Badge variant="outline" className="text-xs">
                                  Locked
                                </Badge>
                              )}
                              {lesson.isCompleted && (
                                <span className="text-[#FF804B] text-lg">✓</span>
                              )}
                              {!lesson.isLocked && !lesson.isCompleted && (
                                <Link href={`/courses/${course.id}/player/${lesson.id}`}>
                                  <Button size="sm" variant="outline">
                                    Start
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'assignments' && (
                <div className="space-y-6">
                  {course.assignments.map((assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{assignment.title}</h3>
                            <p className="text-gray-600 mb-4">{assignment.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Due: {assignment.dueDate}</span>
                              {assignment.grade && (
                                <span>Grade: {assignment.grade}/{assignment.maxGrade}</span>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <Badge className={getStatusColor(assignment.status)}>
                              {assignment.status.replace('-', ' ')}
                            </Badge>
                            <Button size="sm" variant="outline">
                              {assignment.status === 'submitted' ? 'View' : 'Submit'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-4">
                  {course.resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                            <div>
                              <h3 className="font-medium">{resource.title}</h3>
                              <p className="text-sm text-gray-500">{resource.size}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {activeTab === 'discussions' && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">💬</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Discussions</h3>
                  <p className="text-gray-600 mb-6">
                    Ask questions, share insights, and connect with fellow students.
                  </p>
                  <Button className="bg-[#FF804B] hover:bg-[#FF804B]/90">
                    Start a Discussion
                  </Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Progress Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#FF804B]">{course.progress}%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                    <Progress value={course.progress} className="w-full" />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{course.completedLessons}</div>
                        <div className="text-gray-500">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{course.totalLessons - course.completedLessons}</div>
                        <div className="text-gray-500">Remaining</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last accessed:</span>
                      <span className="font-medium">{course.lastAccessed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time remaining:</span>
                      <span className="font-medium">{course.estimatedTimeRemaining}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instructor:</span>
                      <span className="font-medium">{course.instructor.name}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Continue Learning */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Continue Learning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Pick up where you left off and keep making progress.
                    </p>
                    <Button className="w-full bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                      Resume Course
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
