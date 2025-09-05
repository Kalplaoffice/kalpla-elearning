'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ProtectedRoute from '@/components/ProtectedRoute';
import CurriculumBuilder from '@/components/CurriculumBuilder';
import VideoPlayer from '@/components/VideoPlayer';
import PricingManager from '@/components/PricingManager';

interface CourseData {
  // 1️⃣ Course Setup
  title: string;
  subtitle: string;
  category: string;
  subcategory: string;
  language: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  goals: string[];
  targetAudience: string;
  prerequisites: string[];
  thumbnail: File | null;
  promotionalVideo: File | null;
  
  // 2️⃣ Curriculum Builder
  sections: Section[];
  
  // 3️⃣ Pricing
  price: number;
  isFree: boolean;
  discountCoupons: Coupon[];
  emiOption: boolean;
  freePreviewLectures: string[];
  
  // 4️⃣ Publishing
  status: 'DRAFT' | 'PENDING_REVIEW' | 'LIVE' | 'ARCHIVED';
  seoSlug: string;
  keywords: string[];
  tags: string[];
}

interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'QUIZ' | 'ASSIGNMENT' | 'CODING_EXERCISE';
  content: string;
  videoUrl?: string;
  duration: number;
  isFree: boolean;
  order: number;
  resources: Resource[];
  dripReleaseDate?: string;
}

interface Resource {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'AUDIO' | 'IMAGE' | 'LINK' | 'DOCUMENT';
  url: string;
}

interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  expiryDate: string;
  usageLimit: number;
}

const CreateCoursePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    subtitle: '',
    category: '',
    subcategory: '',
    language: 'English',
    level: 'BEGINNER',
    goals: [],
    targetAudience: '',
    prerequisites: [],
    thumbnail: null,
    promotionalVideo: null,
    sections: [],
    price: 0,
    isFree: false,
    discountCoupons: [],
    emiOption: false,
    freePreviewLectures: [],
    status: 'DRAFT',
    seoSlug: '',
    keywords: [],
    tags: []
  });

  const [newGoal, setNewGoal] = useState('');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newKeyword, setNewKeyword] = useState('');
  const [newTag, setNewTag] = useState('');

  const steps = [
    { id: 1, title: 'Course Setup', description: 'Basic course information' },
    { id: 2, title: 'Curriculum Builder', description: 'Create course content' },
    { id: 3, title: 'Video & Features', description: 'Upload and configure videos' },
    { id: 4, title: 'Course Management', description: 'Organize and manage content' },
    { id: 5, title: 'Pricing & Monetization', description: 'Set pricing and offers' },
    { id: 6, title: 'Publishing & Compliance', description: 'Review and publish' },
    { id: 7, title: 'Marketing & Engagement', description: 'Promote your course' }
  ];

  const categories = [
    'Technology', 'Business', 'Health & Fitness', 'Arts & Design',
    'Marketing', 'Photography', 'Music', 'Language', 'Personal Development',
    'Academics', 'Lifestyle', 'Other'
  ];

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi', 'Other'
  ];

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setCourseData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setCourseData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }));
      setNewPrerequisite('');
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      setCourseData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const handleAddTag = () => {
    if (newTag.trim()) {
      setCourseData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveItem = (type: 'goals' | 'prerequisites' | 'keywords' | 'tags', index: number) => {
    setCourseData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (type: 'thumbnail' | 'promotionalVideo', file: File) => {
    setCourseData(prev => ({
      ...prev,
      [type]: file
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>1️⃣ Course Setup</CardTitle>
                <CardDescription>Enter the basic information about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Course Title *</label>
                  <Input
                    value={courseData.title}
                    onChange={(e) => setCourseData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter your course title (max 60 characters)"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {courseData.title.length}/60 characters
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Course Subtitle *</label>
                  <Input
                    value={courseData.subtitle}
                    onChange={(e) => setCourseData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="What will students learn in this course?"
                    maxLength={120}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {courseData.subtitle.length}/120 characters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category *</label>
                    <select
                      value={courseData.category}
                      onChange={(e) => setCourseData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subcategory</label>
                    <Input
                      value={courseData.subcategory}
                      onChange={(e) => setCourseData(prev => ({ ...prev, subcategory: e.target.value }))}
                      placeholder="e.g., Web Development, Data Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Language *</label>
                    <select
                      value={courseData.language}
                      onChange={(e) => setCourseData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      {languages.map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Course Level *</label>
                    <select
                      value={courseData.level}
                      onChange={(e) => setCourseData(prev => ({ ...prev, level: e.target.value as any }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="EXPERT">Expert</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Course Goals/Outcomes *</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="What will students achieve?"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    />
                    <Button onClick={handleAddGoal} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.goals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {goal}
                        <button
                          onClick={() => handleRemoveItem('goals', index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Target Audience *</label>
                  <Input
                    value={courseData.targetAudience}
                    onChange={(e) => setCourseData(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="Who is this course for?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Prerequisites</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newPrerequisite}
                      onChange={(e) => setNewPrerequisite(e.target.value)}
                      placeholder="What should students know before starting?"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddPrerequisite()}
                    />
                    <Button onClick={handleAddPrerequisite} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.prerequisites.map((prereq, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {prereq}
                        <button
                          onClick={() => handleRemoveItem('prerequisites', index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Course Thumbnail *</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('thumbnail', e.target.files[0])}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      {courseData.thumbnail ? (
                        <div>
                          <img
                            src={URL.createObjectURL(courseData.thumbnail)}
                            alt="Course thumbnail"
                            className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                          />
                          <p className="text-sm text-gray-600">{courseData.thumbnail.name}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl">📷</span>
                          </div>
                          <p className="text-sm text-gray-600">Click to upload thumbnail</p>
                          <p className="text-xs text-gray-400">Recommended: 1280x720px</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Promotional Video/Trailer</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('promotionalVideo', e.target.files[0])}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      {courseData.promotionalVideo ? (
                        <div>
                          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl">🎥</span>
                          </div>
                          <p className="text-sm text-gray-600">{courseData.promotionalVideo.name}</p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                            <span className="text-2xl">🎥</span>
                          </div>
                          <p className="text-sm text-gray-600">Click to upload promotional video</p>
                          <p className="text-xs text-gray-400">MP4, MOV, AVI supported</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <CurriculumBuilder
              sections={courseData.sections}
              onSectionsChange={(sections) => setCourseData(prev => ({ ...prev, sections }))}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>3️⃣ Video & Lecture Features</CardTitle>
                <CardDescription>Configure video settings and features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Video Player Demo */}
                  <div>
                    <h4 className="font-semibold mb-4">Video Player Preview</h4>
                    <VideoPlayer
                      videoUrl="https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
                      title="Sample Video Lecture"
                      duration={60}
                      isFree={false}
                      isPreview={true}
                      onProgressUpdate={(progress) => console.log('Progress:', progress)}
                      onComplete={() => console.log('Video completed')}
                      onNoteAdd={(timestamp, note) => console.log('Note added:', timestamp, note)}
                      onBookmarkAdd={(timestamp) => console.log('Bookmark added:', timestamp)}
                      notes={[
                        { id: '1', timestamp: 30, content: 'Important concept here', createdAt: '2024-01-01' },
                        { id: '2', timestamp: 45, content: 'Key takeaway', createdAt: '2024-01-01' }
                      ]}
                      bookmarks={[30, 45, 60]}
                      subtitles={[
                        { id: '1', label: 'English', language: 'en', url: '/subtitles/en.vtt', isDefault: true },
                        { id: '2', label: 'Spanish', language: 'es', url: '/subtitles/es.vtt' }
                      ]}
                      playbackSpeed={1}
                      quality="720p"
                      onSpeedChange={(speed) => console.log('Speed changed:', speed)}
                      onQualityChange={(quality) => console.log('Quality changed:', quality)}
                    />
                  </div>

                  {/* Video Features Configuration */}
                  <div className="grid grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Video Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Default Playback Speed</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1" selected>1x (Normal)</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Default Quality</label>
                          <select className="w-full p-2 border border-gray-300 rounded-md">
                            <option value="auto" selected>Auto</option>
                            <option value="360p">360p</option>
                            <option value="480p">480p</option>
                            <option value="720p">720p</option>
                            <option value="1080p">1080p</option>
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="watermark" className="rounded" />
                          <label htmlFor="watermark" className="text-sm">Enable watermark protection</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="resumePlayback" className="rounded" checked />
                          <label htmlFor="resumePlayback" className="text-sm">Enable resume playback</label>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Interactive Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="videoNotes" className="rounded" checked />
                          <label htmlFor="videoNotes" className="text-sm">Enable video notes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="bookmarks" className="rounded" checked />
                          <label htmlFor="bookmarks" className="text-sm">Enable bookmarks</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="subtitles" className="rounded" checked />
                          <label htmlFor="subtitles" className="text-sm">Enable subtitles/CC</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="mobileOptimized" className="rounded" checked />
                          <label htmlFor="mobileOptimized" className="text-sm">Mobile optimized player</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="progressTracking" className="rounded" checked />
                          <label htmlFor="progressTracking" className="text-sm">Progress tracking</label>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>4️⃣ Course Management Tools</CardTitle>
                <CardDescription>Organize and manage your course content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Management Tools</h3>
                  <p className="text-gray-600 mb-4">Bulk upload, version control, and content organization</p>
                  <Button className="bg-[#FF804B] hover:bg-[#FF804B]/90">
                    Open Management Tools
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <PricingManager
              pricingData={{
                price: courseData.price,
                isFree: courseData.isFree,
                currency: 'USD',
                discountCoupons: courseData.discountCoupons,
                emiOption: courseData.emiOption,
                emiMonths: 6,
                freePreviewLectures: courseData.freePreviewLectures,
                revenueSharing: {
                  instructorPercentage: 70,
                  platformPercentage: 30,
                  paymentProcessingFee: 2.9
                },
                referralTracking: {
                  enabled: true,
                  instructorAffiliateCode: 'AFFILIATE123',
                  commissionPercentage: 10,
                  cookieDuration: 30
                },
                courseBundling: [],
                subscriptionModel: {
                  enabled: false,
                  planType: 'MONTHLY',
                  monthlyPrice: 29.99,
                  yearlyPrice: 299.99,
                  lifetimePrice: 999.99,
                  features: ['Access to all courses', 'Certificate of completion', 'Lifetime updates']
                },
                promotions: []
              }}
              onPricingChange={(data) => {
                setCourseData(prev => ({
                  ...prev,
                  price: data.price,
                  isFree: data.isFree,
                  discountCoupons: data.discountCoupons,
                  emiOption: data.emiOption,
                  freePreviewLectures: data.freePreviewLectures
                }));
              }}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>6️⃣ Publishing & Compliance</CardTitle>
                <CardDescription>Review and publish your course</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">✅ Final Checklist</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✓ Course title and description completed</li>
                      <li>✓ At least one section with lectures added</li>
                      <li>✓ Thumbnail uploaded</li>
                      <li>✓ Pricing set</li>
                      <li>✓ Content reviewed for quality</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Pending Items</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Add promotional video</li>
                      <li>• Set up drip release schedule</li>
                      <li>• Configure accessibility features</li>
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button className="bg-[#FF804B] hover:bg-[#FF804B]/90">
                      Publish Course
                    </Button>
                    <Button variant="outline">
                      Save as Draft
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>7️⃣ Marketing & Engagement</CardTitle>
                <CardDescription>Promote your course and engage students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">SEO-Friendly URL</label>
                  <Input
                    value={courseData.seoSlug}
                    onChange={(e) => setCourseData(prev => ({ ...prev, seoSlug: e.target.value }))}
                    placeholder="course-name-url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Keywords for Search</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                    />
                    <Button onClick={handleAddKeyword} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {keyword}
                        <button
                          onClick={() => handleRemoveItem('keywords', index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} type="button">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {courseData.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveItem('tags', index)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                    Create Landing Page
                  </Button>
                  <Button variant="outline">
                    Set Up Email Campaign
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <ProtectedRoute allowedRoles={['Admin', 'Mentor']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Course</h1>
            <p className="text-gray-600">Build a comprehensive course with all the features you need</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
          </div>

          {/* Step Navigation */}
          <div className="mb-8">
            <div className="flex space-x-1">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex-1 p-3 text-left rounded-lg border transition-colors ${
                    currentStep === step.id
                      ? 'bg-[#FF804B] text-white border-[#FF804B]'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">{step.title}</div>
                  <div className="text-sm opacity-75">{step.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
              disabled={currentStep === steps.length}
              className="bg-[#FF804B] hover:bg-[#FF804B]/90"
            >
              {currentStep === steps.length ? 'Finish' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateCoursePage;
