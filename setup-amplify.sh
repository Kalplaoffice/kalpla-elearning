#!/bin/bash

# Kalpla E-Learning Platform - Amplify Setup Script
# Run this script to set up your Amplify backend

echo "🚀 Setting up Kalpla E-Learning Platform with AWS Amplify..."

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo "❌ Amplify CLI not found. Please install it first:"
    echo "npm install -g @aws-amplify/cli"
    exit 1
fi

# Check if user is logged in to AWS
if ! amplify status &> /dev/null; then
    echo "🔐 Please configure Amplify CLI first:"
    echo "amplify configure"
    exit 1
fi

echo "✅ Amplify CLI is configured"

# Initialize Amplify project
echo "📦 Initializing Amplify project..."
amplify init --yes

# Add Authentication
echo "🔐 Adding Authentication (Cognito)..."
amplify add auth --yes

# Add GraphQL API
echo "📊 Adding GraphQL API (AppSync + DynamoDB)..."
amplify add api --yes

# Add Storage
echo "💾 Adding Storage (S3)..."
amplify add storage --yes

# Add Lambda Function
echo "⚡ Adding Lambda Function for grading..."
amplify add function --yes

# Push all resources to AWS
echo "🚀 Deploying resources to AWS..."
amplify push --yes

echo "✅ Setup complete! Your Kalpla e-learning platform is ready."
echo ""
echo "Next steps:"
echo "1. Update the Amplify configuration in src/app/providers.tsx with your actual values"
echo "2. Create Cognito groups: Student, Mentor, Admin"
echo "3. Set up S3 bucket policies for file access"
echo "4. Configure your payment webhooks"
echo "5. Deploy to Amplify Hosting"
echo ""
echo "Happy coding! 🎉"
