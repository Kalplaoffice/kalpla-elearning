# Authentication Setup Guide

This guide covers the complete authentication setup for the Kalpla e-learning platform, including email, Google OAuth, and phone number authentication.

## Features Implemented

### 1. Email Authentication
- ✅ User registration with email and password
- ✅ User login with email and password
- ✅ Email verification
- ✅ Password reset functionality
- ✅ Resend confirmation codes

### 2. Google OAuth Authentication
- ✅ Google OAuth integration
- ✅ Redirect-based authentication flow
- ✅ Automatic user profile creation
- ✅ Seamless sign-in/sign-up experience

### 3. Phone Number Authentication
- ✅ Phone number registration
- ✅ Phone number login
- ✅ SMS verification (simulated)
- ✅ International phone number support
- ✅ Country code selection

## Configuration Files Updated

### 1. Amplify Configuration (`src/amplifyconfiguration.json`)
```json
{
  "oauth": {
    "domain": "kalpla-elearning.auth.ap-south-1.amazoncognito.com",
    "scope": ["phone", "email", "openid", "profile", "aws.cognito.signin.user.admin"],
    "redirectSignIn": "http://localhost:3000/auth/callback",
    "redirectSignOut": "http://localhost:3000/auth/login",
    "responseType": "code"
  },
  "aws_cognito_social_providers": ["GOOGLE"],
  "aws_cognito_username_attributes": ["EMAIL", "PHONE_NUMBER"],
  "aws_cognito_signup_attributes": ["EMAIL", "PHONE_NUMBER"],
  "aws_cognito_verification_mechanisms": ["EMAIL", "PHONE_NUMBER"]
}
```

### 2. Backend Configuration (`amplify/backend/backend-config.json`)
```json
{
  "auth": {
    "kalplaelearninga4785467": {
      "frontendAuthConfig": {
        "socialProviders": ["GOOGLE"],
        "usernameAttributes": ["EMAIL", "PHONE_NUMBER"],
        "verificationMechanisms": ["EMAIL", "PHONE_NUMBER"]
      }
    }
  }
}
```

## Components Created

### 1. GoogleAuthButton (`src/components/auth/GoogleAuthButton.tsx`)
- Reusable Google OAuth button component
- Loading states and error handling
- Customizable styling and content

### 2. PhoneAuthForm (`src/components/auth/PhoneAuthForm.tsx`)
- Phone number input with international support
- Verification code input
- Support for both sign-in and sign-up modes
- SMS verification simulation

### 3. AuthCallback (`src/app/auth/callback/page.tsx`)
- Handles OAuth redirects
- Session validation
- Automatic redirection to dashboard

## Authentication Context Updates

### New Methods Added
```typescript
interface AuthContextType {
  // Existing methods...
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signUpWithPhone: (phoneNumber: string, name: string) => Promise<void>;
  confirmPhoneSignUp: (phoneNumber: string, code: string) => Promise<void>;
  resendPhoneConfirmationCode: (phoneNumber: string) => Promise<void>;
}
```

### User Interface Updates
```typescript
interface User {
  // Existing properties...
  phoneNumber?: string;
  provider?: 'email' | 'google' | 'phone';
}
```

## Pages Updated

### 1. Login Page (`src/app/auth/login/page.tsx`)
- Toggle between email and phone authentication
- Google OAuth button
- Phone number authentication form
- Enhanced error handling

### 2. Register Page (`src/app/auth/register/page.tsx`)
- Toggle between email and phone authentication
- Google OAuth button
- Phone number registration form
- Terms and conditions acceptance

### 3. Test Page (`src/app/auth/test/page.tsx`)
- Comprehensive testing interface
- All authentication methods in one place
- Real-time status updates
- User information display

## Dependencies Added

```json
{
  "dependencies": {
    "react-phone-number-input": "^3.x.x",
    "libphonenumber-js": "^1.x.x"
  }
}
```

## Usage Examples

### Email Authentication
```typescript
const { signIn, signUp } = useAuth();

// Sign in
await signIn('user@example.com', 'password123');

// Sign up
await signUp('user@example.com', 'password123', 'John Doe');
```

### Google Authentication
```typescript
const { signInWithGoogle } = useAuth();

// Sign in with Google
await signInWithGoogle();
```

### Phone Authentication
```typescript
const { signInWithPhone, signUpWithPhone } = useAuth();

// Sign in with phone
await signInWithPhone('+1234567890');

// Sign up with phone
await signUpWithPhone('+1234567890', 'John Doe');
```

## Testing

### Test Page Access
Visit `/auth/test` to test all authentication methods:
- Email sign-in/sign-up
- Google OAuth
- Phone number sign-in/sign-up
- User status display
- Sign out functionality

### Test Credentials
For testing purposes, you can use:
- **Email**: Any valid email format
- **Password**: Minimum 8 characters
- **Phone**: Any valid international format (e.g., +1234567890)

## Security Considerations

1. **Phone Number Validation**: Uses `libphonenumber-js` for proper validation
2. **OAuth Security**: Proper redirect handling and state management
3. **Password Policy**: Enforced through AWS Cognito
4. **Session Management**: Automatic token refresh and validation
5. **Error Handling**: Comprehensive error messages without exposing sensitive data

## Deployment Notes

### Environment Variables
Make sure to set up the following in your production environment:
- `NEXT_PUBLIC_AMPLIFY_CONFIG`: Amplify configuration
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret

### OAuth Redirect URLs
Update the OAuth redirect URLs in your Google Console:
- Development: `http://localhost:3000/auth/callback`
- Production: `https://yourdomain.com/auth/callback`

## Troubleshooting

### Common Issues

1. **Google OAuth Not Working**
   - Check OAuth configuration in AWS Cognito
   - Verify redirect URLs in Google Console
   - Ensure proper domain configuration

2. **Phone Authentication Issues**
   - Verify phone number format
   - Check AWS Cognito phone number settings
   - Ensure SMS service is properly configured

3. **Session Management**
   - Check token expiration settings
   - Verify refresh token configuration
   - Ensure proper error handling

### Debug Mode
Enable debug logging by setting:
```typescript
// In your auth configuration
console.log('Auth debug enabled');
```

## Next Steps

1. **SMS Integration**: Implement actual SMS sending for phone verification
2. **MFA Support**: Add multi-factor authentication options
3. **Social Providers**: Add more social login options (GitHub, LinkedIn)
4. **Biometric Auth**: Add fingerprint/face ID support
5. **SSO Integration**: Add enterprise SSO support

## Support

For issues or questions regarding authentication setup:
1. Check the test page at `/auth/test`
2. Review browser console for error messages
3. Verify AWS Cognito configuration
4. Check network requests in browser dev tools