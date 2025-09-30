import { createClient } from "@/lib/supabase/server"
import { generateZipContent } from "@/lib/code-generator"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch project
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .single()

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  // Fetch all pages
  const { data: pages } = await supabase.from("pages").select("*").eq("project_id", projectId)

  if (!pages || pages.length === 0) {
    return NextResponse.json({ error: "No pages found" }, { status: 404 })
  }

  // Fetch elements for all pages
  const elementsMap = new Map()
  for (const page of pages) {
    const { data: elements } = await supabase.from("elements").select("*").eq("page_id", page.id).order("order_index")
    elementsMap.set(page.id, elements || [])
  }

  // Generate code
  const { files } = generateZipContent(pages, elementsMap)

  // Return as JSON (in a real app, you'd create a ZIP file)
  return NextResponse.json({ files, project: project.name })
}
