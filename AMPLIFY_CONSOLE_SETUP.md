# 🚀 AWS Amplify Console Setup (Easiest Method)

This is the **easiest and fastest** way to set up your backend. No CLI permissions needed!

## 📋 Step 1: Deploy Frontend to AWS Amplify

### 1.1 Go to AWS Amplify Console
1. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Choose **"GitHub"** as your source
4. Authorize GitHub if needed
5. Select your repository: `Kalplaoffice/kalpla-elearning`
6. Select branch: `main`

### 1.2 Configure Build Settings
Use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 1.3 Deploy
1. Click **"Save and deploy"**
2. Wait for deployment to complete (5-10 minutes)
3. Note your app URL: `https://main.dXXXXXXXXXX.amplifyapp.com`

## 📋 Step 2: Add Backend Services

### 2.1 Add Authentication
1. In your Amplify app, go to **"Backend"** tab
2. Click **"Add backend environment"**
3. Choose **"Create new environment"**
4. Name: `dev`
5. Click **"Create"**

### 2.2 Add Authentication Service
1. In the backend environment, click **"Add feature"**
2. Select **"Authentication"**
3. Choose **"Email"** as sign-in method
4. Configure:
   - **User pool name**: `kalpla-user-pool`
   - **User pool client name**: `kalpla-web-client`
   - **Required attributes**: Email, Name
   - **Custom attributes**: 
     - `role` (String)
     - `points` (Number)
     - `level` (Number)
5. Click **"Save and deploy"**

### 2.3 Add API Service
1. Click **"Add feature"** again
2. Select **"API"**
3. Choose **"GraphQL"**
4. Configure:
   - **API name**: `kalpla-api`
   - **Authorization mode**: Amazon Cognito User Pool
   - **Additional authorization**: API Key
5. Click **"Create"**

### 2.4 Add Storage Service
1. Click **"Add feature"** again
2. Select **"Storage"**
3. Choose **"Content (Images, audio, video, etc.)"**
4. Configure:
   - **Storage name**: `kalpla-storage`
   - **Access level**: Public, Protected, Private
5. Click **"Create"**

### 2.5 Add Function Service
1. Click **"Add feature"** again
2. Select **"Function"**
3. Choose **"Create new function"**
4. Configure:
   - **Function name**: `gradeAssignmentPoints`
   - **Runtime**: Node.js 18.x
5. Click **"Create"**

## 📋 Step 3: Configure Frontend

### 3.1 Get Configuration Values
1. In your Amplify app, go to **"Backend"** tab
2. Click on your environment
3. Note down the configuration values:
   - User Pool ID
   - User Pool Client ID
   - Identity Pool ID
   - GraphQL Endpoint
   - API Key
   - S3 Bucket Name

### 3.2 Update Environment Variables
1. In your Amplify app, go to **"App settings"** → **"Environment variables"**
2. Add these variables:
   ```
   NEXT_PUBLIC_USER_POOL_ID=ap-south-1_XXXXXXXXX
   NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID=XXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_IDENTITY_POOL_ID=ap-south-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://XXXXXXXXXXXXXX.appsync-api.ap-south-1.amazonaws.com/graphql
   NEXT_PUBLIC_GRAPHQL_API_KEY=da2-XXXXXXXXXXXXXXXXXXXXXXXXXX
   NEXT_PUBLIC_S3_BUCKET=kalpla-storage-XXXXXXXXX-dev
   NEXT_PUBLIC_S3_REGION=ap-south-1
   ```

### 3.3 Update Amplify Configuration
1. Go to your GitHub repository
2. Edit `src/lib/amplify-config.ts`
3. Replace the mock values with your real AWS values
4. Commit and push the changes

## 📋 Step 4: Test Your Backend

### 4.1 Test Authentication
1. Go to your deployed app URL
2. Navigate to `/auth/login`
3. Try creating a new account
4. Test login/logout functionality

### 4.2 Test API
1. Go to `/dashboard/student`
2. Check if the page loads without errors
3. Test any API calls

### 4.3 Test Storage
1. Try uploading a file
2. Check if it appears in your S3 bucket

## 📋 Step 5: Add More Services (Optional)

### 5.1 Add Analytics
1. In Amplify Console, go to **"Backend"**
2. Click **"Add feature"**
3. Select **"Analytics"**
4. Choose **"Amazon Pinpoint"**
5. Configure and deploy

### 5.2 Add Notifications
1. Click **"Add feature"**
2. Select **"Notifications"**
3. Choose **"Amazon SNS"**
4. Configure and deploy

### 5.3 Add AI/ML Services
1. Click **"Add feature"**
2. Select **"Predictions"**
3. Choose the AI services you need
4. Configure and deploy

## 🎯 Benefits of This Approach

✅ **No CLI permissions needed**
✅ **Visual interface for all setup**
✅ **Automatic deployment and updates**
✅ **Built-in monitoring and logging**
✅ **Easy to scale and manage**
✅ **Integrated with AWS services**

## 📊 Cost Estimation

**Monthly costs:**
- Amplify Hosting: Free (up to 1000 build minutes)
- Cognito: Free (up to 50,000 MAUs)
- DynamoDB: ~$5-10
- S3: ~$2-5
- Lambda: ~$1-3
- AppSync: ~$5-10

**Total: ~$15-30/month for development**

## 🚀 Next Steps

1. Follow the steps above
2. Test all functionality
3. Configure custom domain
4. Set up monitoring
5. Deploy to production

## 🆘 Need Help?

- **AWS Amplify Documentation**: https://docs.amplify.aws/
- **AWS Console**: https://console.aws.amazon.com/amplify/
- **GitHub Repository**: https://github.com/Kalplaoffice/kalpla-elearning

This approach gives you the same enterprise-grade backend with a much simpler setup process!
