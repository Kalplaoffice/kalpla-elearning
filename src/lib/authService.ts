'use client';

import { 
  signIn as amplifySignIn, 
  signUp as amplifySignUp, 
  signOut as amplifySignOut, 
  getCurrentUser,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  resetPassword as amplifyResetPassword,
  confirmResetPassword as amplifyConfirmResetPassword,
  signInWithRedirect,
  signInWithRedirect as amplifySignInWithRedirect,
  fetchAuthSession
} from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { getUserRoleInfo } from './roleManager';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Student' | 'Mentor' | 'Admin';
  membershipType?: 'basic' | 'premium' | 'admin' | 'instructor';
  subscriptionStatus?: 'active' | 'expired' | 'trial';
  avatarUrl?: string;
  isEmailVerified: boolean;
  provider?: 'email' | 'google' | 'github' | 'linkedin';
  mfaEnabled?: boolean;
}

export interface AuthError {
  code: string;
  message: string;
  name: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresAt: number;
}

class AuthService {
  private listeners: ((user: User | null) => void)[] = [];
  private currentUser: User | null = null;
  private session: AuthSession | null = null;

  constructor() {
    this.setupHubListener();
  }

  private setupHubListener() {
    Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signInWithRedirect':
        case 'signIn':
          this.handleSignIn();
          break;
        case 'signOut':
          this.handleSignOut();
          break;
        case 'tokenRefresh':
          this.handleTokenRefresh();
          break;
        case 'tokenRefresh_failure':
          this.handleTokenRefreshFailure();
          break;
      }
    });
  }

  private async handleSignIn() {
    try {
      const user = await this.getCurrentUser();
      this.currentUser = user;
      this.notifyListeners(user);
    } catch (error) {
      console.error('Error handling sign in:', error);
      this.currentUser = null;
      this.notifyListeners(null);
    }
  }

  private async handleSignOut() {
    this.currentUser = null;
    this.session = null;
    this.notifyListeners(null);
  }

  private async handleTokenRefresh() {
    try {
      const session = await this.getSession();
      this.session = session;
    } catch (error) {
      console.error('Error refreshing token:', error);
    }
  }

  private async handleTokenRefreshFailure() {
    console.error('Token refresh failed, signing out user');
    await this.signOut();
  }

  private notifyListeners(user: User | null) {
    this.listeners.forEach(listener => listener(user));
  }

  public addAuthListener(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async getCurrentUser(): Promise<User | null> {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) return null;

      const email = currentUser.signInDetails?.loginId || currentUser.username || '';
      const name = currentUser.username || email.split('@')[0];
      const userId = currentUser.userId;
      
      const roleInfo = getUserRoleInfo(email, userId);
      const session = await this.getSession();

      const userData: User = {
        id: userId,
        email,
        name,
        role: roleInfo.role,
        membershipType: roleInfo.membershipType,
        subscriptionStatus: roleInfo.subscriptionStatus,
        isEmailVerified: (currentUser as { attributes?: { email_verified?: string } }).attributes?.email_verified === 'true' || false,
        provider: this.detectProvider(currentUser),
        mfaEnabled: this.checkMFAEnabled(currentUser),
      };

      this.currentUser = userData;
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      this.currentUser = null;
      return null;
    }
  }

  public async getSession(): Promise<AuthSession | null> {
    try {
      const session = await fetchAuthSession();
      if (!session.tokens) return null;

      const authSession: AuthSession = {
        accessToken: session.tokens.accessToken.toString(),
        refreshToken: session.tokens.refreshToken?.toString() || '',
        idToken: session.tokens.idToken?.toString() || '',
        expiresAt: session.tokens.accessToken.payload.exp || 0,
      };

      this.session = authSession;
      return authSession;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  private detectProvider(currentUser: any): 'email' | 'google' | 'github' | 'linkedin' {
    const provider = currentUser.signInDetails?.loginId?.includes('@') ? 'email' : 'google';
    // This would need to be enhanced based on actual provider detection
    return provider;
  }

  private checkMFAEnabled(currentUser: any): boolean {
    // Check if MFA is enabled for the user
    return currentUser.preferredMFA !== 'NOMFA';
  }

  public async signInWithEmail(email: string, password: string, rememberMe: boolean = false): Promise<User> {
    try {
      const { isSignedIn, nextStep } = await amplifySignIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('Failed to get user after sign in');
        return user;
      }

      if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        throw new Error('Please check your email and confirm your account before signing in.');
      } else if (nextStep?.signInStep === 'RESET_PASSWORD') {
        throw new Error('Password reset required. Please use the forgot password feature.');
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED') {
        throw new Error('Please set a new password. Check your email for instructions.');
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_TOTP_CODE') {
        throw new Error('MFA_REQUIRED');
      } else {
        throw new Error(`Sign in incomplete. Next step: ${nextStep?.signInStep || 'Unknown'}`);
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async signUpWithEmail(email: string, password: string, name: string): Promise<void> {
    try {
      const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      if (isSignUpComplete) {
        return;
      }

      if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        throw new Error('Please check your email and confirm your account to complete registration.');
      } else {
        throw new Error(`Sign up incomplete. Next step: ${nextStep?.signUpStep || 'Unknown'}`);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async signInWithSocial(provider: 'google' | 'github' | 'linkedin'): Promise<void> {
    try {
      await signInWithRedirect({
        provider: provider === 'google' ? 'Google' : 
                 provider === 'github' ? 'GitHub' : 'LinkedIn'
      });
    } catch (error: any) {
      console.error('Social sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async signInWithPhone(phoneNumber: string): Promise<User> {
    try {
      // For phone number sign in, we need to use the phone number as username
      const { isSignedIn, nextStep } = await amplifySignIn({
        username: phoneNumber,
        password: '', // Phone number sign in doesn't use password
      });

      if (isSignedIn) {
        const user = await this.getCurrentUser();
        if (!user) throw new Error('Failed to get user after sign in');
        return user;
      }

      if (nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
        throw new Error('Please verify your phone number before signing in.');
      } else if (nextStep?.signInStep === 'CONFIRM_SIGN_IN_WITH_SMS_CODE') {
        throw new Error('SMS_CODE_REQUIRED');
      } else {
        throw new Error(`Sign in incomplete. Next step: ${nextStep?.signInStep || 'Unknown'}`);
      }
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async signUpWithPhone(phoneNumber: string, name: string): Promise<void> {
    try {
      // Generate a temporary password for phone sign up
      const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
      
      const { isSignUpComplete, userId, nextStep } = await amplifySignUp({
        username: phoneNumber,
        password: tempPassword,
        options: {
          userAttributes: {
            phone_number: phoneNumber,
            name,
          },
        },
      });

      if (isSignUpComplete) {
        return;
      }

      if (nextStep?.signUpStep === 'CONFIRM_SIGN_UP') {
        throw new Error('Please verify your phone number to complete registration.');
      } else {
        throw new Error(`Sign up incomplete. Next step: ${nextStep?.signUpStep || 'Unknown'}`);
      }
    } catch (error: any) {
      console.error('Phone sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async confirmPhoneSignUp(phoneNumber: string, code: string): Promise<void> {
    try {
      const { isSignUpComplete } = await amplifyConfirmSignUp({
        username: phoneNumber,
        confirmationCode: code,
      });

      if (!isSignUpComplete) {
        throw new Error('Phone verification failed');
      }
    } catch (error: any) {
      console.error('Confirm phone sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async resendPhoneConfirmationCode(phoneNumber: string): Promise<void> {
    try {
      await amplifyResendSignUpCode({
        username: phoneNumber,
      });
    } catch (error: any) {
      console.error('Resend phone confirmation code error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async signOut(): Promise<void> {
    try {
      await amplifySignOut();
      this.currentUser = null;
      this.session = null;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async confirmSignUp(email: string, code: string): Promise<void> {
    try {
      const { isSignUpComplete } = await amplifyConfirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (!isSignUpComplete) {
        throw new Error('Confirmation failed');
      }
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async resendConfirmationCode(email: string): Promise<void> {
    try {
      await amplifyResendSignUpCode({
        username: email,
      });
    } catch (error: any) {
      console.error('Resend confirmation code error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async forgotPassword(email: string): Promise<void> {
    try {
      await amplifyResetPassword({
        username: email,
      });
    } catch (error: any) {
      console.error('Forgot password error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    try {
      await amplifyConfirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw this.handleAuthError(error);
    }
  }

  public async enableMFA(): Promise<void> {
    // Implementation for enabling MFA
    // This would involve setting up TOTP or SMS MFA
    throw new Error('MFA setup not implemented yet');
  }

  public async verifyMFACode(code: string): Promise<User> {
    // Implementation for verifying MFA code
    // This would be called after sign in when MFA is required
    throw new Error('MFA verification not implemented yet');
  }

  public async refreshSession(): Promise<AuthSession | null> {
    try {
      const session = await this.getSession();
      return session;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
  }

  public isSessionValid(): boolean {
    if (!this.session) return false;
    return Date.now() < this.session.expiresAt * 1000;
  }

  public getCurrentUserSync(): User | null {
    return this.currentUser;
  }

  private handleAuthError(error: any): AuthError {
    const errorMap: { [key: string]: string } = {
      'UserAlreadyAuthenticatedException': 'You are already signed in.',
      'NotAuthorizedException': 'Invalid email or password. Please check your credentials.',
      'UserNotConfirmedException': 'Please check your email and confirm your account before signing in.',
      'UserNotFoundException': 'No account found with this email address. Please sign up first.',
      'UsernameExistsException': 'An account with this email already exists. Please sign in instead.',
      'InvalidPasswordException': 'Password does not meet requirements. Please use at least 8 characters with uppercase, lowercase, numbers, and special characters.',
      'InvalidParameterException': 'Invalid email format. Please enter a valid email address.',
      'TooManyRequestsException': 'Too many attempts. Please try again later.',
      'LimitExceededException': 'Attempt limit exceeded. Please try again later.',
      'CodeMismatchException': 'Invalid verification code. Please check and try again.',
      'ExpiredCodeException': 'Verification code has expired. Please request a new one.',
      'InvalidUserPoolConfigurationException': 'Authentication service is temporarily unavailable.',
    };

    const errorCode = error.name || error.code || 'UnknownError';
    const message = errorMap[errorCode] || error.message || 'An unexpected error occurred.';

    return {
      code: errorCode,
      message,
      name: error.name || 'AuthError',
    };
  }
}

export const authService = new AuthService();
export default authService;
