import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ProjectsGrid } from "@/components/dashboard/projects-grid"
import { UsageCard } from "@/components/dashboard/usage-card"
import { SubscriptionCard } from "@/components/dashboard/subscription-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { setupNewUser } from "@/app/actions/setup-user"

function DatabaseSetupRequired() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-2xl space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Setup Required</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              Your database tables haven't been created yet. You need to run the SQL migration scripts to initialize
              your database.
            </p>
          </AlertDescription>
        </Alert>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-semibold">Setup Instructions</h2>
          <ol className="space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                1
              </span>
              <div>
                <p className="font-medium">Open the Scripts Menu</p>
                <p className="text-muted-foreground">Click the three dots (⋮) in the top right corner of v0</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                2
              </span>
              <div>
                <p className="font-medium">Run the Migration Scripts</p>
                <p className="text-muted-foreground">Execute these scripts in order:</p>
                <ul className="ml-4 mt-2 list-inside list-disc space-y-1 text-muted-foreground">
                  <li>scripts/001-create-auth-tables.sql</li>
                  <li>scripts/002-create-editor-tables.sql</li>
                  <li>scripts/003-create-database-tables.sql</li>
                  <li>scripts/004-create-translations-tables.sql</li>
                </ul>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                3
              </span>
              <div>
                <p className="font-medium">Refresh the Page</p>
                <p className="text-muted-foreground">After running all scripts, refresh this page to continue</p>
              </div>
            </li>
          </ol>

          <div className="mt-6">
            <a
              href="/dashboard"
              className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Refresh Page
            </a>
          </div>
        </div>

        <div className="rounded-lg border bg-muted/50 p-4 text-sm">
          <p className="font-medium">Need Help?</p>
          <p className="mt-1 text-muted-foreground">
            The scripts will create all necessary database tables including profiles, projects, subscriptions, and more.
            This is a one-time setup process.
          </p>
        </div>
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let profile, projects, subscription, usage

  try {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError && (profileError.code === "PGRST204" || profileError.code === "PGRST205")) {
      return <DatabaseSetupRequired />
    }

    profile = profileData

    if (!profile) {
      const setupResult = await setupNewUser()
      if (!setupResult.success) {
        throw new Error(setupResult.error || "Failed to setup user")
      }
      redirect("/dashboard")
    }

    const { data: projectsData } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    projects = projectsData

    const { data: subscriptionData } = await supabase
      .from("user_subscriptions")
      .select("*, subscription_plans(*)")
      .eq("user_id", user.id)
      .maybeSingle()

    subscription = subscriptionData

    const { data: usageData } = await supabase.from("usage_tracking").select("*").eq("user_id", user.id).maybeSingle()

    usage = usageData

    if (!subscription || !usage) {
      const setupResult = await setupNewUser()
      if (setupResult.success) {
        redirect("/dashboard")
      }
    }
  } catch (error: any) {
    console.error("[v0] Dashboard error:", error)
    return <DatabaseSetupRequired />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader profile={profile} />
      <main className="flex-1 p-6">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {profile?.display_name || "User"}</h1>
              <p className="text-muted-foreground">Manage your projects and build amazing websites</p>
            </div>
          </div>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <SubscriptionCard subscription={subscription} />
            <UsageCard usage={usage} subscription={subscription} />
          </div>

          <ProjectsGrid projects={projects || []} />
        </div>
      </main>
    </div>
  )
}
