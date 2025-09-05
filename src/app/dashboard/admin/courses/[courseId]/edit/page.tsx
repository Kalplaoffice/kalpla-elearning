'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

// Mock course data - replace with actual GraphQL queries
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  subtitle: 'From Zero to Hero',
  description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack developer.',
  longDescription: 'This comprehensive web development bootcamp is designed to take you from complete beginner to job-ready full-stack developer.',
  category: 'Web Development',
  difficulty: 'Beginner',
  price: 199.99,
  originalPrice: 399.99,
  duration: '40',
  language: 'English',
  thumbnailUrl: '/api/placeholder/800/450',
  trailerUrl: '/api/placeholder/800/450',
  instructorId: '1',
  isPublished: true,
  tags: ['Web Development', 'JavaScript', 'React', 'Node.js'],
  requirements: [
    'No prior programming experience required',
    'Basic computer skills',
    'Internet connection'
  ],
  whatYoullLearn: [
    'Build responsive websites with HTML and CSS',
    'Master JavaScript programming',
    'Create dynamic web applications with React',
    'Build backend APIs with Node.js and Express'
  ],
  includes: [
    '40 hours of video content',
    '120 hands-on coding exercises',
    '12 real-world projects',
    'Certificate of completion'
  ]
};

export default function EditCoursePage({ params }: { params: { courseId: string } }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    longDescription: '',
    category: '',
    difficulty: 'Beginner',
    price: '',
    originalPrice: '',
    duration: '',
    language: 'English',
    thumbnailUrl: '',
    trailerUrl: '',
    instructorId: '',
    isPublished: false,
    tags: [] as string[],
    requirements: [] as string[],
    whatYoullLearn: [] as string[],
    includes: [] as string[]
  });

  const categories = [
    'Web Development',
    'Data Science',
    'Mobile Development',
    'Cloud Computing',
    'DevOps',
    'Machine Learning',
    'Cybersecurity',
    'UI/UX Design',
    'Digital Marketing',
    'Business'
  ];

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    // Simulate loading course data
    setTimeout(() => {
      setFormData({
        title: mockCourse.title,
        subtitle: mockCourse.subtitle,
        description: mockCourse.description,
        longDescription: mockCourse.longDescription,
        category: mockCourse.category,
        difficulty: mockCourse.difficulty,
        price: mockCourse.price.toString(),
        originalPrice: mockCourse.originalPrice.toString(),
        duration: mockCourse.duration,
        language: mockCourse.language,
        thumbnailUrl: mockCourse.thumbnailUrl,
        trailerUrl: mockCourse.trailerUrl,
        instructorId: mockCourse.instructorId,
        isPublished: mockCourse.isPublished,
        tags: mockCourse.tags,
        requirements: mockCourse.requirements,
        whatYoullLearn: mockCourse.whatYoullLearn,
        includes: mockCourse.includes
      });
      setIsLoading(false);
    }, 1000);
  }, [params.courseId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as string[], value.trim()]
      }));
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement course update logic
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to course management page
      window.location.href = '/dashboard/admin/courses';
    }, 2000);
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Admin']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF804B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course...</p>
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
                <h1 className="text-2xl font-bold text-gray-900">Edit Course</h1>
                <p className="text-gray-600">Update course information and settings</p>
              </div>
              <div className="flex space-x-3">
                <Link href={`/dashboard/admin/courses/${params.courseId}`}>
                  <Button variant="outline">View Course</Button>
                </Link>
                <Link href="/dashboard/admin/courses">
                  <Button variant="outline">Back to Courses</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>
                      Update the essential details about your course
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Course Title *
                      </label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g., Complete Web Development Bootcamp"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtitle
                      </label>
                      <Input
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleInputChange}
                        placeholder="e.g., From Zero to Hero"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                        placeholder="Brief description that appears in course listings"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Detailed Description *
                      </label>
                      <textarea
                        name="longDescription"
                        value={formData.longDescription}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                        placeholder="Comprehensive description of what students will learn"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty Level *
                        </label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FF804B] focus:border-transparent"
                        >
                          {difficulties.map(difficulty => (
                            <option key={difficulty} value={difficulty}>{difficulty}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (hours) *
                        </label>
                        <Input
                          name="duration"
                          type="number"
                          value={formData.duration}
                          onChange={handleInputChange}
                          placeholder="40"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Language
                        </label>
                        <Input
                          name="language"
                          value={formData.language}
                          onChange={handleInputChange}
                          placeholder="English"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                    <CardDescription>
                      Update the course price and any discounts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($) *
                        </label>
                        <Input
                          name="price"
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="199.99"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Original Price ($)
                        </label>
                        <Input
                          name="originalPrice"
                          type="number"
                          step="0.01"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          placeholder="399.99"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Media */}
                <Card>
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>
                      Update course thumbnail and trailer video
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thumbnail URL *
                      </label>
                      <Input
                        name="thumbnailUrl"
                        value={formData.thumbnailUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/thumbnail.jpg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trailer Video URL
                      </label>
                      <Input
                        name="trailerUrl"
                        value={formData.trailerUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/trailer.mp4"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Course Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Content</CardTitle>
                    <CardDescription>
                      Update what students will learn and what's included
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What You'll Learn
                      </label>
                      <div className="space-y-2">
                        {formData.whatYoullLearn.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...formData.whatYoullLearn];
                                newItems[index] = e.target.value;
                                setFormData(prev => ({ ...prev, whatYoullLearn: newItems }));
                              }}
                              placeholder="e.g., Build responsive websites with HTML and CSS"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeArrayItem('whatYoullLearn', index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setFormData(prev => ({ ...prev, whatYoullLearn: [...prev.whatYoullLearn, ''] }))}
                        >
                          Add Learning Outcome
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements
                      </label>
                      <div className="space-y-2">
                        {formData.requirements.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...formData.requirements];
                                newItems[index] = e.target.value;
                                setFormData(prev => ({ ...prev, requirements: newItems }));
                              }}
                              placeholder="e.g., No prior programming experience required"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeArrayItem('requirements', index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setFormData(prev => ({ ...prev, requirements: [...prev.requirements, ''] }))}
                        >
                          Add Requirement
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What's Included
                      </label>
                      <div className="space-y-2">
                        {formData.includes.map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              value={item}
                              onChange={(e) => {
                                const newItems = [...formData.includes];
                                newItems[index] = e.target.value;
                                setFormData(prev => ({ ...prev, includes: newItems }));
                              }}
                              placeholder="e.g., 40 hours of video content"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => removeArrayItem('includes', index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setFormData(prev => ({ ...prev, includes: [...prev.includes, ''] }))}
                        >
                          Add Inclusion
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Publish Settings */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Publish Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="isPublished"
                          checked={formData.isPublished}
                          onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                          className="rounded border-gray-300 text-[#FF804B] focus:ring-[#FF804B]"
                        />
                        <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">
                          Course is published
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Uncheck to save as draft
                      </p>
                    </CardContent>
                  </Card>

                  {/* Course Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="flex items-center space-x-1">
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeArrayItem('tags', index)}
                                className="ml-1 text-gray-400 hover:text-gray-600"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Input
                            placeholder="Add tag"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.target as HTMLInputElement;
                                if (input.value.trim()) {
                                  setFormData(prev => ({ ...prev, tags: [...prev.tags, input.value.trim()] }));
                                  input.value = '';
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#FF804B] hover:bg-[#FF804B]/90"
                        >
                          {isSubmitting ? 'Updating Course...' : 'Update Course'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => window.history.back()}
                        >
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
