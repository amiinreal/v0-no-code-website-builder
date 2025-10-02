"use client"

import { EditorCanvas } from "@/components/editor/editor-canvas"
import { EditorSidebar } from "@/components/editor/editor-sidebar"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { EditorProvider } from "@/components/editor/editor-provider"
import { useState } from "react"
import type { Viewport } from "@/components/editor/viewport-switcher"

interface EditorPageClientProps {
  project: any
  pages: any[]
  currentPage: any
  elements: any[]
}

export function EditorPageClient({ project, pages, currentPage, elements }: EditorPageClientProps) {
  const [viewport, setViewport] = useState<Viewport>("desktop")
  const [showGrid, setShowGrid] = useState(true)

  return (
    <EditorProvider project={project} pages={pages} currentPage={currentPage} elements={elements}>
      <div className="flex h-screen flex-col">
        <EditorToolbar 
          viewport={viewport} 
          onViewportChange={setViewport}
          showGrid={showGrid}
          onGridToggle={setShowGrid}
        />
        <div className="flex flex-1 overflow-hidden">
          <EditorSidebar viewport={viewport} />
          <EditorCanvas viewport={viewport} showGrid={showGrid} />
        </div>
      </div>
    </EditorProvider>
  )
}