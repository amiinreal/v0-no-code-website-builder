import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown } from "lucide-react"
import Link from "next/link"

interface SubscriptionCardProps {
  subscription: any
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const plan = subscription?.subscription_plans

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5" />
          Current Plan
        </CardTitle>
        <CardDescription>Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">{plan?.name || "Free"}</p>
            <p className="text-sm text-muted-foreground">
              {plan?.price_in_cents ? `$${(plan.price_in_cents / 100).toFixed(2)}/month` : "No cost"}
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/dashboard/billing">{plan?.name === "Free" ? "Upgrade" : "Manage"}</Link>
          </Button>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Projects</span>
            <span className="font-medium">{plan?.max_projects || 1}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pages per Project</span>
            <span className="font-medium">{plan?.max_pages_per_project || 5}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-medium">{plan?.max_storage_mb || 100} MB</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
