'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

// Mock lesson data
const mockLesson = {
  id: '3',
  title: 'CSS Basics and Styling',
  description: 'Introduction to CSS and basic styling techniques',
  type: 'video',
  duration: 25,
  videoUrl: '/api/placeholder/video3.mp4',
  transcript: 'Welcome to CSS Basics and Styling. In this lesson, we\'ll cover CSS syntax, selectors, and common properties.',
  resources: [
    { id: '1', name: 'CSS Properties Reference', type: 'pdf', url: '/api/placeholder/css-reference.pdf' }
  ]
};

export default function CoursePlayerPage({ 
  params 
}: { 
  params: { courseId: string; lessonId: string } 
}) {
  const { user } = useAuth();
  const [lesson, setLesson] = useState(mockLesson);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, [params.courseId, params.lessonId]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['Student']}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF804B] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['Student']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Complete Web Development Bootcamp</h1>
                <p className="text-gray-600">{lesson.title}</p>
              </div>
              <Link href={`/dashboard/courses/${params.courseId}`}>
                <Button variant="outline">Back to Course</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Video Player */}
              <Card className="mb-6">
                <CardContent className="p-0">
                  <div className="aspect-video bg-black relative">
                    <video
                      className="w-full h-full object-cover"
                      controls
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                    >
                      <source src={lesson.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/50 text-white">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lesson Info */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span className="text-2xl">▶️</span>
                    <span>{lesson.title}</span>
                  </CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Duration: {lesson.duration} minutes</span>
                    <span>Type: {lesson.type}</span>
                    <span>Progress: {Math.round((currentTime / duration) * 100)}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Resources */}
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Resources</CardTitle>
                  <CardDescription>Download additional materials for this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lesson.resources.map((resource) => (
                      <div key={resource.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📄</span>
                          <div>
                            <div className="font-medium">{resource.name}</div>
                            <div className="text-sm text-gray-500">{resource.type.toUpperCase()}</div>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="space-y-6">
                {/* Course Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Course Progress</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#FF804B]">35%</div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                    <Progress value={35} className="w-full" />
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full bg-[#2C4E41] hover:bg-[#2C4E41]/90">
                      Mark as Complete
                    </Button>
                    <Button variant="outline" className="w-full">
                      Take Notes
                    </Button>
                    <Button variant="outline" className="w-full">
                      Ask Question
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}