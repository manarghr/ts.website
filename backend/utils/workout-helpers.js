// Workout log
// File: backend/utils/workout-helpers.js
//
// Stores the RESULT of a training session and nothing else: which exercise, how
// many reps, the average form score, how long it took. No frames, no video, no
// pose landmarks, no joint angles -- the analysis happens in the browser and
// only these numbers ever come back (see AI/README.md and /privacy).
//
// This is what makes "track your progress over time" possible without holding
// anyone's camera footage. It is the data-minimisation trade-off stated plainly:
// we keep the summary, not the recording.
//
// One consequence worth being honest about: because the measuring happens on the
// client, these numbers are self-reported. A determined user could POST a
// thousand squats they never did. Verifying them server-side would mean
// uploading the video, which is exactly what we refuse to do -- so this is a
// personal log, and must never be used for leaderboards, prizes or anything
// competitive. The clamping below only keeps the data plausible enough to chart.

import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { ANALYSERS } from "@/lib/ai/analysers";

/** Exercises we can log, taken from the analysers so the two cannot drift. */
const LOGGABLE_EXERCISES = Object.keys(ANALYSERS);

// Ceilings chosen to be obviously-impossible rather than strict: the point is to
// stop a bad or malicious value from wrecking a chart, not to police training.
const MAX_REPS = 5000;
const MAX_DURATION_SECONDS = 24 * 60 * 60;
const MAX_CALORIES = 20000;

/** How many sessions a history request can return at once. */
const DEFAULT_LIMIT = 30;
const MAX_LIMIT = 100;

const clampInt = (value, min, max) => {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
};

export class WorkoutError extends Error {}

/**
 * Record one finished session.
 *
 * @param {string} userId
 * @param {object} input - { exercise, reps, formScore, durationSeconds, calories }
 * @returns {Promise<object>} the stored row
 */
export async function saveWorkout(userId, input = {}) {
  const exercise = String(input.exercise || "").trim().toLowerCase();
  if (!LOGGABLE_EXERCISES.includes(exercise)) {
    throw new WorkoutError("Unknown exercise");
  }

  const row = {
    id: `workout_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    user_id: userId,
    exercise,
    reps: clampInt(input.reps, 0, MAX_REPS),
    // Average across the analysed frames, not the last one, so a session that
    // ended mid-rep is not judged by that single frame.
    form_score: clampInt(input.formScore, 0, 100),
    duration_seconds: clampInt(input.durationSeconds, 0, MAX_DURATION_SECONDS),
    calories: clampInt(input.calories, 0, MAX_CALORIES),
    created_at: new Date(),
  };

  const workouts = await getCollection("workout_sessions");
  await workouts.insertOne(row);

  // insertOne mutates `row` with Mongo's own _id, which nothing outside the
  // database needs to know about.
  const { _id, ...stored } = row;
  return stored;
}

/**
 * A user's recent sessions, newest first.
 *
 * @param {string} userId
 * @param {number} [limit]
 */
export async function listWorkouts(userId, limit = DEFAULT_LIMIT) {
  const workouts = await getCollection("workout_sessions");

  return workouts
    .find({ user_id: userId }, { projection: { _id: 0 } })
    .sort({ created_at: -1 })
    .limit(clampInt(limit, 1, MAX_LIMIT))
    .toArray();
}

/**
 * Totals for the profile header. Computed in the database rather than by
 * pulling every session back and adding them up in JavaScript.
 *
 * @param {string} userId
 */
export async function workoutTotals(userId) {
  const workouts = await getCollection("workout_sessions");

  const [totals] = await workouts
    .aggregate([
      { $match: { user_id: userId } },
      {
        $group: {
          _id: null,
          sessions: { $sum: 1 },
          reps: { $sum: "$reps" },
          seconds: { $sum: "$duration_seconds" },
          calories: { $sum: "$calories" },
          averageFormScore: { $avg: "$form_score" },
          lastWorkoutAt: { $max: "$created_at" },
        },
      },
      { $project: { _id: 0 } },
    ])
    .toArray();

  // No sessions yet: return the same shape with zeros so callers never have to
  // special-case an empty history.
  if (!totals) {
    return {
      sessions: 0,
      reps: 0,
      seconds: 0,
      calories: 0,
      averageFormScore: 0,
      lastWorkoutAt: null,
    };
  }

  return { ...totals, averageFormScore: Math.round(totals.averageFormScore || 0) };
}

/** Delete one session. Scoped to the owner, so an id alone is not enough. */
export async function deleteWorkout(userId, workoutId) {
  const workouts = await getCollection("workout_sessions");
  const { deletedCount } = await workouts.deleteOne({ id: workoutId, user_id: userId });
  return deletedCount === 1;
}
