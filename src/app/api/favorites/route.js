// Saved coaches / liked videos / saved meals
// File: src/app/api/favorites/route.js
//
// The user is always taken from the session cookie -- never from a userId in the
// query string or body, which would let anyone read or edit someone else's saves.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";
import {
  listFavorites,
  toggleFavorite,
  setFavorite,
  removeFavorite,
  setFavoriteComment,
  isValidFavoriteType,
  FAVORITE_TYPES,
} from "@/backend/utils/favorites-helpers";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

function badType() {
  return NextResponse.json(
    { error: `type must be one of: ${FAVORITE_TYPES.join(", ")}` },
    { status: 400 }
  );
}

// GET /api/favorites?type=coach
export async function GET(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const type = new URL(request.url).searchParams.get("type");
    if (!isValidFavoriteType(type)) return badType();

    return NextResponse.json({ success: true, items: await listFavorites(userId, type) });
  } catch (error) {
    console.error("GET /api/favorites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/favorites  { type, itemId }                    -> toggle
// POST /api/favorites  { type, itemId, favorited: true }    -> force on/off
// POST /api/favorites  { type, itemId, comment: "..." }     -> set the note
export async function POST(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { type, itemId, comment, favorited } = await request.json();
    if (!isValidFavoriteType(type)) return badType();
    if (!itemId) return NextResponse.json({ error: "itemId is required" }, { status: 400 });

    if (comment !== undefined) {
      await setFavoriteComment(userId, type, itemId, comment);
      return NextResponse.json({ success: true });
    }

    // An explicit `favorited` means the caller knows the end state it wants;
    // without it, flip whatever is currently stored.
    const result =
      favorited === undefined
        ? await toggleFavorite(userId, type, itemId)
        : await setFavorite(userId, type, itemId, Boolean(favorited));

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error.message === "Favorite not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("POST /api/favorites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/favorites?type=coach&itemId=sami-a3f2
export async function DELETE(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const itemId = searchParams.get("itemId");

    if (!isValidFavoriteType(type)) return badType();
    if (!itemId) return NextResponse.json({ error: "itemId is required" }, { status: 400 });

    await removeFavorite(userId, type, itemId);
    return NextResponse.json({ success: true, favorited: false });
  } catch (error) {
    console.error("DELETE /api/favorites:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
