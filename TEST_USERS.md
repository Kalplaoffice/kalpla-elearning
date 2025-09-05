# 🧪 Test User Accounts

This document contains test user accounts for different roles in the Kalpla e-learning platform.

## 🔐 Test User Credentials

### 1. 👨‍💼 LearnCap Academy Admin (Primary Admin)
- **Email**: `learncapacademy@gmail.com`
- **Password**: `Admin123!`
- **Role**: Admin
- **Permissions**: Full platform access, user management, course management, analytics
- **Features**: Can access admin dashboard, manage all users, create/edit courses, view analytics

### 2. 👨‍💼 Test Admin User
- **Email**: `admin@kalpla.com`
- **Password**: `Admin123!`
- **Role**: Admin
- **Permissions**: Full platform access, user management, course management, analytics
- **Features**: Can access admin dashboard, manage all users, create/edit courses, view analytics

### 3. 🎓 Regular Student
- **Email**: `student@kalpla.com`
- **Password**: `Student123!`
- **Role**: Student
- **Permissions**: Course access, assignments, basic community features
- **Features**: Can enroll in courses, submit assignments, access student dashboard

### 4. 👨‍🏫 Instructor
- **Email**: `instructor@kalpla.com`
- **Password**: `Instructor123!`
- **Role**: Instructor
- **Permissions**: Course creation, student management, content upload
- **Features**: Can create courses, manage enrolled students, upload content

### 5. 💎 12-Month Membership Student
- **Email**: `premium@kalpla.com`
- **Password**: `Premium123!`
- **Role**: Student (with premium membership)
- **Permissions**: All student features + premium community access
- **Features**: Full course access, premium community features, mentorship program, live classes

## 🚀 How to Create These Users

### Option 1: Manual Registration (Recommended)
1. Go to `/auth/register`
2. Use the email and password combinations above
3. The system will automatically assign the "Student" role by default
4. For Admin and Instructor roles, you'll need to update them in the AWS Cognito console

### Option 2: AWS Cognito Console
1. Go to AWS Cognito User Pool
2. Navigate to "Users" tab
3. Click "Create user"
4. Enter the email and temporary password
5. Set the custom attribute `custom:role` to the appropriate role
6. Mark email as verified

### Option 3: Programmatic Creation (Advanced)
Use the AWS CLI or SDK to create users programmatically:

```bash
# Example AWS CLI command (replace with your user pool ID)
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username admin@kalpla.com \
  --user-attributes Name=email,Value=admin@kalpla.com Name=custom:role,Value=Admin \
  --temporary-password Admin123! \
  --message-action SUPPRESS
```

## 🎯 Testing Scenarios

### Admin User Testing
- [ ] Login to admin dashboard
- [ ] Access user management
- [ ] Create/edit courses
- [ ] View analytics
- [ ] Manage community content

### Regular Student Testing
- [ ] Login to student dashboard
- [ ] Browse and enroll in courses
- [ ] Submit assignments
- [ ] Access basic community features
- [ ] View progress and certificates

### Instructor Testing
- [ ] Login to instructor dashboard
- [ ] Create new courses
- [ ] Upload course content
- [ ] Manage enrolled students
- [ ] Grade assignments

### Premium Student Testing
- [ ] Login to student dashboard
- [ ] Access premium community features
- [ ] Join mentorship program
- [ ] Access live classes
- [ ] Use advanced community tools

## 🔧 Role Configuration

### Custom Attributes in Cognito
- `custom:role`: "Admin", "Student", "Instructor"
- `custom:membership_type`: "basic", "premium", "12-month"
- `custom:subscription_status`: "active", "expired", "trial"

### Role-Based Access Control
- **Admin**: Full access to all features
- **Instructor**: Course creation and management
- **Student (Basic)**: Standard course access
- **Student (Premium)**: All student features + premium community

## 🚨 Important Notes

1. **Password Requirements**: All passwords must meet Cognito's password policy (8+ characters, mixed case, numbers, special characters)

2. **Email Verification**: Users need to verify their email addresses before full access

3. **Role Assignment**: The `custom:role` attribute determines user permissions

4. **Membership Status**: Premium features are controlled by the `custom:membership_type` attribute

5. **Testing Environment**: These are test accounts - do not use in production

## 🔄 Password Reset Testing

Test the password reset flow with any of these accounts:
1. Go to `/auth/forgot-password`
2. Enter the email address
3. Check email for verification code
4. Enter code and new password
5. Login with new credentials

## 📱 Mobile Testing

Test the responsive design and mobile functionality:
- Login on mobile devices
- Test course enrollment flow
- Verify dashboard responsiveness
- Test community features on mobile

---

**Last Updated**: $(date)
**Version**: 1.0
**Environment**: Development/Testing
