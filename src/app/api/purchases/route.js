// Buying a coach's item
// File: src/app/api/purchases/route.js
//
// The buyer is the session user and the price is read from the database, so a
// request can only choose WHAT to buy -- never who is buying or for how much.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";
import {
  createPurchase,
  hasPurchased,
  listPurchasesForUser,
  findPurchasableItem,
} from "@/backend/utils/purchase-helpers";
import { priceBreakdown } from "@/lib/pricing";
import { hasPaidSubscription } from "@/lib/plans";
import { getUserById } from "@/backend/utils/auth-helpers";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

// GET /api/purchases                          -> everything you have bought
// GET /api/purchases?itemType=program&itemId=x -> do you own this, and what would it cost
export async function GET(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get("itemType");
    const itemId = searchParams.get("itemId");

    if (!itemType || !itemId) {
      return NextResponse.json({ success: true, purchases: await listPurchasesForUser(userId) });
    }

    const [owned, item, user] = await Promise.all([
      hasPurchased(userId, itemType, itemId),
      findPurchasableItem(itemType, itemId),
      getUserById(userId),
    ]);

    // Quote the price from here too, so the button shows exactly what will be charged.
    const quote = item
      ? priceBreakdown({
          basePrice: item.basePrice,
          coachDiscountPercent: item.coachDiscountPercent,
          isSubscriber: hasPaidSubscription(user),
        })
      : null;

    return NextResponse.json({ success: true, owned, quote });
  } catch (error) {
    console.error("GET /api/purchases:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/purchases  { itemType, itemId }
export async function POST(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { itemType, itemId } = await request.json();
    if (!itemType || !itemId) {
      return NextResponse.json({ error: "itemType and itemId are required" }, { status: 400 });
    }

    const purchase = await createPurchase({ userId, itemType, itemId });
    return NextResponse.json({ success: true, purchase });
  } catch (error) {
    const known = {
      "Unknown item type": 400,
      "Item not found": 404,
      "This item has no coach to pay": 400,
      "Already purchased": 409,
      "User not found": 401,
    };

    if (known[error.message]) {
      return NextResponse.json({ error: error.message }, { status: known[error.message] });
    }

    console.error("POST /api/purchases:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
