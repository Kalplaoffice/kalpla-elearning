const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const ses = new AWS.SES();

exports.handler = async (event) => {
  console.log('Send Notification Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    const { userId, title, message, type, data, actionUrl } = event.arguments;
    
    // Validate input
    if (!userId || !title || !message || !type) {
      throw new Error('userId, title, message, and type are required');
    }
    
    // Get user details
    const userParams = {
      TableName: process.env.USER_TABLE || 'User-XXXXXXXXX',
      Key: { id: userId }
    };
    
    const userResult = await dynamodb.get(userParams).promise();
    if (!userResult.Item) {
      throw new Error('User not found');
    }
    
    const user = userResult.Item;
    
    // Create notification record
    const notificationParams = {
      TableName: process.env.NOTIFICATION_TABLE || 'Notification-XXXXXXXXX',
      Item: {
        id: uuidv4(),
        userId: userId,
        title: title,
        message: message,
        type: type,
        data: data ? JSON.stringify(data) : null,
        actionUrl: actionUrl || null,
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    await dynamodb.put(notificationParams).promise();
    
    // Send push notification if user has push notifications enabled
    if (user.notificationSettings?.push !== false) {
      await sendPushNotification(user, title, message, data);
    }
    
    // Send email notification if user has email notifications enabled
    if (user.notificationSettings?.email !== false && shouldSendEmail(type)) {
      await sendEmailNotification(user, title, message, actionUrl);
    }
    
    // Send SMS notification if user has SMS enabled and it's urgent
    if (user.notificationSettings?.sms === true && isUrgentNotification(type)) {
      await sendSMSNotification(user, title, message);
    }
    
    // Send SNS notification for real-time updates
    await sendSNSNotification(userId, type, title, message, data);
    
    return {
      id: notificationParams.Item.id,
      success: true,
      channels: getNotificationChannels(user, type)
    };
    
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
};

async function sendPushNotification(user, title, message, data) {
  try {
    // This would integrate with your push notification service
    // For now, we'll use SNS for push notifications
    const pushParams = {
      TopicArn: process.env.PUSH_TOPIC_ARN || 'arn:aws:sns:ap-south-1:112914241644:kalpla-push-notifications',
      Message: JSON.stringify({
        default: message,
        APNS: JSON.stringify({
          aps: {
            alert: {
              title: title,
              body: message
            },
            badge: 1,
            sound: 'default',
            data: data
          }
        }),
        GCM: JSON.stringify({
          notification: {
            title: title,
            body: message
          },
          data: data
        })
      }),
      Subject: title,
      MessageStructure: 'json'
    };
    
    await sns.publish(pushParams).promise();
    
  } catch (error) {
    console.error('Error sending push notification:', error);
    // Don't fail the main operation if push notification fails
  }
}

async function sendEmailNotification(user, title, message, actionUrl) {
  try {
    const emailParams = {
      Source: 'noreply@kalpla.com',
      Destination: {
        ToAddresses: [user.email]
      },
      Message: {
        Subject: {
          Data: title,
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: generateEmailHTML(title, message, actionUrl, user.name),
            Charset: 'UTF-8'
          },
          Text: {
            Data: `${title}\n\n${message}${actionUrl ? `\n\nView: ${actionUrl}` : ''}`,
            Charset: 'UTF-8'
          }
        }
      }
    };
    
    await ses.sendEmail(emailParams).promise();
    
  } catch (error) {
    console.error('Error sending email notification:', error);
    // Don't fail the main operation if email fails
  }
}

async function sendSMSNotification(user, title, message) {
  try {
    if (!user.phone) return;
    
    const smsParams = {
      TopicArn: process.env.SMS_TOPIC_ARN || 'arn:aws:sns:ap-south-1:112914241644:kalpla-sms-notifications',
      Message: `${title}: ${message}`,
      Subject: 'Kalpla Notification',
      PhoneNumber: user.phone
    };
    
    await sns.publish(smsParams).promise();
    
  } catch (error) {
    console.error('Error sending SMS notification:', error);
    // Don't fail the main operation if SMS fails
  }
}

async function sendSNSNotification(userId, type, title, message, data) {
  try {
    const snsParams = {
      TopicArn: process.env.SNS_TOPIC_ARN || 'arn:aws:sns:ap-south-1:112914241644:kalplanotifications-dev',
      Message: JSON.stringify({
        type: 'NOTIFICATION_CREATED',
        userId: userId,
        notificationType: type,
        title: title,
        message: message,
        data: data,
        timestamp: new Date().toISOString()
      }),
      Subject: 'New Notification'
    };
    
    await sns.publish(snsParams).promise();
    
  } catch (error) {
    console.error('Error sending SNS notification:', error);
    // Don't fail the main operation if SNS fails
  }
}

function shouldSendEmail(type) {
  const emailTypes = [
    'COURSE_UPDATE',
    'ASSIGNMENT_DUE',
    'MENTORSHIP_SESSION',
    'PAYMENT_SUCCESS',
    'PAYMENT_FAILED',
    'CERTIFICATE_ISSUED',
    'SYSTEM_ANNOUNCEMENT'
  ];
  
  return emailTypes.includes(type);
}

function isUrgentNotification(type) {
  const urgentTypes = [
    'PAYMENT_FAILED',
    'SYSTEM_ANNOUNCEMENT',
    'MENTORSHIP_SESSION'
  ];
  
  return urgentTypes.includes(type);
}

function getNotificationChannels(user, type) {
  const channels = ['database'];
  
  if (user.notificationSettings?.push !== false) {
    channels.push('push');
  }
  
  if (user.notificationSettings?.email !== false && shouldSendEmail(type)) {
    channels.push('email');
  }
  
  if (user.notificationSettings?.sms === true && isUrgentNotification(type)) {
    channels.push('sms');
  }
  
  return channels;
}

function generateEmailHTML(title, message, actionUrl, userName) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2C4E41, #FF804B); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #FF804B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Kalpla</h1>
          <h2>${title}</h2>
        </div>
        <div class="content">
          <p>Hello ${userName || 'there'},</p>
          <p>${message}</p>
          ${actionUrl ? `<a href="${actionUrl}" class="button">Take Action</a>` : ''}
          <p>Best regards,<br>The Kalpla Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>© 2024 Kalpla. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
