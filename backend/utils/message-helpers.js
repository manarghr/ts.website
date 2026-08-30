// Messages
// File: backend/utils/message-helpers.js
//
// Messages are stored flat -- one row per message, with a sender and a receiver.
// Conversations are assembled at read time by grouping on "the other person", so
// there is no separate thread record to keep in sync.

import { getCollection } from '@/lib/mongodb';

// Unbounded content means one request can write megabytes into the database.
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Send a message. Both ids are decided by the caller from the session, never from
 * the request body.
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
 * Every message between two people, oldest first, so it reads as a conversation.
 *
 * Deliberately symmetric: `myId` is whoever is reading, so the same function
 * serves the member's view and the coach's view.
 */
export async function listThread(myId, otherId, limit = 200) {
  const messages = await getCollection('messages');

  const rows = await messages
    .find({
      $or: [
        { sender_id: myId, receiver_id: otherId },
        { sender_id: otherId, receiver_id: myId },
      ],
    })
    .sort({ created_at: 1 })
    .limit(limit)
    .toArray();

  return rows.map((row) => ({
    id: row._id.toString(),
    content: row.content,
    read: Boolean(row.read),
    createdAt: row.created_at,
    fromMe: row.sender_id === myId,
  }));
}

/**
 * One row per person you have exchanged messages with, most recent first.
 *
 * Grouped in JS rather than with an aggregation pipeline: one person's message
 * history is small, and this stays readable. `counterpartLookup` joins the names
 * and pictures from whichever collection the other side lives in.
 */
async function listConversations(myId, { collectionName, project, toContact }, limit = 500) {
  const messages = await getCollection('messages');

  const rows = await messages
    .find({ $or: [{ sender_id: myId }, { receiver_id: myId }] })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray();

  if (rows.length === 0) return [];

  const threads = new Map();
  for (const row of rows) {
    const otherId = row.sender_id === myId ? row.receiver_id : row.sender_id;

    if (!threads.has(otherId)) {
      // rows are newest-first, so the first one seen for an id is the latest.
      threads.set(otherId, {
        otherId,
        lastMessage: row.content,
        lastAt: row.created_at,
        lastFromMe: row.sender_id === myId,
        unread: 0,
      });
    }
    // Unread counts only what they sent me and I have not opened.
    if (row.receiver_id === myId && !row.read) threads.get(otherId).unread += 1;
  }

  const source = await getCollection(collectionName);
  const docs = await source
    .find({ id: { $in: [...threads.keys()] } })
    .project(project)
    .toArray();
  const byId = new Map(docs.map((doc) => [doc.id, doc]));

  return [...threads.values()].map((thread) => ({
    ...thread,
    contact: toContact(byId.get(thread.otherId), thread.otherId),
  }));
}

/** A member's conversations. The other side is always a coach. */
export function listConversationsForUser(myId) {
  return listConversations(myId, {
    collectionName: 'coaches',
    project: { _id: 0, id: 1, name: 1, image_url: 1, category: 1 },
    toContact: (doc, id) => ({
      id,
      name: doc?.name || 'Unknown coach',
      picture: doc?.image_url || '',
      subtitle: doc?.category || '',
    }),
  });
}

/** A coach's conversations. The other side is always a member. */
export function listConversationsForCoach(myId) {
  return listConversations(myId, {
    collectionName: 'users',
    project: { _id: 0, id: 1, fullName: 1, profilePicture: 1, selectedPlan: 1 },
    toContact: (doc, id) => ({
      id,
      name: doc?.fullName || 'Deleted user',
      picture: doc?.profilePicture || '',
      subtitle: doc?.selectedPlan || '',
    }),
  });
}

/** Mark what the other person sent me as read. Scoped so it only touches my own. */
export async function markThreadRead(myId, otherId) {
  const messages = await getCollection('messages');
  const result = await messages.updateMany(
    { sender_id: otherId, receiver_id: myId, read: false },
    { $set: { read: true } }
  );
  return { modified: result.modifiedCount };
}

export async function countUnreadForCoach(coachId) {
  const messages = await getCollection('messages');
  return messages.countDocuments({ receiver_id: coachId, read: false });
}

/** Mark everything in my inbox as read, or just the ids given. */
export async function markMessagesRead(recipientId, messageIds) {
  const messages = await getCollection('messages');
  const { ObjectId } = await import('mongodb');

  const filter = { receiver_id: recipientId, read: false };

  if (Array.isArray(messageIds) && messageIds.length > 0) {
    const valid = messageIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    if (valid.length === 0) return { modified: 0 };
    filter._id = { $in: valid };
  }

  const result = await messages.updateMany(filter, { $set: { read: true } });
  return { modified: result.modifiedCount };
}
