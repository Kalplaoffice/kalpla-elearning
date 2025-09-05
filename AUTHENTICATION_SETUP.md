# 🔐 Enhanced Authentication Setup Guide

This guide covers the comprehensive authentication system with multiple auth options, social login, MFA, and enterprise features.

## 🎯 **Authentication Features**

### **1. Multiple Authentication Methods**
- ✅ **Email/Password Authentication**
- ✅ **Social Login** (Google, GitHub, LinkedIn)
- ✅ **Multi-Factor Authentication (MFA)**
- ✅ **Password Reset & Recovery**
- ✅ **Session Management**
- ✅ **Remember Me Functionality**

### **2. Security Features**
- ✅ **Strong Password Policies**
- ✅ **Email Verification**
- ✅ **Account Lockout Protection**
- ✅ **Session Timeout**
- ✅ **Token Refresh**
- ✅ **OAuth 2.0 / OpenID Connect**

### **3. User Experience**
- ✅ **Unified Auth UI**
- ✅ **Error Handling**
- ✅ **Loading States**
- ✅ **Responsive Design**
- ✅ **Accessibility Support**

## 🛠️ **Setup Instructions**

### **Step 1: AWS Cognito Configuration**

#### **1.1 Create User Pool**
```bash
# Create user pool with enhanced settings
aws cognito-idp create-user-pool \
  --pool-name "KalplaUserPool" \
  --policies '{
    "PasswordPolicy": {
      "MinimumLength": 8,
      "RequireUppercase": true,
      "RequireLowercase": true,
      "RequireNumbers": true,
      "RequireSymbols": true
    }
  }' \
  --schema '[
    {
      "Name": "email",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    },
    {
      "Name": "name",
      "AttributeDataType": "String",
      "Required": true,
      "Mutable": true
    }
  ]' \
  --auto-verified-attributes email \
  --mfa-configuration OPTIONAL \
  --mfa-configuration TOTP
```

#### **1.2 Create User Pool Client**
```bash
# Create app client with OAuth support
aws cognito-idp create-user-pool-client \
  --user-pool-id YOUR_USER_POOL_ID \
  --client-name "KalplaWebClient" \
  --generate-secret \
  --explicit-auth-flows USER_PASSWORD_AUTH ALLOW_USER_SRP_AUTH ALLOW_REFRESH_TOKEN_AUTH \
  --supported-identity-providers COGNITO Google GitHub LinkedIn \
  --callback-urls "http://localhost:3000/auth/callback" "https://your-domain.com/auth/callback" \
  --logout-urls "http://localhost:3000/auth/login" "https://your-domain.com/auth/login" \
  --allowed-oauth-flows code \
  --allowed-oauth-scopes email openid profile \
  --allowed-oauth-flows-user-pool-client
```

### **Step 2: Social Provider Setup**

#### **2.1 Google OAuth Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
6. Copy Client ID and Secret

#### **2.2 GitHub OAuth Setup**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set Authorization callback URL:
   - `https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
4. Copy Client ID and Secret

#### **2.3 LinkedIn OAuth Setup**
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create new app
3. Add OAuth 2.0 redirect URL:
   - `https://your-domain.auth.us-east-1.amazoncognito.com/oauth2/idpresponse`
4. Copy Client ID and Secret

### **Step 3: Environment Variables**

Create `.env.local` file:
```env
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=us-east-1
NEXT_PUBLIC_AWS_USER_POOL_ID=us-east-1_XXXXXXXXX
NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID=your-client-id
NEXT_PUBLIC_AWS_IDENTITY_POOL_ID=us-east-1:your-identity-pool-id

# OAuth Configuration
NEXT_PUBLIC_OAUTH_DOMAIN=your-domain.auth.us-east-1.amazoncognito.com
NEXT_PUBLIC_REDIRECT_SIGN_IN=http://localhost:3000/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT=http://localhost:3000/auth/login
NEXT_PUBLIC_REDIRECT_SIGN_IN_PROD=https://your-domain.com/auth/callback
NEXT_PUBLIC_REDIRECT_SIGN_OUT_PROD=https://your-domain.com/auth/login

# Social Provider Client IDs
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NEXT_PUBLIC_GITHUB_CLIENT_ID=your-github-client-id
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your-linkedin-client-id

# API Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://your-api-id.appsync-api.us-east-1.amazonaws.com/graphql

# Storage Configuration
NEXT_PUBLIC_S3_BUCKET=your-s3-bucket

# Analytics (Optional)
NEXT_PUBLIC_PINPOINT_APP_ID=your-pinpoint-app-id
```

### **Step 4: Cognito Identity Providers Setup**

#### **4.1 Add Google Identity Provider**
```bash
aws cognito-idp create-identity-provider \
  --user-pool-id YOUR_USER_POOL_ID \
  --provider-name Google \
  --provider-type Google \
  --provider-details '{
    "client_id": "your-google-client-id",
    "client_secret": "your-google-client-secret",
    "authorize_scopes": "email profile openid"
  }' \
  --attribute-mapping '{
    "email": "email",
    "name": "name",
    "username": "sub"
  }'
```

#### **4.2 Add GitHub Identity Provider**
```bash
aws cognito-idp create-identity-provider \
  --user-pool-id YOUR_USER_POOL_ID \
  --provider-name GitHub \
  --provider-type GitHub \
  --provider-details '{
    "client_id": "your-github-client-id",
    "client_secret": "your-github-client-secret",
    "authorize_scopes": "user:email"
  }' \
  --attribute-mapping '{
    "email": "email",
    "name": "name",
    "username": "id"
  }'
```

#### **4.3 Add LinkedIn Identity Provider**
```bash
aws cognito-idp create-identity-provider \
  --user-pool-id YOUR_USER_POOL_ID \
  --provider-name LinkedIn \
  --provider-type LinkedIn \
  --provider-details '{
    "client_id": "your-linkedin-client-id",
    "client_secret": "your-linkedin-client-secret",
    "authorize_scopes": "r_liteprofile r_emailaddress"
  }' \
  --attribute-mapping '{
    "email": "email",
    "name": "name",
    "username": "id"
  }'
```

## 🚀 **Usage Examples**

### **1. Basic Email Authentication**
```typescript
import { useAuth } from '@/contexts/EnhancedAuthContext';

function LoginComponent() {
  const { signInWithEmail, signUpWithEmail, user, loading, error } = useAuth();

  const handleSignIn = async (email: string, password: string) => {
    try {
      await signInWithEmail(email, password, true); // remember me
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    // Your UI components
  );
}
```

### **2. Social Authentication**
```typescript
import { useAuth } from '@/contexts/EnhancedAuthContext';

function SocialLoginComponent() {
  const { signInWithSocial } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      await signInWithSocial('google');
    } catch (error) {
      console.error('Google sign in failed:', error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
}
```

### **3. MFA Setup**
```typescript
import { useAuth } from '@/contexts/EnhancedAuthContext';

function MFAComponent() {
  const { enableMFA, verifyMFACode, user } = useAuth();

  const handleEnableMFA = async () => {
    try {
      await enableMFA();
      // Show QR code or setup instructions
    } catch (error) {
      console.error('MFA setup failed:', error);
    }
  };

  const handleVerifyMFA = async (code: string) => {
    try {
      await verifyMFACode(code);
    } catch (error) {
      console.error('MFA verification failed:', error);
    }
  };

  return (
    // MFA setup UI
  );
}
```

## 🔧 **Advanced Configuration**

### **1. Custom Password Policies**
```typescript
// In amplify-config-enhanced.ts
passwordFormat: {
  minLength: 12,
  requireLowercase: true,
  requireUppercase: true,
  requireNumbers: true,
  requireSpecialCharacters: true,
  temporaryPasswordValidityDays: 7,
}
```

### **2. Session Management**
```typescript
// Configure session timeouts
session: {
  refreshToken: {
    expiresIn: 30, // days
  },
  accessToken: {
    expiresIn: 1, // hour
  },
  idToken: {
    expiresIn: 1, // hour
  },
}
```

### **3. Custom Error Handling**
```typescript
// In authService.ts
private handleAuthError(error: any): AuthError {
  const errorMap = {
    'UserAlreadyAuthenticatedException': 'You are already signed in.',
    'NotAuthorizedException': 'Invalid credentials.',
    'UserNotConfirmedException': 'Please verify your email.',
    // Add more custom error messages
  };
  
  return {
    code: error.name || 'UnknownError',
    message: errorMap[error.name] || error.message,
    name: error.name || 'AuthError',
  };
}
```

## 🧪 **Testing**

### **1. Test User Creation**
```bash
# Create test users with different roles
npm run create-test-users
```

### **2. Social Login Testing**
- Use test accounts for each provider
- Test callback handling
- Verify user data mapping

### **3. MFA Testing**
- Enable MFA for test users
- Test TOTP code verification
- Test backup codes

## 📱 **Mobile Support**

The authentication system is fully responsive and works on:
- ✅ Desktop browsers
- ✅ Mobile browsers
- ✅ Progressive Web Apps (PWA)
- ✅ React Native (with Amplify)

## 🔒 **Security Best Practices**

1. **Environment Variables**: Never commit secrets to version control
2. **HTTPS Only**: Always use HTTPS in production
3. **Token Rotation**: Implement proper token refresh
4. **Rate Limiting**: Configure rate limits in Cognito
5. **Audit Logging**: Enable CloudTrail for audit logs
6. **MFA Enforcement**: Require MFA for admin users
7. **Session Management**: Implement proper session timeout

## 🚨 **Troubleshooting**

### **Common Issues**

1. **OAuth Redirect Mismatch**
   - Check callback URLs in Cognito
   - Verify domain configuration

2. **Social Login Not Working**
   - Verify client IDs and secrets
   - Check OAuth scopes

3. **MFA Issues**
   - Ensure TOTP is enabled in Cognito
   - Check user MFA settings

4. **Session Expiry**
   - Configure proper token refresh
   - Handle token refresh failures

### **Debug Mode**
Enable debug logging in development:
```typescript
// In amplify-config-enhanced.ts
Amplify.Logger.LOG_LEVEL = 'DEBUG';
```

## 📚 **Additional Resources**

- [AWS Cognito Documentation](https://docs.aws.amazon.com/cognito/)
- [Amplify Auth Documentation](https://docs.amplify.aws/react/build-a-backend/auth/)
- [OAuth 2.0 Specification](https://tools.ietf.org/html/rfc6749)
- [OpenID Connect Specification](https://openid.net/connect/)

---

This enhanced authentication system provides enterprise-grade security with multiple authentication options, making it suitable for both individual users and large organizations.
