'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock course content data - replace with actual GraphQL queries
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  modules: [
    {
      id: '1',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of web development',
      order: 1,
      isPublished: true,
      lessons: [
        {
          id: '1',
          title: 'Introduction to HTML',
          description: 'Learn the basics of HTML structure and elements',
          type: 'video',
          duration: 15,
          order: 1,
          isPublished: true,
          videoUrl: '/api/placeholder/video1.mp4',
          resources: [
            { id: '1', name: 'HTML Cheat Sheet', type: 'pdf', url: '/api/placeholder/html-cheat-sheet.pdf' }
          ]
        },
        {
          id: '2',
          title: 'HTML Elements and Attributes',
          description: 'Deep dive into HTML elements and their attributes',
          type: 'video',
          duration: 20,
          order: 2,
          isPublished: true,
          videoUrl: '/api/placeholder/video2.mp4',
          resources: []
        },
        {
          id: '3',
          title: 'CSS Basics and Styling',
          description: 'Introduction to CSS and basic styling techniques',
          type: 'video',
          duration: 25,
          order: 3,
          isPublished: false,
          videoUrl: '/api/placeholder/video3.mp4',
          resources: []
        },
        {
          id: '4',
          title: 'HTML & CSS Quiz',
          description: 'Test your knowledge of HTML and CSS fundamentals',
          type: 'quiz',
          duration: 30,
          order: 4,
          isPublished: true,
          questions: 10,
          resources: []
        }
      ]
    },
    {
      id: '2',
      title: 'JavaScript Basics',
      description: 'Master JavaScript programming fundamentals',
      order: 2,
      isPublished: false,
      lessons: [
        {
          id: '5',
          title: 'Variables and Data Types',
          description: 'Learn about JavaScript variables and data types',
          type: 'video',
          duration: 18,
          order: 1,
          isPublished: false,
          videoUrl: '/api/placeholder/video5.mp4',
          resources: []
        }
      ]
    }
  ]
};

export default function CourseContentPage({ params }: { params: { courseId: string } }) {
  const { user } = useAuth();
  const [course, setCourse] = useState(mockCourse);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set(['1']));

  useEffect(() => {
    // Simulate loading course data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.courseId]);

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '▶️';
      case 'quiz': return '📝';
      case 'assignment': return '📋';
      case 'text': return '📄';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'assignment': return 'bg-purple-100 text-purple-800';
      case 'text': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Admin']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF804B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course content...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Course Content</h1>
                <p className="text-gray-600">{course.title}</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowAddModule(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90"
                >
                  Add Module
                </Button>
                <Link href={`/dashboard/admin/courses/${params.courseId}`}>
                  <Button variant="outline">Back to Course</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {course.modules.map((module, moduleIndex) => (
              <Card key={module.id} className="overflow-hidden">
                <CardHeader 
                  className="bg-gray-50 cursor-pointer"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {expandedModules.has(module.id) ? '📂' : '📁'}
                      </span>
                      <div>
                        <CardTitle className="text-lg">
                          Module {module.order}: {module.title}
                        </CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={module.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {module.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedModule(module.id);
                          setShowAddLesson(true);
                        }}
                      >
                        Add Lesson
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {expandedModules.has(module.id) && (
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{getTypeIcon(lesson.type)}</span>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium">{lesson.title}</h4>
                                  <Badge className={getTypeColor(lesson.type)}>
                                    {lesson.type}
                                  </Badge>
                                  {lesson.type === 'quiz' && (
                                    <span className="text-sm text-gray-500">
                                      {lesson.questions} questions
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                  <span>Duration: {lesson.duration} min</span>
                                  <span>Order: {lesson.order}</span>
                                  {lesson.resources.length > 0 && (
                                    <span>Resources: {lesson.resources.length}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={lesson.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                                {lesson.isPublished ? 'Published' : 'Draft'}
                              </Badge>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Resources */}
                          {lesson.resources.length > 0 && (
                            <div className="mt-3 pl-8">
                              <h5 className="text-sm font-medium text-gray-700 mb-2">Resources:</h5>
                              <div className="space-y-1">
                                {lesson.resources.map((resource) => (
                                  <div key={resource.id} className="flex items-center space-x-2 text-sm text-gray-600">
                                    <span>📎</span>
                                    <span>{resource.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {resource.type.toUpperCase()}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}

            {/* Empty State */}
            {course.modules.length === 0 && (
              <Card>
                <CardContent className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No modules yet</h3>
                  <p className="text-gray-600 mb-6">
                    Start building your course by adding your first module.
                  </p>
                  <Button
                    onClick={() => setShowAddModule(true)}
                    className="bg-[#FF804B] hover:bg-[#FF804B]/90"
                  >
                    Add First Module
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Add Module Modal */}
        {showAddModule && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Module</CardTitle>
                <CardDescription>
                  Create a new module for your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Module Title *
                  </label>
                  <Input placeholder="e.g., HTML & CSS Fundamentals" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                    placeholder="Brief description of what students will learn in this module"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-[#FF804B] hover:bg-[#FF804B]/90">
                    Create Module
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddModule(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Lesson Modal */}
        {showAddLesson && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Add New Lesson</CardTitle>
                <CardDescription>
                  Add a new lesson to the selected module
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title *
                  </label>
                  <Input placeholder="e.g., Introduction to HTML" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                    placeholder="Brief description of the lesson content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Type *
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent">
                    <option value="video">Video Lesson</option>
                    <option value="quiz">Quiz</option>
                    <option value="assignment">Assignment</option>
                    <option value="text">Text Content</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <Input type="number" placeholder="15" />
                </div>
                <div className="flex space-x-3">
                  <Button className="flex-1 bg-[#FF804B] hover:bg-[#FF804B]/90">
                    Create Lesson
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddLesson(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
