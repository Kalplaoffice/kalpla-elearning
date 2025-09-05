'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';

interface ChannelDetailPageProps {
  params: {
    channelId: string;
  };
}

export default function ChannelDetailPage({ params }: ChannelDetailPageProps) {
  const [newMessage, setNewMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);

  // Mock channel data
  const channel = {
    id: params.channelId,
    name: "Startup Ideas & Validation",
    description: "Share and get feedback on your startup ideas",
    category: "startups",
    members: 456,
    isJoined: true,
    isPinned: false
  };

  const messages = [
    {
      id: 1,
      author: "Sarah Chen",
      avatar: "SC",
      content: "Has anyone tried validating their idea through landing pages? I'm getting mixed results.",
      timestamp: "2 minutes ago",
      isPinned: false,
      reactions: [
        { emoji: "👍", count: 5 },
        { emoji: "💡", count: 3 }
      ]
    },
    {
      id: 2,
      author: "Mike Kumar",
      avatar: "MK",
      content: "I've had success with landing pages! The key is to focus on the problem, not the solution. What's your conversion rate?",
      timestamp: "5 minutes ago",
      isPinned: false,
      reactions: [
        { emoji: "👍", count: 8 },
        { emoji: "🎯", count: 2 }
      ]
    },
    {
      id: 3,
      author: "Priya Sharma",
      avatar: "PS",
      content: "Great question! Here's a template I used that worked well: [Link to template]",
      timestamp: "8 minutes ago",
      isPinned: true,
      reactions: [
        { emoji: "❤️", count: 12 },
        { emoji: "📝", count: 4 }
      ]
    },
    {
      id: 4,
      author: "Alex Johnson",
      avatar: "AJ",
      content: "Don't forget to also validate through customer interviews. Landing pages are just one piece of the puzzle.",
      timestamp: "12 minutes ago",
      isPinned: false,
      reactions: [
        { emoji: "👍", count: 6 },
        { emoji: "💬", count: 1 }
      ]
    }
  ];

  const members = [
    { name: "Sarah Chen", role: "Student", status: "online", avatar: "SC" },
    { name: "Mike Kumar", role: "Mentor", status: "online", avatar: "MK" },
    { name: "Priya Sharma", role: "Student", status: "away", avatar: "PS" },
    { name: "Alex Johnson", role: "Admin", status: "online", avatar: "AJ" },
    { name: "Emma Davis", role: "Student", status: "offline", avatar: "ED" }
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      // Handle sending message
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Channel Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{channel.name}</h1>
                <p className="text-gray-600">{channel.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="capitalize">
                  {channel.category}
                </Badge>
                <Button variant="outline" onClick={() => setShowMembers(!showMembers)}>
                  👥 {channel.members} members
                </Button>
              </div>
            </div>
            
            {/* Channel Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/community/channels">
                <Button variant="outline">← Back to Channels</Button>
              </Link>
              <Button variant="outline">📌 Pinned Messages</Button>
              <Button variant="outline">📁 Files</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle className="text-lg">Messages</CardTitle>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex space-x-3 ${message.isPinned ? 'bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400' : ''}`}>
                      <div className="w-10 h-10 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-bold">
                          {message.avatar}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-gray-900">{message.author}</span>
                          <span className="text-sm text-gray-500">{message.timestamp}</span>
                          {message.isPinned && (
                            <Badge variant="warning" className="text-xs">Pinned</Badge>
                          )}
                        </div>
                        <p className="text-gray-800 mb-2">{message.content}</p>
                        
                        {/* Reactions */}
                        <div className="flex items-center space-x-2">
                          {message.reactions.map((reaction, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs"
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            + Add reaction
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </form>
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Members List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Members ({channel.members})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {members.map((member, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              {member.avatar}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            member.status === 'online' ? 'bg-green-500' : 
                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
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

              {/* Channel Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Channel Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Rules</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Be respectful and constructive</li>
                      <li>• Stay on topic</li>
                      <li>• No spam or self-promotion</li>
                      <li>• Use @mentions sparingly</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Moderators</h4>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AJ</span>
                      </div>
                      <span className="text-sm text-gray-600">Alex Johnson</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    📌 Pin Message
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    📁 Share File
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    🔔 Mute Channel
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    ⚙️ Channel Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
