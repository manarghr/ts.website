// Cascade deletes
// File: backend/utils/cascade-helpers.js
//
// MongoDB has no foreign keys, so nothing cleans up automatically. Deleting a coach
// row leaves their videos, reviews, announcements and everyone's saved-coach entries
// pointing at an id that no longer resolves -- which is how a profile page ends up
// rendering reviews for a ghost.
//
// Both delete paths (the coach deleting their own account, and an admin deleting a
// coach) call the same function here. When they were written separately they had
// already drifted: both still deleted from `coach_sessions`, a collection that no
// longer exists now that sessions are unified, so the deleted coach stayed logged in.
//
// NOTE: these run as a sequence of independent deletes, not a transaction. If one
// fails halfway, earlier deletes stand. Atlas does support multi-document
// transactions if this ever needs to be all-or-nothing.

import { getCollection } from "@/lib/mongodb";

/**
 * Remove a coach and everything that belongs to or points at them.
 * Returns a per-collection count of what was removed, which is worth logging.
 */
export async function deleteCoachCascade(coachId) {
  if (!coachId) throw new Error("coachId is required");

  const deleted = {};
  const remove = async (collectionName, filter) => {
    const collection = await getCollection(collectionName);
    const { deletedCount } = await collection.deleteMany(filter);
    deleted[collectionName] = (deleted[collectionName] || 0) + deletedCount;
  };

  // Videos are removed below, so collect their ids first -- afterwards there is no
  // way to find the favorites that referenced them.
  const videosCollection = await getCollection("videos");
  const videoIds = (
    await videosCollection.find({ coach_id: coachId }).project({ id: 1 }).toArray()
  ).map((v) => v.id);

  // Identity
  await remove("coaches", { id: coachId });
  await remove("coach_accounts", { coach_id: coachId });

  // Any active login for this coach. This is the one the old code got wrong.
  await remove("sessions", { principal_id: coachId });

  // Content they own
  await remove("videos", { coach_id: coachId });
  await remove("announcements", { coach_id: coachId });
  await remove("training_programs", { coach_id: coachId });
  await remove("blog", { coach_id: coachId });
  await remove("pending_blogs", { coach_id: coachId });
  await remove("certifications", { coach_id: coachId });

  // Things other people created that point at them
  await remove("coach_ratings", { coach_id: coachId });
  await remove("follows", { coach_id: coachId });
  await remove("messages", { receiver_id: coachId });

  // Saved-coach entries, plus saved-video entries for the videos just deleted
  await remove("favorites", { type: "coach", item_id: coachId });
  if (videoIds.length > 0) {
    await remove("favorites", { type: "video", item_id: { $in: videoIds } });
  }

  return deleted;
}

/**
 * Remove a user and everything they created.
 *
 * Their coach reviews go too, which changes those coaches' averages -- recompute
 * them if you add a user-deletion route to the admin panel.
 */
export async function deleteUserCascade(userId) {
  if (!userId) throw new Error("userId is required");

  const deleted = {};
  const remove = async (collectionName, filter) => {
    const collection = await getCollection(collectionName);
    const { deletedCount } = await collection.deleteMany(filter);
    deleted[collectionName] = (deleted[collectionName] || 0) + deletedCount;
  };

  await remove("users", { id: userId });
  await remove("sessions", { principal_id: userId });
  await remove("favorites", { user_id: userId });
  await remove("follows", { user_id: userId });
  await remove("coach_ratings", { user_id: userId });
  await remove("messages", { sender_id: userId });
  await remove("pending_blogs", { submittedBy: userId });

  return deleted;
}
