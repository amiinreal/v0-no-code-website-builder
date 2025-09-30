"use client"

import { DragOverlay } from "@dnd-kit/core"
import { Type, ImageIcon, Square, Layout, Navigation, FileText } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DndOverlayProps {
  activeId: string | null
  activeType: string | null
}

const ELEMENT_ICONS: Record<string, any> = {
  section: Layout,
  container: Square,
  text: Type,
  image: ImageIcon,
  button: Square,
  navbar: Navigation,
  footer: FileText,
}

export function DndOverlay({ activeId, activeType }: DndOverlayProps) {
  if (!activeId || !activeType) return null

  const Icon = ELEMENT_ICONS[activeType] || Square

  return (
    <DragOverlay>
      <Card className="flex items-center gap-2 p-3 shadow-lg">
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium capitalize">{activeType}</span>
      </Card>
    </DragOverlay>
  )
}
