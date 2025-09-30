"use client"

import { Button } from "@/components/ui/button"
import { Monitor, Tablet, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"

export type Viewport = "desktop" | "tablet" | "mobile"

interface ViewportSwitcherProps {
  viewport: Viewport
  onViewportChange: (viewport: Viewport) => void
}

export function ViewportSwitcher({ viewport, onViewportChange }: ViewportSwitcherProps) {
  return (
    <div className="flex items-center gap-1 rounded-lg border bg-background p-1">
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-8 px-3", viewport === "desktop" && "bg-muted")}
        onClick={() => onViewportChange("desktop")}
      >
        <Monitor className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-8 px-3", viewport === "tablet" && "bg-muted")}
        onClick={() => onViewportChange("tablet")}
      >
        <Tablet className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("h-8 px-3", viewport === "mobile" && "bg-muted")}
        onClick={() => onViewportChange("mobile")}
      >
        <Smartphone className="h-4 w-4" />
      </Button>
    </div>
  )
}
