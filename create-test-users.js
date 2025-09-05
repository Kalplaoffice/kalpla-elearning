#!/usr/bin/env node

/**
 * Test User Creation Script for Kalpla E-learning Platform
 * 
 * This script creates test users with different roles for development and testing.
 * Run this script after setting up your AWS Amplify backend.
 */

const { Amplify } = require('aws-amplify');
const { signUp, confirmSignUp } = require('aws-amplify/auth');

// Import your amplify configuration
const awsconfig = require('./src/lib/amplify-config').default;

// Configure Amplify
Amplify.configure(awsconfig);

const testUsers = [
  {
    email: 'admin@kalpla.com',
    password: 'Admin123!',
    name: 'Admin User',
    role: 'Admin',
    membershipType: 'admin',
    description: 'Full platform administrator'
  },
  {
    email: 'student@kalpla.com',
    password: 'Student123!',
    name: 'Regular Student',
    role: 'Student',
    membershipType: 'basic',
    description: 'Standard student account'
  },
  {
    email: 'instructor@kalpla.com',
    password: 'Instructor123!',
    name: 'Course Instructor',
    role: 'Instructor',
    membershipType: 'instructor',
    description: 'Course creator and instructor'
  },
  {
    email: 'premium@kalpla.com',
    password: 'Premium123!',
    name: 'Premium Student',
    role: 'Student',
    membershipType: 'premium',
    description: '12-month membership student with premium features'
  }
];

async function createTestUser(user) {
  try {
    console.log(`\n🔧 Creating user: ${user.name} (${user.email})`);
    
    const { isSignUpComplete, nextStep } = await signUp({
      username: user.email,
      password: user.password,
      options: {
        userAttributes: {
          email: user.email,
          name: user.name,
          'custom:role': user.role,
          'custom:membership_type': user.membershipType,
          'custom:subscription_status': 'active'
        },
        autoSignIn: {
          enabled: false // We'll confirm manually
        }
      }
    });

    if (isSignUpComplete) {
      console.log(`✅ User ${user.name} created successfully!`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Membership: ${user.membershipType}`);
    } else {
      console.log(`⚠️  User ${user.name} created but needs confirmation`);
      console.log(`   Next step: ${nextStep.signUpStep}`);
      
      // For development, we'll auto-confirm
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        try {
          await confirmSignUp({
            username: user.email,
            confirmationCode: '123456' // This might need to be updated based on your Cognito settings
          });
          console.log(`✅ User ${user.name} confirmed successfully!`);
        } catch (confirmError) {
          console.log(`❌ Failed to confirm user ${user.name}:`, confirmError.message);
          console.log(`   Manual confirmation required in AWS Cognito console`);
        }
      }
    }
  } catch (error) {
    if (error.name === 'UsernameExistsException') {
      console.log(`⚠️  User ${user.name} already exists`);
    } else {
      console.log(`❌ Failed to create user ${user.name}:`, error.message);
    }
  }
}

async function createAllTestUsers() {
  console.log('🚀 Starting test user creation process...\n');
  console.log('📋 Test Users to be created:');
  testUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.description}`);
  });

  console.log('\n' + '='.repeat(60));
  
  for (const user of testUsers) {
    await createTestUser(user);
    // Add a small delay between user creations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Test user creation process completed!');
  console.log('\n📝 Next Steps:');
  console.log('1. Check AWS Cognito console for any users that need manual confirmation');
  console.log('2. Update user roles if needed (custom:role attribute)');
  console.log('3. Test login with each account');
  console.log('4. Verify role-based access control');
  
  console.log('\n🔗 Useful Links:');
  console.log('- Login Page: http://localhost:3000/auth/login');
  console.log('- Registration Page: http://localhost:3000/auth/register');
  console.log('- Student Dashboard: http://localhost:3000/dashboard/student');
  console.log('- Admin Dashboard: http://localhost:3000/dashboard/admin');
}

// Run the script
if (require.main === module) {
  createAllTestUsers().catch(console.error);
}

module.exports = { createTestUsers, testUsers };
