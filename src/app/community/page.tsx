'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Community Access Required</CardTitle>
            <CardDescription>
              Please sign in to access the community features
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/auth/login">
              <Button className="w-full">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to the Kalpla Community! 🚀
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Connect, learn, and grow with fellow entrepreneurs and mentors
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md">
              <Input
                placeholder="Search discussions, users, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-[#FF804B]/10 rounded-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Members</p>
                    <p className="text-2xl font-bold text-gray-900">2,847</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-[#2C4E41]/10 rounded-lg">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Discussions</p>
                    <p className="text-2xl font-bold text-gray-900">1,234</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Live Sessions</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Your Points</p>
                    <p className="text-2xl font-bold text-gray-900">2,450</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Discussions */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Discussions</CardTitle>
                    <Link href="/community/discussions">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "How to validate your startup idea?",
                        author: "Sarah Chen",
                        replies: 23,
                        lastActivity: "2 hours ago",
                        category: "Startup Advice",
                        isPinned: true
                      },
                      {
                        title: "React vs Vue.js for MVP development",
                        author: "Mike Kumar",
                        replies: 15,
                        lastActivity: "4 hours ago",
                        category: "Technical",
                        isPinned: false
                      },
                      {
                        title: "Pitch deck template recommendations",
                        author: "Priya Sharma",
                        replies: 8,
                        lastActivity: "6 hours ago",
                        category: "Resources",
                        isPinned: false
                      }
                    ].map((discussion, index) => (
                      <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {discussion.author.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{discussion.title}</h3>
                            {discussion.isPinned && (
                              <Badge variant="warning" className="text-xs">Pinned</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            by {discussion.author} • {discussion.lastActivity}
                          </p>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline" className="text-xs">
                              {discussion.category}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {discussion.replies} replies
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Upcoming Events</CardTitle>
                    <Link href="/community/events">
                      <Button variant="outline" size="sm">View All</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Weekly Startup Pitch Session",
                        time: "Today, 6:00 PM IST",
                        type: "Live Session",
                        attendees: 45
                      },
                      {
                        title: "Mentor Office Hours",
                        time: "Tomorrow, 2:00 PM IST",
                        type: "Office Hours",
                        attendees: 12
                      },
                      {
                        title: "AI & ML Workshop",
                        time: "Friday, 3:00 PM IST",
                        type: "Workshop",
                        attendees: 89
                      }
                    ].map((event, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.time}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {event.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{event.attendees} attending</p>
                          <Button size="sm" className="mt-2">Join</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/community/channels" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      📢 Browse Channels
                    </Button>
                  </Link>
                  <Link href="/community/messages" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      💬 Direct Messages
                    </Button>
                  </Link>
                  <Link href="/community/voice-rooms" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      🎤 Voice Rooms
                    </Button>
                  </Link>
                  <Link href="/community/leaderboard" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      🏆 Leaderboard
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <CardTitle>Trending Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      "#startup-ideas",
                      "#funding-advice",
                      "#react-development",
                      "#mentorship",
                      "#pitch-deck"
                    ].map((topic, index) => (
                      <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{topic}</span>
                        <Badge variant="outline" className="text-xs">Hot</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Online Members */}
              <Card>
                <CardHeader>
                  <CardTitle>Online Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Sarah Chen", status: "online", role: "Mentor" },
                      { name: "Mike Kumar", status: "online", role: "Student" },
                      { name: "Priya Sharma", status: "away", role: "Student" },
                      { name: "Alex Johnson", status: "online", role: "Admin" }
                    ].map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{member.name}</p>
                          <Badge variant="outline" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
