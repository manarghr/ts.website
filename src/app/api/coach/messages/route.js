// A coach's inbox
// File: src/app/api/coach/messages/route.js
//
// The coach id comes from the session, so there is no way to ask for somebody
// else's inbox. A userId in the query or body only ever names the OTHER side of a
// conversation -- never who is asking.

import { NextResponse } from "next/server";
import { requireCoach } from "@/backend/utils/session";
import {
  listConversationsForCoach,
  listThread,
  markThreadRead,
  countUnreadForCoach,
  markMessagesRead,
  sendMessage,
  MAX_MESSAGE_LENGTH,
} from "@/backend/utils/message-helpers";
import { getUserById } from "@/backend/utils/auth-helpers";
import { getCoachById } from "@/backend/utils/db-helpers";
import { notify, NOTIFICATION_TYPES } from "@/backend/utils/notification-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

// GET /api/coach/messages             -> one row per member you have talked to
// GET /api/coach/messages?userId=x    -> the full thread with that member
export async function GET(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return UNAUTHORIZED;

    const userId = new URL(request.url).searchParams.get("userId");

    if (userId) {
      const messages = await listThread(coachId, userId);
      // Opening a thread is what marks it read.
      await markThreadRead(coachId, userId);
      return NextResponse.json({
        success: true,
        messages,
        unreadCount: await countUnreadForCoach(coachId),
      });
    }

    const [conversations, unreadCount] = await Promise.all([
      listConversationsForCoach(coachId),
      countUnreadForCoach(coachId),
    ]);

    return NextResponse.json({ success: true, conversations, unreadCount });
  } catch (error) {
    console.error("GET /api/coach/messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/coach/messages  { userId, content }  -> reply to a member
export async function POST(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return UNAUTHORIZED;

    const { userId, content } = await request.json();

    const trimmed = String(content || "").trim();
    if (!userId) return NextResponse.json({ error: "userId is required" }, { status: 400 });
    if (!trimmed) return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    if (!(await getUserById(userId))) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await sendMessage(coachId, userId, trimmed);

    const coach = await getCoachById(coachId);
    await notify({
      recipientId: userId,
      recipientRole: "user",
      type: NOTIFICATION_TYPES.MESSAGE,
      title: `${coach?.name || "Your coach"} replied to you`,
      body: trimmed.slice(0, 140),
      link: "/profile",
    });

    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error) {
    console.error("POST /api/coach/messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/coach/messages  -> mark the whole inbox read
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
