"use client"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EditorCanvas } from "@/components/editor/editor-canvas"
import { EditorSidebar } from "@/components/editor/editor-sidebar"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { EditorProvider } from "@/components/editor/editor-provider"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useState } from "react"
import type { Viewport } from "@/components/editor/viewport-switcher"

interface EditorPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  let project = null
  let pages = null
  let currentPage = null
  let elements = null
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

    // Fetch pages
    const pagesResult = await supabase.from("pages").select("*").eq("project_id", projectId).order("created_at")
    pages = pagesResult.data

    // Get or create home page
    currentPage = pages?.find((p) => p.is_home) || pages?.[0]

    if (!currentPage && pages?.length === 0) {
      const { data: newPage } = await supabase
        .from("pages")
        .insert({
          project_id: projectId,
          name: "Home",
          slug: "home",
          is_home: true,
        })
        .select()
        .single()

      currentPage = newPage
    }

    // Fetch elements for current page
    const elementsResult = await supabase
      .from("elements")
      .select("*")
      .eq("page_id", currentPage?.id || "")
      .order("order_index")
    elements = elementsResult.data
  } catch (error: any) {
    hasError = true
    console.error("[v0] Error fetching editor data:", error)
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

  return <EditorPageClient project={project} pages={pages || []} currentPage={currentPage} elements={elements || []} />
}

function EditorPageClient({ project, pages, currentPage, elements }: any) {
  const [viewport, setViewport] = useState<Viewport>("desktop")

  return (
    <EditorProvider project={project} pages={pages} currentPage={currentPage} elements={elements}>
      <div className="flex h-screen flex-col">
        <EditorToolbar viewport={viewport} onViewportChange={setViewport} />
        <div className="flex flex-1 overflow-hidden">
          <EditorSidebar />
          <EditorCanvas viewport={viewport} />
        </div>
      </div>
    </EditorProvider>
  )
}
