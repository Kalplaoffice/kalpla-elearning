'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock community data - replace with actual GraphQL queries
const communityServers = [
  {
    id: '1',
    name: 'Kalpla Founders Community',
    description: 'Exclusive community for 12-month mentorship students',
    icon: '🚀',
    memberCount: 1247,
    onlineCount: 89,
    isPremium: true,
    channels: [
      { id: '1', name: 'announcements', type: 'text', unreadCount: 3 },
      { id: '2', name: 'general', type: 'text', unreadCount: 0 },
      { id: '3', name: 'mentorship-support', type: 'text', unreadCount: 12 },
      { id: '4', name: 'study-groups', type: 'text', unreadCount: 5 },
      { id: '5', name: 'voice-lounge', type: 'voice', onlineCount: 8 },
      { id: '6', name: 'mentor-office-hours', type: 'voice', onlineCount: 2 },
      { id: '7', name: 'project-showcase', type: 'text', unreadCount: 0 },
      { id: '8', name: 'job-opportunities', type: 'text', unreadCount: 7 }
    ],
    roles: ['Owner', 'Moderator', 'Mentor', 'Student'],
    isJoined: true
  },
  {
    id: '2',
    name: 'Web Development Cohort 2024',
    description: 'Cohort-specific community for web development students',
    icon: '💻',
    memberCount: 156,
    onlineCount: 23,
    isPremium: true,
    channels: [
      { id: '1', name: 'react-discussions', type: 'text', unreadCount: 8 },
      { id: '2', name: 'project-help', type: 'text', unreadCount: 15 },
      { id: '3', 'name': 'code-review', type: 'text', unreadCount: 3 },
      { id: '4', name: 'study-sessions', type: 'voice', onlineCount: 5 },
      { id: '5', name: 'pair-programming', type: 'voice', onlineCount: 2 }
    ],
    roles: ['Mentor', 'Student'],
    isJoined: true
  },
  {
    id: '3',
    name: 'Data Science Masters',
    description: 'Advanced data science and ML community',
    icon: '📊',
    memberCount: 89,
    onlineCount: 12,
    isPremium: true,
    channels: [
      { id: '1', name: 'ml-algorithms', type: 'text', unreadCount: 4 },
      { id: '2', name: 'dataset-sharing', type: 'text', unreadCount: 0 },
      { id: '3', name: 'research-papers', type: 'text', unreadCount: 2 },
      { id: '4', name: 'model-deployment', type: 'voice', onlineCount: 3 }
    ],
    roles: ['Mentor', 'Student'],
    isJoined: false
  }
];

const recentMessages = [
  {
    id: '1',
    user: {
      name: 'Sarah Johnson',
      avatar: '/api/placeholder/32/32',
      role: 'Mentor',
      isOnline: true
    },
    channel: 'mentorship-support',
    message: 'Great question about React hooks! Check out the new tutorial I shared in #resources',
    timestamp: '2 minutes ago',
    reactions: [
      { emoji: '👍', count: 5 },
      { emoji: '❤️', count: 3 }
    ]
  },
  {
    id: '2',
    user: {
      name: 'Alex Chen',
      avatar: '/api/placeholder/32/32',
      role: 'Student',
      isOnline: true
    },
    channel: 'general',
    message: 'Anyone working on the final project? Looking for a study buddy!',
    timestamp: '15 minutes ago',
    reactions: [
      { emoji: '🤝', count: 2 }
    ]
  },
  {
    id: '3',
    user: {
      name: 'Mike Rodriguez',
      avatar: '/api/placeholder/32/32',
      role: 'Student',
      isOnline: false
    },
    channel: 'job-opportunities',
    message: 'Just got an interview at Google! Thanks to the community for all the support 🙏',
    timestamp: '1 hour ago',
    reactions: [
      { emoji: '🎉', count: 12 },
      { emoji: '🔥', count: 8 }
    ]
  }
];

const userStats = {
  level: 15,
  xp: 2450,
  nextLevelXp: 3000,
  messagesSent: 1247,
  voiceTime: '45h 23m',
  badges: [
    { name: 'Early Adopter', icon: '🌟', description: 'Joined in first month' },
    { name: 'Helpful Mentor', icon: '🎓', description: 'Helped 50+ students' },
    { name: 'Active Participant', icon: '💬', description: '1000+ messages' },
    { name: 'Voice Champion', icon: '🎤', description: '40+ hours in voice' }
  ],
  streak: 7,
  rank: 15
};

export default function PremiumCommunityPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const [hasMentorshipAccess, setHasMentorshipAccess] = useState(false);
  const [selectedServer, setSelectedServer] = useState(communityServers[0]);
  const [selectedChannel, setSelectedChannel] = useState(communityServers[0].channels[0]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Check if user has mentorship access (premium feature)
      // In production, this would check their subscription status
      setHasMentorshipAccess(user.membershipType === 'premium' || user.role === 'Admin');
    }
  }, [isAuthenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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

  if (!hasMentorshipAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Premium Community Access</h1>
          <p className="text-gray-600 mb-6">
            This exclusive community is only available to students enrolled in our 12-month mentorship program.
          </p>
          <div className="space-y-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/mentorship">Join Mentorship Program</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/programs">View All Programs</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="Student">
      <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Sidebar - Servers */}
        <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-2">
          {communityServers.map((server) => (
            <button
              key={server.id}
              onClick={() => setSelectedServer(server)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-colors ${
                selectedServer.id === server.id 
                  ? 'bg-blue-600' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {server.icon}
            </button>
          ))}
          <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-2xl">
            +
          </button>
        </div>

        {/* Channels Sidebar */}
        <div className="w-64 bg-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-semibold text-lg">{selectedServer.name}</h2>
            <p className="text-sm text-gray-400">{selectedServer.description}</p>
            <div className="flex items-center mt-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              {selectedServer.onlineCount} online
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {selectedServer.channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel)}
                  className={`w-full text-left px-3 py-2 rounded flex items-center justify-between hover:bg-gray-700 ${
                    selectedChannel.id === channel.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">
                      {channel.type === 'voice' ? '🔊' : '#'}
                    </span>
                    <span className="text-sm">{channel.name}</span>
                  </div>
                  {channel.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {channel.unreadCount}
                    </span>
                  )}
                  {channel.type === 'voice' && channel.onlineCount > 0 && (
                    <span className="text-xs text-gray-400">
                      {channel.onlineCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src="/api/placeholder/32/32"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">John Doe</div>
                <div className="text-xs text-gray-400">Level {userStats.level}</div>
              </div>
              <div className="flex space-x-1">
                <button className="p-1 hover:bg-gray-700 rounded">
                  🎤
                </button>
                <button className="p-1 hover:bg-gray-700 rounded">
                  📹
                </button>
                <button className="p-1 hover:bg-gray-700 rounded">
                  ⚙️
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Channel Header */}
          <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6">
            <div className="flex items-center">
              <span className="mr-2">
                {selectedChannel.type === 'voice' ? '🔊' : '#'}
              </span>
              <h3 className="font-semibold">{selectedChannel.name}</h3>
              {selectedChannel.type === 'voice' && (
                <span className="ml-2 text-sm text-gray-400">
                  {selectedChannel.onlineCount} online
                </span>
              )}
            </div>
            <div className="ml-auto flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-700 rounded">
                👥
              </button>
              <button className="p-2 hover:bg-gray-700 rounded">
                📌
              </button>
              <button className="p-2 hover:bg-gray-700 rounded">
                🔍
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedChannel.type === 'text' ? (
              recentMessages.map((message) => (
                <div key={message.id} className="flex space-x-3">
                  <img
                    src={message.user.avatar}
                    alt={message.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{message.user.name}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        message.user.role === 'Mentor' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {message.user.role}
                      </span>
                      <span className="text-xs text-gray-400">{message.timestamp}</span>
                    </div>
                    <p className="text-gray-300">{message.message}</p>
                    {message.reactions && message.reactions.length > 0 && (
                      <div className="flex space-x-2 mt-2">
                        {message.reactions.map((reaction, index) => (
                          <button
                            key={index}
                            className="flex items-center space-x-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                          >
                            <span>{reaction.emoji}</span>
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔊</div>
                <h3 className="text-xl font-semibold mb-2">Voice Channel</h3>
                <p className="text-gray-400 mb-6">
                  {selectedChannel.onlineCount} people are in this voice channel
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Join Voice Channel
                </Button>
              </div>
            )}
          </div>

          {/* Message Input */}
          {selectedChannel.type === 'text' && (
            <div className="p-6 border-t border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Message #${selectedChannel.name}`}
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="absolute right-3 top-3 flex space-x-2">
                    <button className="text-gray-400 hover:text-white">😊</button>
                    <button className="text-gray-400 hover:text-white">📎</button>
                    <button className="text-gray-400 hover:text-white">📷</button>
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Members & Activity */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 p-4">
          <div className="space-y-6">
            {/* Online Members */}
            <div>
              <h4 className="font-semibold text-sm text-gray-400 mb-3">
                ONLINE — {selectedServer.onlineCount}
              </h4>
              <div className="space-y-2">
                {[
                  { name: 'Sarah Johnson', role: 'Mentor', isOnline: true },
                  { name: 'Alex Chen', role: 'Student', isOnline: true },
                  { name: 'Mike Rodriguez', role: 'Student', isOnline: true },
                  { name: 'Emily Davis', role: 'Mentor', isOnline: true }
                ].map((member, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="relative">
                      <img
                        src="/api/placeholder/24/24"
                        alt={member.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    </div>
                    <span className="text-sm">{member.name}</span>
                    <span className={`text-xs px-1 py-0.5 rounded ${
                      member.role === 'Mentor' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-600 text-white'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Stats */}
            <div>
              <h4 className="font-semibold text-sm text-gray-400 mb-3">YOUR STATS</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Level {userStats.level}</span>
                    <span>{userStats.xp}/{userStats.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(userStats.xp / userStats.nextLevelXp) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>Messages:</span>
                    <span>{userStats.messagesSent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voice Time:</span>
                    <span>{userStats.voiceTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Streak:</span>
                    <span>{userStats.streak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rank:</span>
                    <span>#{userStats.rank}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h4 className="font-semibold text-sm text-gray-400 mb-3">BADGES</h4>
              <div className="grid grid-cols-2 gap-2">
                {userStats.badges.map((badge, index) => (
                  <div key={index} className="text-center p-2 bg-gray-700 rounded">
                    <div className="text-2xl mb-1">{badge.icon}</div>
                    <div className="text-xs">{badge.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
