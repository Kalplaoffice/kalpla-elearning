'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ProfilePageProps {
  params: {
    userId: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    id: params.userId,
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    avatar: "SC",
    role: "Student",
    status: "online",
    joinDate: "2023-08-15",
    bio: "Passionate entrepreneur building the next big thing in fintech. Love connecting with like-minded individuals and sharing knowledge.",
    location: "San Francisco, CA",
    website: "https://sarahchen.dev",
    linkedin: "https://linkedin.com/in/sarahchen",
    twitter: "@sarahchen_dev",
    points: 15420,
    rank: 1,
    badges: [
      { name: "🏆 Top Performer", description: "Ranked #1 on leaderboard", earnedDate: "2024-01-10" },
      { name: "💡 Idea Master", description: "Shared 10+ innovative ideas", earnedDate: "2024-01-05" },
      { name: "🎯 Goal Crusher", description: "Completed 15+ assignments", earnedDate: "2024-01-01" },
      { name: "💬 Community Helper", description: "Helped 25+ students", earnedDate: "2023-12-20" }
    ],
    stats: {
      assignmentsCompleted: 15,
      communityPosts: 45,
      liveSessionsAttended: 20,
      mentorshipHours: 12,
      projectsShared: 8,
      connections: 156
    },
    recentActivity: [
      {
        type: "post",
        title: "How to validate your startup idea",
        description: "Shared a comprehensive guide on idea validation",
        timestamp: "2 hours ago",
        likes: 23,
        comments: 8
      },
      {
        type: "achievement",
        title: "Earned Top Performer Badge",
        description: "Ranked #1 on the leaderboard this month",
        timestamp: "1 day ago",
        likes: 45,
        comments: 12
      },
      {
        type: "project",
        title: "FinTech MVP Demo",
        description: "Shared a demo of their latest project",
        timestamp: "3 days ago",
        likes: 67,
        comments: 15
      },
      {
        type: "mentorship",
        title: "Helped Mike with pitch deck",
        description: "Provided feedback on Mike's investor pitch",
        timestamp: "5 days ago",
        likes: 12,
        comments: 3
      }
    ],
    skills: ["React", "Node.js", "Python", "Product Management", "UI/UX Design", "Marketing"],
    interests: ["FinTech", "AI/ML", "Startups", "Mentoring", "Open Source"],
    isFollowing: false
  };

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'activity', name: 'Activity' },
    { id: 'projects', name: 'Projects' },
    { id: 'connections', name: 'Connections' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'post': return '📝';
      case 'achievement': return '🏆';
      case 'project': return '🚀';
      case 'mentorship': return '👨‍🏫';
      default: return '📄';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'post': return 'bg-blue-100 text-blue-800';
      case 'achievement': return 'bg-yellow-100 text-yellow-800';
      case 'project': return 'bg-green-100 text-green-800';
      case 'mentorship': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/community" className="text-[#FF804B] hover:text-[#FF804B]/80 font-medium">
              ← Back to Community
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardContent className="p-6">
                  {/* Profile Header */}
                  <div className="text-center mb-6">
                    <div className="relative inline-block mb-4">
                      <div className="w-24 h-24 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center mx-auto">
                        <span className="text-white text-2xl font-bold">
                          {user.avatar}
                        </span>
                      </div>
                      {user.status === 'online' && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                      )}
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                    <Badge variant="outline" className="mb-2">
                      {user.role}
                    </Badge>
                    <p className="text-gray-600 text-sm mb-4">{user.bio}</p>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-4">
                      <span>📍 {user.location}</span>
                      <span>📅 Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center space-x-3 mb-6">
                      {user.website && (
                        <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FF804B]">
                          🌐
                        </a>
                      )}
                      {user.linkedin && (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FF804B]">
                          💼
                        </a>
                      )}
                      {user.twitter && (
                        <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-[#FF804B]">
                          🐦
                        </a>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full">
                        {user.isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      <Button variant="outline" className="w-full">
                        💬 Message
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Stats</h3>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-[#FF804B]">{user.points.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Points</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-[#2C4E41]">#{user.rank}</div>
                        <div className="text-xs text-gray-600">Rank</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{user.stats.assignmentsCompleted}</div>
                        <div className="text-xs text-gray-600">Assignments</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{user.stats.connections}</div>
                        <div className="text-xs text-gray-600">Connections</div>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {user.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
                    <div className="flex flex-wrap gap-1">
                      {user.interests.map((interest, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      variant={activeTab === tab.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab(tab.id)}
                      className="flex-1"
                    >
                      {tab.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Badges */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Badges & Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.badges.map((badge, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                            <span className="text-2xl">{badge.name.split(' ')[0]}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{badge.name}</h4>
                              <p className="text-sm text-gray-600">{badge.description}</p>
                              <p className="text-xs text-gray-500">Earned {new Date(badge.earnedDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.recentActivity.slice(0, 3).map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                            <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{activity.title}</h4>
                              <p className="text-sm text-gray-600">{activity.description}</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{activity.timestamp}</span>
                                <span>👍 {activity.likes}</span>
                                <span>💬 {activity.comments}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'activity' && (
                <Card>
                  <CardHeader>
                    <CardTitle>All Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {user.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                          <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-gray-900">{activity.title}</h4>
                              <Badge variant="outline" className={`text-xs ${getActivityColor(activity.type)}`}>
                                {activity.type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{activity.timestamp}</span>
                              <span>👍 {activity.likes}</span>
                              <span>💬 {activity.comments}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'projects' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🚀</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects shared yet</h3>
                      <p className="text-gray-600">This user hasn't shared any projects publicly.</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'connections' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Connections ({user.stats.connections})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">👥</div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Connections are private</h3>
                      <p className="text-gray-600">This user's connections are not publicly visible.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
