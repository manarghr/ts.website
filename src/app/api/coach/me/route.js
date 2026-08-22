// Which coach is signed in on this browser?
// File: src/app/api/coach/me/route.js

import { NextResponse } from "next/server";
import { getCoachById } from "@/backend/utils/db-helpers";
import { getCoachAccount } from "@/backend/utils/coach-auth-helpers";
import { requireCoach } from "@/backend/utils/session";

export async function GET(request) {
  try {
    const coachId = await requireCoach(request);
    if (!coachId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const coach = await getCoachById(coachId);
    if (!coach) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }

    // account holds email/phone/specialization; coach holds the public profile
    const account = await getCoachAccount(coachId);

    return NextResponse.json({ success: true, coachId, coach, account });
  } catch (error) {
    console.error("GET /api/coach/me:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
