// Who follows this coach
// File: src/app/api/coach/followers/route.js

import { NextResponse } from "next/server";
import { requireCoach } from "@/backend/utils/session";
import { listCoachFollowers } from "@/backend/utils/db-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const followers = await listCoachFollowers(coachId);
    return NextResponse.json({ success: true, followers, count: followers.length });
  } catch (error) {
    console.error("GET /api/coach/followers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
