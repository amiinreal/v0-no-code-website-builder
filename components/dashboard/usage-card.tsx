import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3 } from "lucide-react"

interface UsageCardProps {
  usage: any
  subscription: any
}

export function UsageCard({ usage, subscription }: UsageCardProps) {
  const plan = subscription?.subscription_plans

  const projectUsage = usage?.project_count || 0
  const projectLimit = plan?.max_projects || 1
  const projectPercentage = (projectUsage / projectLimit) * 100

  const storageUsage = usage?.storage_used_mb || 0
  const storageLimit = plan?.max_storage_mb || 100
  const storagePercentage = (storageUsage / storageLimit) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Usage
        </CardTitle>
        <CardDescription>Track your resource usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Projects</span>
            <span className="font-medium">
              {projectUsage} / {projectLimit}
            </span>
          </div>
          <Progress value={projectPercentage} />
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">Storage</span>
            <span className="font-medium">
              {storageUsage} MB / {storageLimit} MB
            </span>
          </div>
          <Progress value={storagePercentage} />
        </div>
      </CardContent>
    </Card>
  )
}
