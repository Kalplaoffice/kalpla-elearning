# Kalpla - E-Learning Platform

A comprehensive e-learning platform built with Next.js 14, AWS Amplify, and modern web technologies. Features courses, 12-month mentorship programs, degree programs, blog, payments, leaderboard, and admin dashboard.

## 🚀 Features

### Core Features
- **Course Management**: Create, manage, and deliver online courses
- **Video Player**: Advanced video player with progress tracking
- **Drip Content**: Sequential, time-based, or date-based content release
- **Assignments & Grading**: Submit assignments and get graded by mentors
- **Leaderboard**: Gamified learning with points and badges
- **Mentorship Program**: 12-month structured mentorship
- **Degree Programs**: Accredited degree programs
- **Blog System**: Content management and publishing
- **Payment Integration**: Secure payment processing
- **Role-based Access**: Student, Mentor, and Admin roles

### Technical Features
- **Next.js 14**: App router, server components, and modern React
- **AWS Amplify**: Backend-as-a-Service with GraphQL API
- **Authentication**: AWS Cognito with role-based access
- **Storage**: S3 for videos, images, and file uploads
- **Database**: DynamoDB with GraphQL API
- **Serverless**: Lambda functions for business logic
- **CI/CD**: Automated deployment with Amplify Hosting
- **TypeScript**: Full type safety
- **Tailwind CSS**: Modern, responsive design

## 📁 Project Structure

```
src/
├── app/                          # Next.js 14 app router
│   ├── auth/                     # Authentication pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── verify/page.tsx
│   ├── courses/                  # Course-related pages
│   │   ├── page.tsx             # Course catalog
│   │   └── [courseId]/
│   │       ├── page.tsx         # Course details
│   │       ├── player/
│   │       │   └── [lessonId]/page.tsx
│   │       ├── reviews/page.tsx
│   │       └── resources/page.tsx
│   ├── programs/                 # Degree programs
│   │   ├── page.tsx
│   │   ├── [programId]/page.tsx
│   │   └── apply/page.tsx
│   ├── mentorship/               # Mentorship program
│   │   ├── page.tsx
│   │   ├── apply/page.tsx
│   │   └── leaderboard/page.tsx
│   ├── blog/                     # Blog system
│   │   ├── page.tsx
│   │   ├── [slug]/page.tsx
│   │   └── author/[authorId]/page.tsx
│   ├── dashboard/                # User dashboards
│   │   ├── student/             # Student dashboard
│   │   ├── mentor/              # Mentor dashboard
│   │   └── admin/               # Admin dashboard
│   ├── checkout/                 # Payment pages
│   │   ├── page.tsx
│   │   ├── success/page.tsx
│   │   └── failure/page.tsx
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── providers.tsx            # Amplify providers
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   ├── CoursePlayer.tsx         # Video player component
│   ├── Navbar.tsx               # Navigation
│   └── Footer.tsx               # Footer
├── lib/                         # Utilities
│   └── utils.ts
└── middleware.ts                # Route protection

amplify/                         # AWS Amplify configuration
├── backend/
│   ├── api/kalplaapi/
│   │   └── schema.graphql       # GraphQL schema
│   ├── function/gradeAssignmentPoints/
│   │   ├── src/index.js         # Lambda function
│   │   └── package.json
│   ├── auth/                    # Cognito configuration
│   └── storage/                 # S3 configuration
├── team-provider-info.json      # Environment config
└── backend-config.json          # Backend config
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- AWS Account
- Git

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd kalpla-elearning
npm install
```

### 2. Configure AWS Amplify
```bash
# Install Amplify CLI globally
npm install -g @aws-amplify/cli

# Configure AWS credentials
amplify configure

# Run the setup script
./setup-amplify.sh
```

### 3. Manual Amplify Setup (Alternative)
If you prefer manual setup:

```bash
# Initialize Amplify
amplify init

# Add Authentication
amplify add auth
# Choose: Default configuration with Social Provider (optional)
# Choose: Email

# Add GraphQL API
amplify add api
# Choose: GraphQL
# Choose: Cognito User Pool
# Choose: Single object with fields (e.g., "Todo" with id, name, description)
# Choose: Yes, with auth rules

# Add Storage
amplify add storage
# Choose: Content (Images, audio, video, etc.)
# Choose: Auth and guest users
# Choose: Create/Update, Read, Delete for Authenticated users
# Choose: Read for Guest users

# Add Lambda Function
amplify add function
# Choose: gradeAssignmentPoints
# Choose: Node.js
# Choose: Hello World function

# Deploy everything
amplify push
```

### 4. Update Configuration
After deployment, update `src/app/providers.tsx` with your actual Amplify configuration values from `amplify_outputs.json`.

### 5. Create Cognito Groups
In the AWS Cognito Console:
1. Go to User Pools → Your Pool → Groups
2. Create groups: `Student`, `Mentor`, `Admin`
3. Assign users to appropriate groups

### 6. Configure S3 Bucket Policies
Set up proper access rules for your S3 bucket:
- `public/` - Read access for all users
- `protected/{userId}/` - Read/write for owner, read for mentors/admin
- `private/{userId}/` - Read/write for owner only
- `videos/` - Read for enrolled students, write for mentors/admin
- `submissions/` - Write for students, read/write for mentors/admin

### 7. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application.

## 🚀 Deployment

### Deploy to Amplify Hosting
1. Push your code to GitHub
2. Go to AWS Amplify Console
3. Click "New app" → "Host web app"
4. Connect your GitHub repository
5. Select the branch (usually `main`)
6. Amplify will auto-detect Next.js and use the `amplify.yml` configuration
7. Deploy!

### Environment Variables
Set these in your Amplify app settings:
- `NEXT_PUBLIC_AMPLIFY_REGION`
- `NEXT_PUBLIC_AMPLIFY_USER_POOL_ID`
- `NEXT_PUBLIC_AMPLIFY_USER_POOL_WEB_CLIENT_ID`
- `NEXT_PUBLIC_AMPLIFY_GRAPHQL_ENDPOINT`

## 📊 GraphQL Schema

The platform uses a comprehensive GraphQL schema with the following main types:

- **User**: User profiles with roles and points
- **Course**: Course information and metadata
- **Module**: Course modules with lessons
- **Lesson**: Individual lessons with video/content
- **Enrollment**: Student course enrollments
- **LessonProgress**: Video watching progress
- **AssignmentSubmission**: Student assignments
- **LeaderboardEntry**: Points and rankings
- **BlogPost**: Blog content management
- **Payment**: Payment records

## 🔐 Authentication & Authorization

### Roles
- **Student**: Can enroll in courses, submit assignments, view progress
- **Mentor**: Can grade assignments, view student progress, manage content
- **Admin**: Full access to all features and data

### Route Protection
- Middleware protects `/dashboard/*` routes
- Client-side role checking on protected pages
- GraphQL schema enforces data access rules

## 🎥 Video Player Features

- Progress tracking with automatic saving
- Drip content release (sequential, time-based, date-based)
- Video controls and seeking
- Course navigation sidebar
- Completion tracking

## 💳 Payment Integration

The platform is designed to integrate with:
- Razorpay
- Stripe
- PayPal

Webhook endpoints handle payment confirmations and user enrollment.

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for styling
- Responsive video player
- Mobile-optimized dashboards

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Performance

- Next.js 14 optimizations
- Image optimization
- Code splitting
- CDN delivery via CloudFront
- Server-side rendering

## 🔧 Development

### Adding New Features
1. Create new pages in `src/app/`
2. Add GraphQL mutations/queries
3. Update the schema if needed
4. Add proper authentication/authorization
5. Test thoroughly

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Component-based architecture

## 📚 API Documentation

### GraphQL Operations
See `src/lib/graphql/` for all queries and mutations.

### Key Mutations
- `createEnrollment`: Enroll in a course
- `updateLessonProgress`: Track video progress
- `submitAssignment`: Submit assignments
- `finalizeGrade`: Grade assignments (mentors only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Live streaming integration
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Advanced assessment tools
- [ ] Certificate generation
- [ ] Integration with LMS systems

---

**Happy Learning! 🎓**