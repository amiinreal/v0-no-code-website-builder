"use client"

import { cn } from "@/lib/utils"
import { Plus, Target } from "lucide-react"

interface DropIndicatorProps {
  position: "top" | "bottom" | "inside" | "left" | "right"
  isVisible: boolean
  elementType?: string
  targetElementType?: string
}

export function DropIndicator({ 
  position, 
  isVisible, 
  elementType, 
  targetElementType 
}: DropIndicatorProps) {
  if (!isVisible) return null

  const isHorizontal = position === "top" || position === "bottom"
  const isVertical = position === "left" || position === "right"
  const isInside = position === "inside"

  const getDropMessage = () => {
    if (elementType && targetElementType) {
      return `Drop ${elementType} into ${targetElementType}`
    }
    if (elementType) {
      return `Drop ${elementType} here`
    }
    return "Drop element here"
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute z-50 transition-all duration-200 ease-in-out",
        // Horizontal indicators (top/bottom)
        isHorizontal && "left-0 right-0",
        position === "top" && "-top-1",
        position === "bottom" && "-bottom-1",
        // Vertical indicators (left/right)
        isVertical && "top-0 bottom-0",
        position === "left" && "-left-1",
        position === "right" && "-right-1",
        // Inside indicator with enhanced styling
        isInside && "inset-1 border-2 border-dashed border-primary bg-primary/5 rounded-lg backdrop-blur-sm",
      )}
    >
      {isHorizontal && (
        <div className="relative">
          <div className="h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 shadow-lg rounded-full">
            <div className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-primary shadow-lg border-2 border-white flex items-center justify-center">
              <Plus className="h-2 w-2 text-white" />
            </div>
            <div className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-primary shadow-lg border-2 border-white flex items-center justify-center">
              <Plus className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-2 py-1 rounded text-xs font-medium shadow-lg whitespace-nowrap">
            {getDropMessage()}
          </div>
        </div>
      )}
      
      {isVertical && (
        <div className="relative h-full">
          <div className="w-1 h-full bg-gradient-to-b from-primary/50 via-primary to-primary/50 shadow-lg rounded-full">
            <div className="absolute top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-lg border-2 border-white flex items-center justify-center">
              <Plus className="h-2 w-2 text-white" />
            </div>
            <div className="absolute bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-primary shadow-lg border-2 border-white flex items-center justify-center">
              <Plus className="h-2 w-2 text-white" />
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-2 py-1 rounded text-xs font-medium shadow-lg whitespace-nowrap -rotate-90">
            {getDropMessage()}
          </div>
        </div>
      )}
      
      {isInside && (
        <div className="flex items-center justify-center h-full relative">
          <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg animate-pulse" />
          <div className="bg-primary/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium text-white shadow-xl flex items-center gap-2 z-10">
            <Target className="h-4 w-4" />
            {getDropMessage()}
          </div>
          {/* Corner indicators */}
          <div className="absolute top-1 left-1 h-3 w-3 border-l-2 border-t-2 border-primary rounded-tl" />
          <div className="absolute top-1 right-1 h-3 w-3 border-r-2 border-t-2 border-primary rounded-tr" />
          <div className="absolute bottom-1 left-1 h-3 w-3 border-l-2 border-b-2 border-primary rounded-bl" />
          <div className="absolute bottom-1 right-1 h-3 w-3 border-r-2 border-b-2 border-primary rounded-br" />
        </div>
      )}
    </div>
  )
}
