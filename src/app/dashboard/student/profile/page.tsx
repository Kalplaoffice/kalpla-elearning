'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Mock user profile data - replace with actual GraphQL queries
const userProfile = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: '/api/placeholder/100/100',
  bio: 'Passionate web developer learning new technologies',
  location: 'San Francisco, CA',
  website: 'https://johndoe.dev',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  twitter: '@johndoe',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
  interests: ['Web Development', 'Data Science', 'Cloud Computing'],
  timezone: 'PST',
  language: 'English',
  joinedDate: '2024-01-01',
  lastActive: '2024-01-15',
  totalPoints: 1250,
  coursesCompleted: 2,
  certificatesEarned: 3
};

const securitySettings = {
  twoFactorEnabled: false,
  lastPasswordChange: '2024-01-01',
  connectedAccounts: [
    { provider: 'Google', email: 'john.doe@gmail.com', connected: true },
    { provider: 'GitHub', username: 'johndoe', connected: true },
    { provider: 'LinkedIn', username: 'johndoe', connected: false }
  ],
  activeSessions: [
    { device: 'Chrome on MacOS', location: 'San Francisco, CA', lastActive: '2024-01-15T10:30:00Z' },
    { device: 'Safari on iPhone', location: 'San Francisco, CA', lastActive: '2024-01-14T15:20:00Z' }
  ]
};

const notificationPreferences = {
  email: {
    assignments: true,
    courseUpdates: true,
    mentorship: true,
    achievements: true,
    leaderboard: false,
    marketing: false
  },
  push: {
    assignments: true,
    liveSessions: true,
    messages: true,
    achievements: true,
    leaderboard: true
  },
  sms: {
    urgent: true,
    reminders: false,
    marketing: false
  }
};

const savedNotes = [
  {
    id: '1',
    title: 'React Hooks Best Practices',
    content: 'Always use useEffect with proper dependencies...',
    course: 'Web Development Bootcamp',
    lesson: 'React Hooks and State Management',
    createdAt: '2024-01-15',
    tags: ['react', 'hooks', 'best-practices']
  },
  {
    id: '2',
    title: 'AWS S3 Configuration',
    content: 'Remember to set proper CORS policies...',
    course: 'AWS Cloud Practitioner',
    lesson: 'S3 Storage Configuration',
    createdAt: '2024-01-12',
    tags: ['aws', 's3', 'configuration']
  }
];

const bookmarks = [
  {
    id: '1',
    title: 'JavaScript Array Methods Cheat Sheet',
    url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    course: 'Web Development Bootcamp',
    addedAt: '2024-01-14'
  },
  {
    id: '2',
    title: 'React Documentation - Hooks',
    url: 'https://reactjs.org/docs/hooks-intro.html',
    course: 'Web Development Bootcamp',
    addedAt: '2024-01-13'
  }
];

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

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

  const handleSave = () => {
    // Save profile changes
    setIsEditing(false);
    // Here you would typically make an API call to save the changes
  };

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account & Settings</h1>
          <p className="text-gray-600">Manage your profile, security, and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'security', label: 'Security' },
            { id: 'notifications', label: 'Notifications' },
            { id: 'preferences', label: 'Preferences' },
            { id: 'saved-content', label: 'Saved Content' }
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id)}
              className="rounded-full"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={formData.avatar}
                        alt={formData.name}
                        className="w-20 h-20 rounded-full"
                      />
                      <div>
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                        <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 2MB</p>
                      </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website
                        </label>
                        <input
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({...formData, website: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    {/* Social Links */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          LinkedIn
                        </label>
                        <input
                          type="url"
                          value={formData.linkedin}
                          onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GitHub
                        </label>
                        <input
                          type="url"
                          value={formData.github}
                          onChange={(e) => setFormData({...formData, github: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Twitter
                        </label>
                        <input
                          type="text"
                          value={formData.twitter}
                          onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Skills
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {skill}
                            {isEditing && (
                              <button className="ml-2 text-blue-600 hover:text-blue-800">
                                ×
                              </button>
                            )}
                          </span>
                        ))}
                        {isEditing && (
                          <input
                            type="text"
                            placeholder="Add skill..."
                            className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex space-x-2">
                        <Button onClick={handleSave}>
                          Save Changes
                        </Button>
                        <Button variant="outline" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Points:</span>
                      <span className="font-medium">{userProfile.totalPoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Courses Completed:</span>
                      <span className="font-medium">{userProfile.coursesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certificates:</span>
                      <span className="font-medium">{userProfile.certificatesEarned}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since:</span>
                      <span className="font-medium">{userProfile.joinedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Active:</span>
                      <span className="font-medium">{userProfile.lastActive}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Timezone:</span>
                      <span className="font-medium">{userProfile.timezone}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Language:</span>
                      <span className="font-medium">{userProfile.language}</span>
                    </div>
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">
                      {securitySettings.twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-600">Last changed: {securitySettings.lastPasswordChange}</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Connected Accounts</h4>
                    <div className="space-y-3">
                      {securitySettings.connectedAccounts.map((account, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {account.provider.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{account.provider}</div>
                              <div className="text-sm text-gray-600">
                                {account.email || account.username}
                              </div>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            {account.connected ? 'Disconnect' : 'Connect'}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">Active Sessions</h4>
                    <div className="space-y-3">
                      {securitySettings.activeSessions.map((session, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{session.device}</div>
                            <div className="text-sm text-gray-600">
                              {session.location} • {new Date(session.lastActive).toLocaleString()}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            Revoke
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what email notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(notificationPreferences.email).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {key === 'assignments' && 'Get notified about assignment deadlines and grades'}
                          {key === 'courseUpdates' && 'Receive updates about new course content'}
                          {key === 'mentorship' && 'Notifications about mentorship sessions and updates'}
                          {key === 'achievements' && 'Celebrate your achievements and milestones'}
                          {key === 'leaderboard' && 'Updates about your leaderboard position'}
                          {key === 'marketing' && 'Promotional emails and course recommendations'}
                        </p>
                      </div>
                      <Button
                        variant={value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => {/* Toggle notification */}}
                      >
                        {value ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>Browser push notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(notificationPreferences.push).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                      </div>
                      <Button
                        variant={value ? 'default' : 'outline'}
                        size="sm"
                      >
                        {value ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'saved-content' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Saved Notes</CardTitle>
                <CardDescription>Your personal notes and highlights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedNotes.map((note) => (
                    <div key={note.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{note.title}</h4>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{note.course} • {note.lesson}</span>
                        <span>{note.createdAt}</span>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        {note.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bookmarks</CardTitle>
                <CardDescription>Saved links and resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bookmarks.map((bookmark) => (
                    <div key={bookmark.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{bookmark.title}</h4>
                        <p className="text-sm text-gray-600">{bookmark.course} • {bookmark.addedAt}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">Visit</Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
