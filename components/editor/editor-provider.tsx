"use client"

import type React from "react"

import type { Project, Page, Element, EditorElement } from "@/lib/types"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core"
import { getDragData } from "@/lib/dnd/utils"
import { DndOverlay } from "./dnd/dnd-overlay"
import { useHistory } from "@/lib/hooks/use-history"
import { generateHydrationSafeId } from "@/lib/utils/stable-id"

interface EditorContextType {
  project: Project
  pages: Page[]
  currentPage: Page | null
  elements: EditorElement[]
  selectedElement: EditorElement | null
  setSelectedElement: (element: EditorElement | null) => void
  addElement: (element: Partial<Element>) => EditorElement
  updateElement: (id: string, updates: Partial<Element>) => void
  deleteElement: (id: string) => void
  setCurrentPage: (page: Page) => void
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function useEditor() {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error("useEditor must be used within EditorProvider")
  }
  return context
}

interface EditorProviderProps {
  project: Project
  pages: Page[]
  currentPage: Page | null
  elements: Element[]
  children: React.ReactNode
}

export function EditorProvider({
  project,
  pages: initialPages,
  currentPage: initialPage,
  elements: initialElements,
  children,
}: EditorProviderProps) {
  const [pages, setPages] = useState(initialPages)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedElement, setSelectedElement] = useState<EditorElement | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeType, setActiveType] = useState<string | null>(null)

  const {
    state: elementsState,
    set: setElementsState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset: resetHistory,
  } = useHistory<EditorElement[]>(buildElementTree(initialElements))

  const [elements, setElements] = useState(elementsState)

  useEffect(() => {
    resetHistory(buildElementTree(initialElements))
  }, [initialElements, resetHistory])

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if ((e.metaKey || e.ctrlKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault()
        redo()
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (
          selectedElement &&
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault()
          deleteElement(selectedElement.id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo, selectedElement])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  )

  const addElement = useCallback(
    (element: Partial<Element>) => {
      const newElement: EditorElement = {
        id: generateHydrationSafeId(),
        page_id: currentPage?.id || "",
        parent_id: element.parent_id || null,
        type: element.type || "text",
        content: element.content || {},
        styles: element.styles || {},
        position: element.position || elements.length,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setElementsState([...elements, newElement])
      setElements([...elements, newElement])
      return newElement
    },
    [currentPage, elements, setElementsState],
  )

  const updateElement = useCallback(
    (id: string, updates: Partial<Element>) => {
      const updatedElements = elements.map((el) =>
        el.id === id ? { ...el, ...updates, updated_at: new Date().toISOString() } : el,
      )
      setElementsState(updatedElements)
      setElements(updatedElements)
    },
    [elements, setElementsState],
  )

  const deleteElement = useCallback(
    (id: string) => {
      // First flatten the elements to work with them
      const flatElements = flattenElementsForReorder(elements)
      
      // Function to recursively collect all child IDs
      const collectChildIds = (parentId: string): string[] => {
        const childIds: string[] = []
        flatElements.forEach(el => {
          if (el.parent_id === parentId) {
            childIds.push(el.id)
            // Recursively collect children of children
            childIds.push(...collectChildIds(el.id))
          }
        })
        return childIds
      }
      
      // Get all IDs to delete (element + all its children)
      const idsToDelete = [id, ...collectChildIds(id)]
      
      // Filter out the element and all its children
      const filteredElements = flatElements.filter((el) => !idsToDelete.includes(el.id))
      
      // Rebuild the tree structure
      const newElements = buildElementTree(filteredElements)
      
      setElementsState(newElements)
      setElements(newElements)
      setSelectedElement(null)
    },
    [elements, setElementsState],
  )

  const moveElement = useCallback(
    (elementId: string, newParentId: string | null, position: number) => {
      const flatElements = flattenElementsForReorder(elements)
      const element = flatElements.find((el) => el.id === elementId)

      if (!element) return

      // Update the element's parent
      const updatedElement = {
        ...element,
        parent_id: newParentId,
        position: position,
      }

      // Remove old element and add updated one
      const filtered = flatElements.filter((el) => el.id !== elementId)
      filtered.splice(position, 0, updatedElement)

      // Rebuild tree
      const newElements = buildElementTree(filtered.map((el, idx) => ({ ...el, position: idx })))
      setElementsState(newElements)
      setElements(newElements)
    },
    [elements, setElementsState],
  )

  const handleDragStart = (event: DragStartEvent) => {
    const dragData = getDragData(event.active)
    if (dragData?.type === "new-element") {
      setActiveId(event.active.id as string)
      setActiveType(dragData.elementType || null)
    } else if (dragData?.type === "existing-element") {
      setActiveId(event.active.id as string)
      const element = findElementById(elements, dragData.elementId || "")
      setActiveType(element?.type || null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)
    setActiveType(null)

    if (!over) return

    const dragData = getDragData(active)
    const overData = over.data.current as any

    // Handle dropping new element from sidebar
    if (dragData?.type === "new-element" && dragData.elementType) {
      const parentId = overData?.type === "inside" ? overData.parentId : null
      const newElement = addElement({
        type: dragData.elementType as any,
        content: getDefaultContent(dragData.elementType),
        styles: getDefaultStyles(dragData.elementType),
        parent_id: parentId,
      })
      setSelectedElement(newElement)
    }

    if (dragData?.type === "existing-element" && dragData.elementId) {
      if (overData?.type === "inside") {
        // Drop inside a container
        moveElement(dragData.elementId, overData.parentId, overData.position || 0)
      } else if (overData?.type === "border") {
        // Drop between elements
        moveElement(dragData.elementId, overData.parentId, overData.position || 0)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <EditorContext.Provider
        value={{
          project,
          pages,
          currentPage,
          elements,
          selectedElement,
          setSelectedElement,
          addElement,
          updateElement,
          deleteElement,
          setCurrentPage,
          undo,
          redo,
          canUndo,
          canRedo,
        }}
      >
        {children}
      </EditorContext.Provider>
      <DragOverlay>
        <DndOverlay />
      </DragOverlay>
    </DndContext>
  )
}

function buildElementTree(elements: Element[]): EditorElement[] {
  const elementMap = new Map<string, EditorElement>()
  const rootElements: EditorElement[] = []

  // Sort elements by position to maintain order
  const sortedElements = [...elements].sort((a, b) => (a.position || 0) - (b.position || 0))

  // Create map of all elements
  sortedElements.forEach((el) => {
    elementMap.set(el.id, { ...el, children: [] })
  })

  // Build tree structure
  sortedElements.forEach((el) => {
    const element = elementMap.get(el.id)!
    if (el.parent_id) {
      const parent = elementMap.get(el.parent_id)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(element)
        // Sort children by position
        parent.children.sort((a, b) => (a.position || 0) - (b.position || 0))
      }
    } else {
      rootElements.push(element)
    }
  })

  // Sort root elements by position
  rootElements.sort((a, b) => (a.position || 0) - (b.position || 0))
  return rootElements
}

function getDefaultContent(type: string): Record<string, any> {
  switch (type) {
    case "text":
      return { text: "Edit this text", tag: "p" }
    case "image":
      return { src: "/placeholder.svg?height=200&width=400", alt: "Image" }
    case "logo":
      return { src: "", alt: "Logo" }
    case "button":
      return { text: "Click me", href: "#" }
    case "navbar":
      return { brand: "Brand", links: [] }
    case "footer":
      return { text: "© 2025 All rights reserved" }
    case "form":
      return { title: "Contact Form", action: "", method: "POST" }
    default:
      return {}
  }
}

function getDefaultStyles(type: string): Record<string, any> {
  switch (type) {
    case "section":
      return { padding: "40px 20px", backgroundColor: "#ffffff" }
    case "container":
      return { maxWidth: "1200px", margin: "0 auto", padding: "20px" }
    case "text":
      return { fontSize: "16px", color: "#000000" }
    case "image":
      return { maxWidth: "100%", height: "auto" }
    case "logo":
      return { maxHeight: "48px", width: "auto" }
    case "button":
      return { 
        padding: "10px 20px", 
        backgroundColor: "#000000", 
        color: "#ffffff", 
        borderRadius: "4px",
        border: "none",
        cursor: "pointer"
      }
    case "navbar":
      return { 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        padding: "16px 20px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb"
      }
    case "footer":
      return { 
        padding: "20px", 
        textAlign: "center",
        backgroundColor: "#f9fafb",
        borderTop: "1px solid #e5e7eb"
      }
    case "form":
      return { 
        padding: "20px", 
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        backgroundColor: "#ffffff"
      }
    default:
      return {}
  }
}

// Helper function to flatten elements for reordering
function flattenElementsForReorder(elements: EditorElement[]): EditorElement[] {
  const result: EditorElement[] = []
  elements.forEach((el) => {
    const { children, ...element } = el
    result.push(element as EditorElement)
    if (children && children.length > 0) {
      result.push(...flattenElementsForReorder(children))
    }
  })
  return result
}

// Helper function to find element by ID
function findElementById(elements: EditorElement[], id: string): EditorElement | null {
  for (const el of elements) {
    if (el.id === id) return el
    if (el.children) {
      const found = findElementById(el.children, id)
      if (found) return found
    }
  }
  return null
}
