// Coach Authentication + Session Helpers (MongoDB)
// File: backend/utils/coach-auth-helpers.js

import bcrypt from "bcrypt";
import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { createCoach, getCoachById } from "@/backend/utils/db-helpers";

const SESSION_COOKIE_NAME = "trainsight_coach_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

function mapSpecializationToCategory(s) {
  const v = String(s || "").toLowerCase();
  if (v.includes("yoga")) return "Yoga";
  if (v.includes("cardio") || v.includes("endurance")) return "Cardio";
  if (v.includes("nutrition")) return "Nutrition";
  if (v.includes("crossfit")) return "CrossFit";
  if (v.includes("rehab")) return "Rehabilitation";
  if (v.includes("sport")) return "Sports Performance";
  return "Strength";
}

export function getCoachSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getCoachSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}

export async function createCoachAccount(coachData) {
  const coachAccounts = await getCollection("coach_accounts");

  const email = String(coachData.email || "").trim().toLowerCase();
  if (!email) throw new Error("Email is required");
  if (!coachData.password) throw new Error("Password is required");
  if (!coachData.name) throw new Error("Name is required");

  const existing = await coachAccounts.findOne({ email });
  if (existing) throw new Error("Coach with this email already exists");

  const base = slugify(coachData.name) || "coach";
  const short = crypto.randomBytes(3).toString("hex");
  const coachId = `${base}-${short}`;

  const passwordHash = await bcrypt.hash(coachData.password, 10);
  const category = coachData.category || mapSpecializationToCategory(coachData.specialization);

  // Create the public coach profile document
  await createCoach({
    id: coachId,
    name: coachData.name,
    category,
    bio: coachData.bio || "",
    image_url: coachData.image_url || "",
  });

  const now = new Date();
  const accountDoc = {
    coach_id: coachId,
    email,
    password: passwordHash,
    // store extra info for dashboard editing (optional)
    phone: coachData.phone || "",
    specialization: coachData.specialization || "",
    experience: coachData.experience || "",
    certification: coachData.certification || "",
    status: coachData.status || "active",
    created_at: now,
    updated_at: now,
  };

  await coachAccounts.insertOne(accountDoc);
  return { coachId };
}

export async function authenticateCoach(email, password) {
  const coachAccounts = await getCollection("coach_accounts");
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const account = await coachAccounts.findOne({ email: normalizedEmail });
  if (!account) throw new Error("Invalid email or password");
  const ok = await bcrypt.compare(password, account.password);
  if (!ok) throw new Error("Invalid email or password");
  return { coachId: account.coach_id };
}

export async function createCoachSession(coachId) {
  const sessions = await getCollection("coach_sessions");
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);
  await sessions.insertOne({
    session_id: sessionId,
    coach_id: coachId,
    created_at: now,
    expires_at: expiresAt,
  });
  return { sessionId, expiresAt };
}

export async function getCoachIdFromSession(sessionId) {
  if (!sessionId) return null;
  const sessions = await getCollection("coach_sessions");
  const s = await sessions.findOne({ session_id: sessionId });
  if (!s) return null;
  if (s.expires_at && new Date(s.expires_at).getTime() < Date.now()) {
    // expire
    await sessions.deleteOne({ session_id: sessionId });
    return null;
  }
  return s.coach_id || null;
}

export async function deleteCoachSession(sessionId) {
  if (!sessionId) return;
  const sessions = await getCollection("coach_sessions");
  await sessions.deleteOne({ session_id: sessionId });
}

export async function getCoachBySessionId(sessionId) {
  const coachId = await getCoachIdFromSession(sessionId);
  if (!coachId) return null;
  const coach = await getCoachById(coachId);
  return coach || null;
}

