'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

// Mock course data - replace with actual GraphQL queries
const mockCourse = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  subtitle: 'From Zero to Hero',
  description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB to become a full-stack developer. This comprehensive course covers everything from basic web development concepts to advanced full-stack applications.',
  longDescription: `This comprehensive web development bootcamp is designed to take you from complete beginner to job-ready full-stack developer. You'll learn modern web technologies, build real-world projects, and develop the skills needed to land your first developer job.

What makes this course special:
• Hands-on projects that you can add to your portfolio
• Industry-relevant curriculum updated regularly
• Direct mentorship and career guidance
• Job placement assistance upon completion
• Lifetime access to all materials and updates`,
  instructor: {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Full-Stack Developer',
    company: 'Google',
    avatar: '/api/placeholder/100/100',
    bio: 'Sarah has 8+ years of experience in web development and has helped over 10,000 students land their dream jobs.',
    rating: 4.9,
    students: 15000
  },
  category: 'Web Development',
  difficulty: 'Beginner',
  price: 199.99,
  originalPrice: 399.99,
  thumbnailUrl: '/api/placeholder/800/450',
  trailerUrl: '/api/placeholder/800/450',
  duration: '40 hours',
  lessons: 120,
  students: 1250,
  rating: 4.8,
  reviews: 342,
  language: 'English',
  lastUpdated: '2024-01-15',
  isPublished: true,
  isEnrolled: false,
  modules: [
    {
      id: '1',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of web development',
      duration: '8 hours',
      lessons: 24,
      isUnlocked: true,
      lessons: [
        {
          id: '1',
          title: 'Introduction to HTML',
          duration: '15 min',
          type: 'video',
          isCompleted: false,
          isPreview: true
        },
        {
          id: '2',
          title: 'HTML Elements and Attributes',
          duration: '20 min',
          type: 'video',
          isCompleted: false,
          isPreview: false
        }
      ]
    },
    {
      id: '2',
      title: 'JavaScript Basics',
      description: 'Master JavaScript programming fundamentals',
      duration: '12 hours',
      lessons: 36,
      isUnlocked: false,
      lessons: [
        {
          id: '3',
          title: 'Variables and Data Types',
          duration: '18 min',
          type: 'video',
          isCompleted: false,
          isPreview: false
        }
      ]
    }
  ],
  requirements: [
    'No prior programming experience required',
    'Basic computer skills',
    'Internet connection',
    'Code editor (we\'ll help you install one)'
  ],
  whatYoullLearn: [
    'Build responsive websites with HTML and CSS',
    'Master JavaScript programming',
    'Create dynamic web applications with React',
    'Build backend APIs with Node.js and Express',
    'Work with databases using MongoDB',
    'Deploy applications to the cloud',
    'Use Git for version control',
    'Follow industry best practices'
  ],
  includes: [
    '40 hours of video content',
    '120 hands-on coding exercises',
    '12 real-world projects',
    'Downloadable resources',
    'Certificate of completion',
    'Lifetime access',
    'Mobile and desktop access',
    'Direct instructor support'
  ]
};

export default function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState(mockCourse);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/auth/login?redirect=/courses/' + params.courseId;
      return;
    }
    
    setIsEnrolling(true);
    // TODO: Implement enrollment logic
    setTimeout(() => {
      setCourse(prev => ({ ...prev, isEnrolled: true }));
      setIsEnrolling(false);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'instructor', label: 'Instructor' },
    { id: 'reviews', label: 'Reviews' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <Badge className="mb-4 bg-white/20 text-white border-white/30">
                {course.category}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">{course.title}</h1>
              <p className="text-xl mb-6 opacity-90">{course.subtitle}</p>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">⭐</span>
                  <span>{course.rating} ({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👥</span>
                  <span>{course.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">⏱️</span>
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📚</span>
                  <span>{course.lessons} lessons</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={course.thumbnailUrl}
                alt={course.title}
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-black/20 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-[#FF804B] text-[#FF804B]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">About this course</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">{course.longDescription}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">What you'll learn</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.whatYoullLearn.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-[#FF804B] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">Course requirements</h3>
                  <ul className="space-y-2">
                    {course.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-gray-400 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-bold mb-4">This course includes</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {course.includes.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-[#FF804B] mr-3 mt-1">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Course curriculum</h3>
                {course.modules.map((module, index) => (
                  <Card key={module.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{module.title}</CardTitle>
                          <CardDescription>{module.description}</CardDescription>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <div>{module.duration}</div>
                          <div>{module.lessons} lessons</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-3">
                              {lesson.type === 'video' ? '▶️' : '📄'}
                            </span>
                            <div>
                              <div className="font-medium">{lesson.title}</div>
                              <div className="text-sm text-gray-500">{lesson.duration}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lesson.isPreview && (
                              <Badge variant="outline" className="text-xs">
                                Preview
                              </Badge>
                            )}
                            {lesson.isCompleted && (
                              <span className="text-[#FF804B]">✓</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'instructor' && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-6">Meet your instructor</h3>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={course.instructor.avatar}
                        alt={course.instructor.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="text-xl font-bold">{course.instructor.name}</h4>
                        <p className="text-[#FF804B] font-medium">{course.instructor.title}</p>
                        <p className="text-gray-600 mb-4">{course.instructor.company}</p>
                        <p className="text-gray-700 mb-4">{course.instructor.bio}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-1">⭐</span>
                            <span>{course.instructor.rating} Instructor Rating</span>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-1">👥</span>
                            <span>{course.instructor.students.toLocaleString()} Students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">Student reviews</h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{course.rating}</div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400">⭐</span>
                      ))}
                      <span className="ml-2 text-gray-600">({course.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                {/* Mock reviews */}
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <Card key={review}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium">Student {review}</span>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700">
                              This course exceeded my expectations! The instructor explains complex concepts in a way that's easy to understand. The hands-on projects really helped solidify my learning.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-[#FF804B]">
                    {formatPrice(course.price)}
                  </div>
                  {course.originalPrice && (
                    <div className="text-lg text-gray-500 line-through">
                      {formatPrice(course.originalPrice)}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mt-2">
                    {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                  </div>
                </div>

                {course.isEnrolled ? (
                  <div className="space-y-4">
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button className="w-full bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                        Continue Learning
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full">
                      Add to Wishlist
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full bg-[#FF804B] hover:bg-[#FF804B]/90"
                    >
                      {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
                    </Button>
                    <Button variant="outline" className="w-full">
                      Add to Wishlist
                    </Button>
                    <Button variant="outline" className="w-full">
                      Gift this course
                    </Button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">This course includes:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="text-[#FF804B] mr-2">✓</span>
                      {course.duration} of video content
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FF804B] mr-2">✓</span>
                      {course.lessons} lessons
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FF804B] mr-2">✓</span>
                      Certificate of completion
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FF804B] mr-2">✓</span>
                      Lifetime access
                    </li>
                    <li className="flex items-center">
                      <span className="text-[#FF804B] mr-2">✓</span>
                      Mobile and desktop access
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
