// Your training log
// File: src/app/api/workouts/route.js
//
// GET  /api/workouts        -> your recent sessions + totals
// POST /api/workouts        -> record a finished session
// DELETE /api/workouts?id=  -> remove one of your sessions
//
// The owner is always the session user, never a value from the request, so a
// caller can only ever read or write their own log.
//
// What arrives here is a summary -- exercise, reps, score, duration. The route
// accepts nothing else: no frames, no landmarks, no video. See /privacy.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";
import {
  saveWorkout,
  listWorkouts,
  workoutTotals,
  deleteWorkout,
  WorkoutError,
} from "@/backend/utils/workout-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

export async function GET(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get("limit")) || undefined;

    const [workouts, totals] = await Promise.all([
      listWorkouts(userId, limit),
      workoutTotals(userId),
    ]);

    return NextResponse.json({ success: true, workouts, totals });
  } catch (error) {
    console.error("GET /api/workouts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const workout = await saveWorkout(userId, body);
    return NextResponse.json({ success: true, workout }, { status: 201 });
  } catch (error) {
    if (error instanceof WorkoutError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("POST /api/workouts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const removed = await deleteWorkout(userId, id);
    if (!removed) return NextResponse.json({ error: "Workout not found" }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/workouts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
