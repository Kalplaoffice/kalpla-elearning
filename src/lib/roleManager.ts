/**
 * Role Management Utility
 * 
 * This utility manages user roles without relying on Cognito custom attributes.
 * It uses email patterns and local storage as fallbacks.
 */

export type UserRole = 'Student' | 'Mentor' | 'Admin';
export type MembershipType = 'basic' | 'premium' | 'admin' | 'instructor';

export interface UserRoleInfo {
  role: UserRole;
  membershipType: MembershipType;
  subscriptionStatus: 'active' | 'expired' | 'trial';
}

/**
 * Get user role information based on email pattern
 */
export function getUserRoleFromEmail(email: string): UserRoleInfo {
  const emailLower = email.toLowerCase();
  
  // Specific admin email
  if (emailLower === 'learncapacademy@gmail.com') {
    return {
      role: 'Admin',
      membershipType: 'admin',
      subscriptionStatus: 'active'
    };
  }
  
  if (emailLower.includes('admin@')) {
    return {
      role: 'Admin',
      membershipType: 'admin',
      subscriptionStatus: 'active'
    };
  }
  
  if (emailLower.includes('instructor@') || emailLower.includes('mentor@')) {
    return {
      role: 'Mentor',
      membershipType: 'instructor',
      subscriptionStatus: 'active'
    };
  }
  
  if (emailLower.includes('premium@')) {
    return {
      role: 'Student',
      membershipType: 'premium',
      subscriptionStatus: 'active'
    };
  }
  
  // Default to basic student
  return {
    role: 'Student',
    membershipType: 'basic',
    subscriptionStatus: 'active'
  };
}

/**
 * Get user role information from stored data
 */
export function getUserRoleFromStorage(userId: string): UserRoleInfo | null {
  try {
    const stored = localStorage.getItem(`user_role_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing stored role data:', error);
  }
  return null;
}

/**
 * Store user role information
 */
export function storeUserRole(userId: string, roleInfo: UserRoleInfo): void {
  try {
    localStorage.setItem(`user_role_${userId}`, JSON.stringify(roleInfo));
  } catch (error) {
    console.error('Error storing role data:', error);
  }
}

/**
 * Get comprehensive user role information
 */
export function getUserRoleInfo(email: string, userId: string): UserRoleInfo {
  // First try to get from storage
  const storedRole = getUserRoleFromStorage(userId);
  if (storedRole) {
    return storedRole;
  }
  
  // Fallback to email-based detection
  const emailRole = getUserRoleFromEmail(email);
  
  // Store for future use
  storeUserRole(userId, emailRole);
  
  return emailRole;
}

/**
 * Update user role (for admin functions)
 */
export function updateUserRole(userId: string, role: UserRole, membershipType: MembershipType): void {
  const roleInfo: UserRoleInfo = {
    role,
    membershipType,
    subscriptionStatus: 'active'
  };
  
  storeUserRole(userId, roleInfo);
}

/**
 * Check if user has specific role
 */
export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy = {
    'Student': 1,
    'Mentor': 2,
    'Admin': 3
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user has premium membership
 */
export function hasPremiumMembership(membershipType: MembershipType): boolean {
  return membershipType === 'premium' || membershipType === 'admin' || membershipType === 'instructor';
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames = {
    'Student': 'Student',
    'Mentor': 'Instructor',
    'Admin': 'Administrator'
  };
  
  return displayNames[role];
}

/**
 * Get membership display name
 */
export function getMembershipDisplayName(membershipType: MembershipType): string {
  const displayNames = {
    'basic': 'Basic',
    'premium': 'Premium (12-Month)',
    'admin': 'Administrator',
    'instructor': 'Instructor'
  };
  
  return displayNames[membershipType];
}
