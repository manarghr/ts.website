// Fill the database with demo content
// File: scripts/seed-demo.mjs
//
//   npm run seed-demo            insert or update the demo content
//   npm run seed-demo -- --clear remove everything it inserted
//
// A showcase with no coaches, no programs and no articles reads as broken
// rather than unfinished, so this puts enough content in the database for the
// site to look like a working product.
//
// Three properties worth knowing:
//
//   Idempotent  Documents are upserted by a fixed id, so running it twice
//               changes nothing. Edit demo-data.mjs and re-run to update.
//   Reversible  Every document carries `is_demo: true`, so --clear removes
//               exactly what this script added and nothing a real user made.
//   Additive    It never touches documents it did not create.

import { MongoClient } from "mongodb";
import { readFileSync } from "fs";
import { join } from "path";
import { programs, meals, videos } from "./demo-data.mjs";
import { blogs } from "./demo-blogs.mjs";
import { coaches } from "./demo-coaches.mjs";

// Next.js loads .env.local automatically, a plain node script does not.
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
    // no .env.local -- the check below reports it
  }
}

loadEnvLocal();

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "trainsight";
const clearing = process.argv.includes("--clear");

if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local first.");
  process.exit(1);
}

const now = new Date();

/** Spread creation dates over the past few months so lists are not all "today". */
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const withMeta = (doc, index) => ({
  ...doc,
  is_demo: true,
  created_at: daysAgo(index * 9 + 3),
  updated_at: daysAgo(index * 9 + 3),
});

/** Documents keyed by the collection they belong in. */
function buildDocuments() {
  return {
    // Ratings and counts are derived from the index, not random, so re-running
    // the seed does not silently change every number on the site.
    coaches: coaches.map((coach, index) => ({
      ...withMeta(coach, index % 12),
      // Left empty on purpose: the components fall back to /coach-avatar.svg.
      // These are invented people and should not wear real faces.
      image_url: "",
      rating: Number((4.3 + ((index * 7) % 7) / 10).toFixed(1)),
      total_ratings: 40 + ((index * 37) % 210),
      followers_count: 900 + ((index * 613) % 7200),
      following_count: 60 + ((index * 29) % 240),
    })),

    training_programs: programs.map(withMeta),

    blog: blogs.map((blog, index) => ({
      ...withMeta(blog, index),
      // The blog UI prints `date` directly, so it is a display string, not a Date.
      date: daysAgo(index * 9 + 3).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    })),

    meals: meals.map(withMeta),

    videos: videos.map((video, index) => ({
      ...withMeta(video, index),
      id: `demo_video_${index + 1}`,
      // No thumbnail and no footage: the UI falls back to
      // /video-placeholder.svg rather than an unrelated stock photo.
      thumbnail_url: "",
      video_url: "",
    })),
  };
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

async function main() {
  await client.connect();
  const db = client.db(dbName);
  console.log(`connected to "${dbName}"\n`);

  if (clearing) {
    let removed = 0;
    for (const name of ["coaches", "training_programs", "blog", "meals", "videos"]) {
      const { deletedCount } = await db.collection(name).deleteMany({ is_demo: true });
      removed += deletedCount;
      console.log(`  ${String(deletedCount).padStart(3)} removed from ${name}`);
    }
    console.log(`\nremoved ${removed} demo documents. Real content is untouched.`);
    return;
  }

  const documents = buildDocuments();
  let inserted = 0;
  let updated = 0;

  for (const [collection, docs] of Object.entries(documents)) {
    let added = 0;
    let changed = 0;

    for (const doc of docs) {
      // Upsert on the app's own `id`, not Mongo's _id, so re-running updates
      // the same document rather than creating a second copy.
      const result = await db
        .collection(collection)
        .updateOne({ id: doc.id }, { $set: doc }, { upsert: true });

      if (result.upsertedCount) added += 1;
      else if (result.matchedCount) changed += 1;
    }

    inserted += added;
    updated += changed;
    console.log(
      `  ${collection.padEnd(18)} ${String(added).padStart(3)} new, ${String(changed).padStart(3)} updated`
    );
  }

  console.log(`\n${inserted} inserted, ${updated} updated.`);
  console.log("Every document is tagged is_demo: true -- remove with:");
  console.log("  npm run seed-demo -- --clear");
}

main()
  .catch((error) => {
    console.error("\nSeeding failed:", error.message);
    if (/timed out|ServerSelection/i.test(error.message)) {
      console.error("Check that your IP is allowed in Atlas (Network Access).");
    }
    process.exitCode = 1;
  })
  .finally(() => client.close());
