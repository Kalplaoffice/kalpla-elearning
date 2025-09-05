'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const conversations = [
    {
      id: 1,
      user: {
        name: "Sarah Chen",
        avatar: "SC",
        status: "online",
        role: "Mentor"
      },
      lastMessage: "Thanks for the feedback on my pitch deck!",
      timestamp: "2 minutes ago",
      unreadCount: 2,
      isOnline: true
    },
    {
      id: 2,
      user: {
        name: "Mike Kumar",
        avatar: "MK",
        status: "away",
        role: "Student"
      },
      lastMessage: "Can you review my startup idea?",
      timestamp: "1 hour ago",
      unreadCount: 0,
      isOnline: false
    },
    {
      id: 3,
      user: {
        name: "Priya Sharma",
        avatar: "PS",
        status: "offline",
        role: "Student"
      },
      lastMessage: "The React workshop was amazing!",
      timestamp: "3 hours ago",
      unreadCount: 1,
      isOnline: false
    },
    {
      id: 4,
      user: {
        name: "Alex Johnson",
        avatar: "AJ",
        status: "online",
        role: "Admin"
      },
      lastMessage: "Welcome to the community!",
      timestamp: "1 day ago",
      unreadCount: 0,
      isOnline: true
    }
  ];

  const currentChat = selectedChat ? conversations.find(c => c.id.toString() === selectedChat) : null;

  const messages = currentChat ? [
    {
      id: 1,
      sender: "Sarah Chen",
      content: "Hi! I saw your post about startup validation. Could you share some tips?",
      timestamp: "10:30 AM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      content: "Sure! I'd be happy to help. What specific aspect are you struggling with?",
      timestamp: "10:32 AM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Sarah Chen",
      content: "I'm not sure how to validate if there's actually demand for my product idea.",
      timestamp: "10:35 AM",
      isOwn: false
    },
    {
      id: 4,
      sender: "You",
      content: "Great question! Here are a few methods I've used:\n\n1. Landing page with email signup\n2. Customer interviews\n3. Pre-sales or pre-orders\n4. Social media validation\n\nWould you like me to elaborate on any of these?",
      timestamp: "10:38 AM",
      isOwn: true
    },
    {
      id: 5,
      sender: "Sarah Chen",
      content: "Thanks for the feedback on my pitch deck!",
      timestamp: "2 minutes ago",
      isOwn: false
    }
  ] : [];

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Direct Messages</h1>
            <p className="text-gray-600">Connect with mentors and fellow students privately</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="lg:col-span-1">
              <Card className="h-full flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle>Conversations</CardTitle>
                    <Button size="sm">+ New Chat</Button>
                  </div>
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-0">
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedChat === conversation.id.toString() ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedChat(conversation.id.toString())}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <div className="w-12 h-12 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {conversation.user.avatar}
                              </span>
                            </div>
                            {conversation.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {conversation.user.name}
                              </h3>
                              <span className="text-xs text-gray-500">
                                {conversation.timestamp}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge variant="default" className="ml-2">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                            
                            <Badge variant="outline" className="text-xs mt-1">
                              {conversation.user.role}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              {currentChat ? (
                <Card className="h-full flex flex-col">
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">
                              {currentChat.user.avatar}
                            </span>
                          </div>
                          {currentChat.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{currentChat.user.name}</h3>
                          <p className="text-sm text-gray-500">
                            {currentChat.isOnline ? 'Online' : 'Last seen recently'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">📞 Call</Button>
                        <Button variant="outline" size="sm">📹 Video</Button>
                        <Button variant="outline" size="sm">ℹ️ Info</Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.isOwn
                              ? 'bg-[#FF804B] text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.isOwn ? 'text-orange-100' : 'text-gray-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t p-4">
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">📎</Button>
                      <Button variant="outline" size="sm">😊</Button>
                      <Input
                        placeholder="Type a message..."
                        className="flex-1"
                      />
                      <Button>Send</Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
