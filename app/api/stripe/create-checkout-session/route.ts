import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { planId } = await request.json()

  // Fetch plan details
  const { data: plan } = await supabase.from("subscription_plans").select("*").eq("id", planId).single()

  if (!plan || !plan.stripe_price_id) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  let customerId: string

  const { data: subscription } = await supabase.from("user_subscriptions").select("*").eq("user_id", user.id).single()

  if (subscription?.stripe_customer_id) {
    customerId = subscription.stripe_customer_id
  } else {
    const customer = await stripe.customers.create({
      email: profile?.email || user.email || "",
      metadata: {
        supabase_user_id: user.id,
      },
    })
    customerId = customer.id
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: plan.stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: `${request.headers.get("origin")}/dashboard/billing?success=true`,
    cancel_url: `${request.headers.get("origin")}/dashboard/billing?canceled=true`,
    metadata: {
      user_id: user.id,
      plan_id: planId,
    },
  })

  return NextResponse.json({ url: session.url })
}
