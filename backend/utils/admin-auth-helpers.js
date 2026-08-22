// Admin authentication
// File: backend/utils/admin-auth-helpers.js
//
// The admin password used to be the literal string "admin123" compared in
// client-side JavaScript (src/app/admin/page.js), which meant anyone could read it
// with View Source. It now lives as a bcrypt hash in .env.local and is only ever
// compared on the server.
//
// There is no admins collection: this site has exactly one administrator, so an
// env var is simpler and safer than a table (nothing to enumerate, nothing to
// privilege-escalate into). If you ever need several admins, move these two values
// into an `admins` collection -- the session layer already supports it.

import bcrypt from "bcryptjs";
import { ROLES, createSession } from "@/backend/utils/session";

/**
 * A bcrypt hash is full of `$`, which collides with env-var expansion, so the hash
 * in .env.local is written with the $ escaped (\$2a\$10\$...). Depending on how the
 * file is loaded the backslashes may or may not survive, so strip them here and
 * accept either form -- otherwise a stray backslash produces a baffling
 * "invalid password" for a password that is perfectly correct.
 */
function readAdminHash() {
  const raw = process.env.ADMIN_PASSWORD_HASH;
  if (!raw) return null;

  const cleaned = raw.trim().replace(/\\\$/g, "$").replace(/^["']|["']$/g, "");

  // A valid bcrypt hash is exactly 60 chars and starts with $2a$ / $2b$ / $2y$.
  if (!/^\$2[aby]\$\d{2}\$.{53}$/.test(cleaned)) return null;

  return cleaned;
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && readAdminHash());
}

/**
 * Verify admin credentials and open a session.
 * Throws with a deliberately vague message so a wrong email and a wrong password
 * are indistinguishable to whoever is guessing.
 */
export async function authenticateAdmin(email, password) {
  const hash = readAdminHash();

  if (!process.env.ADMIN_EMAIL || !hash) {
    throw new Error(
      process.env.ADMIN_PASSWORD_HASH && !hash
        ? "ADMIN_PASSWORD_HASH in .env.local is not a valid bcrypt hash. It must be 60 characters starting with $2a$ -- regenerate it and escape each $ as \\$."
        : "Admin login is not configured. Add ADMIN_EMAIL and ADMIN_PASSWORD_HASH to .env.local"
    );
  }

  const submitted = String(email || "").trim().toLowerCase();
  const expected = String(process.env.ADMIN_EMAIL).trim().toLowerCase();

  // Always run bcrypt.compare, even when the email is wrong. Returning early on a
  // bad email would make that path measurably faster and leak which half failed.
  const passwordOk = await bcrypt.compare(String(password || ""), hash);

  if (submitted !== expected || !passwordOk) {
    throw new Error("Invalid email or password");
  }

  const { sessionId } = await createSession(expected, ROLES.ADMIN);
  return { sessionId, email: expected };
}
