// Coach account helpers (MongoDB)
// File: backend/utils/coach-auth-helpers.js
//
// Sessions now live in backend/utils/session.js (one shared `sessions` collection).
// The old function names are kept as thin wrappers so existing coach routes keep
// working unchanged.

import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";
import { createCoach, getCoachById } from "@/backend/utils/db-helpers";
import {
  ROLES,
  createSession,
  readSession,
  destroySession,
  getSessionCookieName,
  getSessionTtlSeconds,
} from "@/backend/utils/session";

import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

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

// Kept for backwards compatibility -- both now point at the unified session cookie.
export const getCoachSessionCookieName = getSessionCookieName;
export const getCoachSessionTtlSeconds = getSessionTtlSeconds;

export async function createCoachAccount(coachData) {
  const coachAccounts = await getCollection("coach_accounts");

  const email = String(coachData.email || "").trim().toLowerCase();
  if (!email) throw new Error("Email is required");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a valid email address");
  if (!coachData.password) throw new Error("Password is required");
  if (String(coachData.password).length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (!coachData.name || !String(coachData.name).trim()) throw new Error("Name is required");

  const existing = await coachAccounts.findOne({ email });
  if (existing) throw new Error("A coach account with this email already exists");

  const base = slugify(coachData.name) || "coach";
  const coachId = `${base}-${crypto.randomBytes(3).toString("hex")}`;

  const passwordHash = await bcrypt.hash(coachData.password, BCRYPT_ROUNDS);
  const category = coachData.category || mapSpecializationToCategory(coachData.specialization);

  // Public-facing profile document
  await createCoach({
    id: coachId,
    name: String(coachData.name).trim(),
    category,
    bio: coachData.bio || "",
    image_url: coachData.image_url || "",
  });

  const now = new Date();
  try {
    await coachAccounts.insertOne({
      coach_id: coachId,
      email,
      password: passwordHash,
      phone: coachData.phone || "",
      specialization: coachData.specialization || "",
      experience: coachData.experience || "",
      certification: coachData.certification || "",
      status: coachData.status || "active",
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    if (error?.code === 11000) throw new Error("A coach account with this email already exists");
    throw error;
  }

  return { coachId };
}

export async function authenticateCoach(email, password) {
  const coachAccounts = await getCollection("coach_accounts");
  const account = await coachAccounts.findOne({
    email: String(email || "").trim().toLowerCase(),
  });

  if (!account) throw new Error("Invalid email or password");

  const ok = await bcrypt.compare(String(password || ""), account.password);
  if (!ok) throw new Error("Invalid email or password");

  return { coachId: account.coach_id };
}

export async function createCoachSession(coachId) {
  return createSession(coachId, ROLES.COACH);
}

export async function getCoachIdFromSession(sessionId) {
  const session = await readSession(sessionId);
  if (!session || session.role !== ROLES.COACH) return null;
  return session.principalId;
}

export async function deleteCoachSession(sessionId) {
  return destroySession(sessionId);
}

export async function getCoachBySessionId(sessionId) {
  const coachId = await getCoachIdFromSession(sessionId);
  if (!coachId) return null;
  return (await getCoachById(coachId)) || null;
}

/** Account record (email, phone, specialization...) as opposed to the public profile. */
export async function getCoachAccount(coachId) {
  const coachAccounts = await getCollection("coach_accounts");
  const account = await coachAccounts.findOne({ coach_id: coachId });
  if (!account) return null;
  const { password, _id, ...rest } = account;
  return rest;
}
