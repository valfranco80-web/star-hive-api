import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const { priceId, email } = await req.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "subscription",
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      trial_period_days: 7,
    },
    success_url: `https://star-hive-tarot.lovable.app?success=true`,
cancel_url: `https://star-hive-tarot.lovable.app?canceled=true`,
  });

  return NextResponse.json({ url: session.url }, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
