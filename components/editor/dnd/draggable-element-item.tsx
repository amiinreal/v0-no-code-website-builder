"use client"

import React from "react"
import { useDraggable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"
import { useStableId } from "@/lib/utils/stable-id"

interface DraggableElementItemProps {
  type: string
  label: string
  icon: LucideIcon
}

export const DraggableElementItem = React.forwardRef<
  HTMLButtonElement,
  DraggableElementItemProps
>(({ type, label, icon: Icon }, ref) => {
  // Use stable ID to prevent hydration mismatches
  const stableId = useStableId(`new-${type}`)
  
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: stableId,
    data: {
      type: "new-element",
      elementType: type,
    },
  })

  // Combine refs properly
  const combinedRef = React.useCallback((node: HTMLButtonElement | null) => {
    setNodeRef(node)
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }, [setNodeRef, ref])

  return (
    <Button
      ref={combinedRef}
      variant="outline"
      className={cn(
        "w-full justify-start bg-transparent cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50",
      )}
      {...listeners}
      {...attributes}
    >
      <GripVertical className="mr-2 h-4 w-4 text-muted-foreground" />
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </Button>
  )
})
DraggableElementItem.displayName = "DraggableElementItem"
