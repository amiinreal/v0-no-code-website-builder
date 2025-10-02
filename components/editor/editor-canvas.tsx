"use client"

import { useEditor } from "./editor-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RenderElement } from "./render-element"
import { GridOverlay, useSnapToGrid } from "./snap-to-grid"
import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"
import type { Viewport } from "./viewport-switcher"
import { useState } from "react"

interface EditorCanvasProps {
  viewport: Viewport
  showGrid: boolean
}

const VIEWPORT_WIDTHS = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
}

export function EditorCanvas({ viewport, showGrid }: EditorCanvasProps) {
  const { elements } = useEditor()

  const { setNodeRef, isOver } = useDroppable({
    id: "canvas-root",
    data: {
      type: "inside",
      parentId: null,
      position: elements.length,
    },
  })

  return (
    <main className="flex-1 bg-muted/20">
      <ScrollArea className="h-full">
        <div className="flex justify-center p-8 min-h-full">
          <div
            ref={setNodeRef}
            className={cn(
              "bg-white shadow-lg transition-all duration-300 relative",
              isOver && "ring-2 ring-primary",
              viewport === "mobile" && "min-h-[667px]",
              viewport === "tablet" && "min-h-[1024px]",
            )}
            style={{
              width: VIEWPORT_WIDTHS[viewport],
              maxWidth: "100%",
            }}
          >
            <GridOverlay enabled={showGrid} gridSize={20} />
            <div className="p-8 relative z-20">
              {elements.length === 0 ? (
                <div className="flex h-96 items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">Your canvas is empty</p>
                    <p className="text-sm text-muted-foreground">Drag elements from the sidebar to start building</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {elements.map((element, idx) => (
                    <RenderElement key={element.id} element={element} index={idx} viewport={viewport} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </main>
  )
}
