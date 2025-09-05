#!/bin/bash

# Script to push the Kalpla E-learning platform to GitHub
# This script will commit all changes and push to the remote repository

echo "🚀 Pushing Kalpla E-learning platform to GitHub..."

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Not in a git repository. Initializing..."
    git init
    git remote add origin https://github.com/jnaneshshetty/kalpla-elearning.git
fi

# Add all files
echo "📁 Adding all files..."
git add .

# Check if there are any changes to commit
if git diff --staged --quiet; then
    echo "✅ No changes to commit. Repository is up to date."
    exit 0
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "feat: Complete e-learning platform with live backend integration

- ✅ Real AWS Amplify backend with Cognito, GraphQL API, S3 storage
- ✅ Comprehensive course creation system with 70+ features
- ✅ Live data integration for all pages
- ✅ Advanced video player with notes, bookmarks, subtitles
- ✅ Curriculum builder with drag-and-drop functionality
- ✅ Pricing and monetization management
- ✅ Course analytics dashboard
- ✅ Student and admin dashboards with live data
- ✅ Community platform features
- ✅ Mobile-responsive design with accent colors
- ✅ Production-ready architecture

Backend Services:
- Amazon Cognito for authentication
- AWS AppSync GraphQL API
- DynamoDB for data storage
- S3 for file storage
- Lambda functions for business logic
- CloudFront CDN for content delivery

Frontend Features:
- Next.js 15 with TypeScript
- Tailwind CSS with custom accent colors
- Shadcn/ui components
- Real-time data fetching
- Responsive design
- PWA capabilities"

# Push to GitHub
echo "🌐 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 Repository: https://github.com/jnaneshshetty/kalpla-elearning"
    echo ""
    echo "🎉 Your e-learning platform is now live on GitHub!"
    echo "📱 Next steps:"
    echo "   1. Deploy to AWS Amplify Hosting"
    echo "   2. Configure custom domain"
    echo "   3. Set up production environment variables"
    echo "   4. Test all features with real data"
else
    echo "❌ Failed to push to GitHub. Please check your credentials and try again."
    exit 1
fi
