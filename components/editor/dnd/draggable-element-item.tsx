"use client"

import { useDraggable } from "@dnd-kit/core"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"
import { GripVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface DraggableElementItemProps {
  type: string
  label: string
  icon: LucideIcon
}

export function DraggableElementItem({ type, label, icon: Icon }: DraggableElementItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `new-${type}`,
    data: {
      type: "new-element",
      elementType: type,
    },
  })

  return (
    <Button
      ref={setNodeRef}
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
}
