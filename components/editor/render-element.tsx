"use client"

import type React from "react"
import { forwardRef } from "react"

import type { EditorElement } from "@/lib/types"
import { useEditor } from "./editor-provider"
import { cn } from "@/lib/utils"
import { useDraggable, useDroppable, useDndContext } from "@dnd-kit/core"
import { GripVertical } from "lucide-react"
import { DropIndicator } from "./dnd/drop-indicator"
import { canDropInElement, getDropPosition, getDragData } from "@/lib/dnd/utils"
import { getResponsiveStyles } from "@/lib/responsive-utils"
import type { Viewport } from "./viewport-switcher"
import { useStableId } from "@/lib/utils/stable-id"
import { canHaveChildren } from "@/lib/hierarchy-utils"
import { NavbarComponent } from "./smart-components/navbar-component"
import { EnhancedNavbarComponent } from "./responsive-navbar"
import { HeroComponent } from "./smart-components/hero-component"
import { FooterComponent } from "./smart-components/footer-component"
import { FormComponent } from "./smart-components/form-component"

interface RenderElementProps {
  element: EditorElement
  index?: number
  viewport?: Viewport
  isPreview?: boolean
  onSelect?: (element: EditorElement) => void
  isSelected?: boolean
}

export const RenderElement = forwardRef<HTMLDivElement, RenderElementProps>(
  ({ element, index = 0, viewport = "desktop" }, ref) => {
    const { selectedElement, setSelectedElement } = useEditor()
    const { active } = useDndContext()

    const isSelected = selectedElement?.id === element.id

    // Get current drag data for drop indicators
    const dragData = active ? getDragData(active) : null

    // Generate stable IDs for drop zones to prevent hydration mismatches
    const dropInsideId = useStableId(`drop-inside-${element.id}`)
    const dropBetweenId = useStableId(`drop-between-${element.id}`)

    // Draggable setup for existing elements
    const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
      id: element.id,
      data: {
        type: "existing-element",
        elementId: element.id,
        elementType: element.type,
      },
    })

    // Droppable setup for containers that can accept children
    const canAcceptChildren = canDropInElement(element.type)
    const { setNodeRef: setDropInsideRef, isOver: isOverInside } = useDroppable({
      id: dropInsideId,
      disabled: !canAcceptChildren,
      data: {
        type: "inside",
        parentId: element.id,
        position: element.children?.length || 0,
      },
    })

    // Droppable setup for positioning between elements
    const { setNodeRef: setDropBetweenRef, isOver: isOverBetween } = useDroppable({
      id: dropBetweenId,
      data: {
        type: "border",
        parentId: element.parent_id,
        position: index,
      },
    })

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation()
      setSelectedElement(element)
    }

    const renderDragHandle = () => {
      if (!isSelected) return null
      return (
        <div
          {...attributes}
          {...listeners}
          ref={setDragRef}
          className="absolute -left-8 top-2 cursor-grab active:cursor-grabbing z-10 p-1 bg-primary text-primary-foreground rounded opacity-75 hover:opacity-100"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )
    }

    const baseClasses = cn(
      "relative border-2 border-transparent transition-all duration-200",
      isSelected && "border-primary border-dashed",
      isDragging && "opacity-50",
    )

    const renderContent = () => {
      const responsiveStyles = getResponsiveStyles(element, viewport)
      
      // Convert styles to CSS-in-JS format
      const cssStyles = Object.entries(responsiveStyles).reduce((acc, [key, value]) => {
        // Convert kebab-case to camelCase for CSS-in-JS
        const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        acc[camelKey] = value
        return acc
      }, {} as Record<string, any>)
      
      switch (element.type) {
        case "section":
          return (
            <section
              ref={setDropInsideRef}
              className={cn(baseClasses, "min-h-[100px]", isOverInside && "ring-2 ring-primary ring-dashed")}
              style={cssStyles}
              onClick={handleClick}
            >
              {renderDragHandle()}
              <DropIndicator 
                position="inside" 
                isVisible={isOverInside} 
                elementType={dragData?.elementType} 
                targetElementType="section" 
              />
              {element.children && element.children.length > 0 ? (
                element.children.map((child, idx) => <RenderElement key={child.id} element={child} index={idx} viewport={viewport} />)
              ) : (
                <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                  Drop elements here
                </div>
              )}
            </section>
          )
        case "container":
          return (
            <div
              ref={setDropInsideRef}
              className={cn(baseClasses, "min-h-[50px]", isOverInside && "ring-2 ring-primary ring-dashed")}
              style={cssStyles}
              onClick={handleClick}
            >
              {renderDragHandle()}
              <DropIndicator 
                position="inside" 
                isVisible={isOverInside} 
                elementType={dragData?.elementType} 
                targetElementType="container" 
              />
              {element.children && element.children.length > 0 ? (
                element.children.map((child, idx) => <RenderElement key={child.id} element={child} index={idx} viewport={viewport} />)
              ) : (
                <div className="flex items-center justify-center h-20 text-sm text-muted-foreground border-2 border-dashed rounded">
                  Drop elements here
                </div>
              )}
            </div>
          )
        case "navbar":
          return (
            <div 
              ref={setDropInsideRef}
              className={cn(baseClasses, "min-h-[64px]", isOverInside && "ring-2 ring-primary ring-dashed")}
              onClick={handleClick}
            >
              {renderDragHandle()}
              <EnhancedNavbarComponent 
                element={element} 
                viewport={viewport}
                isPreview={false}
              >
                <DropIndicator 
                  position="inside" 
                  isVisible={isOverInside} 
                  elementType={dragData?.elementType} 
                  targetElementType="navbar" 
                />
                {element.children && element.children.length > 0 ? (
                  element.children.map((child, idx) => (
                    <RenderElement key={child.id} element={child} index={idx} viewport={viewport} />
                  ))
                ) : (
                  <div className="flex items-center justify-center h-16 text-sm text-muted-foreground border-2 border-dashed rounded mx-4">
                    Drop elements here (logo, links, buttons, etc.)
                  </div>
                )}
              </EnhancedNavbarComponent>
            </div>
          )
        case "hero":
          return (
            <div className={cn(baseClasses, isOverInside && "ring-2 ring-primary ring-dashed")}>
              {renderDragHandle()}
              <HeroComponent element={element} isPreview={false} />
              <DropIndicator 
                position="inside" 
                isVisible={isOverInside} 
                elementType={dragData?.elementType} 
                targetElementType="hero" 
              />
            </div>
          )
        case "footer":
          return (
            <div className={cn(baseClasses, isOverInside && "ring-2 ring-primary ring-dashed")}>
              {renderDragHandle()}
              <FooterComponent element={element} isPreview={false} />
              <DropIndicator 
                position="inside" 
                isVisible={isOverInside} 
                elementType={dragData?.elementType} 
                targetElementType="footer" 
              />
            </div>
          )
        case "form":
          return (
            <div className={cn(baseClasses, isOverInside && "ring-2 ring-primary ring-dashed")}>
              {renderDragHandle()}
              <FormComponent element={element} isPreview={false} />
              <DropIndicator 
                position="inside" 
                isVisible={isOverInside} 
                elementType={dragData?.elementType} 
                targetElementType="form" 
              />
            </div>
          )
        case "text":
          const Tag = element.content.tag || "p"
          return (
            <Tag className={baseClasses} style={cssStyles} onClick={handleClick}>
              {renderDragHandle()}
              {element.content.text || "Edit this text"}
            </Tag>
          )
        case "image":
          return (
            <div className={cn(baseClasses, "inline-block")} onClick={handleClick}>
              {renderDragHandle()}
              <img
                style={cssStyles}
                src={element.content.src || "/placeholder.svg"}
                alt={element.content.alt}
                className="max-w-full"
              />
            </div>
          )
        case "button":
          return (
            <div className={cn(baseClasses, "inline-block")} onClick={handleClick}>
              {renderDragHandle()}
              <button style={cssStyles}>{element.content.text || "Button"}</button>
            </div>
          )
        case "logo":
          return (
            <div className={cn(baseClasses, "inline-block")} onClick={handleClick}>
              {renderDragHandle()}
              {element.content.src ? (
                <img
                  style={cssStyles}
                  src={element.content.src}
                  alt={element.content.alt || "Logo"}
                  className="max-h-12"
                />
              ) : (
                <div className="px-4 py-2 bg-gray-100 rounded text-sm">Logo</div>
              )}
            </div>
          )
        case "form":
          return (
            <form
              ref={setDropInsideRef}
              className={cn(
                baseClasses,
                "p-4 border border-gray-200 rounded min-h-[100px]",
                isOverInside && "ring-2 ring-primary ring-dashed"
              )}
              style={cssStyles}
              onClick={handleClick}
            >
              {renderDragHandle()}
              <DropIndicator 
                position="inside" 
                isVisible={isOverInside} 
                elementType={dragData?.elementType} 
                targetElementType="form" 
              />
              <h3 className="mb-4 font-semibold">{element.content.title || "Form"}</h3>
              {element.children && element.children.length > 0 ? (
                <div className="space-y-4">
                  {element.children.map((child, idx) => (
                    <RenderElement key={child.id} element={child} index={idx} viewport={viewport} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-20 text-sm text-muted-foreground border-2 border-dashed rounded">
                  Drop form elements here
                </div>
              )}
            </form>
          )
        default:
          return (
            <div className={baseClasses} onClick={handleClick}>
              Unknown element
            </div>
          )
      }
    }

    return (
      <div
        ref={(node) => {
          setDropBetweenRef(node)
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
        }}
        className="relative"
      >
        {renderContent()}
      </div>
    )
  }
)
RenderElement.displayName = "RenderElement"
