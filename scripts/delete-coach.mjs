// Remove a coach and everything attached to them
// File: scripts/delete-coach.mjs
//
//   npm run delete-coach -- <coachId>            show what would go
//   npm run delete-coach -- <coachId> --confirm  actually delete it
//
// For clearing out test accounts created through the signup form, which the
// demo seeder cannot touch: those are real records without `is_demo`, so
// `seed-demo -- --clear` correctly leaves them alone.
//
// MongoDB has no foreign keys, so deleting the coaches row on its own would
// leave their videos, ratings, follows and active session behind, pointing at
// an id that no longer exists.
//
// The collection list mirrors deleteCoachCascade() in
// backend/utils/cascade-helpers.js. It is duplicated rather than imported
// because that module resolves "@/lib/mongodb" through the Next.js path alias,
// which a plain node script cannot follow. If you add a collection there, add
// it here too.

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { join } from "path";

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
    // reported below
  }
}

loadEnvLocal();

const args = process.argv.slice(2);
const coachId = args.find((a) => !a.startsWith("--"));
const confirmed = args.includes("--confirm");

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "trainsight";

if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}
if (!coachId) {
  console.error("Usage: npm run delete-coach -- <coachId> [--confirm]");
  process.exit(1);
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

async function main() {
  await client.connect();
  const db = client.db(dbName);

  const coach = await db.collection("coaches").findOne({ id: coachId });
  if (!coach) {
    console.error(`No coach with id "${coachId}".`);
    process.exitCode = 1;
    return;
  }

  console.log(`coach   : ${coach.name} (${coach.id})`);
  console.log(`category: ${coach.category}`);
  console.log(`demo    : ${coach.is_demo ? "yes" : "no"}\n`);

  // Video ids first: once the videos are gone there is no way to find the
  // favourites that pointed at them.
  const videoIds = (
    await db.collection("videos").find({ coach_id: coachId }).project({ id: 1 }).toArray()
  ).map((v) => v.id);

  const targets = [
    ["coaches", { id: coachId }],
    ["coach_accounts", { coach_id: coachId }],
    ["sessions", { principal_id: coachId }],
    ["videos", { coach_id: coachId }],
    ["announcements", { coach_id: coachId }],
    ["training_programs", { coach_id: coachId }],
    ["blog", { coach_id: coachId }],
    ["pending_blogs", { coach_id: coachId }],
    ["certifications", { coach_id: coachId }],
    ["coach_ratings", { coach_id: coachId }],
    ["follows", { coach_id: coachId }],
    ["messages", { receiver_id: coachId }],
    ["favorites", { type: "coach", item_id: coachId }],
  ];

  if (videoIds.length > 0) {
    targets.push(["favorites", { type: "video", item_id: { $in: videoIds } }]);
  }

  let total = 0;
  for (const [collection, filter] of targets) {
    const count = confirmed
      ? (await db.collection(collection).deleteMany(filter)).deletedCount
      : await db.collection(collection).countDocuments(filter);

    if (count > 0) {
      console.log(`  ${String(count).padStart(3)} ${confirmed ? "deleted from" : "would go from"} ${collection}`);
      total += count;
    }
  }

  console.log();
  if (confirmed) {
    console.log(`removed ${total} documents.`);
  } else {
    console.log(`${total} documents would be removed. Re-run with --confirm to do it.`);
  }
}

main()
  .catch((error) => {
    console.error("Failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => client.close());
