'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ChannelsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Channels', count: 24 },
    { id: 'general', name: 'General', count: 8 },
    { id: 'mentorship', name: 'Mentorship', count: 6 },
    { id: 'startups', name: 'Startups', count: 5 },
    { id: 'technical', name: 'Technical', count: 3 },
    { id: 'off-topic', name: 'Off-topic', count: 2 }
  ];

  const channels = [
    {
      id: 1,
      name: "General Discussion",
      description: "General chat and announcements for the community",
      category: "general",
      members: 1247,
      isPublic: true,
      isJoined: true,
      lastActivity: "2 minutes ago",
      unreadCount: 3
    },
    {
      id: 2,
      name: "Startup Ideas & Validation",
      description: "Share and get feedback on your startup ideas",
      category: "startups",
      members: 456,
      isPublic: true,
      isJoined: true,
      lastActivity: "15 minutes ago",
      unreadCount: 0
    },
    {
      id: 3,
      name: "Mentor Office Hours",
      description: "Get direct help from our expert mentors",
      category: "mentorship",
      members: 234,
      isPublic: true,
      isJoined: false,
      lastActivity: "1 hour ago",
      unreadCount: 0
    },
    {
      id: 4,
      name: "React & Frontend",
      description: "Discuss React, Vue, Angular and frontend technologies",
      category: "technical",
      members: 189,
      isPublic: true,
      isJoined: true,
      lastActivity: "30 minutes ago",
      unreadCount: 7
    },
    {
      id: 5,
      name: "Funding & Investment",
      description: "Tips and discussions about raising capital",
      category: "startups",
      members: 312,
      isPublic: true,
      isJoined: false,
      lastActivity: "2 hours ago",
      unreadCount: 0
    },
    {
      id: 6,
      name: "Success Stories",
      description: "Share your wins and celebrate others' achievements",
      category: "general",
      members: 567,
      isPublic: true,
      isJoined: true,
      lastActivity: "45 minutes ago",
      unreadCount: 1
    },
    {
      id: 7,
      name: "Job Opportunities",
      description: "Post and find job opportunities in startups",
      category: "general",
      members: 423,
      isPublic: true,
      isJoined: false,
      lastActivity: "3 hours ago",
      unreadCount: 0
    },
    {
      id: 8,
      name: "Memes & Fun",
      description: "Light-hearted content and community bonding",
      category: "off-topic",
      members: 678,
      isPublic: true,
      isJoined: true,
      lastActivity: "1 hour ago",
      unreadCount: 0
    }
  ];

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Channels
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Join discussions, share ideas, and connect with fellow entrepreneurs
            </p>
            
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="whitespace-nowrap"
                  >
                    {category.name} ({category.count})
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChannels.map((channel) => (
              <Card key={channel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{channel.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {channel.description}
                      </CardDescription>
                    </div>
                    {channel.unreadCount > 0 && (
                      <Badge variant="default" className="ml-2">
                        {channel.unreadCount}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Channel Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>👥 {channel.members.toLocaleString()} members</span>
                      <span>🕒 {channel.lastActivity}</span>
                    </div>

                    {/* Category Badge */}
                    <div>
                      <Badge 
                        variant="outline" 
                        className="text-xs capitalize"
                      >
                        {channel.category}
                      </Badge>
                    </div>

                    {/* Join/Leave Button */}
                    <div className="flex gap-2">
                      {channel.isJoined ? (
                        <>
                          <Link href={`/community/channels/${channel.id}`} className="flex-1">
                            <Button className="w-full">
                              {channel.unreadCount > 0 ? 'View Messages' : 'Enter Channel'}
                            </Button>
                          </Link>
                          <Button variant="outline" size="sm">
                            Leave
                          </Button>
                        </>
                      ) : (
                        <Button className="w-full">
                          Join Channel
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Create Channel Button (Admin only) */}
          <div className="mt-8 text-center">
            <Button size="lg" className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
              + Create New Channel
            </Button>
          </div>

          {/* Empty State */}
          {filteredChannels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No channels found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
