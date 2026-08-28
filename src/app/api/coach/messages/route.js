// A coach's inbox
// File: src/app/api/coach/messages/route.js
//
// Reads only messages addressed to the signed-in coach. The coach id comes from
// the session, so there is no way to ask for somebody else's inbox.

import { NextResponse } from "next/server";
import { requireCoach } from "@/backend/utils/session";
import {
  listMessagesForCoach,
  countUnreadForCoach,
  markMessagesRead,
} from "@/backend/utils/message-helpers";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

// GET /api/coach/messages
export async function GET(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return UNAUTHORIZED;

    const [messages, unreadCount] = await Promise.all([
      listMessagesForCoach(coachId),
      countUnreadForCoach(coachId),
    ]);

    return NextResponse.json({ success: true, messages, unreadCount });
  } catch (error) {
    console.error("GET /api/coach/messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/coach/messages          -> mark everything read
// PATCH /api/coach/messages { ids }  -> mark just those
export async function PATCH(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return UNAUTHORIZED;

    const body = await request.json().catch(() => ({}));
    const result = await markMessagesRead(coachId, body?.ids);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("PATCH /api/coach/messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
