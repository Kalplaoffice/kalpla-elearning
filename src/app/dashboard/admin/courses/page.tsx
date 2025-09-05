'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Mock course data
const mockCourses = [
  {
    id: 1,
    title: 'Full-Stack Web Development',
    instructor: 'Sarah Chen',
    category: 'Programming',
    difficulty: 'Intermediate',
    price: 299,
    students: 2500,
    rating: 4.9,
    status: 'Published',
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-20',
    modules: 12,
    duration: '8 weeks'
  },
  {
    id: 2,
    title: 'AI & Machine Learning',
    instructor: 'Dr. Alex Kumar',
    category: 'AI/ML',
    difficulty: 'Advanced',
    price: 399,
    students: 1800,
    rating: 4.8,
    status: 'Published',
    createdAt: '2024-01-10',
    lastUpdated: '2024-01-18',
    modules: 15,
    duration: '12 weeks'
  },
  {
    id: 3,
    title: 'Digital Marketing Mastery',
    instructor: 'Priya Sharma',
    category: 'Marketing',
    difficulty: 'Beginner',
    price: 199,
    students: 3200,
    rating: 4.9,
    status: 'Draft',
    createdAt: '2024-01-20',
    lastUpdated: '2024-01-20',
    modules: 8,
    duration: '6 weeks'
  }
];

const categoryOptions = ['All', 'Programming', 'AI/ML', 'Marketing', 'Design', 'Business'];
const difficultyOptions = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const statusOptions = ['All', 'Published', 'Draft', 'Archived'];

export default function CourseManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || course.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || course.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourses(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCourses.length === filteredCourses.length) {
      setSelectedCourses([]);
    } else {
      setSelectedCourses(filteredCourses.map(course => course.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on courses:`, selectedCourses);
    // Implement bulk actions here
  };

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-600">Create and manage courses and degree programs</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setShowCreateCourse(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white"
                >
                  Create New Course
                </Button>
                <Button variant="outline">
                  Import Courses
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#2C4E41]">Search & Filter Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {categoryOptions.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {difficultyOptions.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedDifficulty('All');
                      setSelectedStatus('All');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Actions */}
          {selectedCourses.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {selectedCourses.length} course(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('publish')}
                      >
                        Publish
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('archive')}
                      >
                        Archive
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('export')}
                      >
                        Export Selected
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('delete')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedCourses([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-[#2C4E41]">{course.title}</CardTitle>
                      <CardDescription>by {course.instructor}</CardDescription>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedCourses.includes(course.id)}
                      onChange={() => handleSelectCourse(course.id)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{course.category}</Badge>
                    <Badge variant={course.difficulty === 'Beginner' ? 'default' : 
                                   course.difficulty === 'Intermediate' ? 'outline' : 'destructive'}>
                      {course.difficulty}
                    </Badge>
                    <Badge variant={course.status === 'Published' ? 'default' : 'outline'}>
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        <span className="text-yellow-400">★</span>
                        <span className="ml-1 font-medium">{course.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-[#2C4E41]">₹{course.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Modules:</span>
                      <span className="font-medium">{course.modules}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Preview
                    </Button>
                    <Button size="sm" variant="outline">
                      ⋮
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course & Degree Program Management Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Add/Edit/Delete Courses', description: 'Create and manage course content', status: 'active' },
                { title: 'Add/Edit/Delete Degree Programs', description: 'Manage comprehensive degree programs', status: 'active' },
                { title: 'Upload Curriculum & Course Structure', description: 'Organize course modules and lessons', status: 'active' },
                { title: 'Upload Video Lectures & Materials', description: 'Add multimedia content and resources', status: 'active' },
                { title: 'Drip Content Scheduling', description: 'Unlock content per week/module', status: 'active' },
                { title: 'Preview Course as Student', description: 'Test course experience from student view', status: 'active' },
                { title: 'Set Pricing (One-time, Subscription, EMI)', description: 'Flexible pricing options', status: 'active' },
                { title: 'Enable/Disable Free Trials', description: 'Manage trial access for courses', status: 'active' },
                { title: 'Assign Instructors to Courses', description: 'Link mentors to specific courses', status: 'active' },
                { title: 'Track Course Completion Analytics', description: 'Monitor student progress and engagement', status: 'active' }
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <Badge variant={feature.status === 'active' ? 'default' : 'outline'}>
                        {feature.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">{mockCourses.length}</div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {mockCourses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Students</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {(mockCourses.reduce((sum, course) => sum + course.rating, 0) / mockCourses.length).toFixed(1)}
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    ₹{mockCourses.reduce((sum, course) => sum + (course.price * course.students), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
