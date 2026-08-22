// Who is signed in on this browser?
// File: src/app/api/auth/me/route.js
//
// This is the ONLY trustworthy source of identity on the client. It reads the
// httpOnly cookie -- there is no user id in the request the caller can tamper with.

import { NextResponse } from "next/server";
import { getUserById } from "@/backend/utils/auth-helpers";
import { getCurrentSession, ROLES, clearSessionCookie } from "@/backend/utils/session";

export async function GET(request) {
  try {
    const session = await getCurrentSession(request);

    if (!session) {
      return NextResponse.json({ authenticated: false, user: null, role: null });
    }

    // Signed in, but as a coach or admin -- not a user.
    if (session.role !== ROLES.USER) {
      return NextResponse.json({ authenticated: false, user: null, role: session.role });
    }

    const user = await getUserById(session.principalId);

    if (!user) {
      // Session points at a deleted account: clean up rather than 500.
      return clearSessionCookie(
        NextResponse.json({ authenticated: false, user: null, role: null })
      );
    }

    return NextResponse.json({ authenticated: true, user, role: ROLES.USER });
  } catch (error) {
    console.error("GET /api/auth/me:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
