// Gives every existing account the subscription fields the new entitlement check
// needs. Safe to run repeatedly -- it only touches users that have no
// subscriptionStatus yet.
//
//   node scripts/backfill-subscriptions.mjs          (show what would change)
//   node scripts/backfill-subscriptions.mjs --apply  (write it)
//
// The rule matches how a new signup is treated:
//   free-trial  -> active, 7 days from the day they registered (so old ones are
//                  already expired, which is correct -- they had their week)
//   monthly     -> pending_payment. Nobody has actually paid: there is no
//   annual         checkout yet. Granting these would be inventing revenue.
//   no plan     -> none

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
const apply = process.argv.includes("--apply");

if (!uri) {
  console.error("\n  MONGODB_URI is not set.\n");
  process.exit(1);
}

const DAY_MS = 86400000;
const FREE_TRIAL_DAYS = 7;

function fieldsFor(user) {
  const plan = user.selectedPlan || "";

  if (plan === "free-trial") {
    const start = user.createdAt ? new Date(user.createdAt) : new Date();
    return {
      subscriptionStatus: "active",
      subscriptionExpiresAt: new Date(start.getTime() + FREE_TRIAL_DAYS * DAY_MS),
      trialUsedAt: start,
    };
  }

  if (plan === "monthly" || plan === "annual") {
    return {
      subscriptionStatus: "pending_payment",
      subscriptionExpiresAt: null,
      trialUsedAt: null,
    };
  }

  return {
    subscriptionStatus: "none",
    subscriptionExpiresAt: null,
    trialUsedAt: null,
  };
}

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 10000 });

try {
  await client.connect();
  const users = client.db(dbName).collection("users");

  const pending = await users.find({ subscriptionStatus: { $exists: false } }).toArray();

  if (pending.length === 0) {
    console.log("\n  Nothing to do -- every user already has a subscriptionStatus.\n");
  } else {
    console.log(`\n  ${pending.length} user(s) without a subscriptionStatus:\n`);

    for (const user of pending) {
      const patch = fieldsFor(user);
      const until = patch.subscriptionExpiresAt
        ? ` until ${patch.subscriptionExpiresAt.toISOString().slice(0, 10)}`
        : "";
      console.log(
        `    ${user.email || user.id}  plan="${user.selectedPlan || "-"}"  ->  ${patch.subscriptionStatus}${until}`
      );

      if (apply) {
        await users.updateOne({ id: user.id }, { $set: { ...patch, updated_at: new Date() } });
      }
    }

    console.log(
      apply
        ? `\n  Done. ${pending.length} user(s) updated.\n`
        : "\n  Dry run -- nothing was written. Re-run with --apply to save.\n"
    );
  }
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
