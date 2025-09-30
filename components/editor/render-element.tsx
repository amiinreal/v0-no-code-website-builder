"use client"

import type React from "react"

import type { EditorElement } from "@/lib/types"
import { useEditor } from "./editor-provider"
import { cn } from "@/lib/utils"
import { useDraggable, useDroppable } from "@dnd-kit/core"
import { GripVertical } from "lucide-react"
import { DropIndicator } from "./dnd/drop-indicator"
import { canDropInElement } from "@/lib/dnd/utils"

interface RenderElementProps {
  element: EditorElement
  index?: number
}

export function RenderElement({ element, index = 0 }: RenderElementProps) {
  const { selectedElement, setSelectedElement } = useEditor()
  const isSelected = selectedElement?.id === element.id
  const canContainChildren = canDropInElement(element.type)

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: element.id,
    data: {
      type: "existing-element",
      elementId: element.id,
      parentId: element.parent_id,
    },
  })

  const { setNodeRef: setDropRef, isOver: isOverBorder } = useDroppable({
    id: `drop-border-${element.id}`,
    data: {
      type: "border",
      elementId: element.id,
      parentId: element.parent_id,
      position: index,
    },
  })

  const { setNodeRef: setDropInsideRef, isOver: isOverInside } = useDroppable({
    id: `drop-inside-${element.id}`,
    data: {
      type: "inside",
      elementId: element.id,
      parentId: element.id,
      position: element.children?.length || 0,
    },
    disabled: !canContainChildren,
  })

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedElement(element)
  }

  const baseClasses = cn(
    "relative transition-all group",
    isSelected && "ring-2 ring-primary ring-offset-2",
    isDragging && "opacity-30",
  )

  const renderDragHandle = () => {
    if (!isSelected) return null
    return (
      <div
        className="absolute -left-8 top-2 z-10 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        {...listeners}
        {...attributes}
      >
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>
    )
  }

  const renderContent = () => {
    switch (element.type) {
      case "section":
        return (
          <section
            ref={setDropInsideRef}
            className={cn(baseClasses, "min-h-[100px]", isOverInside && "ring-2 ring-primary ring-dashed")}
            style={element.styles}
            onClick={handleClick}
          >
            {renderDragHandle()}
            <DropIndicator position="inside" isVisible={isOverInside} />
            {element.children && element.children.length > 0 ? (
              element.children.map((child, idx) => <RenderElement key={child.id} element={child} index={idx} />)
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
            className={cn(baseClasses, "min-h-[80px]", isOverInside && "ring-2 ring-primary ring-dashed")}
            style={element.styles}
            onClick={handleClick}
          >
            {renderDragHandle()}
            <DropIndicator position="inside" isVisible={isOverInside} />
            {element.children && element.children.length > 0 ? (
              element.children.map((child, idx) => <RenderElement key={child.id} element={child} index={idx} />)
            ) : (
              <div className="flex items-center justify-center h-20 text-sm text-muted-foreground border-2 border-dashed rounded">
                Drop elements here
              </div>
            )}
          </div>
        )
      case "navbar":
        return (
          <nav
            ref={setDropInsideRef}
            className={cn(
              baseClasses,
              "flex items-center justify-between p-4 min-h-[60px]",
              isOverInside && "ring-2 ring-primary ring-dashed",
            )}
            style={element.styles}
            onClick={handleClick}
          >
            {renderDragHandle()}
            <DropIndicator position="inside" isVisible={isOverInside} />
            <span className="font-bold">{element.content.brand || "Brand"}</span>
            <div className="flex gap-4">
              {element.content.links?.map((link: any, i: number) => (
                <a key={i} href={link.href}>
                  {link.text}
                </a>
              ))}
              {element.children && element.children.length > 0 && (
                <div className="flex gap-2">
                  {element.children.map((child, idx) => (
                    <RenderElement key={child.id} element={child} index={idx} />
                  ))}
                </div>
              )}
            </div>
          </nav>
        )
      case "footer":
        return (
          <footer
            ref={setDropInsideRef}
            className={cn(
              baseClasses,
              "p-4 text-center min-h-[60px]",
              isOverInside && "ring-2 ring-primary ring-dashed",
            )}
            style={element.styles}
            onClick={handleClick}
          >
            {renderDragHandle()}
            <DropIndicator position="inside" isVisible={isOverInside} />
            {element.content.text || "Footer"}
            {element.children && element.children.length > 0 && (
              <div className="mt-4 space-y-2">
                {element.children.map((child, idx) => (
                  <RenderElement key={child.id} element={child} index={idx} />
                ))}
              </div>
            )}
          </footer>
        )
      case "text":
        const Tag = element.content.tag || "p"
        return (
          <Tag className={baseClasses} style={element.styles} onClick={handleClick}>
            {renderDragHandle()}
            {element.content.text || "Edit this text"}
          </Tag>
        )
      case "image":
        return (
          <div className={cn(baseClasses, "inline-block")} onClick={handleClick}>
            {renderDragHandle()}
            <img
              style={element.styles}
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
            <button style={element.styles}>{element.content.text || "Button"}</button>
          </div>
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
        setDragRef(node)
        setDropRef(node)
      }}
      className="relative"
    >
      {renderContent()}
    </div>
  )
}
