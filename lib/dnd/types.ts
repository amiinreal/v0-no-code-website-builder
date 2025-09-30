export type DragType = "new-element" | "existing-element"

export interface DragData {
  type: DragType
  elementType?: string
  elementId?: string
  parentId?: string | null
}

export interface DropZoneData {
  parentId: string | null
  position: number
}
