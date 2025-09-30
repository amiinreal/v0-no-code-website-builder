import type { Active, Over } from "@dnd-kit/core"
import type { DragData, DropZoneData } from "./types"

export function getDragData(active: Active): DragData | null {
  return active.data.current as DragData | null
}

export function getDropZoneData(over: Over): DropZoneData | null {
  return over.data.current as DropZoneData | null
}

export function canDropInElement(elementType: string): boolean {
  // Define which element types can contain children
  const containerTypes = ["section", "container", "navbar", "footer"]
  return containerTypes.includes(elementType)
}
