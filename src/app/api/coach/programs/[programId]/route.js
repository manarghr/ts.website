import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { getCoachIdFromSession, getCoachSessionCookieName } from "@/backend/utils/coach-auth-helpers";

export async function PUT(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { programId } = await params;
    if (!programId) return NextResponse.json({ error: "Program ID is required" }, { status: 400 });

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

    const programs = await getCollection("training_programs");
    const existing = await programs.findOne({ id: programId });
    if (!existing) return NextResponse.json({ error: "Program not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const update = { updated_at: new Date() };
    if (name !== undefined) update.name = String(name).trim();
    if (description !== undefined) update.description = String(description).trim();
    if (duration !== undefined) update.duration = String(duration).trim();
    if (goal !== undefined) update.goal = String(goal).trim();
    if (schedule !== undefined) update.schedule = Array.isArray(schedule) ? schedule : [];
    if (exercises !== undefined) update.exercises = Array.isArray(exercises) ? exercises : [];
    if (price !== undefined) update.price = typeof price === "number" ? price : Number(price || 0);
    if (discount !== undefined) update.discount = !!discount;
    if (discount_percentage !== undefined) {
      update.discount_percentage =
        typeof discount_percentage === "number" ? discount_percentage : Number(discount_percentage || 0);
    }

    await programs.updateOne({ id: programId }, { $set: update });
    const updated = await programs.findOne({ id: programId });
    return NextResponse.json({ success: true, program: updated });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const sid = request?.cookies?.get(getCoachSessionCookieName())?.value;
    const coachId = await getCoachIdFromSession(sid);
    if (!coachId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const { programId } = await params;
    if (!programId) return NextResponse.json({ error: "Program ID is required" }, { status: 400 });

    const programs = await getCollection("training_programs");
    const existing = await programs.findOne({ id: programId });
    if (!existing) return NextResponse.json({ error: "Program not found" }, { status: 404 });
    if (existing.coach_id !== coachId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await programs.deleteOne({ id: programId });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

