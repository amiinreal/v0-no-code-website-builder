"use client"

import { DragPreview } from "./drag-preview"
import { getDragData } from "@/lib/dnd/utils"
import { useDndContext } from "@dnd-kit/core"

const ELEMENT_LABELS = {
  section: "Section",
  container: "Container", 
  navbar: "Navbar",
  footer: "Footer",
  text: "Text",
  image: "Image",
  logo: "Logo",
  button: "Button",
  form: "Form",
}

export function DndOverlay() {
  const { active } = useDndContext()
  
  if (!active) return null
  
  const dragData = getDragData(active)
  if (!dragData) return null

  const elementType = dragData.elementType || "container"
  const label = ELEMENT_LABELS[elementType as keyof typeof ELEMENT_LABELS] || "Element"

  return (
    <DragPreview
      type={elementType}
      label={label}
      isDragging={true}
    />
  )
}
