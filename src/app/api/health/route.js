// Backend health check
// File: src/app/api/health/route.js
//
// Two audiences, two answers.
//
// Anyone may ask whether the site is up -- uptime monitors and load balancers
// need that, and it has to work without credentials. They get a bare status and
// the right code: 200 healthy, 503 not.
//
// Everything useful for debugging is also everything useful for reconnaissance:
// the database name, the list of collections, which env vars are set, and raw
// driver errors. That used to be public. It now requires an admin session.

import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/utils/session";
import { testConnection, getDatabase } from "@/lib/mongodb";

// Reads the session cookie, so it can never be statically rendered.
export const dynamic = "force-dynamic";

export async function GET(request) {
  const timestamp = new Date().toISOString();

  // Ask the admin question first: if the ping throws, we still need to know
  // whether this caller is allowed to see why.
  const isAdmin = Boolean(await requireAdmin(request).catch(() => null));

  let connected = false;
  let failure = null;

  try {
    connected = await testConnection();
  } catch (error) {
    failure = error?.message || "Unknown error";
  }

  const status = connected ? "ok" : "error";
  const httpStatus = connected ? 200 : 503;

  if (!isAdmin) {
    return NextResponse.json({ status, timestamp }, { status: httpStatus });
  }

  const detail = {
    database: process.env.MONGODB_DB || "trainsight (default)",
    nodeEnv: process.env.NODE_ENV || "development",
    mongodbUri: process.env.MONGODB_URI ? "configured" : "missing",
  };

  if (connected) {
    try {
      const db = await getDatabase();
      const collections = await db.listCollections().toArray();
      detail.database = db.databaseName;
      detail.collections = collections.map((c) => c.name);
      detail.collectionCount = collections.length;
    } catch (error) {
      detail.collectionsError = error?.message || "Could not list collections";
    }
  } else if (failure) {
    detail.error = failure;
  }

  return NextResponse.json({ status, timestamp, mongodb: detail }, { status: httpStatus });
}
