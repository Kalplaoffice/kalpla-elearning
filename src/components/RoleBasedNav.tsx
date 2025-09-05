'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  MessageSquare,
  Award,
  Calendar,
  Upload,
  FileText,
  CreditCard,
  Shield,
  GraduationCap
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const roleBasedNavItems = {
  Admin: [
    { href: '/dashboard/admin', label: 'Overview', icon: BarChart3, description: 'Dashboard overview' },
    { href: '/dashboard/admin/users', label: 'Users', icon: Users, description: 'Manage users' },
    { href: '/dashboard/admin/courses', label: 'Courses', icon: BookOpen, description: 'Manage courses' },
    { href: '/dashboard/admin/analytics', label: 'Analytics', icon: BarChart3, description: 'Platform analytics' },
    { href: '/dashboard/admin/community', label: 'Community', icon: MessageSquare, description: 'Moderate community' },
    { href: '/dashboard/admin/payments', label: 'Payments', icon: CreditCard, description: 'Financial overview' },
    { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings, description: 'System settings' },
  ],
  Mentor: [
    { href: '/dashboard/mentor', label: 'Overview', icon: BarChart3, description: 'Mentor dashboard' },
    { href: '/dashboard/mentor/courses', label: 'My Courses', icon: BookOpen, description: 'Manage courses' },
    { href: '/dashboard/mentor/students', label: 'Students', icon: Users, description: 'View students' },
    { href: '/dashboard/mentor/upload', label: 'Upload', icon: Upload, description: 'Upload content' },
    { href: '/dashboard/mentor/schedule', label: 'Schedule', icon: Calendar, description: 'Plan sessions' },
    { href: '/dashboard/mentor/grading', label: 'Grading', icon: Award, description: 'Grade assignments' },
    { href: '/dashboard/mentor/reports', label: 'Reports', icon: FileText, description: 'Performance reports' },
  ],
  Student: [
    { href: '/dashboard/student', label: 'Overview', icon: BarChart3, description: 'Student dashboard' },
    { href: '/dashboard/student/courses', label: 'My Courses', icon: BookOpen, description: 'Enrolled courses' },
    { href: '/dashboard/student/assignments', label: 'Assignments', icon: FileText, description: 'View assignments' },
    { href: '/dashboard/student/certificates', label: 'Certificates', icon: Award, description: 'My certificates' },
    { href: '/dashboard/student/community', label: 'Community', icon: MessageSquare, description: 'Student community' },
    { href: '/dashboard/student/mentorship', label: 'Mentorship', icon: GraduationCap, description: 'Mentorship program' },
    { href: '/dashboard/student/profile', label: 'Profile', icon: Settings, description: 'Account settings' },
  ],
};

export default function RoleBasedNav() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const navItems = roleBasedNavItems[user.role] || roleBasedNavItems.Student;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-[#2C4E41] to-[#FF804B] bg-clip-text text-transparent">
            Kalpla
          </Link>

          {/* Role Badge */}
          <div className="flex items-center space-x-4">
            <Badge 
              variant="outline" 
              className={`${
                user.role === 'Admin' ? 'text-red-600 border-red-600' :
                user.role === 'Mentor' ? 'text-blue-600 border-blue-600' :
                'text-green-600 border-green-600'
              }`}
            >
              {user.role === 'Admin' ? '👨‍💼 Admin' :
               user.role === 'Mentor' ? '👨‍🏫 Mentor' :
               '🎓 Student'}
            </Badge>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex space-x-1 pb-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-[#FF804B] hover:bg-[#FF804B]/10"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Mobile navigation component
export function MobileRoleBasedNav() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return null;
  }

  const navItems = roleBasedNavItems[user.role] || roleBasedNavItems.Student;

  return (
    <div className="bg-white shadow-lg border-t">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          {navItems.slice(0, 4).map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="flex flex-col items-center space-y-1 p-2 h-auto text-xs text-gray-600 hover:text-[#FF804B]"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
