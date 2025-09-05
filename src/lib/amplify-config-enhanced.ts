import { Amplify } from 'aws-amplify';

// Enhanced Amplify configuration with social providers
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID || 'us-east-1_XXXXXXXXX',
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID || 'your-client-id',
      identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID || 'us-east-1:your-identity-pool-id',
      loginWith: {
        email: true,
        username: false,
        phone: false,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
        phone_number: {
          required: false,
        },
      },
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
      mfa: {
        status: 'optional',
        totpEnabled: true,
        smsEnabled: false,
      },
      // Social providers configuration
      socialProviders: {
        google: {
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
          scopes: ['email', 'profile'],
        },
        github: {
          clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 'your-github-client-id',
          scopes: ['user:email'],
        },
        linkedin: {
          clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || 'your-linkedin-client-id',
          scopes: ['r_liteprofile', 'r_emailaddress'],
        },
      },
      // OAuth configuration
      oauth: {
        domain: process.env.NEXT_PUBLIC_OAUTH_DOMAIN || 'your-domain.auth.us-east-1.amazoncognito.com',
        scope: ['email', 'openid', 'profile'],
        redirectSignIn: [
          process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN || 'http://localhost:3000/auth/callback',
          process.env.NEXT_PUBLIC_REDIRECT_SIGN_IN_PROD || 'https://your-domain.com/auth/callback',
        ],
        redirectSignOut: [
          process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT || 'http://localhost:3000/auth/login',
          process.env.NEXT_PUBLIC_REDIRECT_SIGN_OUT_PROD || 'https://your-domain.com/auth/login',
        ],
        responseType: 'code',
      },
      // Advanced settings
      allowGuestAccess: false,
      allowFederatedUsers: true,
      enableSMS: false,
      enableEmail: true,
      // Session configuration
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
      },
    },
  },
  // API configuration
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'your-graphql-endpoint',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
  // Storage configuration
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || 'your-s3-bucket',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
  // Analytics configuration
  Analytics: {
    Pinpoint: {
      appId: process.env.NEXT_PUBLIC_PINPOINT_APP_ID || 'your-pinpoint-app-id',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
  // Notifications configuration
  Notifications: {
    InAppMessaging: {
      appId: process.env.NEXT_PUBLIC_PINPOINT_APP_ID || 'your-pinpoint-app-id',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;
