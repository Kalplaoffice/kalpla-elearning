# 🚀 Manual AWS Backend Setup Guide

Since your AWS user has limited permissions for Amplify CLI, we'll set up the backend manually using the AWS Console. This approach will give you full control and the same enterprise-grade backend.

## 📋 Prerequisites

- AWS Account with admin access (or user with necessary permissions)
- Access to AWS Console
- Your project already has the frontend code

## 🏗️ Step-by-Step Backend Setup

### 1. **Amazon Cognito User Pool Setup**

#### Go to AWS Console → Cognito → User Pools → Create User Pool

**Basic Configuration:**
- **Pool name**: `kalpla-user-pool`
- **Step-through settings**: Choose "Step through settings"

**Sign-in options:**
- ✅ Email
- ✅ Username (optional)

**Password policy:**
- Minimum length: 8
- ✅ Require uppercase letters
- ✅ Require lowercase letters  
- ✅ Require numbers
- ✅ Require symbols

**Multi-factor authentication:**
- ✅ MFA required
- ✅ SMS text message
- ✅ Time-based one-time password (TOTP)

**User account recovery:**
- ✅ Self-service account recovery
- ✅ Email only

**Required attributes:**
- ✅ email
- ✅ name
- ✅ Custom attributes:
  - `role` (String, Mutable)
  - `points` (Number, Mutable)
  - `level` (Number, Mutable)

**App clients:**
- **App client name**: `kalpla-web-client`
- ✅ Generate client secret: No
- ✅ Enable SRP (Secure Remote Password) protocol based authentication
- ✅ Enable username-password based authentication

**Hosted authentication pages:**
- ✅ Use the Cognito Hosted UI
- **Domain**: `kalpla-dev` (or your preferred domain)
- **Callback URLs**: 
  - `http://localhost:3000/`
  - `https://your-domain.com/`
- **Sign-out URLs**:
  - `http://localhost:3000/`
  - `https://your-domain.com/`

**User groups:**
- **Group name**: `Students`
- **Group name**: `Mentors`  
- **Group name**: `Admins`
- **Group name**: `Moderators`

### 2. **Amazon Cognito Identity Pool Setup**

#### Go to AWS Console → Cognito → Identity Pools → Create Identity Pool

**Basic Configuration:**
- **Identity pool name**: `kalpla-identity-pool`
- ✅ Enable access to unauthenticated identities
- **Authentication providers**:
  - **Cognito**: Select your user pool and app client

### 3. **Amazon DynamoDB Tables Setup**

#### Go to AWS Console → DynamoDB → Tables → Create Table

Create these tables with the following configuration:

**Table 1: Users**
- **Table name**: `Users`
- **Partition key**: `id` (String)
- **Sort key**: None
- **Settings**: On-demand

**Table 2: Courses**
- **Table name**: `Courses`
- **Partition key**: `id` (String)
- **Sort key**: None
- **Settings**: On-demand

**Table 3: Enrollments**
- **Table name**: `Enrollments`
- **Partition key**: `id` (String)
- **Sort key**: None
- **Settings**: On-demand

**Table 4: Assignments**
- **Table name**: `Assignments`
- **Partition key**: `id` (String)
- **Sort key**: None
- **Settings**: On-demand

**Table 5: CommunityPosts**
- **Table name**: `CommunityPosts`
- **Partition key**: `id` (String)
- **Sort key**: None
- **Settings**: On-demand

### 4. **Amazon S3 Bucket Setup**

#### Go to AWS Console → S3 → Create Bucket

**Basic Configuration:**
- **Bucket name**: `kalpla-storage-[random-suffix]`
- **Region**: ap-south-1
- **Block Public Access**: Uncheck "Block all public access"
- ✅ I acknowledge that the current settings might result in this bucket and objects becoming public

**Bucket Policy:**
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::kalpla-storage-[your-bucket-name]/*"
        }
    ]
}
```

### 5. **AWS Lambda Functions Setup**

#### Go to AWS Console → Lambda → Create Function

**Function 1: gradeAssignmentPoints**
- **Function name**: `gradeAssignmentPoints`
- **Runtime**: Node.js 18.x
- **Architecture**: x86_64
- **Execution role**: Create new role with basic Lambda permissions

**Function 2: joinVoiceChannel**
- **Function name**: `joinVoiceChannel`
- **Runtime**: Node.js 18.x
- **Architecture**: x86_64
- **Execution role**: Create new role with basic Lambda permissions

**Function 3: contentModeration**
- **Function name**: `contentModeration`
- **Runtime**: Node.js 18.x
- **Architecture**: x86_64
- **Execution role**: Create new role with basic Lambda permissions

**Function 4: sendNotification**
- **Function name**: `sendNotification`
- **Runtime**: Node.js 18.x
- **Architecture**: x86_64
- **Execution role**: Create new role with basic Lambda permissions

### 6. **Amazon SNS Topics Setup**

#### Go to AWS Console → SNS → Topics → Create Topic

**Topic 1: General Notifications**
- **Topic name**: `kalpla-notifications`
- **Type**: Standard

**Topic 2: Push Notifications**
- **Topic name**: `kalpla-push-notifications`
- **Type**: Standard

**Topic 3: Email Notifications**
- **Topic name**: `kalpla-email-notifications`
- **Type**: Standard

### 7. **Amazon AppSync API Setup**

#### Go to AWS Console → AppSync → Create API

**API Configuration:**
- **API name**: `kalpla-api`
- **API type**: GraphQL
- **Authentication type**: Amazon Cognito User Pool
- **User Pool**: Select your created user pool
- **App Client**: Select your created app client
- **Additional authentication types**: API Key

**Schema:**
Copy the schema from `amplify/backend/api/kalplaapi/schema.graphql`

### 8. **CloudFront Distribution Setup**

#### Go to AWS Console → CloudFront → Create Distribution

**Origin Configuration:**
- **Origin Domain**: Your S3 bucket domain
- **Origin Path**: `/public`
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE

**Cache Behavior:**
- **Path Pattern**: Default (*)
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Cache Policy**: CachingOptimized

### 9. **IAM Roles and Policies**

#### Go to AWS Console → IAM → Roles → Create Role

**Role 1: Lambda Execution Role**
- **Role name**: `kalpla-lambda-execution-role`
- **Trusted entity**: AWS Lambda
- **Permissions**: 
  - AWSLambdaBasicExecutionRole
  - AmazonDynamoDBFullAccess
  - AmazonS3FullAccess
  - AmazonSNSFullAccess
  - AmazonComprehendFullAccess

**Role 2: Cognito Identity Pool Role**
- **Role name**: `kalpla-cognito-identity-role`
- **Trusted entity**: Cognito Identity Pool
- **Permissions**:
  - AmazonS3ReadOnlyAccess
  - AmazonDynamoDBReadOnlyAccess

### 10. **Environment Configuration**

After setting up all the AWS resources, create a `.env.local` file with your actual values:

```env
# AWS Configuration
NEXT_PUBLIC_AWS_REGION=ap-south-1

# Cognito Configuration
NEXT_PUBLIC_USER_POOL_ID=ap-south-1_XXXXXXXXX
NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_IDENTITY_POOL_ID=ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# AppSync Configuration
NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://XXXXXXXXXXXXXX.appsync-api.ap-south-1.amazonaws.com/graphql
NEXT_PUBLIC_GRAPHQL_API_KEY=da2-XXXXXXXXXXXXXXXXXXXXXXXXXX

# S3 Configuration
NEXT_PUBLIC_S3_BUCKET=kalpla-storage-[your-bucket-name]
NEXT_PUBLIC_S3_REGION=ap-south-1

# CloudFront Configuration
NEXT_PUBLIC_CDN_DOMAIN=dXXXXXXXXXXXXXX.cloudfront.net
```

## 🔧 Alternative: Use AWS Amplify Console

If you prefer a more automated approach:

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings
5. Deploy the app
6. Add backend services through the console

## 📊 Cost Estimation

**Monthly costs for development:**
- DynamoDB: ~$5-10
- S3: ~$2-5
- Lambda: ~$1-3
- Cognito: Free (up to 50,000 MAUs)
- AppSync: ~$5-10
- CloudFront: ~$1-5

**Total: ~$15-35/month for development**

## 🚀 Next Steps

1. Follow the steps above to create all AWS resources
2. Update your `.env.local` file with actual values
3. Test the authentication flow
4. Deploy your frontend to AWS Amplify Hosting
5. Configure custom domain and SSL

## 🆘 Need Help?

If you encounter any issues:
1. Check AWS CloudTrail for error logs
2. Verify IAM permissions
3. Ensure all resources are in the same region
4. Test each service individually

This manual setup will give you the same enterprise-grade backend as the Amplify CLI, with full control over all resources.
