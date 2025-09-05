'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock data - replace with actual GraphQL queries
const assignments = [
  {
    id: '1',
    title: 'Build a Todo App with React',
    course: 'Complete Web Development Bootcamp',
    courseId: '1',
    description: 'Create a fully functional todo application using React hooks and state management.',
    dueDate: '2024-01-20',
    status: 'Pending',
    submittedAt: null,
    grade: null,
    feedback: null,
    points: 100,
    instructions: 'Build a todo app with the following features: add, edit, delete, and mark as complete.',
    resources: [
      'React Documentation',
      'State Management Guide',
      'Sample Code Repository'
    ]
  },
  {
    id: '2',
    title: 'Data Analysis Project',
    course: 'Data Science with Python',
    courseId: '2',
    description: 'Analyze a dataset and create visualizations to present your findings.',
    dueDate: '2024-01-25',
    status: 'Submitted',
    submittedAt: '2024-01-18',
    grade: null,
    feedback: null,
    points: 150,
    instructions: 'Choose a dataset from the provided options and perform exploratory data analysis.',
    resources: [
      'Dataset Options',
      'Pandas Tutorial',
      'Matplotlib Guide'
    ]
  },
  {
    id: '3',
    title: 'AWS Cloud Architecture Design',
    course: 'AWS Cloud Practitioner',
    courseId: '3',
    description: 'Design a scalable cloud architecture for a web application.',
    dueDate: '2024-01-15',
    status: 'Graded',
    submittedAt: '2024-01-12',
    grade: 85,
    feedback: 'Great work on the architecture design! Consider adding auto-scaling groups for better performance.',
    points: 200,
    instructions: 'Design a three-tier architecture using AWS services.',
    resources: [
      'AWS Architecture Center',
      'Best Practices Guide',
      'Cost Optimization Tips'
    ]
  },
  {
    id: '4',
    title: 'Mobile App Prototype',
    course: 'Mobile App Development with React Native',
    courseId: '4',
    description: 'Create a mobile app prototype using React Native.',
    dueDate: '2024-02-01',
    status: 'Not Started',
    submittedAt: null,
    grade: null,
    feedback: null,
    points: 120,
    instructions: 'Build a cross-platform mobile app with navigation and basic functionality.',
    resources: [
      'React Native Documentation',
      'Navigation Guide',
      'UI Component Library'
    ]
  }
];

const statusFilters = ['All', 'Not Started', 'Pending', 'Submitted', 'Graded'];
const courseFilters = ['All', 'Web Development', 'Data Science', 'AWS', 'Mobile Development'];

export default function StudentAssignmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const groups = session.tokens?.idToken?.payload['cognito:groups'] as string[] || [];
        
        setUser(currentUser);
        setIsAuthorized(groups.includes('Student') || groups.includes('Admin'));
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <Link href="/auth/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredAssignments = assignments.filter(assignment => {
    const statusMatch = selectedStatusFilter === 'All' || assignment.status === selectedStatusFilter;
    const courseMatch = selectedCourseFilter === 'All' || 
      assignment.course.toLowerCase().includes(selectedCourseFilter.toLowerCase());
    return statusMatch && courseMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Graded':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade: number | null) => {
    if (grade === null) return '';
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Assignments</h1>
          <p className="text-gray-600">Track your assignment progress and grades</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {assignments.length}
              </div>
              <div className="text-gray-600">Total Assignments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {assignments.filter(a => a.status === 'Graded').length}
              </div>
              <div className="text-gray-600">Graded</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600 mb-2">
                {assignments.filter(a => a.status === 'Pending' || a.status === 'Submitted').length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {assignments.reduce((acc, a) => acc + (a.grade || 0), 0)}
              </div>
              <div className="text-gray-600">Total Points Earned</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">Status:</span>
            {statusFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedStatusFilter === filter ? 'default' : 'outline'}
                onClick={() => setSelectedStatusFilter(filter)}
                size="sm"
                className="rounded-full"
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">Course:</span>
            {courseFilters.map((filter) => (
              <Button
                key={filter}
                variant={selectedCourseFilter === filter ? 'default' : 'outline'}
                onClick={() => setSelectedCourseFilter(filter)}
                size="sm"
                className="rounded-full"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{assignment.title}</h3>
                    <p className="text-gray-600 mb-2">{assignment.course}</p>
                    <p className="text-gray-600 text-sm">{assignment.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                    {assignment.grade !== null && (
                      <span className={`text-lg font-bold ${getGradeColor(assignment.grade)}`}>
                        {assignment.grade}%
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Due Date:</span>
                    <span className="ml-2 text-gray-600">{assignment.dueDate}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Points:</span>
                    <span className="ml-2 text-gray-600">{assignment.points}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Submitted:</span>
                    <span className="ml-2 text-gray-600">
                      {assignment.submittedAt || 'Not submitted'}
                    </span>
                  </div>
                </div>

                {assignment.feedback && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Feedback:</h4>
                    <p className="text-gray-600 text-sm">{assignment.feedback}</p>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/courses/${assignment.courseId}`}>View Course</Link>
                    </Button>
                    {assignment.status === 'Not Started' && (
                      <Button asChild size="sm">
                        <Link href={`/courses/${assignment.courseId}/player/1`}>Start Assignment</Link>
                      </Button>
                    )}
                    {assignment.status === 'Pending' && (
                      <Button asChild size="sm">
                        <Link href={`/courses/${assignment.courseId}/player/1`}>Continue Work</Link>
                      </Button>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {assignment.instructions}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No assignments found</h3>
            <p className="text-gray-600 mb-6">
              {selectedStatusFilter === 'All' 
                ? "You don't have any assignments yet."
                : `No assignments found with status "${selectedStatusFilter}".`
              }
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
