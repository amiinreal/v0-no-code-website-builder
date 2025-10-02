import type { ElementType } from "./types"

/**
 * Defines the hierarchical structure of the website builder
 * Page → Sections → Containers → Elements
 */

export const ELEMENT_HIERARCHY = {
  // Top level - can only be direct children of page
  sections: ["section", "navbar", "footer", "hero"] as const,
  
  // Container level - can contain other elements
  containers: ["container"] as const,
  
  // Content elements - cannot contain other elements
  elements: ["text", "image", "logo", "button", "form", "form-field"] as const,
} as const

export type SectionType = typeof ELEMENT_HIERARCHY.sections[number]
export type ContainerType = typeof ELEMENT_HIERARCHY.containers[number]
export type ContentElementType = typeof ELEMENT_HIERARCHY.elements[number]

/**
 * Check if an element type can contain children
 */
export function canHaveChildren(elementType: ElementType): boolean {
  return (
    ELEMENT_HIERARCHY.sections.includes(elementType as SectionType) ||
    ELEMENT_HIERARCHY.containers.includes(elementType as ContainerType)
  )
}

/**
 * Check if an element can be dropped into a parent
 */
export function canDropIntoParent(
  childType: ElementType,
  parentType: ElementType | null
): boolean {
  // If no parent, only sections can be at root level
  if (!parentType) {
    return ELEMENT_HIERARCHY.sections.includes(childType as SectionType)
  }

  // Sections can contain containers and content elements
  if (ELEMENT_HIERARCHY.sections.includes(parentType as SectionType)) {
    return (
      ELEMENT_HIERARCHY.containers.includes(childType as ContainerType) ||
      ELEMENT_HIERARCHY.elements.includes(childType as ContentElementType)
    )
  }

  // Containers can only contain content elements
  if (ELEMENT_HIERARCHY.containers.includes(parentType as ContainerType)) {
    return ELEMENT_HIERARCHY.elements.includes(childType as ContentElementType)
  }

  // Content elements cannot contain anything
  return false
}

/**
 * Get valid child types for a parent element
 */
export function getValidChildTypes(parentType: ElementType | null): ElementType[] {
  if (!parentType) {
    return [...ELEMENT_HIERARCHY.sections]
  }

  if (ELEMENT_HIERARCHY.sections.includes(parentType as SectionType)) {
    return [...ELEMENT_HIERARCHY.containers, ...ELEMENT_HIERARCHY.elements]
  }

  if (ELEMENT_HIERARCHY.containers.includes(parentType as ContainerType)) {
    return [...ELEMENT_HIERARCHY.elements]
  }

  return []
}

/**
 * Get the default container layout for different element types
 */
export function getDefaultContainerLayout(elementType: ElementType): Record<string, any> {
  switch (elementType) {
    case "section":
      return {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "2rem",
        minHeight: "200px",
      }
    case "container":
      return {
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        padding: "1rem",
        flexWrap: "wrap",
      }
    case "navbar":
      return {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }
    case "footer":
      return {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        backgroundColor: "#f9fafb",
        borderTop: "1px solid #e5e7eb",
      }
    case "hero":
      return {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "4rem 2rem",
        minHeight: "400px",
        textAlign: "center",
        backgroundColor: "#f8fafc",
      }
    default:
      return {}
  }
}

/**
 * Snap-to-grid configuration
 */
export const GRID_CONFIG = {
  size: 8, // 8px grid
  enabled: true,
  showGrid: false, // Can be toggled by user
}

/**
 * Snap a value to the nearest grid point
 */
export function snapToGrid(value: number, gridSize: number = GRID_CONFIG.size): number {
  if (!GRID_CONFIG.enabled) return value
  return Math.round(value / gridSize) * gridSize
}

/**
 * Snap position object to grid
 */
export function snapPositionToGrid(position: { x: number; y: number }): { x: number; y: number } {
  return {
    x: snapToGrid(position.x),
    y: snapToGrid(position.y),
  }
}