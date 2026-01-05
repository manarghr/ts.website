import { NextResponse } from "next/server";
import { getCoachBySessionId, getCoachSessionCookieName, getCoachIdFromSession } from "@/backend/utils/coach-auth-helpers";

export async function GET(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    if (!sid) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const coach = await getCoachBySessionId(sid);
    if (!coach) return NextResponse.json({ error: "Coach not found" }, { status: 404 });

    return NextResponse.json({ success: true, coachId, coach });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

