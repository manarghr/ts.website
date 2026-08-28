// Notifications
// File: backend/utils/notification-helpers.js
//
// Rows are written when something happens, rather than worked out on the fly from
// messages/purchases/reviews. Two reasons: "read" has to be stored somewhere, and
// deriving a feed means one query per source table every time the bell is opened.
//
// The recipient is (id, role) rather than just an id, because a user and a coach
// could in principle share an id space -- the role keeps the two inboxes apart.

import { getCollection } from "@/lib/mongodb";

export const NOTIFICATION_TYPES = {
  MESSAGE: "message",
  SALE: "sale",
  REVIEW: "review",
  FOLLOW: "follow",
  BLOG_APPROVED: "blog_approved",
  SYSTEM: "system",
};

/**
 * Write one notification.
 *
 * Never throws. A notification is a side effect of something more important --
 * if writing it fails, the message must still send and the sale must still be
 * recorded. Callers therefore do not need to wrap this in a try/catch.
 */
export async function notify({ recipientId, recipientRole, type, title, body = "", link = "" }) {
  try {
    if (!recipientId || !recipientRole || !type || !title) return null;

    const notifications = await getCollection("notifications");
    const row = {
      recipient_id: recipientId,
      recipient_role: recipientRole,
      type,
      title,
      body,
      link,
      read: false,
      created_at: new Date(),
    };

    await notifications.insertOne(row);
    return row;
  } catch (error) {
    console.error("[notify] could not write notification:", error?.message);
    return null;
  }
}

export async function listNotifications(recipientId, recipientRole, limit = 50) {
  const notifications = await getCollection("notifications");
  const rows = await notifications
    .find({ recipient_id: recipientId, recipient_role: recipientRole })
    .sort({ created_at: -1 })
    .limit(limit)
    .toArray();

  return rows.map(({ _id, recipient_id, recipient_role, ...rest }) => ({
    id: _id.toString(),
    ...rest,
  }));
}

export async function countUnreadNotifications(recipientId, recipientRole) {
  const notifications = await getCollection("notifications");
  return notifications.countDocuments({
    recipient_id: recipientId,
    recipient_role: recipientRole,
    read: false,
  });
}

/** Scoped to the recipient, so ids from a request can only ever touch your own. */
export async function markNotificationsRead(recipientId, recipientRole, ids) {
  const notifications = await getCollection("notifications");
  const { ObjectId } = await import("mongodb");

  const filter = { recipient_id: recipientId, recipient_role: recipientRole, read: false };

  if (Array.isArray(ids) && ids.length > 0) {
    const valid = ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id));
    if (valid.length === 0) return { modified: 0 };
    filter._id = { $in: valid };
  }

  const result = await notifications.updateMany(filter, { $set: { read: true } });
  return { modified: result.modifiedCount };
}

export async function clearNotifications(recipientId, recipientRole) {
  const notifications = await getCollection("notifications");
  const result = await notifications.deleteMany({
    recipient_id: recipientId,
    recipient_role: recipientRole,
  });
  return { deleted: result.deletedCount };
}
