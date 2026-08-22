// Favorites: saved coaches, liked videos, saved meals
// File: backend/utils/favorites-helpers.js
//
// One collection covers all three, distinguished by `type`:
//
//   { user_id, type: "coach" | "video" | "meal", item_id, comment, created_at }
//
// Only the ID is stored. The old code embedded whole coach/video/meal objects in
// the user document, so a coach renaming themselves left every user showing a stale
// copy forever. Here the item is looked up fresh on every read.
//
// `comment` exists because a saved meal carries a note the user wrote about it --
// that belongs to the favorite, not to the meal.

import { getCollection } from "@/lib/mongodb";

export const FAVORITE_TYPES = ["coach", "video", "meal"];

// which collection each type resolves against
const SOURCE_COLLECTION = {
  coach: "coaches",
  video: "videos",
  meal: "meals",
};

export function isValidFavoriteType(type) {
  return FAVORITE_TYPES.includes(type);
}

/**
 * Add or remove a favorite. Returns { favorited: boolean }.
 * Toggling means the UI can call one endpoint for both directions.
 */
export async function toggleFavorite(userId, type, itemId) {
  if (!isValidFavoriteType(type)) throw new Error("Invalid favorite type");
  if (!itemId) throw new Error("itemId is required");

  const favorites = await getCollection("favorites");
  const existing = await favorites.findOne({ user_id: userId, type, item_id: itemId });

  if (existing) {
    await favorites.deleteOne({ _id: existing._id });
    return { favorited: false };
  }

  try {
    await favorites.insertOne({
      user_id: userId,
      type,
      item_id: itemId,
      comment: "",
      created_at: new Date(),
    });
  } catch (error) {
    // Unique index rejected a double-click that raced past the findOne above.
    // The end state the user wanted is "favorited", so report success.
    if (error?.code !== 11000) throw error;
  }

  return { favorited: true };
}

export async function removeFavorite(userId, type, itemId) {
  if (!isValidFavoriteType(type)) throw new Error("Invalid favorite type");
  const favorites = await getCollection("favorites");
  await favorites.deleteOne({ user_id: userId, type, item_id: itemId });
  return { favorited: false };
}

/**
 * Force a favorite on or off, rather than flipping whatever is there.
 *
 * Toggling is wrong when the caller already knows the desired end state -- e.g.
 * following a coach should always save them, even if they were somehow saved
 * already. Unlike toggle, calling this twice is the same as calling it once.
 */
export async function setFavorite(userId, type, itemId, favorited) {
  if (!isValidFavoriteType(type)) throw new Error("Invalid favorite type");
  if (!itemId) throw new Error("itemId is required");

  const favorites = await getCollection("favorites");

  if (!favorited) {
    await favorites.deleteOne({ user_id: userId, type, item_id: itemId });
    return { favorited: false };
  }

  // upsert: creates it if missing, leaves an existing one (and its note) alone
  await favorites.updateOne(
    { user_id: userId, type, item_id: itemId },
    { $setOnInsert: { user_id: userId, type, item_id: itemId, comment: "", created_at: new Date() } },
    { upsert: true }
  );

  return { favorited: true };
}

/** Update the note attached to a saved item (used by saved meals). */
export async function setFavoriteComment(userId, type, itemId, comment) {
  if (!isValidFavoriteType(type)) throw new Error("Invalid favorite type");

  const favorites = await getCollection("favorites");
  const result = await favorites.updateOne(
    { user_id: userId, type, item_id: itemId },
    { $set: { comment: String(comment || "").slice(0, 1000), updated_at: new Date() } }
  );

  if (result.matchedCount === 0) throw new Error("Favorite not found");
  return true;
}

/**
 * List favorites of one type, with the real item merged in.
 *
 * Two queries, not one per favorite: fetch the rows, then fetch every referenced
 * item in a single `$in`. Looking each one up in a loop would be N+1 round trips.
 *
 * Items that no longer exist (deleted coach, removed meal) are skipped rather than
 * returned as nulls the UI would have to guard against.
 */
export async function listFavorites(userId, type) {
  if (!isValidFavoriteType(type)) throw new Error("Invalid favorite type");

  const favorites = await getCollection("favorites");
  const rows = await favorites
    .find({ user_id: userId, type })
    .sort({ created_at: -1 })
    .toArray();

  if (rows.length === 0) return [];

  const source = await getCollection(SOURCE_COLLECTION[type]);
  const items = await source.find({ id: { $in: rows.map((r) => r.item_id) } }).toArray();

  const byId = new Map(items.map((item) => [item.id, item]));

  return rows
    .filter((row) => byId.has(row.item_id))
    .map((row) => {
      const { _id, ...item } = byId.get(row.item_id);
      return {
        ...item,
        comment: row.comment || "",
        favoritedAt: row.created_at,
      };
    });
}

/** Just the IDs -- for "is this already favorited?" checks on a detail page. */
export async function listFavoriteIds(userId, type) {
  if (!isValidFavoriteType(type)) throw new Error("Invalid favorite type");
  const favorites = await getCollection("favorites");
  const rows = await favorites.find({ user_id: userId, type }).project({ item_id: 1 }).toArray();
  return rows.map((r) => r.item_id);
}
