// Is the caller signed in as admin?
// File: src/app/api/admin/me/route.js
//
// The admin page calls this on load so a refresh doesn't drop you back to the
// login form, and so "am I admin" is answered by the server rather than by a
// localStorage flag the user could set themselves.

import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const adminId = await requireAdmin(request);

    if (!adminId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, email: adminId });
  } catch (error) {
    console.error("GET /api/admin/me:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
