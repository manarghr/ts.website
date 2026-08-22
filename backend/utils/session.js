// Unified session layer for users, coaches and admins.
// File: backend/utils/session.js
//
// One `sessions` collection, one httpOnly cookie. The cookie holds ONLY a random
// session id -- never a user id, never a role. Everything about who you are is
// looked up server-side, so a user editing their cookie in devtools gets nothing.
//
// Because there is a single cookie, logging in as a user automatically ends a
// coach session and vice versa. That is the behaviour the app already wanted.

import crypto from "crypto";
import { getCollection } from "@/lib/mongodb";

const SESSION_COOKIE_NAME = "trainsight_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

export const ROLES = { USER: "user", COACH: "coach", ADMIN: "admin" };

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

export function getSessionTtlSeconds() {
  return SESSION_TTL_SECONDS;
}

/**
 * Cookie flags.
 * httpOnly -> JavaScript cannot read it, so an XSS bug cannot steal the session.
 * sameSite lax -> not sent on cross-site POSTs, which blocks basic CSRF.
 * secure in production -> only sent over HTTPS (Vercel is HTTPS, localhost is not).
 */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL_SECONDS,
  };
}

/**
 * Create a session row and return its id.
 * @param {string} principalId - users.id, coaches.id, or the admin email
 * @param {string} role - one of ROLES
 */
export async function createSession(principalId, role) {
  if (!principalId) throw new Error("principalId is required");
  if (!Object.values(ROLES).includes(role)) throw new Error(`Unknown role: ${role}`);

  const sessions = await getCollection("sessions");
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_TTL_SECONDS * 1000);

  await sessions.insertOne({
    session_id: sessionId,
    principal_id: principalId,
    role,
    created_at: now,
    expires_at: expiresAt,
  });

  return { sessionId, expiresAt };
}

/**
 * Look up a session. Returns null if missing or expired.
 * Expired rows are deleted on read; the TTL index also sweeps them in the background.
 */
export async function readSession(sessionId) {
  if (!sessionId) return null;

  const sessions = await getCollection("sessions");
  const doc = await sessions.findOne({ session_id: sessionId });
  if (!doc) return null;

  if (doc.expires_at && new Date(doc.expires_at).getTime() < Date.now()) {
    await sessions.deleteOne({ session_id: sessionId });
    return null;
  }

  return { principalId: doc.principal_id, role: doc.role, createdAt: doc.created_at };
}

export async function destroySession(sessionId) {
  if (!sessionId) return;
  const sessions = await getCollection("sessions");
  await sessions.deleteOne({ session_id: sessionId });
}

/** Remove every session belonging to one account (used on account delete). */
export async function destroyAllSessionsFor(principalId) {
  if (!principalId) return;
  const sessions = await getCollection("sessions");
  await sessions.deleteMany({ principal_id: principalId });
}

export function getSessionIdFromRequest(request) {
  return request?.cookies?.get(SESSION_COOKIE_NAME)?.value || null;
}

/** Read the caller's session straight from the request. Returns null if signed out. */
export async function getCurrentSession(request) {
  return readSession(getSessionIdFromRequest(request));
}

/**
 * Guard for API routes. Returns the principal id, or null when the caller is not
 * signed in with the required role.
 *
 *   const userId = await requireRole(request, ROLES.USER);
 *   if (!userId) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
 */
export async function requireRole(request, role) {
  const session = await getCurrentSession(request);
  if (!session || session.role !== role) return null;
  return session.principalId;
}

export const requireUser = (request) => requireRole(request, ROLES.USER);
export const requireCoach = (request) => requireRole(request, ROLES.COACH);
export const requireAdmin = (request) => requireRole(request, ROLES.ADMIN);

/** Attach the session cookie to a NextResponse. */
export function setSessionCookie(response, sessionId) {
  response.cookies.set(SESSION_COOKIE_NAME, sessionId, sessionCookieOptions());
  return response;
}

/** Clear the session cookie on a NextResponse. */
export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions(),
    maxAge: 0,
  });
  return response;
}
