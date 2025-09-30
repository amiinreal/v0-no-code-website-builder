import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DatabaseManager } from "@/components/database/database-manager"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface DatabasePageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function DatabasePage({ params }: DatabasePageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let project = null
  let tables = null
  let hasError = false

  try {
    // Fetch project
    const projectResult = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .eq("user_id", user.id)
      .single()
    project = projectResult.data

    if (!project) {
      redirect("/dashboard")
    }

    // Fetch user tables
    const tablesResult = await supabase.from("user_tables").select("*").eq("project_id", projectId)
    tables = tablesResult.data
  } catch (error: any) {
    hasError = true
    console.error("[v0] Error fetching database data:", error)
  }

  // Show error message if tables don't exist
  if (hasError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Database Not Initialized</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              The database tables haven't been created yet. Please run the SQL migration scripts to set up your
              database.
            </p>
            <div className="rounded-md bg-muted p-4">
              <p className="mb-2 font-semibold">Steps to fix:</p>
              <ol className="list-inside list-decimal space-y-1 text-sm">
                <li>Click the three dots menu in the top right corner</li>
                <li>Select "Run Script"</li>
                <li>Run scripts/001-create-auth-tables.sql</li>
                <li>Run scripts/002-create-editor-tables.sql</li>
                <li>Run scripts/003-create-database-tables.sql</li>
                <li>Run scripts/004-create-translations-tables.sql</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <DatabaseManager project={project} tables={tables || []} />
}
