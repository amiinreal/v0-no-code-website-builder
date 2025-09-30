"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { SubscriptionPlan, UsageTracking } from "@/lib/types"
import { Check, Crown, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

interface BillingManagerProps {
  subscription: any
  plans: SubscriptionPlan[]
  usage: UsageTracking | null
}

export function BillingManager({ subscription, plans, usage }: BillingManagerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const currentPlan = subscription?.subscription_plans

  const handleUpgrade = async (planId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error("Failed to create portal session:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="font-semibold">Billing & Subscription</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">Manage Your Subscription</h2>
            <p className="text-muted-foreground">Choose the plan that works best for you</p>
          </div>

          {currentPlan && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5" />
                  Current Plan: {currentPlan.name}
                </CardTitle>
                <CardDescription>
                  {currentPlan.price_in_cents > 0
                    ? `$${(currentPlan.price_in_cents / 100).toFixed(2)}/month`
                    : "Free forever"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-medium">
                      {usage?.project_count || 0} / {currentPlan.max_projects}
                    </span>
                  </div>
                  <Progress value={((usage?.project_count || 0) / currentPlan.max_projects) * 100} />
                </div>
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Storage</span>
                    <span className="font-medium">
                      {usage?.storage_used_mb || 0} MB / {currentPlan.max_storage_mb} MB
                    </span>
                  </div>
                  <Progress value={((usage?.storage_used_mb || 0) / currentPlan.max_storage_mb) * 100} />
                </div>
              </CardContent>
              {subscription?.stripe_customer_id && (
                <CardFooter>
                  <Button variant="outline" onClick={handleManageSubscription} disabled={isLoading}>
                    Manage Subscription
                  </Button>
                </CardFooter>
              )}
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan = currentPlan?.id === plan.id
              const isFree = plan.price_in_cents === 0

              return (
                <Card key={plan.id} className={isCurrentPlan ? "border-primary" : ""}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold">
                        {isFree ? "Free" : `$${(plan.price_in_cents / 100).toFixed(0)}`}
                      </span>
                      {!isFree && <span className="text-muted-foreground">/month</span>}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {plan.max_projects} {plan.max_projects === 1 ? "project" : "projects"}
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {plan.max_pages_per_project} pages per project
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary" />
                        {plan.max_storage_mb} MB storage
                      </li>
                      {plan.custom_domain_allowed && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          Custom domain
                        </li>
                      )}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    {isCurrentPlan ? (
                      <Button variant="outline" disabled className="w-full bg-transparent">
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={isLoading || isFree}
                        variant={isFree ? "outline" : "default"}
                      >
                        {isFree ? "Downgrade" : "Upgrade"}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
