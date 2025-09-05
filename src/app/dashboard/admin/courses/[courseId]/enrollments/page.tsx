'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock enrollment data - replace with actual GraphQL queries
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  totalEnrollments: 1250,
  activeEnrollments: 1100,
  completedEnrollments: 150
};

const mockEnrollments = [
  {
    id: '1',
    student: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      avatar: '/api/placeholder/40/40',
      joinDate: '2024-01-15'
    },
    enrollmentDate: '2024-01-15',
    status: 'active',
    progress: 75,
    lastAccessed: '2024-01-20',
    completionDate: null,
    grade: null,
    certificates: []
  },
  {
    id: '2',
    student: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      avatar: '/api/placeholder/40/40',
      joinDate: '2024-01-10'
    },
    enrollmentDate: '2024-01-10',
    status: 'completed',
    progress: 100,
    lastAccessed: '2024-01-25',
    completionDate: '2024-01-25',
    grade: 95,
    certificates: ['certificate-1']
  },
  {
    id: '3',
    student: {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@example.com',
      avatar: '/api/placeholder/40/40',
      joinDate: '2024-01-05'
    },
    enrollmentDate: '2024-01-05',
    status: 'inactive',
    progress: 25,
    lastAccessed: '2024-01-12',
    completionDate: null,
    grade: null,
    certificates: []
  },
  {
    id: '4',
    student: {
      id: '4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      avatar: '/api/placeholder/40/40',
      joinDate: '2024-01-20'
    },
    enrollmentDate: '2024-01-20',
    status: 'active',
    progress: 45,
    lastAccessed: '2024-01-22',
    completionDate: null,
    grade: null,
    certificates: []
  }
];

export default function CourseEnrollmentsPage({ params }: { params: { courseId: string } }) {
  const { user } = useAuth();
  const [course, setCourse] = useState(mockCourse);
  const [enrollments, setEnrollments] = useState(mockEnrollments);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('enrollmentDate');

  useEffect(() => {
    // Simulate loading enrollment data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [params.courseId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEnrollments = enrollments.filter(enrollment => {
    const matchesSearch = enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         enrollment.student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    switch (sortBy) {
      case 'enrollmentDate':
        return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
      case 'progress':
        return b.progress - a.progress;
      case 'lastAccessed':
        return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
      case 'name':
        return a.student.name.localeCompare(b.student.name);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Admin']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF804B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading enrollments...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Course Enrollments</h1>
                <p className="text-gray-600">{course.title}</p>
              </div>
              <Link href={`/dashboard/admin/courses/${params.courseId}`}>
                <Button variant="outline">Back to Course</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-[#FF804B]">{course.totalEnrollments}</div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-green-600">{course.activeEnrollments}</div>
                <div className="text-sm text-gray-600">Active Students</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-blue-600">{course.completedEnrollments}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {Math.round((course.completedEnrollments / course.totalEnrollments) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                  >
                    <option value="enrollmentDate">Sort by Enrollment Date</option>
                    <option value="progress">Sort by Progress</option>
                    <option value="lastAccessed">Sort by Last Accessed</option>
                    <option value="name">Sort by Name</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollments Table */}
          <Card>
            <CardHeader>
              <CardTitle>Student Enrollments ({filteredEnrollments.length})</CardTitle>
              <CardDescription>
                Manage student enrollments and track their progress
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Enrollment Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Accessed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={enrollment.student.avatar}
                              alt={enrollment.student.name}
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {enrollment.student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {enrollment.student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusColor(enrollment.status)}>
                            {enrollment.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-[#FF804B] h-2 rounded-full"
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-900">{enrollment.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(enrollment.enrollmentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(enrollment.lastAccessed).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {enrollment.grade ? `${enrollment.grade}%` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Message
                            </Button>
                            <Button size="sm" variant="outline">
                              Suspend
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          {filteredEnrollments.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No enrollments found</h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No students have enrolled in this course yet.'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
