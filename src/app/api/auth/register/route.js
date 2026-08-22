// User registration
// File: src/app/api/auth/register/route.js

import { NextResponse } from "next/server";
import { createUser } from "@/backend/utils/auth-helpers";
import { ROLES, createSession, setSessionCookie } from "@/backend/utils/session";

export async function POST(request) {
  try {
    const body = await request.json();

    const user = await createUser({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      password: body.password,
      gender: body.gender,
      age: body.age,
      weight: body.weight,
      height: body.height,
      workoutExperience: body.workoutExperience,
      sportsRating: body.sportsRating,
      selectedPlan: body.selectedPlan,
      profilePicture: body.profilePicture,
      bio: body.bio,
    });

    // Registering signs you straight in.
    const { sessionId } = await createSession(user.id, ROLES.USER);

    const response = NextResponse.json({ success: true, user }, { status: 201 });
    return setSessionCookie(response, sessionId);
  } catch (error) {
    console.error("POST /api/auth/register:", error);

    const message = error.message || "Registration failed";

    // Validation and duplicate errors are the user's fault -> 4xx.
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

    // Anything else is us -> 503, and we do NOT leak the internal message.
    return NextResponse.json(
      { error: "Could not reach the database. Please try again in a moment." },
      { status: 503 }
    );
  }
}
