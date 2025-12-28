// Message Helper Functions
// File: backend/utils/message-helpers.js

import { getCollection } from '@/lib/mongodb';

/**
 * Send message to coach
 */
export async function sendMessage(senderId, receiverId, content) {
  const messagesCollection = await getCollection('messages');
  
  const result = await messagesCollection.insertOne({
    sender_id: senderId,
    receiver_id: receiverId,
    content: content.trim(),
    read: false,
    created_at: new Date()
  });

  return {
    messageId: result.insertedId.toString(),
    success: true
  };
}

