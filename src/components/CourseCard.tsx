'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    subtitle?: string;
    description?: string;
    category?: string;
    difficulty?: string;
    price?: number;
    thumbnailUrl?: string;
    rating?: number;
    totalRatings?: number;
    students?: number;
    duration?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    instructor?: string;
    progress?: number;
    nextLesson?: string;
  };
  variant?: 'default' | 'compact' | 'featured';
  showProgress?: boolean;
  showInstructor?: boolean;
  showRating?: boolean;
  showPricing?: boolean;
  showBadges?: boolean;
  className?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = 'default',
  showProgress = false,
  showInstructor = true,
  showRating = true,
  showPricing = true,
  showBadges = true,
  className = ''
}) => {
  const isNew = course.createdAt && new Date(course.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const isTopRated = course.rating && course.rating >= 4.8;
  const isBestseller = course.students && course.students > 10000;

  if (variant === 'compact') {
    return (
      <div className={`group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden ${className}`}>
        <div className="flex items-center space-x-4 p-4">
          {/* Course Thumbnail */}
          <div className="relative w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={course.thumbnailUrl || '/api/placeholder/64/64'}
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 group-hover:text-[#FF804B] transition-colors duration-200 truncate">
              {course.title}
            </h3>
            {showInstructor && (
              <p className="text-sm text-gray-600 truncate">by {course.instructor || 'Expert Instructor'}</p>
            )}
            
            {/* Progress Bar */}
            {showProgress && course.progress !== undefined && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span className="font-semibold">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#2C4E41] to-[#FF804B] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {course.nextLesson && (
              <p className="text-xs text-gray-500 mt-2 truncate">Next: {course.nextLesson}</p>
            )}
          </div>
          
          {/* CTA Button */}
          <div className="flex-shrink-0">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-[#FF804B] to-[#FF804B]/90 hover:from-[#FF804B]/90 hover:to-[#FF804B] text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              {showProgress ? 'Continue' : 'View'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div className={`group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100 ${className}`}>
        {/* Featured Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 shadow-lg">
            ⭐ Featured
          </Badge>
        </div>

        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 overflow-hidden">
          <img
            src={course.thumbnailUrl || '/api/placeholder/600/338'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          
          {/* Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl">
              <div className="w-0 h-0 border-l-[16px] border-l-[#FF804B] border-y-[12px] border-y-transparent ml-1"></div>
            </div>
          </div>

          {/* Badges */}
          {showBadges && (
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              {isTopRated && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
                  ⭐ Top Rated
                </Badge>
              )}
              {isBestseller && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md">
                  🔥 Bestseller
                </Badge>
              )}
              {isNew && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
                  🎉 New
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-[#FF804B] transition-colors duration-200">
            {course.title}
          </h3>
          
          {showInstructor && (
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {(course.instructor || 'A').charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                By {course.instructor || 'Expert Instructor'}
              </span>
            </div>
          )}

          {showRating && course.rating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(course.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ⭐
                  </span>
                ))}
              </div>
              <span className="text-lg font-semibold text-gray-900">
                {course.rating}
              </span>
              <span className="text-sm text-gray-500">
                ({course.totalRatings || Math.floor(Math.random() * 1000) + 100} ratings)
              </span>
            </div>
          )}

          {/* Key Highlights */}
          <div className="flex flex-wrap gap-2 mb-4">
            {course.difficulty && (
              <Badge variant="outline" className="text-sm">
                🎯 {course.difficulty} Friendly
              </Badge>
            )}
            {course.duration && (
              <Badge variant="outline" className="text-sm">
                ⏱️ {course.duration}
              </Badge>
            )}
            {course.students && (
              <Badge variant="outline" className="text-sm">
                🧑‍🎓 {course.students > 1000 ? `${(course.students / 1000).toFixed(1)}k+` : course.students} Students
              </Badge>
            )}
          </div>

          {/* Pricing & CTA */}
          {showPricing && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {course.price ? `₹${course.price}` : 'Free'}
                </span>
                {course.price && course.price > 0 && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{Math.round(course.price * 2.5)}
                  </span>
                )}
                {course.price && course.price > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round(((Math.round(course.price * 2.5) - course.price) / Math.round(course.price * 2.5)) * 100)}% OFF
                  </Badge>
                )}
              </div>

              <Button 
                asChild 
                className="w-full bg-gradient-to-r from-[#FF804B] to-[#FF804B]/90 hover:from-[#FF804B]/90 hover:to-[#FF804B] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
              >
                <Link href={`/courses/${course.id}`}>
                  {course.price && course.price > 0 ? 'Enroll Now' : 'Start Learning'}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100 ${className}`}>
      {/* Top Section - Thumbnail */}
      <div className="relative aspect-video bg-gray-200 overflow-hidden">
        <img
          src={course.thumbnailUrl || '/api/placeholder/400/225'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-0 h-0 border-l-[12px] border-l-[#FF804B] border-y-[8px] border-y-transparent ml-1"></div>
          </div>
        </div>

        {/* Badges */}
        {showBadges && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isTopRated && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-md">
                ⭐ Top Rated
              </Badge>
            )}
            {isBestseller && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md">
                🔥 Bestseller
              </Badge>
            )}
            {isNew && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md">
                🎉 New
              </Badge>
            )}
          </div>
        )}

        {/* Difficulty Badge */}
        {course.difficulty && (
          <div className="absolute top-3 right-3">
            <Badge 
              className={`${
                course.difficulty === 'Beginner' ? 'bg-green-500' :
                course.difficulty === 'Intermediate' ? 'bg-yellow-500' :
                course.difficulty === 'Advanced' ? 'bg-red-500' : 'bg-purple-500'
              } text-white border-0 shadow-md`}
            >
              {course.difficulty}
            </Badge>
          </div>
        )}
      </div>

      {/* Middle Section - Content Info */}
      <div className="p-5">
        {/* Course Title */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#FF804B] transition-colors duration-200">
          {course.title}
        </h3>

        {/* Instructor */}
        {showInstructor && (
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {(course.instructor || 'A').charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-gray-600">
              By {course.instructor || 'Expert Instructor'}
            </span>
          </div>
        )}

        {/* Rating & Reviews */}
        {showRating && course.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(course.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ⭐
                </span>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {course.rating}
            </span>
            <span className="text-sm text-gray-500">
              ({course.totalRatings || Math.floor(Math.random() * 1000) + 100} ratings)
            </span>
          </div>
        )}

        {/* Key Highlights / Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.difficulty && (
            <Badge variant="outline" className="text-xs">
              🎯 {course.difficulty} Friendly
            </Badge>
          )}
          {course.duration && (
            <Badge variant="outline" className="text-xs">
              ⏱️ {course.duration}
            </Badge>
          )}
          {course.students && (
            <Badge variant="outline" className="text-xs">
              🧑‍🎓 {course.students > 1000 ? `${(course.students / 1000).toFixed(1)}k+` : course.students} Students
            </Badge>
          )}
          {course.category && (
            <Badge variant="outline" className="text-xs">
              📚 {course.category}
            </Badge>
          )}
        </div>

        {/* Bottom Section - Pricing & CTA */}
        {showPricing && (
          <div className="space-y-3">
            {/* Price */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {course.price ? `₹${course.price}` : 'Free'}
              </span>
              {course.price && course.price > 0 && (
                <span className="text-lg text-gray-500 line-through">
                  ₹{Math.round(course.price * 2.5)}
                </span>
              )}
              {course.price && course.price > 0 && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {Math.round(((Math.round(course.price * 2.5) - course.price) / Math.round(course.price * 2.5)) * 100)}% OFF
                </Badge>
              )}
            </div>

            {/* CTA Button */}
            <Button 
              asChild 
              className="w-full bg-gradient-to-r from-[#FF804B] to-[#FF804B]/90 hover:from-[#FF804B]/90 hover:to-[#FF804B] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link href={`/courses/${course.id}`}>
                {course.price && course.price > 0 ? 'Enroll Now' : 'Start Learning'}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
