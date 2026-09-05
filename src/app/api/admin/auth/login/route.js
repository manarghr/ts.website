// Admin login
// File: src/app/api/admin/auth/login/route.js

import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/backend/utils/admin-auth-helpers";
import { setSessionCookie } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const { sessionId } = await authenticateAdmin(email, password);

    const response = NextResponse.json({ success: true });
    return setSessionCookie(response, sessionId);
  } catch (error) {
    if (error.message === "Invalid email or password") {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    // Misconfiguration is worth surfacing plainly -- only you can see this page.
    if (error.message.includes("not configured")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.error("POST /api/admin/auth/login:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
