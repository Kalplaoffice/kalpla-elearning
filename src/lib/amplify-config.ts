import { Amplify } from 'aws-amplify';

// For development, we'll use a mock configuration
// In production, this would be replaced with actual AWS credentials
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-east-1_mock',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || 'mock_client_id',
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
      },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://mock-endpoint.com/graphql',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_S3_BUCKET || 'mock-bucket',
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
    },
  },
};

// Configure Amplify
Amplify.configure(amplifyConfig);

export default amplifyConfig;
