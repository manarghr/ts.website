// What things cost and who gets what
// File: src/lib/pricing.js
//
// One function decides every price on the platform, because the checkout screen,
// the coach's earnings page and the stored purchase record MUST agree. If the UI
// worked the discount out on its own, a rounding difference would show up as a
// coach being underpaid, which is the worst kind of bug to find late.
//
// No Node-only imports: the client uses this to show prices, the server uses it
// to decide what to actually charge and record.

/** TrainSight's cut of every coach sale. */
export const PLATFORM_FEE_PERCENT = 20;

/** What a paying subscriber saves on coach items. */
export const SUBSCRIBER_DISCOUNT_PERCENT = 10;

/** Everything a coach can sell. Adding a sixth is one string, not a new table. */
export const PURCHASABLE_TYPES = [
  "video",
  "program",
  "nutrition_plan",
  "live_session",
  "one_on_one",
];

export function isPurchasableType(type) {
  return PURCHASABLE_TYPES.includes(type);
}

const pct = (amount, percent) => Math.round((amount * percent) / 100);

const clampPercent = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(n, 100);
};

/**
 * The full breakdown of a single sale.
 *
 *   base
 *     - coach's own sale discount        -> comes out of the coach's side
 *     = net price, the number the coach's earning is calculated from
 *     - subscriber discount              -> comes out of TrainSight's fee
 *     = what the buyer actually pays
 *
 * The coach earns the same whether or not the buyer is a subscriber. The
 * subscriber discount is capped at the platform fee so our cut can never go
 * negative, however the two percentages are configured above.
 *
 * All amounts are whole currency units, rounded once, so the parts always add up.
 */
export function priceBreakdown({ basePrice, coachDiscountPercent = 0, isSubscriber = false }) {
  const base = Math.max(0, Math.round(Number(basePrice) || 0));

  const coachDiscount = pct(base, clampPercent(coachDiscountPercent));
  const netPrice = base - coachDiscount;

  const platformFeeFull = pct(netPrice, PLATFORM_FEE_PERCENT);
  const coachEarning = netPrice - platformFeeFull;

  const wantedDiscount = isSubscriber ? pct(netPrice, SUBSCRIBER_DISCOUNT_PERCENT) : 0;
  const subscriberDiscount = Math.min(wantedDiscount, platformFeeFull);

  const amountPaid = netPrice - subscriberDiscount;

  return {
    basePrice: base,
    coachDiscount,
    netPrice,
    subscriberDiscount,
    amountPaid,
    // What is left for us after the coach is paid. Never negative.
    platformFee: amountPaid - coachEarning,
    coachEarning,
    isFree: amountPaid === 0,
  };
}
