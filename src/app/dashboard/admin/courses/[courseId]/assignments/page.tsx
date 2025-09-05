'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock assignment data - replace with actual GraphQL queries
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp'
};

const mockAssignments = [
  {
    id: '1',
    title: 'Build a Personal Portfolio Website',
    description: 'Create a responsive portfolio website using HTML and CSS. Include sections for about, projects, skills, and contact.',
    type: 'project',
    dueDate: '2024-02-15',
    maxGrade: 100,
    totalSubmissions: 45,
    gradedSubmissions: 30,
    averageGrade: 87.5,
    isPublished: true,
    createdAt: '2024-01-15',
    instructions: [
      'Use semantic HTML5 elements',
      'Implement responsive design with CSS Grid/Flexbox',
      'Include at least 3 project showcases',
      'Add contact form with validation',
      'Deploy to GitHub Pages or Netlify'
    ],
    rubric: [
      { criterion: 'HTML Structure', points: 25, description: 'Proper semantic HTML and accessibility' },
      { criterion: 'CSS Styling', points: 25, description: 'Responsive design and visual appeal' },
      { criterion: 'Functionality', points: 25, description: 'Working features and interactions' },
      { criterion: 'Code Quality', points: 25, description: 'Clean, well-commented code' }
    ]
  },
  {
    id: '2',
    title: 'JavaScript Calculator',
    description: 'Build a functional calculator using vanilla JavaScript with basic arithmetic operations.',
    type: 'coding',
    dueDate: '2024-02-20',
    maxGrade: 100,
    totalSubmissions: 42,
    gradedSubmissions: 25,
    averageGrade: 92.3,
    isPublished: true,
    createdAt: '2024-01-20',
    instructions: [
      'Create calculator interface with number and operation buttons',
      'Implement basic arithmetic operations (+, -, *, /)',
      'Handle edge cases (division by zero, decimal numbers)',
      'Add clear and backspace functionality',
      'Include keyboard support'
    ],
    rubric: [
      { criterion: 'Functionality', points: 40, description: 'All operations work correctly' },
      { criterion: 'UI/UX', points: 20, description: 'Intuitive and responsive interface' },
      { criterion: 'Code Quality', points: 20, description: 'Clean, readable JavaScript code' },
      { criterion: 'Edge Cases', points: 20, description: 'Proper handling of error conditions' }
    ]
  },
  {
    id: '3',
    title: 'React Component Library',
    description: 'Create a reusable component library with common UI elements using React.',
    type: 'project',
    dueDate: '2024-03-01',
    maxGrade: 100,
    totalSubmissions: 0,
    gradedSubmissions: 0,
    averageGrade: 0,
    isPublished: false,
    createdAt: '2024-01-25',
    instructions: [
      'Build at least 5 reusable components (Button, Input, Modal, Card, etc.)',
      'Use TypeScript for type safety',
      'Implement proper prop interfaces',
      'Add Storybook documentation',
      'Include unit tests for components'
    ],
    rubric: [
      { criterion: 'Component Design', points: 30, description: 'Well-designed, reusable components' },
      { criterion: 'TypeScript', points: 20, description: 'Proper type definitions and interfaces' },
      { criterion: 'Documentation', points: 20, description: 'Clear Storybook stories and README' },
      { criterion: 'Testing', points: 15, description: 'Comprehensive unit tests' },
      { criterion: 'Code Quality', points: 15, description: 'Clean, maintainable code' }
    ]
  }
];

export default function CourseAssignmentsPage({ params }: { params: { courseId: string } }) {
  const { user } = useAuth();
  const [course, setCourse] = useState(mockCourse);
  const [assignments, setAssignments] = useState(mockAssignments);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading assignment data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.courseId]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'project': return 'bg-purple-100 text-purple-800';
      case 'coding': return 'bg-blue-100 text-blue-800';
      case 'quiz': return 'bg-green-100 text-green-800';
      case 'essay': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (isPublished: boolean) => {
    return isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Admin']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF804B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading assignments...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Course Assignments</h1>
                <p className="text-gray-600">{course.title}</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowCreateAssignment(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90"
                >
                  Create Assignment
                </Button>
                <Link href={`/dashboard/admin/courses/${params.courseId}`}>
                  <Button variant="outline">Back to Course</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-[#FF804B]">{assignments.length}</div>
                <div className="text-sm text-gray-600">Total Assignments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">
                  {assignments.filter(a => a.isPublished).length}
                </div>
                <div className="text-sm text-gray-600">Published</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">
                  {assignments.reduce((sum, a) => sum + a.totalSubmissions, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Submissions</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-purple-600">
                  {assignments.reduce((sum, a) => sum + a.gradedSubmissions, 0)}
                </div>
                <div className="text-sm text-gray-600">Graded</div>
              </CardContent>
            </Card>
          </div>

          {/* Assignments List */}
          <div className="space-y-6">
            {assignments.map((assignment) => (
              <Card key={assignment.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        <Badge className={getTypeColor(assignment.type)}>
                          {assignment.type}
                        </Badge>
                        <Badge className={getStatusColor(assignment.isPublished)}>
                          {assignment.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                      </div>
                      <CardDescription className="mb-4">{assignment.description}</CardDescription>
                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Due Date:</span> {assignment.dueDate}
                        </div>
                        <div>
                          <span className="font-medium">Submissions:</span> {assignment.totalSubmissions}
                        </div>
                        <div>
                          <span className="font-medium">Graded:</span> {assignment.gradedSubmissions}
                        </div>
                        <div>
                          <span className="font-medium">Average Grade:</span> {assignment.averageGrade}%
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline">
                        Grade
                      </Button>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {selectedAssignment === assignment.id && (
                  <CardContent className="border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Instructions */}
                      <div>
                        <h4 className="font-semibold mb-3">Instructions</h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          {assignment.instructions.map((instruction, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-[#FF804B] mr-2 mt-1">•</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Rubric */}
                      <div>
                        <h4 className="font-semibold mb-3">Grading Rubric</h4>
                        <div className="space-y-2">
                          {assignment.rubric.map((item, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <div>
                                <span className="font-medium">{item.criterion}</span>
                                <p className="text-gray-600 text-xs">{item.description}</p>
                              </div>
                              <span className="text-[#FF804B] font-medium">{item.points} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}

                <CardContent className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedAssignment(
                        selectedAssignment === assignment.id ? null : assignment.id
                      )}
                    >
                      {selectedAssignment === assignment.id ? 'Hide Details' : 'Show Details'}
                    </Button>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Duplicate
                      </Button>
                      <Button size="sm" variant="outline">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {assignments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments yet</h3>
                <p className="text-gray-600 mb-6">
                  Create your first assignment to start engaging students with hands-on projects.
                </p>
                <Button
                  onClick={() => setShowCreateAssignment(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90"
                >
                  Create First Assignment
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Assignment Modal */}
        {showCreateAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Create New Assignment</CardTitle>
                <CardDescription>
                  Add a new assignment to your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title *
                  </label>
                  <Input placeholder="e.g., Build a Personal Portfolio Website" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                    placeholder="Describe what students need to build or complete"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Type *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent">
                      <option value="project">Project</option>
                      <option value="coding">Coding Exercise</option>
                      <option value="quiz">Quiz</option>
                      <option value="essay">Essay</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <Input type="date" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Grade
                    </label>
                    <Input type="number" placeholder="100" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignment Weight
                    </label>
                    <Input type="number" placeholder="20" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                    placeholder="Provide detailed instructions for students..."
                  />
                </div>

                <div className="flex space-x-3">
                  <Button className="flex-1 bg-[#FF804B] hover:bg-[#FF804B]/90">
                    Create Assignment
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCreateAssignment(false)}
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
