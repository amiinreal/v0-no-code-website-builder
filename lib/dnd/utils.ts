import type { Active } from "@dnd-kit/core"
import type { ElementType } from "../types"
import { canDropIntoParent, canHaveChildren } from "../hierarchy-utils"

export interface DragData {
  type: "new-element" | "existing-element"
  elementType?: ElementType
  elementId?: string
}

export function getDragData(active: Active): DragData | null {
  if (!active?.data?.current) return null
  return active.data.current as DragData
}

export function canDropInElement(elementType: ElementType): boolean {
  return canHaveChildren(elementType)
}

export function canDropElement(
  draggedType: ElementType,
  targetType: ElementType | null
): boolean {
  return canDropIntoParent(draggedType, targetType)
}

export function getDropPosition(
  draggedElement: DragData,
  targetElement: { type: ElementType; id: string }
): "inside" | "before" | "after" | null {
  if (!draggedElement.elementType) return null
  
  // Check if we can drop inside the target
  if (canDropElement(draggedElement.elementType, targetElement.type)) {
    return "inside"
  }
  
  // Otherwise, try to drop before/after at the same level
  return "before" // Default to before for now
}
