// Coach login
// File: src/app/api/coach/auth/login/route.js

import { NextResponse } from "next/server";
import { authenticateCoach, createCoachSession } from "@/backend/utils/coach-auth-helpers";
import { setSessionCookie } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { coachId } = await authenticateCoach(email, password);
    const { sessionId } = await createCoachSession(coachId);

    const response = NextResponse.json({ success: true, coachId });
    return setSessionCookie(response, sessionId);
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("POST /api/coach/auth/login:", error);
    return NextResponse.json(
      { error: "Could not reach the database. Please try again in a moment." },
      { status: 503 }
    );
  }
}
