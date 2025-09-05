'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock progress data - replace with actual GraphQL queries
const overallStats = {
  totalCourses: 5,
  completedCourses: 2,
  inProgressCourses: 2,
  notStartedCourses: 1,
  totalAssignments: 16,
  completedAssignments: 12,
  pendingAssignments: 4,
  averageGrade: 87,
  totalStudyTime: 145, // hours
  currentStreak: 7,
  longestStreak: 15,
  certificatesEarned: 3,
  pointsEarned: 1250,
  leaderboardRank: 15
};

const courseProgress = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    instructor: 'Sarah Johnson',
    progress: 65,
    totalLessons: 45,
    completedLessons: 29,
    totalAssignments: 8,
    completedAssignments: 6,
    averageGrade: 89,
    timeSpent: 45, // hours
    lastAccessed: '2024-01-15',
    estimatedCompletion: '2024-02-15'
  },
  {
    id: '2',
    title: 'Data Science with Python',
    instructor: 'Michael Chen',
    progress: 30,
    totalLessons: 38,
    completedLessons: 11,
    totalAssignments: 6,
    completedAssignments: 2,
    averageGrade: 85,
    timeSpent: 20,
    lastAccessed: '2024-01-14',
    estimatedCompletion: '2024-03-01'
  },
  {
    id: '3',
    title: 'AWS Cloud Practitioner',
    instructor: 'Emily Rodriguez',
    progress: 100,
    totalLessons: 25,
    completedLessons: 25,
    totalAssignments: 4,
    completedAssignments: 4,
    averageGrade: 92,
    timeSpent: 35,
    lastAccessed: '2024-01-10',
    estimatedCompletion: '2024-01-10'
  }
];

const weeklyActivity = [
  { day: 'Mon', hours: 2.5, lessons: 3, assignments: 1 },
  { day: 'Tue', hours: 1.8, lessons: 2, assignments: 0 },
  { day: 'Wed', hours: 3.2, lessons: 4, assignments: 2 },
  { day: 'Thu', hours: 2.1, lessons: 2, assignments: 1 },
  { day: 'Fri', hours: 1.5, lessons: 1, assignments: 0 },
  { day: 'Sat', hours: 4.0, lessons: 5, assignments: 3 },
  { day: 'Sun', hours: 2.8, lessons: 3, assignments: 1 }
];

const skillProgress = [
  { skill: 'JavaScript', level: 85, projects: 3, lastUpdated: '2024-01-15' },
  { skill: 'React', level: 78, projects: 2, lastUpdated: '2024-01-14' },
  { skill: 'Python', level: 65, projects: 1, lastUpdated: '2024-01-12' },
  { skill: 'AWS', level: 92, projects: 4, lastUpdated: '2024-01-10' },
  { skill: 'Data Analysis', level: 45, projects: 1, lastUpdated: '2024-01-08' },
  { skill: 'System Design', level: 30, projects: 0, lastUpdated: '2024-01-05' }
];

const achievements = [
  {
    id: '1',
    title: 'First Course Completed',
    description: 'Completed your first course on the platform',
    icon: '🎓',
    earnedDate: '2024-01-10',
    points: 100
  },
  {
    id: '2',
    title: 'Perfect Score',
    description: 'Achieved 100% on 5 assignments',
    icon: '⭐',
    earnedDate: '2024-01-12',
    points: 250
  },
  {
    id: '3',
    title: 'Consistent Learner',
    description: '7-day learning streak',
    icon: '🔥',
    earnedDate: '2024-01-15',
    points: 150
  },
  {
    id: '4',
    title: 'Code Master',
    description: 'Completed 10+ coding challenges',
    icon: '💻',
    earnedDate: '2024-01-08',
    points: 200
  }
];

const improvementSuggestions = [
  {
    category: 'Assignments',
    suggestion: 'Focus more on Assignments 2 & 3 in Web Development course. Your scores are below average.',
    priority: 'high',
    action: 'Review assignment feedback and practice more exercises'
  },
  {
    category: 'Time Management',
    suggestion: 'Consider studying during peak hours (2-4 PM) when you perform best.',
    priority: 'medium',
    action: 'Schedule study sessions during your most productive hours'
  },
  {
    category: 'Skill Development',
    suggestion: 'Your Python skills are improving but need more practice with data structures.',
    priority: 'medium',
    action: 'Complete additional Python exercises and projects'
  }
];

export default function ProgressPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30days');

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
          <p className="mt-4 text-gray-600">Loading progress data...</p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress & Analytics</h1>
          <p className="text-gray-600">Track your learning journey and performance</p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {[
              { value: '7days', label: 'Last 7 Days' },
              { value: '30days', label: 'Last 30 Days' },
              { value: '90days', label: 'Last 90 Days' },
              { value: 'all', label: 'All Time' }
            ].map((timeframe) => (
              <Button
                key={timeframe.value}
                variant={selectedTimeframe === timeframe.value ? 'default' : 'outline'}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                size="sm"
              >
                {timeframe.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-blue-600 mb-2">{overallStats.totalStudyTime}h</div>
              <div className="text-gray-600">Total Study Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600 mb-2">{overallStats.averageGrade}%</div>
              <div className="text-gray-600">Average Grade</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-purple-600 mb-2">{overallStats.currentStreak}</div>
              <div className="text-gray-600">Current Streak (days)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-orange-600 mb-2">#{overallStats.leaderboardRank}</div>
              <div className="text-gray-600">Leaderboard Rank</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Study hours and activity over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyActivity.map((day, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(day.hours / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{day.hours}h</span>
                      </div>
                      <div className="flex space-x-4 text-xs text-gray-500">
                        <span>{day.lessons} lessons</span>
                        <span>{day.assignments} assignments</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skill Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Skill Development</CardTitle>
              <CardDescription>Your progress across different skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillProgress.map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{skill.skill}</span>
                      <span className="text-sm text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{skill.projects} projects</span>
                      <span>Updated {skill.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Course Progress</CardTitle>
            <CardDescription>Detailed progress for each enrolled course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {courseProgress.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">Instructor: {course.instructor}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{course.progress}%</div>
                      <div className="text-sm text-gray-600">Complete</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Lessons:</span>
                      <span className="ml-2 text-gray-600">{course.completedLessons}/{course.totalLessons}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Assignments:</span>
                      <span className="ml-2 text-gray-600">{course.completedAssignments}/{course.totalAssignments}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Average Grade:</span>
                      <span className="ml-2 text-gray-600">{course.averageGrade}%</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Time Spent:</span>
                      <span className="ml-2 text-gray-600">{course.timeSpent}h</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Last accessed: {course.lastAccessed}
                    </div>
                    <div className="text-sm text-gray-500">
                      Est. completion: {course.estimatedCompletion}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Badges and milestones you've earned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500">Earned {achievement.earnedDate} • {achievement.points} points</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Improvement Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Suggestions</CardTitle>
              <CardDescription>Personalized recommendations for improvement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {improvementSuggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{suggestion.category}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${
                        suggestion.priority === 'high' 
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {suggestion.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.suggestion}</p>
                    <p className="text-xs text-blue-600 font-medium">{suggestion.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
