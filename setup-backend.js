#!/usr/bin/env node

/**
 * AWS Backend Setup Helper Script
 * This script helps you set up the AWS backend manually
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 AWS Backend Setup Helper');
console.log('============================\n');

const questions = [
  {
    key: 'userPoolId',
    question: 'Enter your Cognito User Pool ID (ap-south-1_XXXXXXXXX): ',
    validate: (input) => input.startsWith('ap-south-1_') && input.length > 20
  },
  {
    key: 'userPoolClientId',
    question: 'Enter your Cognito User Pool Client ID: ',
    validate: (input) => input.length > 20
  },
  {
    key: 'identityPoolId',
    question: 'Enter your Cognito Identity Pool ID (ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx): ',
    validate: (input) => input.startsWith('ap-south-1:') && input.length > 30
  },
  {
    key: 'graphqlEndpoint',
    question: 'Enter your AppSync GraphQL Endpoint: ',
    validate: (input) => input.includes('appsync-api') && input.startsWith('https://')
  },
  {
    key: 'graphqlApiKey',
    question: 'Enter your AppSync API Key: ',
    validate: (input) => input.startsWith('da2-') && input.length > 20
  },
  {
    key: 's3Bucket',
    question: 'Enter your S3 Bucket name: ',
    validate: (input) => input.length > 5
  },
  {
    key: 'cloudFrontDomain',
    question: 'Enter your CloudFront domain (optional): ',
    validate: (input) => input.length === 0 || input.includes('cloudfront.net')
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateConfig();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    if (question.validate(answer)) {
      answers[question.key] = answer;
      askQuestion(index + 1);
    } else {
      console.log('❌ Invalid input. Please try again.\n');
      askQuestion(index);
    }
  });
}

function generateConfig() {
  console.log('\n📝 Generating configuration files...\n');

  // Generate .env.local
  const envContent = `# AWS Configuration
NEXT_PUBLIC_AWS_REGION=ap-south-1

# Cognito Configuration
NEXT_PUBLIC_USER_POOL_ID=${answers.userPoolId}
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=${answers.userPoolClientId}
NEXT_PUBLIC_IDENTITY_POOL_ID=${answers.identityPoolId}

# AppSync Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT=${answers.graphqlEndpoint}
NEXT_PUBLIC_GRAPHQL_API_KEY=${answers.graphqlApiKey}

# S3 Configuration
NEXT_PUBLIC_S3_BUCKET=${answers.s3Bucket}
NEXT_PUBLIC_S3_REGION=ap-south-1

# CloudFront Configuration
NEXT_PUBLIC_CDN_DOMAIN=${answers.cloudFrontDomain || 'dXXXXXXXXXXXXXX.cloudfront.net'}

# Feature Flags
NEXT_PUBLIC_COMMUNITY_ENABLED=true
NEXT_PUBLIC_MENTORSHIP_ENABLED=true
NEXT_PUBLIC_LIVE_CLASSES_ENABLED=true
NEXT_PUBLIC_AI_MODERATION_ENABLED=true
NEXT_PUBLIC_GAMIFICATION_ENABLED=true
`;

  fs.writeFileSync('.env.local', envContent);
  console.log('✅ Created .env.local');

  // Generate amplify-config.ts
  const configContent = `'use client';

import { Amplify } from 'aws-amplify';

// Real AWS Amplify Configuration
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: '${answers.userPoolId}',
      userPoolClientId: '${answers.userPoolClientId}',
      identityPoolId: '${answers.identityPoolId}',
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
      endpoint: '${answers.graphqlEndpoint}',
      region: 'ap-south-1',
      apiKey: '${answers.graphqlApiKey}',
      defaultAuthMode: 'userPool',
      additionalAuthTypes: [
        {
          mode: 'apiKey',
          apiKey: '${answers.graphqlApiKey}',
        },
      ],
    },
  },
  Storage: {
    S3: {
      bucket: '${answers.s3Bucket}',
      region: 'ap-south-1',
      identityPoolId: '${answers.identityPoolId}',
      customPrefix: {
        public: 'public/',
        protected: 'protected/{identity}/',
        private: 'private/{identity}/',
      },
    },
  },
};

// Configure Amplify with the real configuration
Amplify.configure(amplifyConfig);

export default amplifyConfig;
`;

  fs.writeFileSync('src/lib/amplify-config.ts', configContent);
  console.log('✅ Updated src/lib/amplify-config.ts');

  // Generate deployment checklist
  const checklistContent = `# AWS Backend Deployment Checklist

## ✅ Completed Steps

- [x] Cognito User Pool: ${answers.userPoolId}
- [x] Cognito Identity Pool: ${answers.identityPoolId}
- [x] AppSync API: ${answers.graphqlEndpoint}
- [x] S3 Bucket: ${answers.s3Bucket}
- [x] Configuration files generated

## 🔄 Next Steps

1. **Test Authentication**
   \`\`\`bash
   npm run dev
   \`\`\`
   - Go to http://localhost:3000/auth/login
   - Try creating an account
   - Test login/logout

2. **Deploy Frontend**
   \`\`\`bash
   npm run build
   \`\`\`
   - Build should complete without errors
   - Test all pages

3. **Set up AWS Amplify Hosting**
   - Go to AWS Amplify Console
   - Connect your GitHub repository
   - Deploy the app

4. **Configure Custom Domain**
   - Add your domain in Amplify Console
   - Update CORS settings
   - Test production deployment

## 🧪 Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] User logout works
- [ ] Protected routes work
- [ ] File uploads work
- [ ] API calls work
- [ ] Real-time features work

## 📊 Monitoring

- Check CloudWatch logs
- Monitor DynamoDB metrics
- Check S3 usage
- Monitor Lambda invocations

## 🆘 Troubleshooting

If you encounter issues:
1. Check browser console for errors
2. Check AWS CloudTrail for API errors
3. Verify IAM permissions
4. Check CORS settings
5. Verify environment variables

## 📞 Support

- AWS Documentation: https://docs.aws.amazon.com/
- Amplify Documentation: https://docs.amplify.aws/
- Project Repository: https://github.com/Kalplaoffice/kalpla-elearning
`;

  fs.writeFileSync('DEPLOYMENT_CHECKLIST.md', checklistContent);
  console.log('✅ Created DEPLOYMENT_CHECKLIST.md');

  console.log('\n🎉 Configuration complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Test authentication at http://localhost:3000/auth/login');
  console.log('3. Follow the checklist in DEPLOYMENT_CHECKLIST.md');
  console.log('\n🚀 Your backend is ready to use!');

  rl.close();
}

// Start the setup process
askQuestion(0);
