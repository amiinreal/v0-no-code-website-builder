"use client"

import { cn } from "@/lib/utils"

interface DropIndicatorProps {
  position: "top" | "bottom" | "inside"
  isVisible: boolean
}

export function DropIndicator({ position, isVisible }: DropIndicatorProps) {
  if (!isVisible) return null

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-0 right-0 z-50 transition-opacity",
        position === "top" && "-top-1",
        position === "bottom" && "-bottom-1",
        position === "inside" && "inset-0 border-2 border-dashed border-primary bg-primary/5",
      )}
    >
      {position !== "inside" && (
        <div className="h-0.5 bg-primary">
          <div className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
          <div className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  )
}
