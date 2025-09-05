'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  level: string;
  price: number;
  isFree: boolean;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'ARCHIVED';
  totalStudents: number;
  rating: number;
  totalRatings: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: string;
  sections: number;
  lectures: number;
  totalDuration: number;
  completionRate: number;
  revenue: number;
}

const ManageCoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: '1',
      title: 'Complete Web Development Bootcamp',
      instructor: 'John Doe',
      category: 'Technology',
      level: 'Beginner',
      price: 99.99,
      isFree: false,
      status: 'LIVE',
      totalStudents: 1250,
      rating: 4.8,
      totalRatings: 342,
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      thumbnail: '/api/placeholder/300/200',
      sections: 8,
      lectures: 45,
      totalDuration: 1200,
      completionRate: 78,
      revenue: 125000
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      instructor: 'Jane Smith',
      category: 'Technology',
      level: 'Advanced',
      price: 149.99,
      isFree: false,
      status: 'LIVE',
      totalStudents: 890,
      rating: 4.9,
      totalRatings: 156,
      createdAt: '2024-02-01',
      updatedAt: '2024-02-05',
      thumbnail: '/api/placeholder/300/200',
      sections: 6,
      lectures: 32,
      totalDuration: 900,
      completionRate: 85,
      revenue: 133500
    },
    {
      id: '3',
      title: 'Introduction to Data Science',
      instructor: 'Mike Johnson',
      category: 'Technology',
      level: 'Beginner',
      price: 0,
      isFree: true,
      status: 'LIVE',
      totalStudents: 2100,
      rating: 4.7,
      totalRatings: 445,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-12',
      thumbnail: '/api/placeholder/300/200',
      sections: 5,
      lectures: 28,
      totalDuration: 600,
      completionRate: 72,
      revenue: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const categories = ['ALL', 'Technology', 'Business', 'Health & Fitness', 'Arts & Design', 'Marketing'];
  const statuses = ['ALL', 'DRAFT', 'PENDING_REVIEW', 'LIVE', 'ARCHIVED'];

  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || course.status === filterStatus;
      const matchesCategory = filterCategory === 'ALL' || course.category === filterCategory;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortBy as keyof Course];
      const bValue = b[sortBy as keyof Course];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const handleBulkAction = (action: string) => {
    switch (action) {
      case 'delete':
        setCourses(courses.filter(course => !selectedCourses.includes(course.id)));
        setSelectedCourses([]);
        break;
      case 'archive':
        setCourses(courses.map(course => 
          selectedCourses.includes(course.id) 
            ? { ...course, status: 'ARCHIVED' as const }
            : course
        ));
        setSelectedCourses([]);
        break;
      case 'publish':
        setCourses(courses.map(course => 
          selectedCourses.includes(course.id) 
            ? { ...course, status: 'LIVE' as const }
            : course
        ));
        setSelectedCourses([]);
        break;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LIVE': return 'bg-green-100 text-green-800';
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'ARCHIVED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);
  const totalStudents = courses.reduce((sum, course) => sum + course.totalStudents, 0);
  const averageRating = courses.reduce((sum, course) => sum + course.rating, 0) / courses.length;
  const liveCourses = courses.filter(course => course.status === 'LIVE').length;

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Mentor']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
            <p className="text-gray-600">Manage all your courses, track performance, and analyze data</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-[#2C4E41]">{formatCurrency(totalRevenue)}</p>
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
                    <p className="text-2xl font-bold text-[#FF804B]">{totalStudents.toLocaleString()}</p>
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
                    <p className="text-sm font-medium text-gray-600">Live Courses</p>
                    <p className="text-2xl font-bold text-green-600">{liveCourses}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">📚</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{averageRating.toFixed(1)}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[300px]">
                  <Input
                    placeholder="Search courses by title or instructor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="createdAt">Created Date</option>
                  <option value="title">Title</option>
                  <option value="totalStudents">Students</option>
                  <option value="rating">Rating</option>
                  <option value="revenue">Revenue</option>
                </select>

                <Button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant="outline"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedCourses.length > 0 && (
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedCourses.length} course(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleBulkAction('publish')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Publish
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('archive')}
                      size="sm"
                      variant="outline"
                    >
                      Archive
                    </Button>
                    <Button
                      onClick={() => handleBulkAction('delete')}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Courses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Courses ({filteredCourses.length})</CardTitle>
              <CardDescription>Manage and monitor your course performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">
                        <input
                          type="checkbox"
                          checked={selectedCourses.length === filteredCourses.length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCourses(filteredCourses.map(course => course.id));
                            } else {
                              setSelectedCourses([]);
                            }
                          }}
                        />
                      </th>
                      <th className="text-left p-4">Course</th>
                      <th className="text-left p-4">Instructor</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-left p-4">Students</th>
                      <th className="text-left p-4">Rating</th>
                      <th className="text-left p-4">Revenue</th>
                      <th className="text-left p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedCourses.includes(course.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedCourses([...selectedCourses, course.id]);
                              } else {
                                setSelectedCourses(selectedCourses.filter(id => id !== course.id));
                              }
                            }}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium">{course.title}</div>
                              <div className="text-sm text-gray-500">
                                {course.category} • {course.level}
                              </div>
                              <div className="text-sm text-gray-500">
                                {course.sections} sections • {course.lectures} lectures • {formatDuration(course.totalDuration)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{course.instructor}</td>
                        <td className="p-4">
                          <Badge className={getStatusColor(course.status)}>
                            {course.status.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{course.totalStudents.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">
                              {course.completionRate}% completion
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">{course.rating}</span>
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm text-gray-500">({course.totalRatings})</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">
                            {course.isFree ? 'Free' : formatCurrency(course.revenue)}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Analytics
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
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ManageCoursesPage;
