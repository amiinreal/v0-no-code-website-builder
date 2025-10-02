"use client"

import { Button } from "@/components/ui/button"
import { useEditor } from "./editor-provider"
import { ArrowLeft, Save, Eye, Settings, Database, Globe, Languages, Undo, Redo, Grid3X3 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { PublishDialog } from "./publish-dialog"
import { ViewportSwitcher, type Viewport } from "./viewport-switcher"
import { SnapToGrid } from "./snap-to-grid"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EditorToolbarProps {
  viewport: Viewport
  onViewportChange: (viewport: Viewport) => void
  showGrid: boolean
  onGridToggle: (show: boolean) => void
}

export function EditorToolbar({ viewport, onViewportChange, showGrid, onGridToggle }: EditorToolbarProps) {
  const { project, currentPage, elements, undo, redo, canUndo, canRedo } = useEditor()
  const [isSaving, setIsSaving] = useState(false)
  const [isPublishOpen, setIsPublishOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    if (!currentPage) return

    setIsSaving(true)
    try {
      // Delete existing elements
      await supabase.from("elements").delete().eq("page_id", currentPage.id)

      // Insert new elements
      const flatElements = flattenElements(elements)
      if (flatElements.length > 0) {
        await supabase.from("elements").insert(flatElements)
      }

      router.refresh()
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold">{project.name}</h1>
            <p className="text-xs text-muted-foreground">{currentPage?.name || "No page selected"}</p>
          </div>
          <div className="h-6 w-px bg-border" />
          <TooltipProvider>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={undo} disabled={!canUndo}>
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo (Cmd+Z)</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={redo} disabled={!canRedo}>
                    <Redo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Redo (Cmd+Y)</p>
                </TooltipContent>
              </Tooltip>
              <div className="h-4 w-px bg-border mx-1" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={showGrid ? "default" : "ghost"} 
                    size="sm" 
                    onClick={() => onGridToggle(!showGrid)}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Grid</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2">
          <ViewportSwitcher viewport={viewport} onViewportChange={onViewportChange} />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/editor/${project.id}/database`}>
              <Database className="mr-2 h-4 w-4" />
              Database
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/editor/${project.id}/translations`}>
              <Languages className="mr-2 h-4 w-4" />
              Translations
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button size="sm" onClick={() => setIsPublishOpen(true)}>
            <Globe className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </header>

      <PublishDialog open={isPublishOpen} onOpenChange={setIsPublishOpen} project={project} />
    </>
  )
}

function flattenElements(elements: any[], parentId: string | null = null): any[] {
  const result: any[] = []
  elements.forEach((el, index) => {
    const { children, ...element } = el
    result.push({
      ...element,
      parent_id: parentId,
      position: index,
    })
    if (children && children.length > 0) {
      result.push(...flattenElements(children, el.id))
    }
  })
  return result
}
