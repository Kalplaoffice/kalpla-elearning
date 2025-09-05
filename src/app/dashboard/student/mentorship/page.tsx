'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock mentorship data - replace with actual GraphQL queries
const mentorshipProgram = {
  id: '1',
  title: '12-Month Tech Career Accelerator',
  description: 'Comprehensive mentorship program designed to accelerate your career in technology',
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  progress: 45,
  currentPhase: 2,
  totalPhases: 4,
  mentor: {
    id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Software Engineer at Google',
    avatar: '/api/placeholder/60/60',
    experience: '10+ years',
    expertise: ['React', 'Node.js', 'System Design', 'Career Growth']
  }
};

const phases = [
  {
    id: 1,
    title: 'Foundation Building',
    description: 'Establish your learning goals and assess current skills',
    duration: 'Months 1-3',
    status: 'completed',
    progress: 100,
    modules: [
      {
        id: '1',
        title: 'Goal Setting & Assessment',
        type: 'Video',
        duration: '45 min',
        completed: true,
        resources: ['Assessment Template', 'Goal Setting Worksheet']
      },
      {
        id: '2',
        title: 'Learning Roadmap Creation',
        type: 'Video',
        duration: '30 min',
        completed: true,
        resources: ['Roadmap Template', 'Skill Gap Analysis']
      },
      {
        id: '3',
        title: 'Industry Overview',
        type: 'Live Session',
        duration: '60 min',
        completed: true,
        resources: ['Industry Report', 'Career Paths Guide']
      }
    ]
  },
  {
    id: 2,
    title: 'Skill Development',
    description: 'Focus on building technical skills through guided projects',
    duration: 'Months 4-6',
    status: 'in-progress',
    progress: 60,
    modules: [
      {
        id: '4',
        title: 'Project-Based Learning',
        type: 'Video',
        duration: '90 min',
        completed: true,
        resources: ['Project Guidelines', 'Code Review Checklist']
      },
      {
        id: '5',
        title: 'Technical Skills Workshop',
        type: 'Live Session',
        duration: '120 min',
        completed: true,
        resources: ['Workshop Materials', 'Practice Exercises']
      },
      {
        id: '6',
        title: 'Code Review Session',
        type: 'Live Session',
        duration: '60 min',
        completed: false,
        scheduledDate: '2024-01-25',
        resources: ['Code Review Guidelines']
      },
      {
        id: '7',
        title: 'Industry Best Practices',
        type: 'Video',
        duration: '75 min',
        completed: false,
        resources: ['Best Practices Guide', 'Case Studies']
      }
    ]
  },
  {
    id: 3,
    title: 'Portfolio Building',
    description: 'Create a strong portfolio of projects',
    duration: 'Months 7-9',
    status: 'locked',
    progress: 0,
    modules: [
      {
        id: '8',
        title: 'Portfolio Project Development',
        type: 'Project',
        duration: '2 weeks',
        completed: false,
        resources: ['Portfolio Guidelines', 'Project Templates']
      },
      {
        id: '9',
        title: 'GitHub Profile Optimization',
        type: 'Video',
        duration: '45 min',
        completed: false,
        resources: ['GitHub Best Practices', 'Profile Template']
      }
    ]
  },
  {
    id: 4,
    title: 'Career Transition',
    description: 'Prepare for job interviews and career advancement',
    duration: 'Months 10-12',
    status: 'locked',
    progress: 0,
    modules: [
      {
        id: '10',
        title: 'Interview Preparation',
        type: 'Live Session',
        duration: '90 min',
        completed: false,
        resources: ['Interview Questions', 'Practice Scenarios']
      },
      {
        id: '11',
        title: 'Resume & LinkedIn Optimization',
        type: 'Video',
        duration: '60 min',
        completed: false,
        resources: ['Resume Template', 'LinkedIn Guide']
      }
    ]
  }
];

const liveSessions = [
  {
    id: '1',
    title: 'Code Review Session - React Best Practices',
    mentor: 'Sarah Johnson',
    date: '2024-01-25',
    time: '2:00 PM PST',
    duration: '60 min',
    status: 'upcoming',
    joinLink: 'https://meet.google.com/abc-defg-hij'
  },
  {
    id: '2',
    title: 'Career Growth Discussion',
    mentor: 'Sarah Johnson',
    date: '2024-01-30',
    time: '3:00 PM PST',
    duration: '45 min',
    status: 'upcoming',
    joinLink: 'https://meet.google.com/xyz-uvw-rst'
  }
];

const resources = [
  {
    id: '1',
    title: 'Complete Learning Roadmap',
    type: 'PDF',
    size: '2.3 MB',
    downloadUrl: '/resources/learning-roadmap.pdf',
    category: 'Planning'
  },
  {
    id: '2',
    title: 'Industry Best Practices Guide',
    type: 'PDF',
    size: '1.8 MB',
    downloadUrl: '/resources/best-practices.pdf',
    category: 'Technical'
  },
  {
    id: '3',
    title: 'Interview Preparation Checklist',
    type: 'PDF',
    size: '0.9 MB',
    downloadUrl: '/resources/interview-checklist.pdf',
    category: 'Career'
  },
  {
    id: '4',
    title: 'Portfolio Project Templates',
    type: 'ZIP',
    size: '15.2 MB',
    downloadUrl: '/resources/portfolio-templates.zip',
    category: 'Projects'
  }
];

const discussions = [
  {
    id: '1',
    title: 'How to approach system design interviews?',
    author: 'Alex Chen',
    phase: 'Skill Development',
    replies: 5,
    lastActivity: '2 hours ago',
    isResolved: false
  },
  {
    id: '2',
    title: 'Best practices for React state management',
    author: 'Sarah Johnson',
    phase: 'Skill Development',
    replies: 12,
    lastActivity: '1 day ago',
    isResolved: true
  },
  {
    id: '3',
    title: 'Portfolio project ideas for beginners',
    author: 'Mike Rodriguez',
    phase: 'Portfolio Building',
    replies: 8,
    lastActivity: '3 days ago',
    isResolved: false
  }
];

export default function MentorshipPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
          <p className="mt-4 text-gray-600">Loading mentorship program...</p>
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

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'locked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentorship Program</h1>
          <p className="text-gray-600">{mentorshipProgram.description}</p>
        </div>

        {/* Program Overview */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{mentorshipProgram.title}</h2>
                <p className="text-gray-600">Mentor: {mentorshipProgram.mentor.name}</p>
                <p className="text-sm text-gray-500">{mentorshipProgram.mentor.title}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{mentorshipProgram.progress}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${mentorshipProgram.progress}%` }}
              />
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Start Date:</span>
                <span className="ml-2 text-gray-600">{mentorshipProgram.startDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">End Date:</span>
                <span className="ml-2 text-gray-600">{mentorshipProgram.endDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Current Phase:</span>
                <span className="ml-2 text-gray-600">{mentorshipProgram.currentPhase} of {mentorshipProgram.totalPhases}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'overview', label: 'Program Overview' },
            { id: 'sessions', label: 'Live Sessions' },
            { id: 'resources', label: 'Resources' },
            { id: 'discussions', label: 'Discussions' }
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {phases.map((phase) => (
              <Card key={phase.id} className={`${phase.status === 'locked' ? 'opacity-60' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-3">
                        <span className="text-2xl">Phase {phase.id}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPhaseStatusColor(phase.status)}`}>
                          {phase.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </CardTitle>
                      <CardDescription>{phase.duration}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{phase.progress}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{phase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${phase.progress}%` }}
                    />
                  </div>
                  <div className="space-y-3">
                    {phase.modules.map((module) => (
                      <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            module.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}>
                            {module.completed ? '✓' : '○'}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-600">{module.type} • {module.duration}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {module.scheduledDate && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                              {module.scheduledDate}
                            </span>
                          )}
                          <Button size="sm" variant="outline" disabled={phase.status === 'locked'}>
                            {module.completed ? 'Review' : 'Start'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Live Sessions</CardTitle>
                <CardDescription>Join your mentor for live Q&A and guidance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveSessions.map((session) => (
                    <div key={session.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{session.title}</h4>
                          <p className="text-sm text-gray-600">Mentor: {session.mentor}</p>
                          <p className="text-sm text-gray-500">
                            {session.date} at {session.time} • {session.duration}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            session.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {session.status}
                          </span>
                          <Button size="sm">
                            Join Session
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Resources</CardTitle>
                <CardDescription>Download materials and templates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource) => (
                    <div key={resource.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-lg">
                              {resource.type === 'PDF' ? '📄' : '📦'}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{resource.title}</h4>
                            <p className="text-sm text-gray-600">{resource.type} • {resource.size}</p>
                            <p className="text-xs text-gray-500">{resource.category}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'discussions' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Program Discussions</CardTitle>
                <CardDescription>Connect with peers and get help from mentors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{discussion.title}</h4>
                          <p className="text-sm text-gray-600">by {discussion.author} • {discussion.phase}</p>
                          <p className="text-sm text-gray-500">{discussion.replies} replies • {discussion.lastActivity}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {discussion.isResolved && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                              Resolved
                            </span>
                          )}
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full mt-4">
                  <Link href="/dashboard/student/community">View All Discussions</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
