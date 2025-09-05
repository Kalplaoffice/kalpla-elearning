'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#2C4E41] to-[#FF804B] bg-clip-text text-transparent hover:from-[#FF804B] hover:to-[#2C4E41] transition-all duration-300">
            Kalpla
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/courses" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/programs" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              Degree Programs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/mentorship" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              Mentorship
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/blog" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              Blog
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/community" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              Community
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-[#FF804B] font-medium transition-colors duration-200 relative group">
              Contact
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF804B] group-hover:w-full transition-all duration-200"></span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <Badge variant="outline" className="text-xs">
                      {user?.role}
                    </Badge>
                  </div>
                </div>
                <Link href="/dashboard/student">
                  <Button variant="outline">Dashboard</Button>
                </Link>
                <Button onClick={signOut} variant="outline">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button>Sign Up</Button>
                </Link>
                <Link href="/mentorship/apply">
                  <Button className="bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">Apply Now</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                Home
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-blue-600 font-medium">
                Courses
              </Link>
              <Link href="/programs" className="text-gray-700 hover:text-blue-600 font-medium">
                Degree Programs
              </Link>
              <Link href="/mentorship" className="text-gray-700 hover:text-blue-600 font-medium">
                Mentorship
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-blue-600 font-medium">
                Blog
              </Link>
              <Link href="/community" className="text-gray-700 hover:text-blue-600 font-medium">
                Community
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 font-medium">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium">
                Contact
              </Link>
              <div className="pt-4 border-t">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-2 mb-4 p-2 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-r from-[#2C4E41] to-[#FF804B] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{user?.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {user?.role}
                        </Badge>
                      </div>
                    </div>
                    <Link href="/dashboard/student" className="block mb-2">
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Button onClick={signOut} variant="outline" className="w-full">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="block mb-2">
                      <Button variant="outline" className="w-full">Login</Button>
                    </Link>
                    <Link href="/auth/register" className="block mb-2">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                    <Link href="/mentorship/apply">
                      <Button className="w-full bg-[#FF804B] hover:bg-[#FF804B]/90 text-white">Apply Now</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
