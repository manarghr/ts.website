// Coach registration
// File: src/app/api/coach/auth/register/route.js

import { NextResponse } from "next/server";
import { createCoachAccount, createCoachSession } from "@/backend/utils/coach-auth-helpers";
import { setSessionCookie } from "@/backend/utils/session";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    const { coachId } = await createCoachAccount({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      specialization: body.specialization,
      experience: body.experience,
      certification: body.certification,
      bio: body.bio,
      category: body.category,
      image_url: body.image_url,
    });

    const { sessionId } = await createCoachSession(coachId);

    const response = NextResponse.json({ success: true, coachId }, { status: 201 });
    return setSessionCookie(response, sessionId);
  } catch (error) {
    console.error("POST /api/coach/auth/register:", error);

    const message = error.message || "Registration failed";

    if (message.includes("already exists")) {
      return NextResponse.json({ error: message }, { status: 409 });
    }
    if (
      message.includes("required") ||
      message.includes("valid email") ||
      message.includes("at least 8 characters")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Could not reach the database. Please try again in a moment." },
      { status: 503 }
    );
  }
}
