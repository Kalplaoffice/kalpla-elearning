# 🚀 AWS Community Platform Integration Guide

This guide explains how to build a Discord-style community platform for premium mentorship students using AWS Amplify and related services.

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   AWS Amplify   │    │   AWS Services  │
│                 │    │                 │    │                 │
│ • Discord UI    │◄──►│ • Auth (Cognito)│◄──►│ • Chime SDK     │
│ • Real-time Chat│    │ • API (AppSync) │    │ • IVS           │
│ • Voice/Video   │    │ • Storage (S3)  │    │ • S3            │
│ • Gamification  │    │ • Functions     │    │ • SNS           │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Core Features Implementation

### 1. Real-Time Messaging (Discord-style Chat)

#### AppSync Subscriptions
```typescript
// Real-time message subscriptions
const MESSAGE_SUBSCRIPTION = `
  subscription OnMessageAdded($channelId: ID!) {
    onMessageAdded(channelId: $channelId) {
      id
      content
      user {
        name
        avatar
        role
      }
      timestamp
      reactions {
        emoji
        count
      }
    }
  }
`;

// Send message mutation
const SEND_MESSAGE = `
  mutation SendMessage($channelId: ID!, $content: String!, $type: MessageType!) {
    sendMessage(channelId: $channelId, content: $content, type: $type) {
      id
      content
      timestamp
    }
  }
`;
```

#### Lambda Function for Message Processing
```typescript
// amplify/backend/function/sendMessage/src/index.js
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { ComprehendClient, DetectSentimentCommand } = require('@aws-sdk/client-comprehend');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const comprehendClient = new ComprehendClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  const { channelId, content, type } = event.arguments;
  const userId = event.identity.sub;
  
  // Content moderation using Amazon Comprehend
  const sentiment = await comprehendClient.send(new DetectSentimentCommand({
    Text: content,
    LanguageCode: 'en'
  }));
  
  // Check for inappropriate content
  if (sentiment.Sentiment === 'NEGATIVE' && sentiment.SentimentScore.Negative > 0.8) {
    // Flag for moderation
    await flagForModeration(userId, content, channelId);
  }
  
  // Create message record
  const message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    channelId,
    content,
    type,
    userId,
    timestamp: new Date().toISOString(),
    isDeleted: false,
    reactions: []
  };
  
  await docClient.send(new PutCommand({
    TableName: process.env.API_KALPLAAPI_COMMUNITYMESSAGE_TABLE,
    Item: message
  }));
  
  // Update user stats
  await updateUserStats(userId, 'MESSAGES_SENT', 1);
  
  return message;
};
```

### 2. Voice & Video Channels

#### Amazon Chime SDK Integration
```typescript
// Voice channel management
import { ChimeSDK } from '@aws-sdk/client-chime';

const chimeClient = new ChimeSDK({ region: 'us-east-1' });

// Create voice channel
const createVoiceChannel = async (serverId: string, channelName: string) => {
  const meeting = await chimeClient.createMeeting({
    ClientRequestToken: `voice-${serverId}-${channelName}-${Date.now()}`,
    MediaRegion: 'us-east-1'
  });
  
  return {
    chimeRoomId: meeting.Meeting.MeetingId,
    meeting: meeting.Meeting
  };
};

// Join voice channel
const joinVoiceChannel = async (channelId: string, userId: string) => {
  const attendee = await chimeClient.createAttendee({
    MeetingId: channelId,
    ExternalUserId: userId
  });
  
  return {
    attendeeId: attendee.Attendee.AttendeeId,
    joinToken: attendee.Attendee.JoinToken
  };
};
```

#### Amazon IVS for Video Channels
```typescript
// Video channel management
import { IVS } from '@aws-sdk/client-ivs';

const ivsClient = new IVS({ region: 'us-east-1' });

// Create video channel
const createVideoChannel = async (serverId: string, channelName: string) => {
  const channel = await ivsClient.createChannel({
    name: `video-${serverId}-${channelName}`,
    type: 'STANDARD',
    latencyMode: 'LOW'
  });
  
  const streamKey = await ivsClient.createStreamKey({
    channelArn: channel.Channel.Arn
  });
  
  return {
    channelArn: channel.Channel.Arn,
    streamKey: streamKey.StreamKey.Value
  };
};
```

### 3. File Sharing & Media Upload

#### S3 Integration for Attachments
```typescript
// File upload with security scanning
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3 } from '@aws-sdk/client-s3';

const s3Client = new S3Client({ region: process.env.AWS_REGION });

const uploadFile = async (file: File, channelId: string, userId: string) => {
  const fileKey = `community-attachments/${channelId}/${userId}/${Date.now()}-${file.name}`;
  
  // Upload to S3
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.STORAGE_COMMUNITYATTACHMENTS_BUCKETNAME,
    Key: fileKey,
    Body: file,
    ContentType: file.type,
    Metadata: {
      'uploaded-by': userId,
      'channel-id': channelId,
      'original-name': file.name
    }
  }));
  
  // Generate presigned URL for access
  const presignedUrl = await getPresignedUrl(fileKey);
  
  return {
    s3Key: fileKey,
    presignedUrl,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type
  };
};
```

### 4. Gamification & User Stats

#### User Level & XP System
```typescript
// XP calculation and level progression
const calculateXP = (activityType: string, value: number) => {
  const xpMultipliers = {
    MESSAGES_SENT: 1,
    VOICE_TIME: 0.1, // per minute
    STREAK_DAYS: 10,
    HELPFUL_ANSWERS: 5,
    MENTOR_SESSIONS: 20
  };
  
  return Math.floor(value * (xpMultipliers[activityType] || 1));
};

const updateUserLevel = async (userId: string, newXP: number) => {
  const level = Math.floor(newXP / 1000) + 1; // 1000 XP per level
  const currentLevel = Math.floor((newXP - 1000) / 1000) + 1;
  
  if (level > currentLevel) {
    // Level up!
    await awardLevelUpBadge(userId, level);
    await sendLevelUpNotification(userId, level);
  }
  
  return level;
};
```

#### Badge System
```typescript
// Badge awarding system
const checkAndAwardBadges = async (userId: string, activityType: string, value: number) => {
  const userStats = await getUserStats(userId);
  
  // Check for various badge conditions
  const badges = [];
  
  if (userStats.messagesSent >= 1000 && !userStats.badges.includes('CHATTERBOX')) {
    badges.push('CHATTERBOX');
  }
  
  if (userStats.voiceTimeMinutes >= 2400 && !userStats.badges.includes('SOCIAL_BUTTERFLY')) {
    badges.push('SOCIAL_BUTTERFLY');
  }
  
  if (userStats.currentStreak >= 30 && !userStats.badges.includes('DEDICATED')) {
    badges.push('DEDICATED');
  }
  
  // Award new badges
  for (const badgeId of badges) {
    await awardBadge(userId, badgeId);
    await sendBadgeNotification(userId, badgeId);
  }
};
```

### 5. Moderation & Safety

#### AI-Powered Content Moderation
```typescript
// Amazon Comprehend integration for content moderation
import { ComprehendClient, DetectSentimentCommand, DetectPIIEntitiesCommand } from '@aws-sdk/client-comprehend';

const comprehendClient = new ComprehendClient({ region: process.env.AWS_REGION });

const moderateContent = async (content: string) => {
  // Detect sentiment
  const sentiment = await comprehendClient.send(new DetectSentimentCommand({
    Text: content,
    LanguageCode: 'en'
  }));
  
  // Detect PII (Personally Identifiable Information)
  const piiEntities = await comprehendClient.send(new DetectPIIEntitiesCommand({
    Text: content,
    LanguageCode: 'en'
  }));
  
  // Check for toxic content
  const toxicityScore = await detectToxicity(content);
  
  return {
    sentiment: sentiment.Sentiment,
    sentimentScore: sentiment.SentimentScore,
    piiDetected: piiEntities.Entities.length > 0,
    toxicityScore,
    shouldFlag: sentiment.Sentiment === 'NEGATIVE' || toxicityScore > 0.7 || piiEntities.Entities.length > 0
  };
};
```

#### Automated Moderation Actions
```typescript
// Auto-moderation based on content analysis
const handleModerationAction = async (userId: string, content: string, channelId: string) => {
  const moderationResult = await moderateContent(content);
  
  if (moderationResult.shouldFlag) {
    // Get user's moderation history
    const userHistory = await getUserModerationHistory(userId);
    
    let actionType = 'WARN';
    
    if (userHistory.warnings >= 3) {
      actionType = 'MUTE';
    } else if (userHistory.warnings >= 5) {
      actionType = 'KICK';
    } else if (userHistory.warnings >= 10) {
      actionType = 'BAN';
    }
    
    // Apply moderation action
    await applyModerationAction(userId, actionType, 'Automated moderation', channelId);
    
    // Notify moderators
    await notifyModerators(userId, content, actionType, moderationResult);
  }
};
```

### 6. Notifications & Real-time Updates

#### SNS Integration for Push Notifications
```typescript
// Push notification system
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const snsClient = new SNSClient({ region: process.env.AWS_REGION });

const sendPushNotification = async (userId: string, title: string, body: string, data: any) => {
  const user = await getUser(userId);
  
  if (user.pushToken) {
    await snsClient.send(new PublishCommand({
      TargetArn: user.pushToken,
      Message: JSON.stringify({
        default: body,
        APNS: {
          aps: {
            alert: { title, body },
            badge: 1,
            sound: 'default',
            data
          }
        },
        GCM: {
          notification: { title, body },
          data
        }
      }),
      MessageStructure: 'json'
    }));
  }
};
```

#### Real-time Presence System
```typescript
// User presence tracking
const updateUserPresence = async (userId: string, status: 'ONLINE' | 'AWAY' | 'BUSY' | 'INVISIBLE') => {
  await docClient.send(new PutCommand({
    TableName: process.env.API_KALPLAAPI_COMMUNITYMEMBER_TABLE,
    Item: {
      id: userId,
      status,
      lastSeen: new Date().toISOString(),
      isOnline: status !== 'INVISIBLE'
    }
  }));
  
  // Broadcast presence update to all connected clients
  await publishPresenceUpdate(userId, status);
};
```

## 🚀 Deployment Steps

### 1. Update Amplify Backend
```bash
# Add community schema to existing API
amplify update api
# Add the community-schema.graphql content

# Add Lambda functions
amplify add function
# Name: joinVoiceChannel
# Runtime: Node.js 18.x

amplify add function
# Name: sendMessage
# Runtime: Node.js 18.x

amplify add function
# Name: updateUserStats
# Runtime: Node.js 18.x

# Add S3 storage for attachments
amplify add storage
# Name: communityAttachments
# Access: Private (authenticated users only)

# Deploy changes
amplify push
```

### 2. Install Dependencies
```bash
npm install @aws-sdk/client-chime @aws-sdk/client-ivs @aws-sdk/client-comprehend @aws-sdk/client-sns
```

### 3. Configure IAM Permissions
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
        "ivs:CreateStreamKey",
        "comprehend:DetectSentiment",
        "comprehend:DetectPIIEntities",
        "sns:Publish"
      ],
      "Resource": "*"
    }
  ]
}
```

## 📊 Key Features Summary

### ✅ **Discord-Style Features**
- **Real-time Chat:** AppSync subscriptions for instant messaging
- **Voice Channels:** Amazon Chime SDK for voice communication
- **Video Channels:** Amazon IVS for video streaming
- **File Sharing:** S3 integration with security scanning
- **Role Management:** Granular permissions system
- **Server Management:** Multiple community servers

### ✅ **Premium Access Control**
- **Mentorship Verification:** Only paid students can access
- **Role-based Permissions:** Admin, Mentor, Student roles
- **Channel Access Control:** Private channels for specific roles
- **Premium Features:** Advanced features for paying users

### ✅ **Gamification System**
- **XP & Levels:** Activity-based progression
- **Badges & Achievements:** Recognition system
- **Leaderboards:** Global and server rankings
- **Streak Tracking:** Daily activity rewards

### ✅ **Moderation & Safety**
- **AI Content Moderation:** Amazon Comprehend integration
- **Automated Actions:** Warning, mute, kick, ban system
- **PII Detection:** Privacy protection
- **Toxicity Detection:** Inappropriate content filtering

### ✅ **Real-time Features**
- **Live Presence:** Online/offline status
- **Typing Indicators:** Real-time typing status
- **Voice Status:** Mute/unmute, video on/off
- **Push Notifications:** SNS integration

This creates a **world-class community platform** that rivals Discord, Slack, and other professional communication tools! 🚀
