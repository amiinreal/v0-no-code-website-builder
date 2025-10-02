"use client"

import { cn } from "@/lib/utils"

interface GridOverlayProps {
  show: boolean
  gridSize?: number
  className?: string
}

export function GridOverlay({ show, gridSize = 20, className }: GridOverlayProps) {
  if (!show) return null

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none opacity-30 z-10",
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: `${gridSize}px ${gridSize}px`,
      }}
    />
  )
}