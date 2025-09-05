'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock community data - replace with actual GraphQL queries
const discussionThreads = [
  {
    id: '1',
    title: 'How to approach system design interviews?',
    author: {
      id: '1',
      name: 'Alex Chen',
      avatar: '/api/placeholder/40/40',
      role: 'Student',
      level: 'Intermediate'
    },
    course: 'Web Development Bootcamp',
    replies: 12,
    views: 156,
    lastActivity: '2 hours ago',
    isResolved: false,
    tags: ['system-design', 'interview', 'help'],
    content: 'I have an upcoming system design interview and I\'m not sure how to approach it. Any tips or resources would be helpful!',
    upvotes: 8
  },
  {
    id: '2',
    title: 'Best practices for React state management',
    author: {
      id: '2',
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      role: 'Mentor',
      level: 'Expert'
    },
    course: 'Web Development Bootcamp',
    replies: 8,
    views: 89,
    lastActivity: '1 day ago',
    isResolved: true,
    tags: ['react', 'state-management', 'best-practices'],
    content: 'Here are some best practices I\'ve learned over the years for managing state in React applications...',
    upvotes: 15
  },
  {
    id: '3',
    title: 'Portfolio project ideas for beginners',
    author: {
      id: '3',
      name: 'Mike Rodriguez',
      avatar: '/api/placeholder/40/40',
      role: 'Student',
      level: 'Beginner'
    },
    course: 'Web Development Bootcamp',
    replies: 15,
    views: 234,
    lastActivity: '3 days ago',
    isResolved: false,
    tags: ['portfolio', 'projects', 'beginner'],
    content: 'I\'m looking for some good portfolio project ideas that would be suitable for someone just starting out...',
    upvotes: 12
  },
  {
    id: '4',
    title: 'Data Science career path discussion',
    author: {
      id: '4',
      name: 'Emily Davis',
      avatar: '/api/placeholder/40/40',
      role: 'Student',
      level: 'Intermediate'
    },
    course: 'Data Science with Python',
    replies: 6,
    views: 78,
    lastActivity: '4 days ago',
    isResolved: false,
    tags: ['data-science', 'career', 'discussion'],
    content: 'I\'m interested in transitioning to a data science career. What skills should I focus on first?',
    upvotes: 5
  }
];

const studyGroups = [
  {
    id: '1',
    name: 'React Study Group',
    description: 'Weekly study sessions for React development',
    members: 24,
    nextMeeting: '2024-01-20T14:00:00Z',
    course: 'Web Development Bootcamp',
    organizer: 'Sarah Johnson',
    isJoined: true
  },
  {
    id: '2',
    name: 'Data Science Beginners',
    description: 'Support group for data science newcomers',
    members: 18,
    nextMeeting: '2024-01-22T16:00:00Z',
    course: 'Data Science with Python',
    organizer: 'Michael Chen',
    isJoined: false
  },
  {
    id: '3',
    name: 'AWS Cloud Practitioners',
    description: 'Cloud computing study and practice group',
    members: 31,
    nextMeeting: '2024-01-25T10:00:00Z',
    course: 'AWS Cloud Practitioner',
    organizer: 'Emily Rodriguez',
    isJoined: true
  }
];

const challenges = [
  {
    id: '1',
    title: 'Build a Todo App Challenge',
    description: 'Create a full-stack todo application using React and Node.js',
    prize: 'Premium course access for 1 month',
    participants: 45,
    deadline: '2024-01-30',
    difficulty: 'Intermediate',
    tags: ['react', 'nodejs', 'fullstack'],
    isParticipating: true
  },
  {
    id: '2',
    title: 'Data Visualization Contest',
    description: 'Create the most creative data visualization using Python',
    prize: '$500 cash prize',
    participants: 28,
    deadline: '2024-02-15',
    difficulty: 'Advanced',
    tags: ['python', 'data-viz', 'matplotlib'],
    isParticipating: false
  },
  {
    id: '3',
    title: 'AWS Architecture Design',
    description: 'Design a scalable cloud architecture for a social media app',
    prize: 'AWS certification voucher',
    participants: 67,
    deadline: '2024-02-28',
    difficulty: 'Expert',
    tags: ['aws', 'architecture', 'cloud'],
    isParticipating: false
  }
];

const topContributors = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/api/placeholder/40/40',
    role: 'Mentor',
    points: 2450,
    helpfulAnswers: 89,
    courses: ['Web Development', 'React Advanced']
  },
  {
    id: '2',
    name: 'Alex Chen',
    avatar: '/api/placeholder/40/40',
    role: 'Student',
    points: 1890,
    helpfulAnswers: 34,
    courses: ['Web Development', 'Data Science']
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    avatar: '/api/placeholder/40/40',
    role: 'Student',
    points: 1650,
    helpfulAnswers: 28,
    courses: ['Web Development', 'AWS']
  }
];

const categories = [
  { id: 'all', label: 'All Discussions', count: discussionThreads.length },
  { id: 'web-dev', label: 'Web Development', count: discussionThreads.filter(t => t.course.includes('Web')).length },
  { id: 'data-science', label: 'Data Science', count: discussionThreads.filter(t => t.course.includes('Data')).length },
  { id: 'aws', label: 'AWS', count: discussionThreads.filter(t => t.course.includes('AWS')).length },
  { id: 'general', label: 'General', count: 0 }
];

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('discussions');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
          <p className="mt-4 text-gray-600">Loading community...</p>
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

  const filteredThreads = discussionThreads.filter(thread => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'web-dev') return thread.course.includes('Web');
    if (selectedCategory === 'data-science') return thread.course.includes('Data');
    if (selectedCategory === 'aws') return thread.course.includes('AWS');
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community & Networking</h1>
          <p className="text-gray-600">Connect with fellow students, mentors, and industry professionals</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'discussions', label: 'Discussions' },
            { id: 'study-groups', label: 'Study Groups' },
            { id: 'challenges', label: 'Challenges' },
            { id: 'leaderboard', label: 'Top Contributors' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-full"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'discussions' && (
          <div className="space-y-6">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  size="sm"
                  className="rounded-full"
                >
                  {category.label}
                  {category.count > 0 && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {category.count}
                    </span>
                  )}
                </Button>
              ))}
            </div>

            {/* Discussion Threads */}
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <Card key={thread.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <img
                        src={thread.author.avatar}
                        alt={thread.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">{thread.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <span>by {thread.author.name}</span>
                              <span>•</span>
                              <span className={`px-2 py-1 rounded text-xs ${
                                thread.author.role === 'Mentor' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {thread.author.role}
                              </span>
                              <span>•</span>
                              <span>{thread.course}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {thread.isResolved && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                Resolved
                              </span>
                            )}
                            <span className="text-sm text-gray-500">{thread.lastActivity}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{thread.replies} replies</span>
                            <span>{thread.views} views</span>
                            <span>{thread.upvotes} upvotes</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {thread.tags.map((tag) => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                            <Button size="sm" variant="outline">
                              View Discussion
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button variant="outline" size="lg">
                Start New Discussion
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'study-groups' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studyGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">{group.name}</h3>
                      <span className={`px-2 py-1 rounded text-xs ${
                        group.isJoined 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {group.isJoined ? 'Joined' : 'Available'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{group.description}</p>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex justify-between">
                        <span>Members:</span>
                        <span>{group.members}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Course:</span>
                        <span>{group.course}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Organizer:</span>
                        <span>{group.organizer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Meeting:</span>
                        <span>{new Date(group.nextMeeting).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant={group.isJoined ? "outline" : "default"}
                    >
                      {group.isJoined ? 'Leave Group' : 'Join Group'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" size="lg">
                Create Study Group
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="space-y-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                      <p className="text-gray-600 mb-3">{challenge.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Prize: {challenge.prize}</span>
                        <span>•</span>
                        <span>{challenge.participants} participants</span>
                        <span>•</span>
                        <span>Deadline: {challenge.deadline}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        challenge.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        challenge.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        challenge.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {challenge.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        challenge.isParticipating 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {challenge.isParticipating ? 'Participating' : 'Not Joined'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {challenge.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Button 
                      variant={challenge.isParticipating ? "outline" : "default"}
                    >
                      {challenge.isParticipating ? 'View Progress' : 'Join Challenge'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Community members who help others the most</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topContributors.map((contributor, index) => (
                    <div key={contributor.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                          index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                      </div>
                      <img
                        src={contributor.avatar}
                        alt={contributor.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{contributor.name}</h4>
                        <p className="text-sm text-gray-600">{contributor.role}</p>
                        <p className="text-xs text-gray-500">{contributor.courses.join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">{contributor.points} pts</div>
                        <div className="text-sm text-gray-600">{contributor.helpfulAnswers} answers</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
