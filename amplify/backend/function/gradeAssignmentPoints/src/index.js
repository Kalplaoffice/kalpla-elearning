const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  console.log('Grade Assignment Points Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    const { submissionId, grade, feedback, gradedBy } = event.arguments;
    
    // Validate input
    if (!submissionId || grade === undefined) {
      throw new Error('submissionId and grade are required');
    }
    
    if (grade < 0 || grade > 100) {
      throw new Error('Grade must be between 0 and 100');
    }
    
    // Get submission details
    const submissionParams = {
      TableName: process.env.ASSIGNMENT_SUBMISSION_TABLE || 'AssignmentSubmission-XXXXXXXXX',
      Key: { id: submissionId }
    };
    
    const submissionResult = await dynamodb.get(submissionParams).promise();
    if (!submissionResult.Item) {
      throw new Error('Submission not found');
    }
    
    const submission = submissionResult.Item;
    
    // Update submission with grade
    const updateParams = {
      TableName: process.env.ASSIGNMENT_SUBMISSION_TABLE || 'AssignmentSubmission-XXXXXXXXX',
      Key: { id: submissionId },
      UpdateExpression: 'SET #status = :status, #grade = :grade, #feedback = :feedback, #gradedBy = :gradedBy, #gradedAt = :gradedAt, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
        '#grade': 'grade',
        '#feedback': 'feedback',
        '#gradedBy': 'gradedBy',
        '#gradedAt': 'gradedAt',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':status': 'GRADED',
        ':grade': grade,
        ':feedback': feedback || '',
        ':gradedBy': gradedBy || 'system',
        ':gradedAt': new Date().toISOString(),
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };
    
    const updatedSubmission = await dynamodb.update(updateParams).promise();
    
    // Calculate points earned based on grade
    const pointsEarned = Math.round((grade / 100) * 10); // 10 points max per assignment
    
    // Update user points
    const userUpdateParams = {
      TableName: process.env.USER_TABLE || 'User-XXXXXXXXX',
      Key: { id: submission.userId },
      UpdateExpression: 'ADD #points = :points, #updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#points': 'points',
        '#updatedAt': 'updatedAt'
      },
      ExpressionAttributeValues: {
        ':points': pointsEarned,
        ':updatedAt': new Date().toISOString()
      }
    };
    
    await dynamodb.update(userUpdateParams).promise();
    
    // Check for level up
    const userResult = await dynamodb.get({
      TableName: process.env.USER_TABLE || 'User-XXXXXXXXX',
      Key: { id: submission.userId }
    }).promise();
    
    const user = userResult.Item;
    const newLevel = Math.floor(user.points / 100) + 1; // Level up every 100 points
    
    if (newLevel > user.level) {
      // Level up notification
      const levelUpParams = {
        TableName: process.env.NOTIFICATION_TABLE || 'Notification-XXXXXXXXX',
        Item: {
          id: uuidv4(),
          userId: submission.userId,
          title: 'Level Up! 🎉',
          message: `Congratulations! You've reached level ${newLevel}!`,
          type: 'ACHIEVEMENT_UNLOCKED',
          data: JSON.stringify({
            newLevel: newLevel,
            pointsEarned: pointsEarned,
            totalPoints: user.points + pointsEarned
          }),
          isRead: false,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      await dynamodb.put(levelUpParams).promise();
      
      // Update user level
      await dynamodb.update({
        TableName: process.env.USER_TABLE || 'User-XXXXXXXXX',
        Key: { id: submission.userId },
        UpdateExpression: 'SET #level = :level, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#level': 'level',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':level': newLevel,
          ':updatedAt': new Date().toISOString()
        }
      }).promise();
    }
    
    // Send notification to student
    const notificationParams = {
      TableName: process.env.NOTIFICATION_TABLE || 'Notification-XXXXXXXXX',
      Item: {
        id: uuidv4(),
        userId: submission.userId,
        title: 'Assignment Graded',
        message: `Your assignment has been graded. You received ${grade}% and earned ${pointsEarned} points!`,
        type: 'ASSIGNMENT_GRADED',
        data: JSON.stringify({
          submissionId: submissionId,
          grade: grade,
          pointsEarned: pointsEarned,
          feedback: feedback
        }),
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    await dynamodb.put(notificationParams).promise();
    
    // Send SNS notification for real-time updates
    try {
      await sns.publish({
        TopicArn: process.env.SNS_TOPIC_ARN || 'arn:aws:sns:ap-south-1:112914241644:kalplanotifications-dev',
        Message: JSON.stringify({
          type: 'ASSIGNMENT_GRADED',
          userId: submission.userId,
          submissionId: submissionId,
          grade: grade,
          pointsEarned: pointsEarned
        }),
        Subject: 'Assignment Graded'
      }).promise();
    } catch (snsError) {
      console.error('SNS notification failed:', snsError);
      // Don't fail the main operation if SNS fails
    }
    
    return updatedSubmission.Attributes;
    
  } catch (error) {
    console.error('Error grading assignment:', error);
    throw new Error(`Failed to grade assignment: ${error.message}`);
  }
};
