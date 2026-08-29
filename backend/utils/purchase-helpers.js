// Buying a coach's item, and what the coach earns from it
// File: backend/utils/purchase-helpers.js
//
// Prices are NEVER taken from the request. The client sends what it wants to buy;
// the amount is recalculated here from the item in the database. Otherwise anyone
// could post {"amount": 1} and own a 20,000 program -- the same lesson as taking
// userId from the body, applied to money.

import { getCollection } from "@/lib/mongodb";
import { priceBreakdown, isPurchasableType } from "@/lib/pricing";
import { isPaidPlan } from "@/lib/plans";
import { getUserById } from "@/backend/utils/auth-helpers";
import { notify, NOTIFICATION_TYPES } from "@/backend/utils/notification-helpers";

/** Where each sellable type lives, and which field holds its display name. */
const ITEM_SOURCES = {
  program: { collection: "training_programs", titleField: "name" },
  video: { collection: "videos", titleField: "title" },
  nutrition_plan: { collection: "nutrition_plans", titleField: "title" },
  // live_session and one_on_one land here once scheduling exists.
};

export async function findPurchasableItem(itemType, itemId) {
  const source = ITEM_SOURCES[itemType];
  if (!source) return null;

  const collection = await getCollection(source.collection);
  const doc = await collection.findOne({ id: itemId });
  if (!doc) return null;

  return {
    id: doc.id,
    type: itemType,
    title: doc[source.titleField] || "Untitled",
    coachId: doc.coach_id || null,
    basePrice: Number(doc.price) || 0,
    coachDiscountPercent: doc.discount ? Number(doc.discount_percentage) || 0 : 0,
  };
}

export async function hasPurchased(userId, itemType, itemId) {
  const purchases = await getCollection("purchases");
  const found = await purchases.findOne({
    user_id: userId,
    item_type: itemType,
    item_id: itemId,
    status: "paid",
  });
  return Boolean(found);
}

/**
 * Record a purchase. Returns the stored row.
 *
 * No money moves yet -- this grants access and writes the ledger entry the coach's
 * wallet is built from. When a real payment provider is added, it goes in front of
 * this call and everything downstream stays as it is.
 */
export async function createPurchase({ userId, itemType, itemId }) {
  if (!isPurchasableType(itemType)) throw new Error("Unknown item type");

  const item = await findPurchasableItem(itemType, itemId);
  if (!item) throw new Error("Item not found");
  if (!item.coachId) throw new Error("This item has no coach to pay");

  if (await hasPurchased(userId, itemType, itemId)) throw new Error("Already purchased");

  const user = await getUserById(userId);
  if (!user) throw new Error("User not found");

  const breakdown = priceBreakdown({
    basePrice: item.basePrice,
    coachDiscountPercent: item.coachDiscountPercent,
    isSubscriber: isPaidPlan(user.selectedPlan),
  });

  const purchases = await getCollection("purchases");
  const row = {
    user_id: userId,
    coach_id: item.coachId,
    item_type: itemType,
    item_id: itemId,
    // Copied deliberately: a receipt has to keep saying what it said, even after
    // the coach renames the program or changes its price.
    item_title: item.title,
    base_price: breakdown.basePrice,
    coach_discount: breakdown.coachDiscount,
    subscriber_discount: breakdown.subscriberDiscount,
    amount_paid: breakdown.amountPaid,
    platform_fee: breakdown.platformFee,
    coach_earning: breakdown.coachEarning,
    buyer_plan: user.selectedPlan || "",
    status: "paid",
    created_at: new Date(),
  };

  await purchases.insertOne(row);

  await notify({
    recipientId: item.coachId,
    recipientRole: "coach",
    type: NOTIFICATION_TYPES.SALE,
    title: `${user.fullName || "Someone"} bought "${item.title}"`,
    body: `You earned ${breakdown.coachEarning.toFixed(2)}`,
    link: "/coach/dashboard",
  });

  const { _id, ...stored } = row;
  return stored;
}

export async function listPurchasesForUser(userId, limit = 100) {
  const purchases = await getCollection("purchases");
  return purchases
    .find({ user_id: userId, status: "paid" })
    .sort({ created_at: -1 })
    .limit(limit)
    .project({ _id: 0 })
    .toArray();
}

/**
 * The coach's wallet: what they have earned, what has been paid out, and what is
 * therefore still owed. Totals are summed in the database rather than by pulling
 * every row into memory.
 */
export async function getCoachWallet(coachId, recentLimit = 20) {
  const purchases = await getCollection("purchases");
  const payouts = await getCollection("payouts");

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [totals, monthTotals, paidOut, recent] = await Promise.all([
    purchases
      .aggregate([
        { $match: { coach_id: coachId, status: "paid" } },
        { $group: { _id: null, earned: { $sum: "$coach_earning" }, sales: { $sum: 1 } } },
      ])
      .toArray(),
    purchases
      .aggregate([
        { $match: { coach_id: coachId, status: "paid", created_at: { $gte: startOfMonth } } },
        { $group: { _id: null, earned: { $sum: "$coach_earning" }, sales: { $sum: 1 } } },
      ])
      .toArray(),
    payouts
      .aggregate([
        { $match: { coach_id: coachId, status: "paid" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ])
      .toArray(),
    purchases
      .find({ coach_id: coachId, status: "paid" })
      .sort({ created_at: -1 })
      .limit(recentLimit)
      .project({ _id: 0, user_id: 0 })
      .toArray(),
  ]);

  const lifetimeEarned = totals[0]?.earned || 0;
  const totalPaidOut = paidOut[0]?.total || 0;

  return {
    lifetimeEarned,
    totalPaidOut,
    // What we still owe them.
    availableBalance: lifetimeEarned - totalPaidOut,
    totalSales: totals[0]?.sales || 0,
    thisMonthEarned: monthTotals[0]?.earned || 0,
    thisMonthSales: monthTotals[0]?.sales || 0,
    recent,
  };
}
