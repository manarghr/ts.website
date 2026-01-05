import { NextResponse } from "next/server";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";
import { getCollection } from "@/lib/mongodb";

export async function PUT(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const { name, category, bio, image_url } = body;

    const updateData = { updated_at: new Date() };
    if (name) updateData.name = name;
    if (category) updateData.category = category;
    if (bio !== undefined) updateData.bio = bio;
    if (image_url !== undefined) updateData.image_url = image_url;

    const coaches = await getCollection("coaches");
    const result = await coaches.updateOne({ id: coachId }, { $set: updateData });
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Coach not found" }, { status: 404 });
    }
    const coach = await coaches.findOne({ id: coachId });
    return NextResponse.json({ success: true, coach });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

