const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const comprehend = new AWS.Comprehend();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log('Content Moderation Lambda triggered:', JSON.stringify(event, null, 2));
  
  try {
    const { content, type, userId, contentId } = event.arguments;
    
    // Validate input
    if (!content || !type) {
      throw new Error('content and type are required');
    }
    
    // Analyze content for inappropriate language
    const detectParams = {
      Text: content,
      LanguageCode: 'en' // You might want to detect language first
    };
    
    const [sentimentResult, entitiesResult, keyPhrasesResult] = await Promise.all([
      comprehend.detectSentiment(detectParams).promise(),
      comprehend.detectEntities(detectParams).promise(),
      comprehend.detectKeyPhrases(detectParams).promise()
    ]);
    
    // Check for toxic content using sentiment analysis
    const isNegative = sentimentResult.Sentiment === 'NEGATIVE' && sentimentResult.SentimentScore.Negative > 0.7;
    
    // Check for inappropriate entities
    const inappropriateEntities = entitiesResult.Entities.filter(entity => 
      entity.Type === 'PERSON' && entity.Score > 0.9
    );
    
    // Check for inappropriate key phrases
    const inappropriatePhrases = keyPhrasesResult.KeyPhrases.filter(phrase => 
      isInappropriatePhrase(phrase.Text)
    );
    
    // Determine if content should be approved
    const isApproved = !isNegative && inappropriateEntities.length === 0 && inappropriatePhrases.length === 0;
    
    // Calculate confidence score
    const confidence = calculateConfidence(sentimentResult, inappropriateEntities, inappropriatePhrases);
    
    // Get reason for rejection if not approved
    let reason = null;
    if (!isApproved) {
      if (isNegative) reason = 'Negative sentiment detected';
      else if (inappropriateEntities.length > 0) reason = 'Inappropriate entities detected';
      else if (inappropriatePhrases.length > 0) reason = 'Inappropriate phrases detected';
    }
    
    // Store moderation result
    const moderationParams = {
      TableName: process.env.MODERATION_TABLE || 'ContentModeration-XXXXXXXXX',
      Item: {
        id: uuidv4(),
        contentId: contentId || 'unknown',
        userId: userId || 'unknown',
        content: content,
        type: type,
        isApproved: isApproved,
        confidence: confidence,
        reason: reason,
        sentiment: sentimentResult.Sentiment,
        sentimentScore: sentimentResult.SentimentScore,
        inappropriateEntities: inappropriateEntities,
        inappropriatePhrases: inappropriatePhrases,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    await dynamodb.put(moderationParams).promise();
    
    // If content is not approved, send notification to moderators
    if (!isApproved) {
      await notifyModerators(contentId, userId, reason, confidence);
    }
    
    // If content is approved and user is flagged, send warning
    if (isApproved && confidence < 0.8) {
      await sendWarningToUser(userId, confidence);
    }
    
    return {
      isApproved: isApproved,
      confidence: confidence,
      reason: reason,
      categories: getCategories(sentimentResult, inappropriateEntities, inappropriatePhrases)
    };
    
  } catch (error) {
    console.error('Error moderating content:', error);
    throw new Error(`Failed to moderate content: ${error.message}`);
  }
};

function isInappropriatePhrase(phrase) {
  const inappropriateWords = [
    'spam', 'scam', 'fake', 'fraud', 'hate', 'harassment',
    'bully', 'threat', 'violence', 'illegal', 'drugs',
    'weapon', 'terrorism', 'extremism'
  ];
  
  const lowerPhrase = phrase.toLowerCase();
  return inappropriateWords.some(word => lowerPhrase.includes(word));
}

function calculateConfidence(sentimentResult, inappropriateEntities, inappropriatePhrases) {
  let confidence = 1.0;
  
  // Reduce confidence based on negative sentiment
  if (sentimentResult.Sentiment === 'NEGATIVE') {
    confidence -= sentimentResult.SentimentScore.Negative * 0.5;
  }
  
  // Reduce confidence based on inappropriate entities
  confidence -= inappropriateEntities.length * 0.2;
  
  // Reduce confidence based on inappropriate phrases
  confidence -= inappropriatePhrases.length * 0.1;
  
  return Math.max(0, Math.min(1, confidence));
}

function getCategories(sentimentResult, inappropriateEntities, inappropriatePhrases) {
  const categories = [];
  
  if (sentimentResult.Sentiment === 'NEGATIVE') {
    categories.push('negative_sentiment');
  }
  
  if (inappropriateEntities.length > 0) {
    categories.push('inappropriate_entities');
  }
  
  if (inappropriatePhrases.length > 0) {
    categories.push('inappropriate_phrases');
  }
  
  return categories;
}

async function notifyModerators(contentId, userId, reason, confidence) {
  try {
    // Get all moderators
    const moderatorsParams = {
      TableName: process.env.USER_TABLE || 'User-XXXXXXXXX',
      IndexName: 'byRole',
      KeyConditionExpression: '#role = :role',
      ExpressionAttributeNames: {
        '#role': 'role'
      },
      ExpressionAttributeValues: {
        ':role': 'MODERATOR'
      }
    };
    
    const moderatorsResult = await dynamodb.query(moderatorsParams).promise();
    
    // Send notification to each moderator
    for (const moderator of moderatorsResult.Items) {
      const notificationParams = {
        TableName: process.env.NOTIFICATION_TABLE || 'Notification-XXXXXXXXX',
        Item: {
          id: uuidv4(),
          userId: moderator.id,
          title: 'Content Requires Review',
          message: `Content flagged for review. Reason: ${reason}. Confidence: ${(confidence * 100).toFixed(1)}%`,
          type: 'CONTENT_REVIEW',
          data: JSON.stringify({
            contentId: contentId,
            userId: userId,
            reason: reason,
            confidence: confidence
          }),
          isRead: false,
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      };
      
      await dynamodb.put(notificationParams).promise();
    }
    
  } catch (error) {
    console.error('Error notifying moderators:', error);
    // Don't fail the main operation if notification fails
  }
}

async function sendWarningToUser(userId, confidence) {
  try {
    if (!userId || userId === 'unknown') return;
    
    const notificationParams = {
      TableName: process.env.NOTIFICATION_TABLE || 'Notification-XXXXXXXXX',
      Item: {
        id: uuidv4(),
        userId: userId,
        title: 'Content Warning',
        message: 'Your content was approved but flagged for review. Please ensure your content follows community guidelines.',
        type: 'CONTENT_WARNING',
        data: JSON.stringify({
          confidence: confidence,
          message: 'Content quality warning'
        }),
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    
    await dynamodb.put(notificationParams).promise();
    
  } catch (error) {
    console.error('Error sending warning to user:', error);
    // Don't fail the main operation if warning fails
  }
}
