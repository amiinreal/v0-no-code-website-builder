"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"

export async function setupNewUser() {
  try {
    // Get the current user
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: "Not authenticated" }
    }

    // Use admin client to bypass RLS for initial setup
    const admin = createAdminClient()

    // Check if profile exists
    const { data: existingProfile } = await admin.from("profiles").select("*").eq("id", user.id).maybeSingle()

    if (!existingProfile) {
      // Create profile
      const { error: profileError } = await admin.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
      })

      if (profileError) {
        console.error("[v0] Profile creation error:", profileError)
        return { success: false, error: "Failed to create profile" }
      }
    }

    // Check if subscription exists
    const { data: existingSubscription } = await admin
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle()

    if (!existingSubscription) {
      // Get the Free plan ID
      const { data: freePlan } = await admin.from("subscription_plans").select("id").eq("name", "Free").single()

      if (freePlan) {
        // Create subscription
        const { error: subscriptionError } = await admin.from("user_subscriptions").insert({
          user_id: user.id,
          plan_id: freePlan.id,
          status: "active",
        })

        if (subscriptionError) {
          console.error("[v0] Subscription creation error:", subscriptionError)
          return { success: false, error: "Failed to create subscription" }
        }
      }
    }

    // Check if usage tracking exists
    const { data: existingUsage } = await admin.from("usage_tracking").select("*").eq("user_id", user.id).maybeSingle()

    if (!existingUsage) {
      // Create usage tracking
      const { error: usageError } = await admin.from("usage_tracking").insert({
        user_id: user.id,
        project_count: 0,
        storage_used_mb: 0,
      })

      if (usageError) {
        console.error("[v0] Usage tracking creation error:", usageError)
        return { success: false, error: "Failed to create usage tracking" }
      }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Setup user error:", error)
    return { success: false, error: "Setup failed" }
  }
}
