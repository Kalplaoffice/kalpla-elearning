'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminSettings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Kalpla',
    siteDescription: 'Comprehensive e-learning platform with courses, mentorship, and degree programs',
    siteUrl: 'https://kalpla.com',
    adminEmail: 'admin@kalpla.com',
    supportEmail: 'support@kalpla.com',
    
    // Payment Settings
    razorpayKeyId: 'rzp_test_1234567890',
    razorpayKeySecret: '••••••••••••••••',
    stripePublishableKey: 'pk_test_1234567890',
    stripeSecretKey: '••••••••••••••••',
    
    // Email Settings
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@kalpla.com',
    smtpPassword: '••••••••••••••••',
    
    // Storage Settings
    s3Bucket: 'kalpla-storage',
    s3Region: 'us-east-1',
    maxFileSize: 100, // MB
    allowedFileTypes: 'jpg,jpeg,png,gif,mp4,pdf,doc,docx',
    
    // Security Settings
    sessionTimeout: 30, // minutes
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    twoFactorAuth: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    
    // Feature Flags
    enableCommunity: true,
    enableLiveClasses: true,
    enableAssignments: true,
    enableCertificates: true,
    enableGamification: true
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Implement save functionality
  };

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
                <p className="text-gray-600">Configure platform settings and preferences</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline">
                  Reset to Default
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white"
                >
                  Save Changes
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
                {[
                  { id: 'general', name: 'General', icon: '⚙️' },
                  { id: 'payments', name: 'Payments', icon: '💳' },
                  { id: 'email', name: 'Email', icon: '📧' },
                  { id: 'storage', name: 'Storage', icon: '💾' },
                  { id: 'security', name: 'Security', icon: '🔒' },
                  { id: 'notifications', name: 'Notifications', icon: '🔔' },
                  { id: 'features', name: 'Features', icon: '🚀' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-[#FF804B] text-[#FF804B]'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2C4E41]">Site Information</CardTitle>
                  <CardDescription>Basic information about your platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                      <Input
                        value={settings.siteName}
                        onChange={(e) => handleSettingChange('siteName', e.target.value)}
                        placeholder="Enter site name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Site URL</label>
                      <Input
                        value={settings.siteUrl}
                        onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                        placeholder="https://your-site.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF804B]"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                      <Input
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => handleSettingChange('adminEmail', e.target.value)}
                        placeholder="admin@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <Input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => handleSettingChange('supportEmail', e.target.value)}
                        placeholder="support@example.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2C4E41]">Razorpay Configuration</CardTitle>
                  <CardDescription>Configure Razorpay payment gateway</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key ID</label>
                      <Input
                        value={settings.razorpayKeyId}
                        onChange={(e) => handleSettingChange('razorpayKeyId', e.target.value)}
                        placeholder="rzp_test_..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Secret</label>
                      <Input
                        type="password"
                        value={settings.razorpayKeySecret}
                        onChange={(e) => handleSettingChange('razorpayKeySecret', e.target.value)}
                        placeholder="••••••••••••••••"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-[#2C4E41]">Stripe Configuration</CardTitle>
                  <CardDescription>Configure Stripe payment gateway</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Publishable Key</label>
                      <Input
                        value={settings.stripePublishableKey}
                        onChange={(e) => handleSettingChange('stripePublishableKey', e.target.value)}
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                      <Input
                        type="password"
                        value={settings.stripeSecretKey}
                        onChange={(e) => handleSettingChange('stripeSecretKey', e.target.value)}
                        placeholder="••••••••••••••••"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">SMTP Configuration</CardTitle>
                <CardDescription>Configure email server settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
                    <Input
                      value={settings.smtpHost}
                      onChange={(e) => handleSettingChange('smtpHost', e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                    <Input
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => handleSettingChange('smtpPort', parseInt(e.target.value))}
                      placeholder="587"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <Input
                      value={settings.smtpUsername}
                      onChange={(e) => handleSettingChange('smtpUsername', e.target.value)}
                      placeholder="noreply@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <Input
                      type="password"
                      value={settings.smtpPassword}
                      onChange={(e) => handleSettingChange('smtpPassword', e.target.value)}
                      placeholder="••••••••••••••••"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Storage Settings */}
          {activeTab === 'storage' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">AWS S3 Configuration</CardTitle>
                <CardDescription>Configure file storage settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">S3 Bucket</label>
                    <Input
                      value={settings.s3Bucket}
                      onChange={(e) => handleSettingChange('s3Bucket', e.target.value)}
                      placeholder="your-bucket-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">S3 Region</label>
                    <Input
                      value={settings.s3Region}
                      onChange={(e) => handleSettingChange('s3Region', e.target.value)}
                      placeholder="us-east-1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max File Size (MB)</label>
                    <Input
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Allowed File Types</label>
                    <Input
                      value={settings.allowedFileTypes}
                      onChange={(e) => handleSettingChange('allowedFileTypes', e.target.value)}
                      placeholder="jpg,jpeg,png,gif,mp4,pdf"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Security Configuration</CardTitle>
                <CardDescription>Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <Input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      placeholder="30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                    <Input
                      type="number"
                      value={settings.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                      placeholder="5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Min Length</label>
                    <Input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                      placeholder="8"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      className="rounded border-gray-300 mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Notification Preferences</CardTitle>
                <CardDescription>Configure notification delivery methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Email Notifications</div>
                      <div className="text-sm text-gray-600">Send notifications via email</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Push Notifications</div>
                      <div className="text-sm text-gray-600">Send push notifications to mobile devices</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">SMS Notifications</div>
                      <div className="text-sm text-gray-600">Send notifications via SMS</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.smsNotifications}
                      onChange={(e) => handleSettingChange('smsNotifications', e.target.checked)}
                      className="rounded border-gray-300"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feature Flags */}
          {activeTab === 'features' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[#2C4E41]">Feature Flags</CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { key: 'enableCommunity', label: 'Community Features', description: 'Enable Discord-style community platform' },
                    { key: 'enableLiveClasses', label: 'Live Classes', description: 'Enable live streaming and video classes' },
                    { key: 'enableAssignments', label: 'Assignments', description: 'Enable assignment submission and grading' },
                    { key: 'enableCertificates', label: 'Certificates', description: 'Enable certificate generation and management' },
                    { key: 'enableGamification', label: 'Gamification', description: 'Enable points, badges, and leaderboards' }
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <div>
                        <div className="font-medium text-gray-900">{feature.label}</div>
                        <div className="text-sm text-gray-600">{feature.description}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[feature.key as keyof typeof settings] as boolean}
                        onChange={(e) => handleSettingChange(feature.key, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
