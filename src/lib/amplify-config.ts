'use client';

import { Amplify } from 'aws-amplify';

// Enterprise-Grade AWS Amplify Configuration
// This configuration will be replaced with actual amplify_outputs.json when deployed

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-south-1_XXXXXXXXX',
      userPoolClientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      identityPoolId: 'ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      allowGuestAccess: true,
      oauth: {
        domain: 'kalpla-dev.auth.ap-south-1.amazoncognito.com',
        scope: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
        redirectSignIn: [
          'http://localhost:3000/',
          'https://main.d1234567890.amplifyapp.com/',
          'https://kalpla.com/'
        ],
        redirectSignOut: [
          'http://localhost:3000/',
          'https://main.d1234567890.amplifyapp.com/',
          'https://kalpla.com/'
        ],
        responseType: 'code',
      },
      loginWith: {
        email: true,
        phone: true,
        username: false,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
          mutable: true,
        },
        name: {
          required: true,
          mutable: true,
        },
        phone_number: {
          required: false,
          mutable: true,
        },
        'custom:role': {
          required: true,
          mutable: true,
        },
        'custom:points': {
          required: false,
          mutable: true,
        },
        'custom:level': {
          required: false,
          mutable: true,
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
        smsEnabled: true,
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: 'https://XXXXXXXXXXXXXX.appsync-api.ap-south-1.amazonaws.com/graphql',
      region: 'ap-south-1',
      apiKey: 'da2-XXXXXXXXXXXXXXXXXXXXXXXXXX',
      defaultAuthMode: 'userPool',
      additionalAuthTypes: [
        {
          mode: 'apiKey',
          apiKey: 'da2-XXXXXXXXXXXXXXXXXXXXXXXXXX',
        },
      ],
    },
  },
  Storage: {
    S3: {
      bucket: 'kalplaelearning-storage-XXXXXXXXX-dev',
      region: 'ap-south-1',
      identityPoolId: 'ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      customPrefix: {
        public: 'public/',
        protected: 'protected/{identity}/',
        private: 'private/{identity}/',
      },
    },
  },
  Notifications: {
    SNS: {
      region: 'ap-south-1',
      topics: {
        push: 'arn:aws:sns:ap-south-1:112914241644:kalpla-push-notifications',
        email: 'arn:aws:sns:ap-south-1:112914241644:kalpla-email-notifications',
        sms: 'arn:aws:sns:ap-south-1:112914241644:kalpla-sms-notifications',
        general: 'arn:aws:sns:ap-south-1:112914241644:kalplanotifications-dev',
      },
    },
  },
  Analytics: {
    Pinpoint: {
      appId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      region: 'ap-south-1',
      bufferSize: 1000,
      flushInterval: 5000,
      flushSize: 100,
      resendLimit: 5,
    },
  },
  Predictions: {
    identifyEntities: {
      identifyEntities: {
        region: 'ap-south-1',
        celebrityDetectionEnabled: true,
        maxEntities: 50,
        collectionId: 'kalpla-faces',
      },
    },
    identifyLabels: {
      identifyLabels: {
        region: 'ap-south-1',
        type: 'LABELS',
      },
    },
    convert: {
      speechGenerator: {
        region: 'ap-south-1',
        proxy: false,
        defaults: {
          voiceId: 'Joanna',
        },
      },
      transcription: {
        region: 'ap-south-1',
        proxy: false,
        defaults: {
          language: 'en-US',
        },
      },
    },
  },
  Interactions: {
    Lex: {
      'KalplaBot': {
        region: 'ap-south-1',
        botName: 'KalplaBot',
        alias: '$LATEST',
        contentType: 'text/plain; charset=utf-8',
      },
    },
  },
  XR: {
    Sumerian: {
      scenes: {
        'kalpla-3d-campus': {
          sceneConfig: {
            space: 'default',
            sceneId: 'kalpla-3d-campus',
          },
        },
      },
    },
  },
  Geo: {
    AmazonLocationService: {
      maps: {
        default: {
          style: 'VectorEsriStreets',
        },
        kalplaMap: {
          style: 'VectorEsriTopographic',
        },
      },
      search_indices: {
        default: {
          name: 'kalpla-places',
          region: 'ap-south-1',
        },
      },
      region: 'ap-south-1',
    },
  },
  // Custom configuration for enterprise features
  custom: {
    // Video streaming configuration
    video: {
      ivs: {
        region: 'ap-south-1',
        playbackUrl: 'https://XXXXXXXXXXXXXX.ivs.ap-south-1.amazonaws.com/',
        channelArn: 'arn:aws:ivs:ap-south-1:112914241644:channel/XXXXXXXXXXXXXX',
      },
      chime: {
        region: 'us-east-1', // Chime SDK is only available in us-east-1
        mediaRegion: 'us-east-1',
      },
    },
    // AI/ML services
    ai: {
      comprehend: {
        region: 'ap-south-1',
      },
      rekognition: {
        region: 'ap-south-1',
        collectionId: 'kalpla-faces',
      },
      polly: {
        region: 'ap-south-1',
        voiceId: 'Joanna',
      },
      transcribe: {
        region: 'ap-south-1',
        languageCode: 'en-US',
      },
    },
    // Payment processing
    payments: {
      stripe: {
        publishableKey: 'pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXX',
        webhookSecret: 'whsec_XXXXXXXXXXXXXXXXXXXXXXXXXX',
      },
      razorpay: {
        keyId: 'rzp_test_XXXXXXXXXXXXXXXXXXXXXXXXXX',
        keySecret: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
      },
    },
    // Email services
    email: {
      ses: {
        region: 'ap-south-1',
        fromEmail: 'noreply@kalpla.com',
        fromName: 'Kalpla Team',
      },
    },
    // CDN configuration
    cdn: {
      cloudFront: {
        distributionId: 'XXXXXXXXXXXXXX',
        domainName: 'dXXXXXXXXXXXXXX.cloudfront.net',
      },
    },
    // Feature flags
    features: {
      community: {
        enabled: true,
        premiumRequired: true,
      },
      mentorship: {
        enabled: true,
        maxMentors: 50,
      },
      liveClasses: {
        enabled: true,
        maxParticipants: 1000,
      },
      aiModeration: {
        enabled: true,
        confidenceThreshold: 0.8,
      },
      gamification: {
        enabled: true,
        pointsPerLesson: 10,
        pointsPerAssignment: 50,
        pointsPerCourse: 100,
      },
    },
    // Security settings
    security: {
      rateLimiting: {
        enabled: true,
        requestsPerMinute: 100,
      },
      contentSecurityPolicy: {
        enabled: true,
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'", "https://js.stripe.com"],
          'style-src': ["'self'", "'unsafe-inline'"],
          'img-src': ["'self'", "data:", "https:"],
          'connect-src': ["'self'", "https://api.stripe.com"],
        },
      },
    },
    // Monitoring and logging
    monitoring: {
      cloudWatch: {
        region: 'ap-south-1',
        logGroup: '/aws/amplify/kalpla-elearning',
      },
      xRay: {
        enabled: true,
        region: 'ap-south-1',
      },
    },
  },
};

// Configure Amplify with the comprehensive configuration
Amplify.configure(amplifyConfig);

// Export the configuration for use in other parts of the application
export default amplifyConfig;

// Export individual configurations for specific use cases
export const authConfig = amplifyConfig.Auth;
export const apiConfig = amplifyConfig.API;
export const storageConfig = amplifyConfig.Storage;
export const notificationsConfig = amplifyConfig.Notifications;
export const analyticsConfig = amplifyConfig.Analytics;
export const predictionsConfig = amplifyConfig.Predictions;
export const interactionsConfig = amplifyConfig.Interactions;
export const xrConfig = amplifyConfig.XR;
export const geoConfig = amplifyConfig.Geo;
export const customConfig = amplifyConfig.custom;