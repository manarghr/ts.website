// Subscription plans
// File: src/lib/plans.js
//
// One definition, imported by the profile switcher AND by the server-side check in
// auth-helpers. Same reasoning as REPORT_REASONS: if the list lives in two places,
// the server eventually accepts something the UI never offered.
//
// Nothing Node-only in here -- this file is loaded by client components too.

export const PLANS = [
  {
    value: "free-trial",
    title: "Free Trial",
    subtitle: "7 days free",
    description: "Full access for 7 days to explore workout plans and community features.",
  },
  {
    value: "monthly",
    title: "Monthly Plan",
    subtitle: "$29/month",
    description: "All workout programs, nutrition plans and coach consultations. Cancel anytime.",
  },
  {
    value: "annual",
    title: "Annual Plan",
    subtitle: "$199/year",
    description: "Save 43%. Everything in Monthly, plus priority support and exclusive content.",
  },
];

export const PLAN_VALUES = PLANS.map((plan) => plan.value);

/** The plans that actually pay. Used for the member discount and premium content. */
export const PAID_PLANS = ["monthly", "annual"];

export function isPaidPlan(value) {
  return PAID_PLANS.includes(value);
}

export function isValidPlan(value) {
  return PLAN_VALUES.includes(value);
}

/** The full plan object, for showing "Free Trial" instead of the raw "free-trial". */
export function getPlan(value) {
  return PLANS.find((plan) => plan.value === value) || null;
}

// --- Entitlement ------------------------------------------------------------
//
// `selectedPlan` is only what the user PICKED. It used to be the whole story, and
// because it sits in the profile-update whitelist that meant anyone could PUT
// {"selectedPlan":"annual"} and hand themselves a paid membership.
//
// What you are ENTITLED to now lives in `subscriptionStatus`, which no client can
// write: it is not an editable profile field, and only the subscription helpers
// (and later, the payment webhook) set it to "active".

export const SUBSCRIPTION_STATUS = {
  NONE: "none",
  /** Picked a paid plan, money has not been taken yet. Grants nothing. */
  PENDING: "pending_payment",
  ACTIVE: "active",
  CANCELLED: "cancelled",
};

export const FREE_TRIAL_DAYS = 7;

/** Plans that cost nothing, so the server may switch them on by itself. */
export function isFreePlan(value) {
  return value === "free-trial";
}

function notExpired(user) {
  const until = user?.subscriptionExpiresAt;
  if (!until) return true; // no end date == open-ended
  return new Date(until).getTime() > Date.now();
}

/**
 * May this account open premium content? The free trial counts -- it is a real,
 * time-limited grant. A paid plan that was never paid for does not.
 */
export function hasPremiumAccess(user) {
  if (!user) return false;
  return (
    user.subscriptionStatus === SUBSCRIPTION_STATUS.ACTIVE &&
    isValidPlan(user.selectedPlan) &&
    notExpired(user)
  );
}

/** Paying members only -- this is what earns the checkout discount. */
export function hasPaidSubscription(user) {
  return hasPremiumAccess(user) && isPaidPlan(user.selectedPlan);
}

/**
 * The subscription fields a brand-new account starts with.
 *
 * Pure and date-only so `createUser` stays one insert, and so the rule "signing up
 * on the annual plan does not make you a member" is written down exactly once.
 */
export function newSubscriptionFields(plan, now = new Date()) {
  if (!isValidPlan(plan)) {
    return {
      selectedPlan: "",
      subscriptionStatus: SUBSCRIPTION_STATUS.NONE,
      subscriptionExpiresAt: null,
      trialUsedAt: null,
    };
  }

  if (isFreePlan(plan)) {
    return {
      selectedPlan: plan,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      subscriptionExpiresAt: new Date(now.getTime() + FREE_TRIAL_DAYS * 86400000),
      trialUsedAt: now,
    };
  }

  // Paid plan chosen at signup: recorded as an intent, inactive until paid.
  return {
    selectedPlan: plan,
    subscriptionStatus: SUBSCRIPTION_STATUS.PENDING,
    subscriptionExpiresAt: null,
    trialUsedAt: null,
  };
}
