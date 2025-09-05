'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Live classes data - integrated with AWS services
const liveClasses = [
  {
    id: '1',
    title: 'React Hooks Deep Dive',
    instructor: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      title: 'Senior Frontend Developer',
      company: 'Google'
    },
    description: 'Learn advanced React Hooks patterns, custom hooks, and performance optimization techniques.',
    thumbnail: '/api/placeholder/400/225',
    startTime: '2024-01-20T14:00:00Z',
    duration: 90,
    maxStudents: 50,
    enrolledStudents: 32,
    price: 0,
    isFree: true,
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['React', 'Hooks', 'JavaScript', 'Frontend'],
    requirements: ['Basic React knowledge', 'JavaScript ES6+'],
    whatYoullLearn: [
      'Advanced React Hooks patterns',
      'Custom hooks development',
      'Performance optimization',
      'State management with hooks'
    ],
    isLive: false,
    isUpcoming: true,
    joinUrl: '/live-classes/1/join',
    // AWS Integration
    awsService: 'chime', // 'chime' for interactive, 'ivs' for broadcast
    chimeRoomId: 'chime-room-react-hooks-001',
    ivsChannelArn: null,
    recordingS3Key: null,
    maxParticipants: 50,
    currentParticipants: 32,
    // Access Control
    requiresEnrollment: true,
    accessLevel: 'student', // 'student', 'mentor', 'admin'
    // Notifications
    reminderSent: false,
    nextReminder: '2024-01-20T12:00:00Z'
  },
  {
    id: '2',
    title: 'AWS Cloud Architecture Design',
    instructor: {
      name: 'Michael Chen',
      avatar: '/api/placeholder/40/40',
      title: 'Cloud Solutions Architect',
      company: 'Amazon Web Services'
    },
    description: 'Design scalable and cost-effective cloud architectures using AWS services.',
    thumbnail: '/api/placeholder/400/225',
    startTime: '2024-01-22T16:00:00Z',
    duration: 120,
    maxStudents: 30,
    enrolledStudents: 28,
    price: 49.99,
    isFree: false,
    category: 'Cloud Computing',
    level: 'Advanced',
    tags: ['AWS', 'Cloud Architecture', 'DevOps', 'Infrastructure'],
    requirements: ['AWS Fundamentals', 'Basic networking knowledge'],
    whatYoullLearn: [
      'Cloud architecture principles',
      'AWS service selection',
      'Cost optimization strategies',
      'Security best practices'
    ],
    isLive: false,
    isUpcoming: true,
    joinUrl: '/live-classes/2/join',
    // AWS Integration
    awsService: 'ivs', // 'chime' for interactive, 'ivs' for broadcast
    chimeRoomId: null,
    ivsChannelArn: 'arn:aws:ivs:us-east-1:123456789012:channel/aws-architecture-002',
    recordingS3Key: null,
    maxParticipants: 30,
    currentParticipants: 28,
    // Access Control
    requiresEnrollment: true,
    accessLevel: 'student',
    // Notifications
    reminderSent: false,
    nextReminder: '2024-01-22T14:00:00Z'
  },
  {
    id: '3',
    title: 'Data Science with Python - Live Coding',
    instructor: {
      name: 'Emily Davis',
      avatar: '/api/placeholder/40/40',
      title: 'Data Scientist',
      company: 'Netflix'
    },
    description: 'Hands-on data analysis and machine learning with Python in a live coding session.',
    thumbnail: '/api/placeholder/400/225',
    startTime: '2024-01-25T10:00:00Z',
    duration: 150,
    maxStudents: 25,
    enrolledStudents: 25,
    price: 0,
    isFree: true,
    category: 'Data Science',
    level: 'Beginner',
    tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas'],
    requirements: ['Basic Python knowledge', 'Jupyter Notebook'],
    whatYoullLearn: [
      'Data manipulation with Pandas',
      'Data visualization techniques',
      'Basic machine learning concepts',
      'Statistical analysis'
    ],
    isLive: false,
    isUpcoming: true,
    joinUrl: '/live-classes/3/join',
    // AWS Integration
    awsService: 'chime', // Interactive coding session
    chimeRoomId: 'chime-room-data-science-003',
    ivsChannelArn: null,
    recordingS3Key: null,
    maxParticipants: 25,
    currentParticipants: 25,
    // Access Control
    requiresEnrollment: true,
    accessLevel: 'student',
    // Notifications
    reminderSent: true,
    nextReminder: '2024-01-25T08:00:00Z'
  },
  {
    id: '4',
    title: 'System Design Interview Prep',
    instructor: {
      name: 'Alex Rodriguez',
      avatar: '/api/placeholder/40/40',
      title: 'Staff Engineer',
      company: 'Meta'
    },
    description: 'Master system design interviews with real-world examples and best practices.',
    thumbnail: '/api/placeholder/400/225',
    startTime: '2024-01-18T19:00:00Z',
    duration: 180,
    maxStudents: 40,
    enrolledStudents: 40,
    price: 79.99,
    isFree: false,
    category: 'Interview Prep',
    level: 'Advanced',
    tags: ['System Design', 'Interview', 'Architecture', 'Scalability'],
    requirements: ['Software engineering experience', 'Basic system knowledge'],
    whatYoullLearn: [
      'System design fundamentals',
      'Scalability patterns',
      'Database design',
      'Caching strategies'
    ],
    isLive: true,
    isUpcoming: false,
    joinUrl: '/live-classes/4/join',
    // AWS Integration
    awsService: 'ivs', // Large audience broadcast
    chimeRoomId: null,
    ivsChannelArn: 'arn:aws:ivs:us-east-1:123456789012:channel/system-design-004',
    recordingS3Key: 'recordings/system-design-004/2024-01-18.m3u8',
    maxParticipants: 40,
    currentParticipants: 40,
    // Access Control
    requiresEnrollment: true,
    accessLevel: 'student',
    // Notifications
    reminderSent: true,
    nextReminder: null
  }
];

const categories = [
  { id: 'all', label: 'All Classes', count: liveClasses.length },
  { id: 'web-development', label: 'Web Development', count: liveClasses.filter(c => c.category === 'Web Development').length },
  { id: 'data-science', label: 'Data Science', count: liveClasses.filter(c => c.category === 'Data Science').length },
  { id: 'cloud-computing', label: 'Cloud Computing', count: liveClasses.filter(c => c.category === 'Cloud Computing').length },
  { id: 'interview-prep', label: 'Interview Prep', count: liveClasses.filter(c => c.category === 'Interview Prep').length }
];

const levels = [
  { id: 'all', label: 'All Levels' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' }
];

export default function LiveClassesPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedClass, setSelectedClass] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        const groups = session.tokens?.idToken?.payload['cognito:groups'] as string[] || [];
        
        setUser(currentUser);
        setIsAuthorized(groups.includes('Student') || groups.includes('Admin') || groups.includes('Mentor'));
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
          <p className="mt-4 text-gray-600">Loading live classes...</p>
        </div>
      </div>
    );
  }

  const filteredClasses = liveClasses.filter(classItem => {
    const categoryMatch = selectedCategory === 'all' || classItem.category.toLowerCase().replace(' ', '-') === selectedCategory;
    const levelMatch = selectedLevel === 'all' || classItem.level.toLowerCase() === selectedLevel;
    return categoryMatch && levelMatch;
  });

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const getTimeUntilStart = (dateString: string) => {
    const now = new Date();
    const start = new Date(dateString);
    const diff = start.getTime() - now.getTime();
    
    if (diff <= 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Classes</h1>
          <p className="text-gray-600">Join interactive live sessions with industry experts</p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label} ({category.count})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Classes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative overflow-hidden">
                <img
                  src={classItem.thumbnail}
                  alt={classItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex space-x-1">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    classItem.isLive 
                      ? 'bg-red-500 text-white' 
                      : classItem.isUpcoming 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-500 text-white'
                  }`}>
                    {classItem.isLive ? 'LIVE NOW' : classItem.isUpcoming ? 'UPCOMING' : 'ENDED'}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    classItem.awsService === 'chime' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-purple-500 text-white'
                  }`}>
                    {classItem.awsService === 'chime' ? 'INTERACTIVE' : 'BROADCAST'}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {classItem.duration}min
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {classItem.enrolledStudents}/{classItem.maxStudents} students
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1">{classItem.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <img
                      src={classItem.instructor.avatar}
                      alt={classItem.instructor.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{classItem.instructor.name}</span>
                    <span>•</span>
                    <span>{classItem.instructor.title}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{classItem.description}</p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Start Time:</span>
                    <span className="font-medium">{formatTime(classItem.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Time Until Start:</span>
                    <span className="font-medium text-blue-600">{getTimeUntilStart(classItem.startTime)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Level:</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      classItem.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                      classItem.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {classItem.level}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-bold">
                    {classItem.isFree ? 'FREE' : `$${classItem.price}`}
                  </div>
                  <div className="flex space-x-1">
                    {classItem.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    className="flex-1" 
                    disabled={!classItem.isLive && !classItem.isUpcoming}
                    onClick={() => setSelectedClass(classItem)}
                  >
                    {classItem.isLive ? 'Join Now' : classItem.isUpcoming ? 'Enroll' : 'View Details'}
                  </Button>
                  <Button variant="outline" size="sm">
                    ⭐
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Class Details Modal */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{selectedClass.title}</CardTitle>
                    <CardDescription>by {selectedClass.instructor.name}</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedClass(null)}
                  >
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={selectedClass.thumbnail}
                      alt={selectedClass.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Class Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Start Time:</span>
                          <span className="font-medium">{formatTime(selectedClass.startTime)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{selectedClass.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Level:</span>
                          <span className="font-medium">{selectedClass.level}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{selectedClass.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Students:</span>
                          <span className="font-medium">{selectedClass.enrolledStudents}/{selectedClass.maxStudents}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="font-medium text-lg">
                            {selectedClass.isFree ? 'FREE' : `$${selectedClass.price}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Instructor</h4>
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={selectedClass.instructor.avatar}
                          alt={selectedClass.instructor.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{selectedClass.instructor.name}</div>
                          <div className="text-sm text-gray-600">{selectedClass.instructor.title}</div>
                          <div className="text-sm text-gray-500">{selectedClass.instructor.company}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Description</h4>
                    <p className="text-gray-600">{selectedClass.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">What You'll Learn</h4>
                    <ul className="space-y-1">
                      {selectedClass.whatYoullLearn.map((item, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Requirements</h4>
                    <ul className="space-y-1">
                      {selectedClass.requirements.map((req, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1" size="lg">
                      {selectedClass.isLive ? 'Join Live Class' : 'Enroll Now'}
                    </Button>
                    <Button variant="outline" size="lg">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to Teach Live Classes?</h2>
            <p className="text-blue-100 mb-6">
              Share your expertise with our community and earn money teaching live classes
            </p>
            <Button variant="secondary" size="lg">
              Become an Instructor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
