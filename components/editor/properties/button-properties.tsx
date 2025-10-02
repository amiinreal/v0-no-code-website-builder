"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { EditorElement } from "@/lib/types"
import { useEditor } from "../editor-provider"
import { normalizeInlineStyles } from "@/lib/style-normalizer"

interface ButtonPropertiesProps {
  element: EditorElement
}

export function ButtonProperties({ element }: ButtonPropertiesProps) {
  const { updateElement } = useEditor()

  const handleContentChange = (field: string, value: any) => {
    updateElement(element.id, {
      content: { ...element.content, [field]: value },
    })
  }

  const handleStyleChange = (field: string, value: any) => {
    // Normalize styles to prevent shorthand/longhand conflicts
    const normalizedStyles = normalizeInlineStyles({ ...element.styles, [field]: value })
    updateElement(element.id, {
      styles: normalizedStyles,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Button Text</Label>
        <Input
          type="text"
          value={element.content.text || ""}
          onChange={(e) => handleContentChange("text", e.target.value)}
          placeholder="Click me"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Link URL</Label>
        <Input
          type="text"
          value={element.content.href || ""}
          onChange={(e) => handleContentChange("href", e.target.value)}
          placeholder="https://example.com"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            type="color"
            value={element.styles.backgroundColor || "#000000"}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            className="w-16 h-10"
          />
          <Input
            type="text"
            value={element.styles.backgroundColor || "#000000"}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <Label>Text Color</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            type="color"
            value={element.styles.color || "#ffffff"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            className="w-16 h-10"
          />
          <Input
            type="text"
            value={element.styles.color || "#ffffff"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div>
        <Label>Padding</Label>
        <Input
          type="text"
          value={element.styles.padding || "10px 20px"}
          onChange={(e) => handleStyleChange("padding", e.target.value)}
          placeholder="10px 20px"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Border Radius</Label>
        <Input
          type="text"
          value={element.styles.borderRadius || "4px"}
          onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
          placeholder="4px"
          className="mt-1.5"
        />
      </div>
    </div>
  )
}
