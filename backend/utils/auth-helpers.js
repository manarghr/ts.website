// User account helpers (MongoDB)
// File: backend/utils/auth-helpers.js

import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";

// bcryptjs is pure JS -- no native build step, so it works on Windows and on Vercel.
import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

/** Fields a user is allowed to change about themselves. Anything else is ignored. */
const EDITABLE_FIELDS = [
  "fullName",
  "phone",
  "gender",
  "age",
  "weight",
  "height",
  "bio",
  "profilePicture",
  "workoutExperience",
  "sportsRating",
  "selectedPlan",
];

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

/** Never let the password hash leave this module. */
function toPublicUser(user) {
  if (!user) return null;
  const { password, _id, ...rest } = user;
  return rest;
}

function assertValidRegistration({ fullName, email, phone, password }) {
  if (!fullName || !String(fullName).trim()) throw new Error("Full name is required");
  if (!email) throw new Error("Email is required");
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error("Please enter a valid email address");
  if (!phone || !String(phone).trim()) throw new Error("Phone number is required");
  if (!password) throw new Error("Password is required");
  if (String(password).length < 8) throw new Error("Password must be at least 8 characters");
}

/**
 * Create a user. Throws a friendly Error on duplicate email/phone.
 */
export async function createUser(userData) {
  const users = await getCollection("users");
  const email = normalizeEmail(userData.email);
  const phone = String(userData.phone || "").trim();

  assertValidRegistration({ ...userData, email, phone });

  const existing = await users.findOne({ $or: [{ email }, { phone }] });
  if (existing) {
    throw new Error(
      existing.email === email
        ? "An account with this email already exists"
        : "An account with this phone number already exists"
    );
  }

  const now = new Date();
  const newUser = {
    id: `user_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    fullName: String(userData.fullName).trim(),
    email,
    phone,
    password: await bcrypt.hash(userData.password, BCRYPT_ROUNDS),
    gender: userData.gender || "",
    age: userData.age ?? null,
    weight: userData.weight ?? null,
    height: userData.height ?? null,
    workoutExperience: userData.workoutExperience || "",
    sportsRating: userData.sportsRating || "",
    selectedPlan: userData.selectedPlan || "",
    profilePicture: userData.profilePicture || "",
    bio: userData.bio || "",
    createdAt: now,
    lastLogin: now,
    updated_at: now,
  };

  try {
    await users.insertOne(newUser);
  } catch (error) {
    // 11000 = unique index rejected it. Two people registering the same email at the
    // same instant both pass the findOne check above; only the index can stop that.
    if (error?.code === 11000) throw new Error("An account with this email already exists");
    throw error;
  }

  return toPublicUser(newUser);
}

/**
 * Verify email + password. Throws on failure with a deliberately vague message so
 * an attacker cannot tell "no such email" from "wrong password".
 */
export async function authenticateUser(email, password) {
  const users = await getCollection("users");
  const user = await users.findOne({ email: normalizeEmail(email) });

  if (!user) throw new Error("Invalid email or password");

  const ok = await bcrypt.compare(String(password || ""), user.password);
  if (!ok) throw new Error("Invalid email or password");

  await users.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } });

  return toPublicUser(user);
}

export async function getUserById(userId) {
  if (!userId) return null;
  const users = await getCollection("users");
  return toPublicUser(await users.findOne({ id: userId }));
}

export async function getUserByEmail(email) {
  const users = await getCollection("users");
  return toPublicUser(await users.findOne({ email: normalizeEmail(email) }));
}

/**
 * Update a profile. Only EDITABLE_FIELDS get through -- a caller cannot sneak in
 * `password`, `email` or `id` by adding them to the request body.
 */
export async function updateUser(userId, updateData) {
  const users = await getCollection("users");

  const patch = {};
  for (const field of EDITABLE_FIELDS) {
    if (updateData[field] !== undefined) patch[field] = updateData[field];
  }

  if (Object.keys(patch).length === 0) throw new Error("No valid fields to update");
  patch.updated_at = new Date();

  const result = await users.updateOne({ id: userId }, { $set: patch });
  if (result.matchedCount === 0) throw new Error("User not found");

  return getUserById(userId);
}

/** Password change requires proving you know the old one. */
export async function changeUserPassword(userId, currentPassword, newPassword) {
  if (!newPassword || String(newPassword).length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  const users = await getCollection("users");
  const user = await users.findOne({ id: userId });
  if (!user) throw new Error("User not found");

  const ok = await bcrypt.compare(String(currentPassword || ""), user.password);
  if (!ok) throw new Error("Current password is incorrect");

  await users.updateOne(
    { id: userId },
    { $set: { password: await bcrypt.hash(newPassword, BCRYPT_ROUNDS), updated_at: new Date() } }
  );

  return true;
}
