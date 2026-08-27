// Message Helper Functions
// File: backend/utils/message-helpers.js

import { getCollection } from '@/lib/mongodb';

// Unbounded content means one request can write megabytes into the database.
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Send a message. The sender is decided by the caller from the session, never
 * from the request body.
 */
export async function sendMessage(senderId, receiverId, content) {
  const messagesCollection = await getCollection('messages');

  const result = await messagesCollection.insertOne({
    sender_id: senderId,
    receiver_id: receiverId,
    content: String(content).trim().slice(0, MAX_MESSAGE_LENGTH),
    read: false,
    created_at: new Date(),
  });

  return {
    messageId: result.insertedId.toString(),
    success: true,
  };
}
