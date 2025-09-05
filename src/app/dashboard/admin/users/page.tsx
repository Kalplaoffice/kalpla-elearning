'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock user data
const mockUsers = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'Student',
    status: 'Active',
    joinDate: '2024-01-15',
    lastLogin: '2024-01-20',
    courses: 3,
    progress: 75
  },
  {
    id: 2,
    name: 'Dr. Alex Kumar',
    email: 'alex@example.com',
    role: 'Mentor',
    status: 'Active',
    joinDate: '2023-12-01',
    lastLogin: '2024-01-20',
    courses: 5,
    progress: 100
  },
  {
    id: 3,
    name: 'Rahul Singh',
    email: 'rahul@example.com',
    role: 'Student',
    status: 'Suspended',
    joinDate: '2024-01-10',
    lastLogin: '2024-01-18',
    courses: 1,
    progress: 25
  },
  {
    id: 4,
    name: 'Sarah Chen',
    email: 'sarah@example.com',
    role: 'Admin',
    status: 'Active',
    joinDate: '2023-11-01',
    lastLogin: '2024-01-20',
    courses: 0,
    progress: 100
  }
];

const roleOptions = ['All', 'Student', 'Mentor', 'Admin', 'Moderator'];
const statusOptions = ['All', 'Active', 'Suspended', 'Pending'];

export default function UserManagement() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'All' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on users:`, selectedUsers);
    // Implement bulk actions here
  };

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                <p className="text-gray-600">Manage students, mentors, and administrators</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setShowAddUser(true)}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white"
                >
                  Add New User
                </Button>
                <Button variant="outline">
                  Export Users
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-[#2C4E41]">Search & Filter Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedRole('All');
                      setSelectedStatus('All');
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

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {selectedUsers.length} user(s) selected
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('activate')}
                      >
                        Activate
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('suspend')}
                      >
                        Suspend
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('export')}
                      >
                        Export Selected
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleBulkAction('delete')}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedUsers([])}
                  >
                    Clear Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Users Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#2C4E41]">Users ({filteredUsers.length})</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedUsers.length === filteredUsers.length ? 'Deselect All' : 'Select All'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                          onChange={handleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Courses</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Progress</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center text-white font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={user.role === 'Admin' ? 'destructive' : 
                                   user.role === 'Mentor' ? 'default' : 'outline'}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge 
                            variant={user.status === 'Active' ? 'default' : 
                                   user.status === 'Suspended' ? 'destructive' : 'outline'}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{user.courses}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-[#FF804B] h-2 rounded-full" 
                                style={{ width: `${user.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{user.progress}%</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900">{user.lastLogin}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className={user.status === 'Active' ? 'text-red-600' : 'text-green-600'}
                            >
                              {user.status === 'Active' ? 'Suspend' : 'Activate'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Feature List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User & Role Management Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Add/Edit/Delete Students', description: 'Create and manage student accounts', status: 'active' },
                { title: 'Add/Edit/Delete Mentors', description: 'Manage instructor and mentor profiles', status: 'active' },
                { title: 'Assign Roles & Permissions', description: 'Set user roles and access levels', status: 'active' },
                { title: 'Suspend/Ban User Accounts', description: 'Temporarily or permanently disable accounts', status: 'active' },
                { title: 'Approve/Reject Signups', description: 'Review and approve new user registrations', status: 'active' },
                { title: 'View Detailed User Profiles', description: 'Access comprehensive user information', status: 'active' },
                { title: 'Reset User Passwords', description: 'Admin password reset functionality', status: 'active' },
                { title: 'Bulk Upload Users via CSV', description: 'Import multiple users at once', status: 'active' },
                { title: 'Role-based Permissions', description: 'Different dashboards for each role', status: 'active' },
                { title: 'Track Login & Session History', description: 'Monitor user activity and sessions', status: 'active' }
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
