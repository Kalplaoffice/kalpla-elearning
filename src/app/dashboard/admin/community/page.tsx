'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock community data
const mockGroups = [
  {
    id: 1,
    name: 'General Discussion',
    description: 'General chat and announcements',
    members: 1250,
    posts: 3420,
    type: 'Public',
    status: 'Active',
    createdAt: '2024-01-01',
    moderators: ['Sarah Chen', 'Alex Kumar']
  },
  {
    id: 2,
    name: 'Startup Mentorship',
    description: 'Mentorship program discussions',
    members: 450,
    posts: 890,
    type: 'Private',
    status: 'Active',
    createdAt: '2024-01-05',
    moderators: ['Dr. Alex Kumar']
  },
  {
    id: 3,
    name: 'Tech News',
    description: 'Latest technology updates and news',
    members: 800,
    posts: 1200,
    type: 'Public',
    status: 'Active',
    createdAt: '2024-01-10',
    moderators: ['Priya Sharma']
  }
];

const mockPosts = [
  {
    id: 1,
    title: 'New React Course Available!',
    author: 'Sarah Chen',
    group: 'General Discussion',
    content: 'Check out our new React course with hands-on projects...',
    likes: 45,
    comments: 12,
    status: 'Approved',
    createdAt: '2024-01-20',
    flagged: false
  },
  {
    id: 2,
    title: 'Inappropriate content',
    author: 'Anonymous User',
    group: 'General Discussion',
    content: 'This post contains inappropriate language...',
    likes: 0,
    comments: 0,
    status: 'Pending Review',
    createdAt: '2024-01-19',
    flagged: true
  },
  {
    id: 3,
    title: 'Startup Pitch Competition Results',
    author: 'Dr. Alex Kumar',
    group: 'Startup Mentorship',
    content: 'Congratulations to all participants...',
    likes: 78,
    comments: 23,
    status: 'Approved',
    createdAt: '2024-01-18',
    flagged: false
  }
];

const mockEvents = [
  {
    id: 1,
    title: 'Startup Pitch Competition',
    date: '2024-02-15',
    time: '6:00 PM IST',
    type: 'Competition',
    attendees: 45,
    maxAttendees: 50,
    status: 'Upcoming'
  },
  {
    id: 2,
    title: 'AI & ML Workshop',
    date: '2024-02-20',
    time: '2:00 PM IST',
    type: 'Workshop',
    attendees: 28,
    maxAttendees: 30,
    status: 'Upcoming'
  },
  {
    id: 3,
    title: 'Investor Meet & Greet',
    date: '2024-01-25',
    time: '7:00 PM IST',
    type: 'Networking',
    attendees: 15,
    maxAttendees: 20,
    status: 'Completed'
  }
];

const groupTypeOptions = ['All', 'Public', 'Private', 'Restricted'];
const postStatusOptions = ['All', 'Approved', 'Pending Review', 'Rejected'];
const eventStatusOptions = ['All', 'Upcoming', 'Ongoing', 'Completed'];

export default function CommunityManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupType, setSelectedGroupType] = useState('All');
  const [selectedPostStatus, setSelectedPostStatus] = useState('All');
  const [selectedEventStatus, setSelectedEventStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('groups');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedGroupType === 'All' || group.type === selectedGroupType;
    
    return matchesSearch && matchesType;
  });

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedPostStatus === 'All' || post.status === selectedPostStatus;
    
    return matchesSearch && matchesStatus;
  });

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedEventStatus === 'All' || event.status === selectedEventStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Community Management</h1>
                <p className="text-gray-600">Moderate and manage community features</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setShowCreateGroup(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white"
                >
                  Create Group
                </Button>
                <Button 
                  onClick={() => setShowCreateEvent(true)}
                  variant="outline"
                >
                  Create Event
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'groups'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Groups ({filteredGroups.length})
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Posts ({filteredPosts.length})
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Events ({filteredEvents.length})
                </button>
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'analytics'
                      ? 'border-[#FF804B] text-[#FF804B]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Analytics
                </button>
              </nav>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#2C4E41]">Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search groups, posts, or events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {activeTab === 'groups' ? 'Group Type' : 
                     activeTab === 'posts' ? 'Post Status' : 'Event Status'}
                  </label>
                  <select
                    value={activeTab === 'groups' ? selectedGroupType : 
                           activeTab === 'posts' ? selectedPostStatus : selectedEventStatus}
                    onChange={(e) => {
                      if (activeTab === 'groups') setSelectedGroupType(e.target.value);
                      else if (activeTab === 'posts') setSelectedPostStatus(e.target.value);
                      else setSelectedEventStatus(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {(activeTab === 'groups' ? groupTypeOptions : 
                      activeTab === 'posts' ? postStatusOptions : eventStatusOptions).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGroupType('All');
                      setSelectedPostStatus('All');
                      setSelectedEventStatus('All');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Groups Tab */}
          {activeTab === 'groups' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[#2C4E41]">{group.name}</CardTitle>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                      <Badge variant={group.type === 'Public' ? 'default' : 'outline'}>
                        {group.type}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={group.status === 'Active' ? 'default' : 'outline'}>
                        {group.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Members:</span>
                        <span className="font-medium">{group.members.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Posts:</span>
                        <span className="font-medium">{group.posts.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Moderators:</span>
                        <span className="font-medium">{group.moderators.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium">{group.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Manage
                      </Button>
                      <Button size="sm" variant="outline">
                        ⋮
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Community Posts</CardTitle>
                <CardDescription>Moderate and manage community posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium text-gray-900">{post.title}</h3>
                            {post.flagged && (
                              <Badge variant="destructive">Flagged</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">by {post.author} in {post.group}</p>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>👍 {post.likes}</span>
                            <span>💬 {post.comments}</span>
                            <span>{post.createdAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={post.status === 'Approved' ? 'default' : 
                                   post.status === 'Pending Review' ? 'outline' : 'destructive'}
                          >
                            {post.status}
                          </Badge>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              Approve
                            </Button>
                            <Button size="sm" variant="outline">
                              Reject
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-[#2C4E41]">{event.title}</CardTitle>
                        <CardDescription>{event.type}</CardDescription>
                      </div>
                      <Badge variant={event.status === 'Upcoming' ? 'default' : 
                                   event.status === 'Ongoing' ? 'outline' : 'destructive'}>
                        {event.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">{event.time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Attendees:</span>
                        <span className="font-medium">{event.attendees}/{event.maxAttendees}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">{mockGroups.length}</div>
                  <p className="text-sm text-gray-600">Total Groups</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {mockGroups.reduce((sum, group) => sum + group.members, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Members</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {mockGroups.reduce((sum, group) => sum + group.posts, 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Total Posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-[#2C4E41]">
                    {mockPosts.filter(post => post.flagged).length}
                  </div>
                  <p className="text-sm text-gray-600">Flagged Content</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Feature List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Community & Engagement Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Create/Edit/Delete Groups/Channels', description: 'Manage discussion groups and channels', status: 'active' },
                { title: 'Moderate Posts & Comments', description: 'Approve/reject community content', status: 'active' },
                { title: 'Pin Important Posts', description: 'Highlight important announcements', status: 'active' },
                { title: 'Manage Polls/Surveys', description: 'Create and manage community polls', status: 'active' },
                { title: 'Assign Community Moderators', description: 'Delegate moderation responsibilities', status: 'active' },
                { title: 'Send Announcements/Notifications', description: 'Broadcast messages to all members', status: 'active' },
                { title: 'Monitor Flagged/Reported Content', description: 'Review and handle content reports', status: 'active' },
                { title: 'Track Engagement Stats', description: 'Monitor posts, likes, and comments', status: 'active' },
                { title: 'Host Live Q&A Sessions', description: 'Interactive sessions with Chime/Zoom integration', status: 'active' },
                { title: 'Archive Inactive Groups', description: 'Manage and archive unused groups', status: 'active' }
              ].map((feature, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      </div>
                      <Badge variant={feature.status === 'active' ? 'default' : 'outline'}>
                        {feature.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
