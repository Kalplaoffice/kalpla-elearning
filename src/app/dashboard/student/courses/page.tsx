'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock data - replace with actual GraphQL queries
const enrolledCourses = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    thumbnailUrl: '/api/placeholder/300/200',
    progress: 65,
    totalLessons: 45,
    completedLessons: 29,
    nextLesson: 'React Hooks and State Management',
    lastAccessed: '2024-01-15',
    status: 'In Progress',
    estimatedTimeRemaining: '12 hours'
  },
  {
    id: '2',
    title: 'Data Science with Python',
    instructor: 'Michael Chen',
    thumbnailUrl: '/api/placeholder/300/200',
    progress: 30,
    totalLessons: 38,
    completedLessons: 11,
    nextLesson: 'Pandas DataFrames',
    lastAccessed: '2024-01-14',
    status: 'In Progress',
    estimatedTimeRemaining: '20 hours'
  },
  {
    id: '3',
    title: 'AWS Cloud Practitioner',
    instructor: 'Emily Rodriguez',
    thumbnailUrl: '/api/placeholder/300/200',
    progress: 100,
    totalLessons: 25,
    completedLessons: 25,
    nextLesson: 'Course Complete!',
    lastAccessed: '2024-01-10',
    status: 'Completed',
    estimatedTimeRemaining: '0 hours'
  },
  {
    id: '4',
    title: 'Mobile App Development with React Native',
    instructor: 'David Kim',
    thumbnailUrl: '/api/placeholder/300/200',
    progress: 0,
    totalLessons: 32,
    completedLessons: 0,
    nextLesson: 'Introduction to React Native',
    lastAccessed: '2024-01-12',
    status: 'Not Started',
    estimatedTimeRemaining: '25 hours'
  }
];

const filters = ['All', 'In Progress', 'Completed', 'Not Started'];
const sortOptions = ['Recently Accessed', 'Progress', 'Title', 'Last Updated'];

export default function StudentCoursesPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Recently Accessed');

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
          <p className="mt-4 text-gray-600">Loading courses...</p>
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

  const filteredCourses = enrolledCourses.filter(course => {
    if (selectedFilter === 'All') return true;
    return course.status === selectedFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {enrolledCourses.length}
              </div>
              <div className="text-gray-600">Total Courses</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {enrolledCourses.filter(c => c.status === 'Completed').length}
              </div>
              <div className="text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {enrolledCourses.filter(c => c.status === 'In Progress').length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)}%
              </div>
              <div className="text-gray-600">Average Progress</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter)}
                className="rounded-full"
              >
                {filter}
              </Button>
            ))}
          </div>
          <div className="md:ml-auto">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      course.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : course.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">Instructor: {course.instructor}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                      <span>{course.estimatedTimeRemaining} remaining</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Next:</strong> {course.nextLesson}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last accessed: {course.lastAccessed}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    {course.status === 'Completed' ? (
                      <Button asChild variant="outline" className="flex-1">
                        <Link href={`/courses/${course.id}`}>Review Course</Link>
                      </Button>
                    ) : (
                      <Button asChild className="flex-1">
                        <Link href={`/courses/${course.id}/player/1`}>
                          {course.status === 'Not Started' ? 'Start Course' : 'Continue Learning'}
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="outline">
                      <Link href={`/courses/${course.id}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              {selectedFilter === 'All' 
                ? "You haven't enrolled in any courses yet."
                : `No courses found with status "${selectedFilter}".`
              }
            </p>
            <Button asChild>
              <Link href="/courses">Browse Courses</Link>
            </Button>
          </div>
        )}

        {/* Browse More Courses */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Looking for more courses?</h3>
          <Button asChild variant="outline" size="lg">
            <Link href="/courses">Browse All Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
