'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const timeFilters = [
    { id: 'all', name: 'All Time' },
    { id: 'month', name: 'This Month' },
    { id: 'week', name: 'This Week' },
    { id: 'today', name: 'Today' }
  ];

  const categoryFilters = [
    { id: 'all', name: 'Overall' },
    { id: 'assignments', name: 'Assignments' },
    { id: 'community', name: 'Community' },
    { id: 'mentorship', name: 'Mentorship' },
    { id: 'events', name: 'Events' }
  ];

  const leaderboardData = [
    {
      rank: 1,
      name: "Sarah Chen",
      avatar: "SC",
      points: 15420,
      badges: ["🏆 Top Performer", "💡 Idea Master", "🎯 Goal Crusher"],
      role: "Student",
      progress: 100,
      achievements: [
        { name: "Completed 15 assignments", points: 1500 },
        { name: "Helped 25+ students", points: 2500 },
        { name: "Attended 20+ live sessions", points: 2000 }
      ]
    },
    {
      rank: 2,
      name: "Mike Kumar",
      avatar: "MK",
      points: 12850,
      badges: ["🚀 Rising Star", "💬 Community Helper"],
      role: "Student",
      progress: 83,
      achievements: [
        { name: "Completed 12 assignments", points: 1200 },
        { name: "Active in community discussions", points: 1800 },
        { name: "Mentored 10+ students", points: 1500 }
      ]
    },
    {
      rank: 3,
      name: "Priya Sharma",
      avatar: "PS",
      points: 11200,
      badges: ["🎓 Knowledge Seeker", "📚 Study Buddy"],
      role: "Student",
      progress: 73,
      achievements: [
        { name: "Completed 10 assignments", points: 1000 },
        { name: "Participated in study groups", points: 1200 },
        { name: "Shared valuable resources", points: 800 }
      ]
    },
    {
      rank: 4,
      name: "Alex Johnson",
      avatar: "AJ",
      points: 9850,
      badges: ["💪 Consistent Learner"],
      role: "Student",
      progress: 64,
      achievements: [
        { name: "Completed 8 assignments", points: 800 },
        { name: "Regular community participation", points: 1000 },
        { name: "Attended mentorship sessions", points: 600 }
      ]
    },
    {
      rank: 5,
      name: "Emma Davis",
      avatar: "ED",
      points: 9200,
      badges: ["🌟 Newcomer"],
      role: "Student",
      progress: 60,
      achievements: [
        { name: "Completed 6 assignments", points: 600 },
        { name: "Active in discussions", points: 800 },
        { name: "Joined study groups", points: 400 }
      ]
    }
  ];

  const currentUser = {
    rank: 12,
    name: "You",
    avatar: "U",
    points: 2450,
    badges: ["🎯 Goal Setter"],
    role: "Student",
    progress: 16
  };

  const badges = [
    { name: "🏆 Top Performer", description: "Ranked #1 on leaderboard", rarity: "legendary" },
    { name: "💡 Idea Master", description: "Shared 10+ innovative ideas", rarity: "epic" },
    { name: "🎯 Goal Crusher", description: "Completed 15+ assignments", rarity: "epic" },
    { name: "🚀 Rising Star", description: "Gained 1000+ points this month", rarity: "rare" },
    { name: "💬 Community Helper", description: "Helped 20+ students", rarity: "rare" },
    { name: "🎓 Knowledge Seeker", description: "Attended 10+ live sessions", rarity: "common" },
    { name: "📚 Study Buddy", description: "Participated in 5+ study groups", rarity: "common" },
    { name: "💪 Consistent Learner", description: "Logged in 30+ days straight", rarity: "common" },
    { name: "🌟 Newcomer", description: "Joined this month", rarity: "common" }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Community Leaderboard 🏆
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              See how you stack up against fellow entrepreneurs and track your progress
            </p>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex gap-2">
                {timeFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={timeFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTimeFilter(filter.id)}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                {categoryFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={categoryFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCategoryFilter(filter.id)}
                  >
                    {filter.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>
                    Rankings based on {categoryFilter === 'all' ? 'overall' : categoryFilter} performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {leaderboardData.map((user, index) => (
                      <div
                        key={user.rank}
                        className={`flex items-center space-x-4 p-4 rounded-lg border ${
                          index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200' : 'bg-white'
                        }`}
                      >
                        {/* Rank */}
                        <div className="flex-shrink-0">
                          {user.rank <= 3 ? (
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                              user.rank === 1 ? 'bg-yellow-500' :
                              user.rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
                            }`}>
                              {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold">
                              {user.rank}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {user.avatar}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{user.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {user.role}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Points and Progress */}
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="font-medium text-gray-900">{user.points.toLocaleString()} points</span>
                              <span className="text-gray-500">{user.progress}% of top performer</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${user.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Badges */}
                          <div className="flex flex-wrap gap-1">
                            {user.badges.map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Current User */}
                    <div className="border-t pt-4 mt-6">
                      <div className="flex items-center space-x-4 p-4 rounded-lg border-2 border-[#FF804B] bg-[#FF804B]/5">
                        <div className="w-12 h-12 rounded-full bg-[#FF804B] flex items-center justify-center text-white font-bold">
                          {currentUser.rank}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">
                                {currentUser.avatar}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{currentUser.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {currentUser.role}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="font-medium text-gray-900">{currentUser.points.toLocaleString()} points</span>
                              <span className="text-gray-500">{currentUser.progress}% of top performer</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${currentUser.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {currentUser.badges.map((badge, badgeIndex) => (
                              <Badge key={badgeIndex} variant="outline" className="text-xs">
                                {badge}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Your Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#FF804B] mb-2">
                      {currentUser.points.toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-600">Total Points</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-gray-900">12</div>
                      <p className="text-xs text-gray-600">Assignments</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">45</div>
                      <p className="text-xs text-gray-600">Community Posts</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">8</div>
                      <p className="text-xs text-gray-600">Live Sessions</p>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">3</div>
                      <p className="text-xs text-gray-600">Badges Earned</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Available Badges */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Badges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {badges.map((badge, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                        <span className="text-2xl">{badge.name.split(' ')[0]}</span>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{badge.name}</span>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getRarityColor(badge.rarity)}`}
                            >
                              {badge.rarity}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard/student/assignments">
                    <Button variant="outline" className="w-full justify-start">
                      📝 Complete Assignments
                    </Button>
                  </Link>
                  <Link href="/community/channels">
                    <Button variant="outline" className="w-full justify-start">
                      💬 Join Discussions
                    </Button>
                  </Link>
                  <Link href="/community/events">
                    <Button variant="outline" className="w-full justify-start">
                      🎯 Attend Events
                    </Button>
                  </Link>
                  <Link href="/community/mentorship">
                    <Button variant="outline" className="w-full justify-start">
                      👨‍🏫 Book Mentorship
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
