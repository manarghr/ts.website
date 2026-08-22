// User login
// File: src/app/api/auth/login/route.js

import { NextResponse } from "next/server";
import { authenticateUser } from "@/backend/utils/auth-helpers";
import { ROLES, createSession, setSessionCookie } from "@/backend/utils/session";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await authenticateUser(email, password);

    // A fresh session id on every login. Logging in as a user also replaces any
    // coach session, because both share one cookie.
    const { sessionId } = await createSession(user.id, ROLES.USER);

    const response = NextResponse.json({ success: true, user });
    return setSessionCookie(response, sessionId);
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    console.error("POST /api/auth/login:", error);
    return NextResponse.json(
      { error: "Could not reach the database. Please try again in a moment." },
      { status: 503 }
    );
  }
}
