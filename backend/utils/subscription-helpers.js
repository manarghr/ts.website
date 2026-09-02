// Subscriptions -- the only place a plan is allowed to change
// File: backend/utils/subscription-helpers.js
//
// Everything that grants membership goes through here, so there is exactly one
// answer to "how did this account become a paying member?".
//
// The rule: the client may ask, the server decides.
//   free trial  -> the server can switch it on itself, it costs nothing, once only
//   paid plan   -> recorded as pending_payment and grants NOTHING until money moves
//
// activateSubscription() is the hook a payment provider calls on success. Nothing
// reachable from the browser calls it today, which is the point.

import { getCollection } from "@/lib/mongodb";
import { getUserById } from "@/backend/utils/auth-helpers";
import {
  FREE_TRIAL_DAYS,
  SUBSCRIPTION_STATUS,
  hasPaidSubscription,
  hasPremiumAccess,
  isFreePlan,
  isValidPlan,
} from "@/lib/plans";

const DAY_MS = 86400000;

/** How long each plan runs once paid. Null = until cancelled. */
const PLAN_DAYS = {
  "free-trial": FREE_TRIAL_DAYS,
  monthly: 30,
  annual: 365,
};

async function patchUser(userId, patch) {
  const users = await getCollection("users");
  const result = await users.updateOne(
    { id: userId },
    { $set: { ...patch, updated_at: new Date() } }
  );
  if (result.matchedCount === 0) throw new Error("User not found");
  return getUserById(userId);
}

/** What the profile page and /api/subscription show. Safe to send to the client. */
export function subscriptionView(user) {
  return {
    plan: user?.selectedPlan || "",
    status: user?.subscriptionStatus || SUBSCRIPTION_STATUS.NONE,
    expiresAt: user?.subscriptionExpiresAt || null,
    premium: hasPremiumAccess(user),
    paid: hasPaidSubscription(user),
    trialAvailable: !user?.trialUsedAt,
  };
}

/**
 * A user asking to move to `plan`.
 *
 * Returns { activated, paymentRequired, subscription }. A paid plan always comes
 * back with activated:false -- the route turns that into HTTP 402, and the user
 * keeps whatever access they already had.
 */
export async function requestPlanChange(userId, plan) {
  if (!isValidPlan(plan)) throw new Error("Invalid plan");

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  if (isFreePlan(plan)) {
    // One trial per account. Without this the "free" plan is an infinite
    // membership: cancel, re-pick, cancel, re-pick.
    if (user.trialUsedAt) throw new Error("Your free trial has already been used");

    const now = new Date();
    const updated = await patchUser(userId, {
      selectedPlan: plan,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      subscriptionExpiresAt: new Date(now.getTime() + FREE_TRIAL_DAYS * DAY_MS),
      trialUsedAt: now,
    });

    return { activated: true, paymentRequired: false, subscription: subscriptionView(updated) };
  }

  if (user.selectedPlan === plan && hasPaidSubscription(user)) {
    throw new Error("You are already on this plan");
  }

  // Intent only. subscriptionStatus is what grants access, and this is not "active".
  const updated = await patchUser(userId, {
    selectedPlan: plan,
    subscriptionStatus: SUBSCRIPTION_STATUS.PENDING,
    subscriptionExpiresAt: null,
  });

  return { activated: false, paymentRequired: true, subscription: subscriptionView(updated) };
}

/**
 * Turn a paid plan on. SERVER ONLY -- call this from a verified payment result,
 * never from a request body.
 */
export async function activateSubscription(userId, plan, { days } = {}) {
  if (!isValidPlan(plan)) throw new Error("Invalid plan");

  const length = days ?? PLAN_DAYS[plan] ?? null;
  const updated = await patchUser(userId, {
    selectedPlan: plan,
    subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    subscriptionExpiresAt: length ? new Date(Date.now() + length * DAY_MS) : null,
    subscriptionActivatedAt: new Date(),
  });

  return subscriptionView(updated);
}

/** Give up the plan. Access stops now, and the trial stays used. */
export async function cancelSubscription(userId) {
  const updated = await patchUser(userId, {
    subscriptionStatus: SUBSCRIPTION_STATUS.CANCELLED,
    subscriptionExpiresAt: null,
  });

  return subscriptionView(updated);
}
