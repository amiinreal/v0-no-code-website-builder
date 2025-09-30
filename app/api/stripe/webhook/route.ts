import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import type Stripe from "stripe"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const planId = session.metadata?.plan_id

      if (userId && planId) {
        // Update or create subscription
        await supabase.from("user_subscriptions").upsert({
          user_id: userId,
          plan_id: planId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }
      break
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      // Find user by customer ID
      const { data: userSub } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("stripe_customer_id", customerId)
        .single()

      if (userSub) {
        await supabase
          .from("user_subscriptions")
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("id", userSub.id)
      }
      break
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      // Find user by customer ID
      const { data: userSub } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("stripe_customer_id", customerId)
        .single()

      if (userSub) {
        // Get free plan
        const { data: freePlan } = await supabase.from("subscription_plans").select("*").eq("name", "Free").single()

        if (freePlan) {
          await supabase
            .from("user_subscriptions")
            .update({
              plan_id: freePlan.id,
              status: "canceled",
              stripe_subscription_id: null,
            })
            .eq("id", userSub.id)
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
