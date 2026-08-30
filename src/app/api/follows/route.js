// The coaches you follow
// File: src/app/api/follows/route.js
//
// Following is a different thing from saving: /api/favorites?type=coach is your
// bookmarks, this is who you actually follow.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";
import { listFollowedCoaches } from "@/backend/utils/db-helpers";

export async function GET(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    return NextResponse.json({ success: true, coaches: await listFollowedCoaches(userId) });
  } catch (error) {
    console.error("GET /api/follows:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
