'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateClient } from 'aws-amplify/api';

// Mock data - replace with actual GraphQL queries
const courseData = {
  id: '1',
  title: 'Complete Web Development Bootcamp',
  modules: [
    {
      id: '1',
      title: 'Introduction to Web Development',
      lessons: [
        {
          id: '1',
          title: 'What is Web Development?',
          type: 'VIDEO',
          durationSec: 1200,
          videoUrl: 'https://example.com/video1.mp4',
          completed: false,
          watchedSeconds: 0
        },
        {
          id: '2',
          title: 'Setting up your Development Environment',
          type: 'VIDEO',
          durationSec: 1800,
          videoUrl: 'https://example.com/video2.mp4',
          completed: false,
          watchedSeconds: 0
        }
      ]
    },
    {
      id: '2',
      title: 'HTML Fundamentals',
      lessons: [
        {
          id: '3',
          title: 'HTML Basics and Structure',
          type: 'VIDEO',
          durationSec: 2400,
          videoUrl: 'https://example.com/video3.mp4',
          completed: false,
          watchedSeconds: 0
        },
        {
          id: '4',
          title: 'HTML Forms and Input Elements',
          type: 'VIDEO',
          durationSec: 2100,
          videoUrl: 'https://example.com/video4.mp4',
          completed: false,
          watchedSeconds: 0
        }
      ]
    }
  ]
};

interface CoursePlayerProps {
  courseId: string;
  lessonId: string;
}

export default function CoursePlayer({ courseId, lessonId }: CoursePlayerProps) {
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const client = generateClient();

  // Find current lesson and module
  useEffect(() => {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.id === lessonId);
      if (lesson) {
        setCurrentLesson(lesson);
        setCurrentModule(module);
        setWatchedSeconds(lesson.watchedSeconds);
        break;
      }
    }
  }, [lessonId]);

  // Update progress when video time changes
  const handleTimeUpdate = async () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const newProgress = (currentTime / duration) * 100;
      const newWatchedSeconds = Math.floor(currentTime);
      
      setProgress(newProgress);
      setWatchedSeconds(newWatchedSeconds);

      // Update progress in database every 10 seconds
      if (newWatchedSeconds % 10 === 0) {
        try {
          // This would be a GraphQL mutation to update LessonProgress
          console.log('Updating progress:', {
            userId: 'current-user-id',
            courseId,
            lessonId,
            watchedSeconds: newWatchedSeconds,
            percent: Math.floor(newProgress),
            completed: newProgress >= 90
          });
        } catch (error) {
          console.error('Error updating progress:', error);
        }
      }
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = seekTime;
    }
  };

  if (!currentLesson || !currentModule) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Video Player */}
      <div className="flex-1 flex flex-col">
        <div className="bg-black aspect-video relative">
          <video
            ref={videoRef}
            className="w-full h-full"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={currentLesson.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayPause}
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </Button>
              
              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={handleSeek}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <span className="text-white text-sm">
                {Math.floor(watchedSeconds / 60)}:{(watchedSeconds % 60).toString().padStart(2, '0')} / 
                {Math.floor(currentLesson.durationSec / 60)}:{(currentLesson.durationSec % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Lesson Info */}
        <div className="bg-white p-6">
          <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
          <p className="text-gray-600 mb-4">
            Module: {currentModule.title}
          </p>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {Math.floor(progress)}% complete
            </span>
          </div>
        </div>
      </div>

      {/* Course Content Sidebar */}
      <div className="w-80 bg-white border-l overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">{courseData.title}</h2>
        </div>
        
        <div className="p-4">
          {courseData.modules.map((module, moduleIndex) => (
            <div key={module.id} className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">
                {moduleIndex + 1}. {module.title}
              </h3>
              <div className="space-y-1">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      lesson.id === lessonId
                        ? 'bg-blue-100 border-l-4 border-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {moduleIndex + 1}.{lessonIndex + 1}
                        </span>
                        <span className="text-sm font-medium">{lesson.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {lesson.completed && (
                          <span className="text-green-600">✓</span>
                        )}
                        <span className="text-xs text-gray-500">
                          {Math.floor(lesson.durationSec / 60)}m
                        </span>
                      </div>
                    </div>
                    {lesson.id === lessonId && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-1">
                          <div 
                            className="bg-blue-600 h-1 rounded-full"
                            style={{ width: `${(lesson.watchedSeconds / lesson.durationSec) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
