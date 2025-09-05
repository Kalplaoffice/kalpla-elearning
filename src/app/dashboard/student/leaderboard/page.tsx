'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock leaderboard data - replace with actual GraphQL queries
const leaderboardData = [
  {
    rank: 1,
    userId: '1',
    name: 'Alex Johnson',
    avatar: '/api/placeholder/40/40',
    points: 2450,
    badges: ['First Place', 'Code Master', 'Perfect Score'],
    coursesCompleted: 8,
    streak: 15
  },
  {
    rank: 2,
    userId: '2',
    name: 'Sarah Chen',
    avatar: '/api/placeholder/40/40',
    points: 2380,
    badges: ['Second Place', 'Data Wizard', 'Consistent Learner'],
    coursesCompleted: 7,
    streak: 12
  },
  {
    rank: 3,
    userId: '3',
    name: 'Michael Rodriguez',
    avatar: '/api/placeholder/40/40',
    points: 2250,
    badges: ['Third Place', 'Cloud Expert', 'Team Player'],
    coursesCompleted: 6,
    streak: 10
  },
  {
    rank: 4,
    userId: '4',
    name: 'Emily Davis',
    avatar: '/api/placeholder/40/40',
    points: 2100,
    badges: ['Rising Star', 'Quick Learner'],
    coursesCompleted: 5,
    streak: 8
  },
  {
    rank: 5,
    userId: '5',
    name: 'David Kim',
    avatar: '/api/placeholder/40/40',
    points: 1950,
    badges: ['Dedicated Student', 'Problem Solver'],
    coursesCompleted: 4,
    streak: 6
  },
  {
    rank: 6,
    userId: '6',
    name: 'Lisa Wang',
    avatar: '/api/placeholder/40/40',
    points: 1800,
    badges: ['Newcomer', 'Eager Learner'],
    coursesCompleted: 3,
    streak: 4
  }
];

const badges = [
  { name: 'First Place', description: 'Top performer this month', icon: '🥇' },
  { name: 'Code Master', description: 'Completed 10+ coding challenges', icon: '💻' },
  { name: 'Data Wizard', description: 'Excelled in data science courses', icon: '📊' },
  { name: 'Cloud Expert', description: 'Mastered cloud computing concepts', icon: '☁️' },
  { name: 'Perfect Score', description: 'Achieved 100% on 5+ assignments', icon: '⭐' },
  { name: 'Consistent Learner', description: '7+ day learning streak', icon: '🔥' },
  { name: 'Team Player', description: 'Helped 10+ fellow students', icon: '🤝' },
  { name: 'Rising Star', description: 'Most improved this month', icon: '🌟' }
];

const timeframes = ['This Month', 'This Week', 'All Time'];
const cohorts = ['All Cohorts', 'Web Development', 'Data Science', 'Cloud Computing'];

export default function StudentLeaderboardPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('This Month');
  const [selectedCohort, setSelectedCohort] = useState('All Cohorts');

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
          <p className="mt-4 text-gray-600">Loading leaderboard...</p>
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

  const currentUserRank = leaderboardData.find(entry => entry.userId === 'current-user') || {
    rank: 15,
    name: 'You',
    points: 1200,
    badges: ['Newcomer'],
    coursesCompleted: 2,
    streak: 3
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Compete with fellow students and track your progress</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">Timeframe:</span>
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                onClick={() => setSelectedTimeframe(timeframe)}
                size="sm"
                className="rounded-full"
              >
                {timeframe}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-gray-700 self-center mr-2">Cohort:</span>
            {cohorts.map((cohort) => (
              <Button
                key={cohort}
                variant={selectedCohort === cohort ? 'default' : 'outline'}
                onClick={() => setSelectedCohort(cohort)}
                size="sm"
                className="rounded-full"
              >
                {cohort}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>
                  {selectedTimeframe} • {selectedCohort}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((entry, index) => (
                    <div
                      key={entry.userId}
                      className={`flex items-center space-x-4 p-4 rounded-lg ${
                        index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' : 'bg-gray-50'
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        {index < 3 ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
                            {index + 1}
                          </div>
                        )}
                      </div>

                      {/* Avatar and Name */}
                      <div className="flex items-center space-x-3 flex-1">
                        <img
                          src={entry.avatar}
                          alt={entry.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{entry.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{entry.coursesCompleted} courses</span>
                            <span>•</span>
                            <span>{entry.streak} day streak</span>
                          </div>
                        </div>
                      </div>

                      {/* Points */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{entry.points.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>

                      {/* Badges */}
                      <div className="flex space-x-1">
                        {entry.badges.slice(0, 2).map((badge, badgeIndex) => (
                          <span
                            key={badgeIndex}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {badge}
                          </span>
                        ))}
                        {entry.badges.length > 2 && (
                          <span className="text-xs text-gray-500">+{entry.badges.length - 2}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Rank */}
            <Card>
              <CardHeader>
                <CardTitle>Your Ranking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">#{currentUserRank.rank}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{currentUserRank.points.toLocaleString()}</div>
                  <div className="text-gray-600 mb-4">points</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courses Completed:</span>
                      <span className="font-medium">{currentUserRank.coursesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Streak:</span>
                      <span className="font-medium">{currentUserRank.streak} days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Available Badges</CardTitle>
                <CardDescription>Earn badges by completing achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {badges.map((badge, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-gray-900">{badge.name}</div>
                        <div className="text-xs text-gray-600">{badge.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* How to Earn Points */}
            <Card>
              <CardHeader>
                <CardTitle>How to Earn Points</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complete a lesson:</span>
                    <span className="font-medium">+10 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submit an assignment:</span>
                    <span className="font-medium">+50 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Get 100% on assignment:</span>
                    <span className="font-medium">+100 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complete a course:</span>
                    <span className="font-medium">+500 points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily login streak:</span>
                    <span className="font-medium">+5 points/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Help a fellow student:</span>
                    <span className="font-medium">+25 points</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/student/courses">Continue Learning</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/dashboard/student/assignments">View Assignments</Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
