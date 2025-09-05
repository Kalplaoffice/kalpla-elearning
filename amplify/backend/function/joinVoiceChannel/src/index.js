const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const chime = new AWS.ChimeSDKMeetings({ region: 'us-east-1' });
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('Join Voice Channel Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    const { channelId, userId, userName } = event.arguments;
    
    // Validate input
    if (!channelId || !userId) {
      throw new Error('channelId and userId are required');
    }
    
    // Check if user has permission to join the channel
    const userParams = {
      TableName: process.env.USER_TABLE || 'User-XXXXXXXXX',
      Key: { id: userId }
    };
    
    const userResult = await dynamodb.get(userParams).promise();
    if (!userResult.Item) {
      throw new Error('User not found');
    }
    
    const user = userResult.Item;
    
    // Check if user is enrolled in the course/program that owns this channel
    // This would need to be implemented based on your specific channel structure
    const hasPermission = await checkChannelPermission(userId, channelId);
    if (!hasPermission) {
      throw new Error('User does not have permission to join this channel');
    }
    
    // Create or get existing meeting
    let meetingId = await getOrCreateMeeting(channelId);
    
    // Create attendee for the user
    const attendeeParams = {
      MeetingId: meetingId,
      ExternalUserId: userId
    };
    
    const attendeeResult = await chime.createAttendee(attendeeParams).promise();
    
    // Store voice channel session
    const sessionParams = {
      TableName: process.env.VOICE_SESSION_TABLE || 'VoiceSession-XXXXXXXXX',
      Item: {
        id: uuidv4(),
        channelId: channelId,
        userId: userId,
        meetingId: meetingId,
        attendeeId: attendeeResult.Attendee.AttendeeId,
        status: 'ACTIVE',
        joinedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    await dynamodb.put(sessionParams).promise();
    
    // Send notification to other channel members
    await notifyChannelMembers(channelId, userId, userName, 'JOINED');
    
    return {
      meetingId: meetingId,
      attendeeId: attendeeResult.Attendee.AttendeeId,
      joinToken: attendeeResult.Attendee.JoinToken,
      mediaRegion: attendeeResult.Attendee.MediaRegion
    };
    
  } catch (error) {
    console.error('Error joining voice channel:', error);
    throw new Error(`Failed to join voice channel: ${error.message}`);
  }
};

async function getOrCreateMeeting(channelId) {
  try {
    // Check if meeting already exists for this channel
    const meetingParams = {
      TableName: process.env.VOICE_MEETING_TABLE || 'VoiceMeeting-XXXXXXXXX',
      Key: { channelId: channelId }
    };
    
    const meetingResult = await dynamodb.get(meetingParams).promise();
    
    if (meetingResult.Item && meetingResult.Item.status === 'ACTIVE') {
      return meetingResult.Item.meetingId;
    }
    
    // Create new meeting
    const meetingRequest = {
      ClientRequestToken: uuidv4(),
      MediaRegion: 'us-east-1',
      ExternalMeetingId: `channel-${channelId}-${Date.now()}`
    };
    
    const meeting = await chime.createMeeting(meetingRequest).promise();
    
    // Store meeting info
    const meetingStoreParams = {
      TableName: process.env.VOICE_MEETING_TABLE || 'VoiceMeeting-XXXXXXXXX',
      Item: {
        channelId: channelId,
        meetingId: meeting.Meeting.MeetingId,
        status: 'ACTIVE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    await dynamodb.put(meetingStoreParams).promise();
    
    return meeting.Meeting.MeetingId;
    
  } catch (error) {
    console.error('Error creating/getting meeting:', error);
    throw error;
  }
}

async function checkChannelPermission(userId, channelId) {
  // This is a simplified check - you would implement based on your channel structure
  // For example, check if user is enrolled in the course that owns this channel
  
  try {
    // Check if user is in a community group that has this channel
    const groupParams = {
      TableName: process.env.COMMUNITY_MEMBER_TABLE || 'CommunityMember-XXXXXXXXX',
      IndexName: 'byUser',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };
    
    const groupResult = await dynamodb.query(groupParams).promise();
    
    // For now, allow if user is in any group
    // You would add more specific logic based on channel permissions
    return groupResult.Items.length > 0;
    
  } catch (error) {
    console.error('Error checking channel permission:', error);
    return false;
  }
}

async function notifyChannelMembers(channelId, userId, userName, action) {
  try {
    // Get all members of the channel's group
    const groupParams = {
      TableName: process.env.COMMUNITY_MEMBER_TABLE || 'CommunityMember-XXXXXXXXX',
      IndexName: 'byGroup',
      KeyConditionExpression: 'groupId = :groupId',
      ExpressionAttributeValues: {
        ':groupId': channelId
      }
    };
    
    const membersResult = await dynamodb.query(groupParams).promise();
    
    // Send notifications to all members except the one who joined
    for (const member of membersResult.Items) {
      if (member.userId !== userId) {
        const notificationParams = {
          TableName: process.env.NOTIFICATION_TABLE || 'Notification-XXXXXXXXX',
          Item: {
            id: uuidv4(),
            userId: member.userId,
            title: 'Voice Channel Update',
            message: `${userName} ${action.toLowerCase()} the voice channel`,
            type: 'VOICE_CHANNEL_UPDATE',
            data: JSON.stringify({
              channelId: channelId,
              userId: userId,
              userName: userName,
              action: action
            }),
            isRead: false,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
        
        await dynamodb.put(notificationParams).promise();
      }
    }
    
  } catch (error) {
    console.error('Error notifying channel members:', error);
    // Don't fail the main operation if notification fails
  }
}
