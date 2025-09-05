'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock notification data - replace with actual GraphQL queries
const notifications = [
  {
    id: '1',
    title: 'Assignment Graded: Build Todo App',
    message: 'Your assignment "Build Todo App" has been graded. You received 85/100 points. Great work on the implementation!',
    type: 'assignment',
    priority: 'high',
    isRead: false,
    createdAt: '2024-01-15T10:30:00Z',
    course: 'Web Development Bootcamp',
    actionUrl: '/dashboard/student/assignments'
  },
  {
    id: '2',
    title: 'Live Session Reminder',
    message: 'Your live Q&A session with Sarah Johnson starts in 30 minutes. Join now to get your questions answered!',
    type: 'live-session',
    priority: 'high',
    isRead: false,
    createdAt: '2024-01-15T13:30:00Z',
    course: 'Web Development Bootcamp',
    actionUrl: '/dashboard/student/mentorship'
  },
  {
    id: '3',
    title: 'New Course Module Released',
    message: 'Module 3: "React Hooks and State Management" is now available in your Web Development course.',
    type: 'course-update',
    priority: 'medium',
    isRead: true,
    createdAt: '2024-01-14T09:15:00Z',
    course: 'Web Development Bootcamp',
    actionUrl: '/courses/1/player/15'
  },
  {
    id: '4',
    title: 'Mentorship Session Scheduled',
    message: 'Your next 1-on-1 session with Michael Chen is scheduled for January 25th at 3:00 PM PST.',
    type: 'mentorship',
    priority: 'medium',
    isRead: true,
    createdAt: '2024-01-13T14:20:00Z',
    course: 'Mentorship Program',
    actionUrl: '/dashboard/student/mentorship'
  },
  {
    id: '5',
    title: 'Certificate Earned',
    message: 'Congratulations! You have earned the "JavaScript Fundamentals" certificate. Download it from your certificates page.',
    type: 'achievement',
    priority: 'low',
    isRead: true,
    createdAt: '2024-01-12T16:45:00Z',
    course: 'Web Development Bootcamp',
    actionUrl: '/dashboard/student/certificates'
  },
  {
    id: '6',
    title: 'Leaderboard Update',
    message: 'You moved up 3 positions in the leaderboard! You are now ranked #15. Keep up the great work!',
    type: 'leaderboard',
    priority: 'low',
    isRead: true,
    createdAt: '2024-01-11T11:30:00Z',
    course: 'Global',
    actionUrl: '/dashboard/student/leaderboard'
  },
  {
    id: '7',
    title: 'Payment Successful',
    message: 'Your payment of $199.99 for "Complete Web Development Bootcamp" has been processed successfully.',
    type: 'payment',
    priority: 'medium',
    isRead: true,
    createdAt: '2024-01-10T15:22:00Z',
    course: 'Web Development Bootcamp',
    actionUrl: '/dashboard/student/payments'
  },
  {
    id: '8',
    title: 'Assignment Due Soon',
    message: 'Assignment "Data Analysis Project" is due in 2 days. Make sure to submit your work on time.',
    type: 'assignment',
    priority: 'high',
    isRead: false,
    createdAt: '2024-01-09T08:00:00Z',
    course: 'Data Science with Python',
    actionUrl: '/dashboard/student/assignments'
  }
];

const announcementTypes = [
  { id: 'all', label: 'All Notifications', count: notifications.length },
  { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.isRead).length },
  { id: 'assignment', label: 'Assignments', count: notifications.filter(n => n.type === 'assignment').length },
  { id: 'course-update', label: 'Course Updates', count: notifications.filter(n => n.type === 'course-update').length },
  { id: 'mentorship', label: 'Mentorship', count: notifications.filter(n => n.type === 'mentorship').length },
  { id: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'assignment':
      return '📝';
    case 'live-session':
      return '🎥';
    case 'course-update':
      return '📚';
    case 'mentorship':
      return '👥';
    case 'achievement':
      return '🏆';
    case 'leaderboard':
      return '🏅';
    case 'payment':
      return '💳';
    default:
      return '📢';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function NotificationsPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notificationsList, setNotificationsList] = useState(notifications);

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

  const markAsRead = (notificationId: string) => {
    setNotificationsList(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotificationsList(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
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

  const filteredNotifications = notificationsList.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.isRead;
    return notification.type === selectedFilter;
  });

  const unreadCount = notificationsList.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">Stay updated with your learning journey</p>
            </div>
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {unreadCount} unread
                </span>
              )}
              <Button onClick={markAllAsRead} variant="outline">
                Mark All as Read
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {announcementTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedFilter === type.id ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(type.id)}
                className="rounded-full"
              >
                {type.label}
                {type.count > 0 && (
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {type.count}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">
                  {selectedFilter === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : "No notifications found for this filter."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'border-l-4 border-l-blue-500 bg-blue-50/30' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-medium mb-2 ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mb-3">{notification.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{notification.course}</span>
                            <span>•</span>
                            <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{new Date(notification.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs border ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center space-x-2">
                        <Button asChild size="sm">
                          <Link href={notification.actionUrl}>View Details</Link>
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              Load More Notifications
            </Button>
          </div>
        )}

        {/* Notification Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Customize how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                  <p className="text-sm text-gray-600">Receive urgent notifications via SMS</p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
