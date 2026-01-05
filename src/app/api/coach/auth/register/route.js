import { NextResponse } from "next/server";
import {
  createCoachAccount,
  createCoachSession,
  getCoachSessionCookieName,
  getCoachSessionTtlSeconds,
} from "@/backend/utils/coach-auth-helpers";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, phone, specialization, experience, certification, bio, category, image_url } = body;

    const { coachId } = await createCoachAccount({
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      certification,
      bio,
      category,
      image_url,
    });

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
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 400 }
    );
  }
}

