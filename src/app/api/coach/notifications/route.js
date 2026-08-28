// A coach's notifications
// File: src/app/api/coach/notifications/route.js

import { NextResponse } from "next/server";
import { requireCoach } from "@/backend/utils/session";
import {
  listNotifications,
  countUnreadNotifications,
  markNotificationsRead,
  clearNotifications,
} from "@/backend/utils/notification-helpers";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

// GET /api/coach/notifications
export async function GET(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return UNAUTHORIZED;

    const [notifications, unreadCount] = await Promise.all([
      listNotifications(coachId, "coach"),
      countUnreadNotifications(coachId, "coach"),
    ]);

    return NextResponse.json({ success: true, notifications, unreadCount });
  } catch (error) {
    console.error("GET /api/coach/notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/coach/notifications         -> mark all read
// PATCH /api/coach/notifications { ids } -> mark those read
export async function PATCH(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return UNAUTHORIZED;

    const body = await request.json().catch(() => ({}));
    const result = await markNotificationsRead(coachId, "coach", body?.ids);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("PATCH /api/coach/notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/coach/notifications -> clear the list
export async function DELETE(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) return UNAUTHORIZED;

    return NextResponse.json({ success: true, ...(await clearNotifications(coachId, "coach")) });
  } catch (error) {
    console.error("DELETE /api/coach/notifications:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
