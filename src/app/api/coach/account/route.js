// Delete your own coach account
// File: src/app/api/coach/account/route.js

import { NextResponse } from "next/server";
import { requireCoach, clearSessionCookie } from "@/backend/utils/session";
import { deleteCoachCascade } from "@/backend/utils/cascade-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function DELETE(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const deleted = await deleteCoachCascade(coachId);
    console.log(`[cascade] deleted coach ${coachId}:`, deleted);

    // The session row is gone; clear the cookie too so the browser stops sending
    // an id that no longer resolves.
    return clearSessionCookie(NextResponse.json({ success: true, deleted }));
  } catch (error) {
    console.error("DELETE /api/coach/account:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
