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

export function isValidPlan(value) {
  return PLAN_VALUES.includes(value);
}

/** The full plan object, for showing "Free Trial" instead of the raw "free-trial". */
export function getPlan(value) {
  return PLANS.find((plan) => plan.value === value) || null;
}
