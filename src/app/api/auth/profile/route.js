// Update your own profile
// File: src/app/api/auth/profile/route.js
//
// The user id comes from the session cookie. The body only supplies field values,
// and updateUser() ignores anything outside its whitelist -- so a request cannot
// change someone else's profile, nor set `password`, `email` or `id` on its own.

import { NextResponse } from "next/server";
import { updateUser } from "@/backend/utils/auth-helpers";
import { requireUser } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function PUT(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const user = await updateUser(userId, body);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    if (error.message === "No valid fields to update") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error.message === "User not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    console.error("PUT /api/auth/profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
