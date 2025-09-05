# 🎥 AWS Live Classes Integration Guide

This guide explains how to integrate AWS services with Amplify to build a production-ready live class system.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   AWS Amplify   │    │   AWS Services  │
│                 │    │                 │    │                 │
│ • Live Classes  │◄──►│ • Auth (Cognito)│◄──►│ • Chime SDK     │
│ • Dashboard     │    │ • API (AppSync) │    │ • IVS           │
│ • Course Player │    │ • Storage (S3)  │    │ • S3            │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 AWS Services Integration

### 1. Amazon Chime SDK (Interactive Classes)
**Use Case:** Small to medium interactive classes (up to 50 participants)
**Features:** Video, audio, screen sharing, chat, raise hand, breakout rooms

```typescript
// Chime Integration Example
import { ChimeSDK } from 'aws-sdk';

const chimeClient = new ChimeSDK.ChimeClient({
  region: 'us-east-1'
});

// Create meeting room
const createMeeting = async (classId: string) => {
  const meeting = await chimeClient.createMeeting({
    ClientRequestToken: classId,
    MediaRegion: 'us-east-1'
  }).promise();
  
  return meeting;
};

// Join meeting
const joinMeeting = async (meetingId: string, attendeeId: string) => {
  const attendee = await chimeClient.createAttendee({
    MeetingId: meetingId,
    ExternalUserId: attendeeId
  }).promise();
  
  return attendee;
};
```

### 2. Amazon IVS (Interactive Video Service)
**Use Case:** Large broadcast-style classes (1000+ participants)
**Features:** Ultra-low latency streaming, live polls, chat, emoji reactions

```typescript
// IVS Integration Example
import { IVS } from 'aws-sdk';

const ivsClient = new IVS({
  region: 'us-east-1'
});

// Create channel
const createChannel = async (classId: string) => {
  const channel = await ivsClient.createChannel({
    name: `live-class-${classId}`,
    type: 'STANDARD',
    latencyMode: 'LOW'
  }).promise();
  
  return channel;
};

// Get stream key
const getStreamKey = async (channelArn: string) => {
  const streamKey = await ivsClient.createStreamKey({
    channelArn: channelArn
  }).promise();
  
  return streamKey;
};
```

## 📊 GraphQL Schema Updates

Add these types to your `schema.graphql`:

```graphql
type LiveClass @model @auth(rules: [
  { allow: public, operations: [read] },
  { allow: groups, groups: ["Admin", "Mentor"], operations: [create, update, delete] }
]) {
  id: ID!
  title: String!
  description: String
  instructorId: ID! @index(name: "byInstructor")
  instructor: User @hasOne(fields: ["instructorId"])
  
  # Scheduling
  startTime: AWSDateTime!
  endTime: AWSDateTime!
  duration: Int! # in minutes
  
  # AWS Integration
  awsService: AWSService! # CHIME or IVS
  chimeRoomId: String
  ivsChannelArn: String
  recordingS3Key: String
  
  # Access Control
  requiresEnrollment: Boolean!
  accessLevel: AccessLevel!
  maxParticipants: Int!
  currentParticipants: Int!
  
  # Class Details
  category: String!
  level: ClassLevel!
  price: Float!
  isFree: Boolean!
  tags: [String!]!
  
  # Status
  status: ClassStatus!
  isLive: Boolean!
  isUpcoming: Boolean!
  
  # Notifications
  reminderSent: Boolean!
  nextReminder: AWSDateTime
  
  # Relationships
  enrollments: [LiveClassEnrollment!]! @hasMany(indexName: "byLiveClass")
  recordings: [LiveClassRecording!]! @hasMany(indexName: "byLiveClass")
  
  createdAt: AWSDateTime!
  updatedAt: AWSDateTime!
}

type LiveClassEnrollment @model @auth(rules: [
  { allow: owner },
  { allow: groups, groups: ["Admin", "Mentor"], operations: [read] }
]) @index(name: "byLiveClass", fields: ["liveClassId"])
@index(name: "byUser", fields: ["userId"]) {
  id: ID!
  userId: ID!
  user: User @hasOne(fields: ["userId"])
  liveClassId: ID!
  liveClass: LiveClass @hasOne(fields: ["liveClassId"])
  
  enrolledAt: AWSDateTime!
  attended: Boolean
  attendanceDuration: Int # in minutes
  feedback: String
  rating: Int # 1-5 stars
}

type LiveClassRecording @model @auth(rules: [
  { allow: groups, groups: ["Admin", "Mentor"], operations: [create, update, delete] },
  { allow: private, operations: [read] }
]) @index(name: "byLiveClass", fields: ["liveClassId"]) {
  id: ID!
  liveClassId: ID!
  liveClass: LiveClass @hasOne(fields: ["liveClassId"])
  
  s3Key: String!
  s3Bucket: String!
  duration: Int! # in seconds
  thumbnailUrl: String
  transcriptUrl: String
  
  createdAt: AWSDateTime!
}

enum AWSService {
  CHIME
  IVS
}

enum AccessLevel {
  STUDENT
  MENTOR
  ADMIN
}

enum ClassLevel {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

enum ClassStatus {
  SCHEDULED
  LIVE
  ENDED
  CANCELLED
}
```

## 🔐 Authentication & Access Control

### Cognito Integration
```typescript
// Check user enrollment before joining
const checkEnrollment = async (userId: string, liveClassId: string) => {
  const enrollment = await API.graphql({
    query: getLiveClassEnrollment,
    variables: { userId, liveClassId }
  });
  
  return enrollment.data.getLiveClassEnrollment;
};

// Generate temporary access token
const generateAccessToken = async (userId: string, liveClassId: string) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  
  // Add custom claims for live class access
  const customToken = await API.graphql({
    query: generateLiveClassToken,
    variables: { userId, liveClassId, token }
  });
  
  return customToken.data.generateLiveClassToken;
};
```

## 📱 Frontend Integration

### Live Class Component
```typescript
// components/LiveClassPlayer.tsx
import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

interface LiveClassPlayerProps {
  liveClass: LiveClass;
  onJoin: () => void;
}

export default function LiveClassPlayer({ liveClass, onJoin }: LiveClassPlayerProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const getAccessToken = async () => {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();
      setAccessToken(token);
    };
    
    getAccessToken();
  }, []);

  const handleJoin = async () => {
    setIsJoining(true);
    
    try {
      if (liveClass.awsService === 'CHIME') {
        await joinChimeMeeting(liveClass.chimeRoomId, accessToken);
      } else if (liveClass.awsService === 'IVS') {
        await joinIVSStream(liveClass.ivsChannelArn, accessToken);
      }
      
      onJoin();
    } catch (error) {
      console.error('Failed to join live class:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="live-class-player">
      {liveClass.awsService === 'CHIME' ? (
        <ChimeMeetingPlayer 
          meetingId={liveClass.chimeRoomId}
          accessToken={accessToken}
        />
      ) : (
        <IVSPlayer 
          channelArn={liveClass.ivsChannelArn}
          accessToken={accessToken}
        />
      )}
    </div>
  );
}
```

## 🔔 Notifications Integration

### SNS/SES Integration
```typescript
// Lambda function for sending reminders
export const sendLiveClassReminder = async (event) => {
  const { liveClassId, reminderType } = event.arguments;
  
  // Get live class details
  const liveClass = await getLiveClass(liveClassId);
  
  // Get enrolled students
  const enrollments = await getLiveClassEnrollments(liveClassId);
  
  // Send notifications
  for (const enrollment of enrollments) {
    await sendNotification({
      userId: enrollment.userId,
      type: reminderType,
      data: {
        title: liveClass.title,
        startTime: liveClass.startTime,
        joinUrl: liveClass.joinUrl
      }
    });
  }
  
  return { success: true, sentTo: enrollments.length };
};
```

## 📹 Recording & Replay

### S3 Integration
```typescript
// Store recordings in S3
const storeRecording = async (liveClassId: string, recordingData: Buffer) => {
  const s3Key = `recordings/${liveClassId}/${Date.now()}.mp4`;
  
  await Storage.put(s3Key, recordingData, {
    level: 'private',
    contentType: 'video/mp4'
  });
  
  // Update live class with recording info
  await API.graphql({
    query: updateLiveClass,
    variables: {
      input: {
        id: liveClassId,
        recordingS3Key: s3Key
      }
    }
  });
  
  return s3Key;
};
```

## 🚀 Deployment Steps

1. **Update Amplify Backend:**
```bash
# Add new GraphQL types
amplify update api

# Add Lambda functions for live class management
amplify add function
# Name: liveClassManager
# Runtime: Node.js 18.x

# Add S3 bucket for recordings
amplify add storage
# Name: liveClassRecordings
# Access: Private (authenticated users only)

# Deploy changes
amplify push
```

2. **Install AWS SDK Dependencies:**
```bash
npm install aws-sdk @aws-sdk/client-chime @aws-sdk/client-ivs
```

3. **Configure IAM Permissions:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "chime:CreateMeeting",
        "chime:CreateAttendee",
        "chime:GetMeeting",
        "ivs:CreateChannel",
        "ivs:GetChannel",
        "ivs:CreateStreamKey"
      ],
      "Resource": "*"
    }
  ]
}
```

## 📊 Monitoring & Analytics

### CloudWatch Integration
```typescript
// Track live class metrics
const trackLiveClassMetrics = async (liveClassId: string, metrics: any) => {
  await API.graphql({
    query: createLiveClassMetrics,
    variables: {
      input: {
        liveClassId,
        participantCount: metrics.participantCount,
        averageWatchTime: metrics.averageWatchTime,
        engagementScore: metrics.engagementScore,
        timestamp: new Date().toISOString()
      }
    }
  });
};
```

## 🎯 Key Benefits

- **Scalable:** Handle from 10 to 10,000+ participants
- **Secure:** Cognito-based authentication and authorization
- **Cost-effective:** Pay only for what you use
- **Reliable:** AWS infrastructure with 99.9% uptime
- **Integrated:** Seamless integration with existing Amplify app
- **Recorded:** Automatic recording and replay capabilities
- **Monitored:** Real-time analytics and metrics

This integration provides a complete, production-ready live class system that scales with your platform! 🚀
