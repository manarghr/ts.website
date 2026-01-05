import { NextResponse } from "next/server";
import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

export async function GET(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const programs = await getCollection("training_programs");
    const items = await programs
      .find({ coach_id: coachId })
      .sort({ created_at: -1 })
      .limit(200)
      .toArray();
    return NextResponse.json({ success: true, programs: items });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = await request.json();
    const {
      name,
      description,
      duration,
      schedule,
      exercises,
      price,
      discount,
      discount_percentage,
      goal,
    } = body;

    if (!name || !String(name).trim()) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!description || !String(description).trim())
      return NextResponse.json({ error: "Description is required" }, { status: 400 });

    const programs = await getCollection("training_programs");
    const now = new Date();
    const doc = {
      id: `program_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      coach_id: coachId,
      name: String(name).trim(),
      description: String(description).trim(),
      duration: String(duration || "").trim(),
      schedule: Array.isArray(schedule) ? schedule : [],
      exercises: Array.isArray(exercises) ? exercises : [],
      goal: goal || "",
      price: typeof price === "number" ? price : Number(price || 0),
      discount: !!discount,
      discount_percentage: typeof discount_percentage === "number" ? discount_percentage : Number(discount_percentage || 0),
      created_at: now,
      updated_at: now,
    };

    await programs.insertOne(doc);
    return NextResponse.json({ success: true, program: doc });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
