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

/**
 * Everything sent to one coach, newest first.
 *
 * The sender's name lives on the user document, not on the message, so it is
 * looked up here rather than copied in at send time -- a copy would go stale the
 * moment somebody changes their name. One extra query, not one per message.
 */
export async function listMessagesForCoach(coachId, limit = 200) {
  const messages = await getCollection('messages');

  const rows = await messages
    .find({ receiver_id: coachId })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray();

  const senderIds = [...new Set(rows.map((row) => row.sender_id))];
  const users = await getCollection('users');
  const senders = await users
    .find({ id: { $in: senderIds } })
    .project({ id: 1, fullName: 1, profilePicture: 1, _id: 0 })
    .toArray();

  const byId = new Map(senders.map((user) => [user.id, user]));

  return rows.map((row) => ({
    id: row._id.toString(),
    content: row.content,
    read: Boolean(row.read),
    createdAt: row.created_at,
    sender: byId.get(row.sender_id) || { id: row.sender_id, fullName: 'Deleted user' },
  }));
}

export async function countUnreadForCoach(coachId) {
  const messages = await getCollection('messages');
  return messages.countDocuments({ receiver_id: coachId, read: false });
}

/**
 * Mark this coach's messages as read. Scoped to receiver_id so a coach can never
 * touch a row addressed to somebody else, whatever ids they send.
 */
export async function markMessagesRead(coachId, messageIds) {
  const messages = await getCollection('messages');
  const { ObjectId } = await import('mongodb');

  const filter = { receiver_id: coachId, read: false };

  if (Array.isArray(messageIds) && messageIds.length > 0) {
    const valid = messageIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    if (valid.length === 0) return { modified: 0 };
    filter._id = { $in: valid };
  }

  const result = await messages.updateMany(filter, { $set: { read: true } });
  return { modified: result.modifiedCount };
}
