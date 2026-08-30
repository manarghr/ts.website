// Creates every index the app needs. Safe to run as many times as you like --
// createIndex on an index that already exists does nothing.
//
//   npm run setup-db
//
// Run this once after creating your Atlas cluster, and again whenever you add
// an index here.

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { join } from "path";

// Next.js loads .env.local automatically, but a plain node script does not.
function loadEnvLocal() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // no .env.local -- fall through to the check below
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "trainsight";

if (!uri) {
  console.error("\n  MONGODB_URI is not set.");
  console.error("  Create .env.local in the project root and put your Atlas URI in it.\n");
  process.exit(1);
}

// [collection, indexSpec, options]
const INDEXES = [
  // --- auth ---
  ["users", { email: 1 }, { unique: true }],
  ["users", { id: 1 }, { unique: true }],
  ["users", { phone: 1 }, { unique: true, sparse: true }],

  ["coach_accounts", { email: 1 }, { unique: true }],
  ["coach_accounts", { coach_id: 1 }, { unique: true }],

  // Sessions for users, coaches and admins all live here.
  ["sessions", { session_id: 1 }, { unique: true }],
  ["sessions", { principal_id: 1 }, {}],
  // TTL: Mongo deletes each session automatically once expires_at passes, so the
  // collection cannot grow forever. expireAfterSeconds:0 means "at that exact time".
  ["sessions", { expires_at: 1 }, { expireAfterSeconds: 0 }],

  // --- coaches ---
  ["coaches", { id: 1 }, { unique: true }],
  ["coaches", { category: 1, rating: -1 }, {}],
  ["coaches", { name: "text", bio: "text" }, {}],
  ["certifications", { coach_id: 1 }, {}],

  // one review per user per coach, enforced by the database
  ["coach_ratings", { coach_id: 1, user_id: 1 }, { unique: true }],
  // toggleFollow writes follower_id/following_id. The old index named user_id and
  // coach_id -- fields no follow document has ever had -- so every row looked like
  // (null, null) to a UNIQUE index: the second follow on the platform would fail.
  ["follows", { follower_id: 1, following_id: 1 }, { unique: true }],
  ["follows", { follower_id: 1, created_at: -1 }, {}],

  // saved coaches / liked videos / saved meals.
  // The unique index is what stops a double-click creating two identical saves.
  ["favorites", { user_id: 1, type: 1, item_id: 1 }, { unique: true }],
  ["favorites", { user_id: 1, type: 1, created_at: -1 }, {}],

  // --- content ---
  ["training_programs", { coach_id: 1 }, {}],
  ["training_programs", { id: 1 }, { sparse: true }],
  ["videos", { coach_id: 1, created_at: -1 }, {}],
  ["announcements", { coach_id: 1, created_at: -1 }, {}],
  ["blog", { created_at: -1 }, {}],
  ["pending_blogs", { created_at: -1 }, {}],
  ["meals", { created_at: -1 }, {}],
  ["nutrition_plans", { created_at: -1 }, {}],

  // --- money ---
  // The coach earnings page reads by coach + date, so that is the index.
  ["purchases", { coach_id: 1, created_at: -1 }, {}],
  // "have I already bought this?" on every item page.
  ["purchases", { user_id: 1, item_type: 1, item_id: 1 }, {}],
  ["purchases", { user_id: 1, created_at: -1 }, {}],
  ["payouts", { coach_id: 1, created_at: -1 }, {}],

  // --- inboxes ---
  ["notifications", { recipient_id: 1, recipient_role: 1, created_at: -1 }, {}],
  ["notifications", { recipient_id: 1, recipient_role: 1, read: 1 }, {}],
  ["messages", { receiver_id: 1, created_at: -1 }, {}],
  ["reports", { reported_coach_id: 1, created_at: -1 }, {}],
];

// Indexes that were wrong and must go. Adding a correct index does not remove a
// bad one, and a unique index on the wrong fields actively rejects valid writes.
const OBSOLETE_INDEXES = [
  ["follows", "user_id_1_coach_id_1"],
];

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

try {
  console.log(`\n  Connecting to ${dbName}...`);
  await client.connect();
  const db = client.db(dbName);
  console.log("  Connected.\n");

  for (const [collection, indexName] of OBSOLETE_INDEXES) {
    try {
      await db.collection(collection).dropIndex(indexName);
      console.log(`  drop  ${collection} ${indexName}`);
    } catch (error) {
      // 27 = IndexNotFound, which is the normal case on a fresh database.
      if (error.code !== 27 && error.codeName !== "IndexNotFound") {
        console.log(`  warn  could not drop ${collection} ${indexName}: ${error.message}`);
      }
    }
  }

  let created = 0;
  let skipped = 0;

  for (const [collection, spec, options] of INDEXES) {
    const label = `${collection} ${JSON.stringify(spec)}`;
    try {
      await db.collection(collection).createIndex(spec, options);
      console.log(`  ok    ${label}`);
      created++;
    } catch (error) {
      // 11000 here means existing documents already violate a unique index.
      if (error.code === 11000 || error.codeName === "DuplicateKey") {
        console.log(`  SKIP  ${label}`);
        console.log(`        duplicate data already in the collection -- clean it up, then re-run`);
      } else if (error.codeName === "IndexOptionsConflict" || error.code === 85 || error.code === 86) {
        console.log(`  SKIP  ${label} (an index with this name already exists with different options)`);
      } else {
        console.log(`  FAIL  ${label}: ${error.message}`);
      }
      skipped++;
    }
  }

  console.log(`\n  Done. ${created} indexes ready, ${skipped} skipped.\n`);
} catch (error) {
  console.error(`\n  Failed: ${error.message}`);
  if (/timed out|ServerSelection/i.test(error.message)) {
    console.error("  Most likely your IP is not allowed in Atlas -> Network Access.\n");
  } else if (/auth/i.test(error.message)) {
    console.error("  Check the username/password in MONGODB_URI.\n");
  }
  process.exitCode = 1;
} finally {
  await client.close();
}
