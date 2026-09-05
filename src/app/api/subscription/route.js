// Your own subscription
// File: src/app/api/subscription/route.js
//
// This replaces "PUT /api/auth/profile {selectedPlan}". The difference that matters:
// asking for a paid plan here cannot succeed. It comes back 402 Payment Required,
// and the account keeps exactly the access it had.

import { NextResponse } from "next/server";
import { requireUser } from "@/backend/utils/session";
import { getUserById } from "@/backend/utils/auth-helpers";
import {
  cancelSubscription,
  requestPlanChange,
  subscriptionView,
} from "@/backend/utils/subscription-helpers";

// Never prerendered: this route depends on the request and the database.
export const dynamic = "force-dynamic";

const UNAUTHORIZED = NextResponse.json({ error: "Not authenticated" }, { status: 401 });

// GET /api/subscription -> plan, status, whether the trial is still available
export async function GET(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const user = await getUserById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({ success: true, subscription: subscriptionView(user) });
  } catch (error) {
    console.error("GET /api/subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/subscription { plan }
export async function POST(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    const { plan } = await request.json();
    const result = await requestPlanChange(userId, plan);

    if (result.paymentRequired) {
      return NextResponse.json(
        {
          success: false,
          paymentRequired: true,
          error: "Checkout is not connected yet, so this plan cannot be activated.",
          subscription: result.subscription,
        },
        { status: 402 }
      );
    }

    return NextResponse.json({ success: true, subscription: result.subscription });
  } catch (error) {
    const known = {
      "Invalid plan": 400,
      "Your free trial has already been used": 409,
      "You are already on this plan": 409,
      "User not found": 404,
    };

    if (known[error.message]) {
      return NextResponse.json({ error: error.message }, { status: known[error.message] });
    }

    console.error("POST /api/subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/subscription -> cancel
export async function DELETE(request) {
  try {
    const userId = await requireUser(request);
    if (!userId) return UNAUTHORIZED;

    return NextResponse.json({ success: true, subscription: await cancelSubscription(userId) });
  } catch (error) {
    if (error.message === "User not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("DELETE /api/subscription:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
