// MongoDB connection
// File: src/lib/mongodb.js
//
// One shared, pooled MongoClient for the whole app.
//
// The `global._mongoClientPromise` trick matters in development: Next.js reloads
// modules on every file save, and without it each reload would open a brand new
// connection pool until Atlas refuses more. In production the module is loaded
// once, so a plain module-scoped variable is correct.

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "trainsight";

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
};

let clientPromise;

if (!uri) {
  // Deliberately not thrown at module scope -- that would crash `next build`
  // and every unrelated page. Routes that actually touch the DB fail instead.
  clientPromise = Promise.reject(
    new Error("MONGODB_URI is not set. Add it to .env.local and restart the dev server.")
  );
  // Mark as handled so Node does not log an unhandled-rejection warning at boot.
  clientPromise.catch(() => {});
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, options).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, options).connect();
}

export default clientPromise;

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Main entry point used everywhere in the app.
 * Rewrites driver errors into something readable, without leaking the URI.
 */
export async function getCollection(collectionName) {
  try {
    const db = await getDatabase();
    return db.collection(collectionName);
  } catch (error) {
    const raw = error?.message || "";
    let message = `Database connection failed: ${raw}`;

    if (raw.includes("MONGODB_URI is not set")) {
      message = raw;
    } else if (raw.includes("timed out") || raw.includes("ServerSelection")) {
      message =
        "MongoDB connection timed out. Check that your IP is allowed in Atlas (Network Access) and that the cluster is running.";
    } else if (raw.includes("ENOTFOUND") || raw.includes("ECONNREFUSED")) {
      message = "Cannot reach the MongoDB server. Check MONGODB_URI in .env.local.";
    } else if (raw.toLowerCase().includes("auth")) {
      message = "MongoDB authentication failed. Check the username and password in MONGODB_URI.";
    }

    console.error(`[mongodb] getCollection("${collectionName}") failed:`, raw);
    throw new Error(message);
  }
}

/** Ping the server. Used by /api/health. */
export async function testConnection() {
  try {
    const client = await clientPromise;
    await client.db("admin").command({ ping: 1 });
    return true;
  } catch (error) {
    console.error("[mongodb] ping failed:", error?.message);
    return false;
  }
}

/** Collection names + document counts. Handy for debugging and seeding. */
export async function listCollectionsWithStats() {
  const db = await getDatabase();
  const collections = await db.listCollections().toArray();

  return Promise.all(
    collections.map(async (coll) => {
      const count = await db.collection(coll.name).countDocuments();
      return { name: coll.name, count, isEmpty: count === 0 };
    })
  );
}

export async function getDatabaseByName(name) {
  const client = await clientPromise;
  return client.db(name);
}
