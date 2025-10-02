export type DragType = "new-element" | "existing-element"

export interface DragData {
  type: DragType
  elementType?: string
  elementId?: string
  label?: string
  icon?: string
}

export interface DropZoneData {
  type: "border" | "inside"
  elementId: string
  parentId: string | null
  position: number
}

export interface DragPreviewData {
  type: string
  label: string
  icon?: string
  isNew: boolean
}

export interface DropPosition {
  type: "top" | "bottom" | "inside" | "left" | "right"
  targetId: string
  parentId: string | null
  index: number
}
