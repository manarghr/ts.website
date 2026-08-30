// A user's conversations with coaches
// File: src/app/api/messages/route.js
//
// The user is always the session user. Passing a userId would let anyone read
// somebody else's private messages -- the worst version of that bug class.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";
import {
  listConversationsForUser,
  listThread,
  markThreadRead,
} from "@/backend/utils/message-helpers";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

// GET /api/messages              -> one row per coach you have talked to
// GET /api/messages?coachId=x    -> the full thread with that coach
export async function GET(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const coachId = new URL(request.url).searchParams.get("coachId");

    if (coachId) {
      const messages = await listThread(userId, coachId);
      // Opening a thread is what marks it read.
      await markThreadRead(userId, coachId);
      return NextResponse.json({ success: true, messages });
    }

    return NextResponse.json({
      success: true,
      conversations: await listConversationsForUser(userId),
    });
  } catch (error) {
    console.error("GET /api/messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
