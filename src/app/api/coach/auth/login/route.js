import { NextResponse } from "next/server";
import {
  authenticateCoach,
  createCoachSession,
  getCoachSessionCookieName,
  getCoachSessionTtlSeconds,
} from "@/backend/utils/coach-auth-helpers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { coachId } = await authenticateCoach(email, password);
    const { sessionId } = await createCoachSession(coachId);

    const res = NextResponse.json({ success: true, coachId });
    res.cookies.set(getCoachSessionCookieName(), sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: getCoachSessionTtlSeconds(),
    });
    return res;
  } catch (error) {
    const msg = error.message || "Internal server error";
    const status = msg.includes("Invalid email or password") ? 401 : 400;
    return NextResponse.json({ error: msg }, { status });
  }
}

