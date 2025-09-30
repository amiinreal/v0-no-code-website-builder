"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { EditorElement } from "@/lib/types"
import { useEditor } from "../editor-provider"

interface ContainerPropertiesProps {
  element: EditorElement
}

export function ContainerProperties({ element }: ContainerPropertiesProps) {
  const { updateElement } = useEditor()

  const handleStyleChange = (field: string, value: any) => {
    updateElement(element.id, {
      styles: { ...element.styles, [field]: value },
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Background Color</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            type="color"
            value={element.styles.backgroundColor || "#ffffff"}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            className="w-16 h-10"
          />
          <Input
            type="text"
            value={element.styles.backgroundColor || "#ffffff"}
            onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
            placeholder="#ffffff"
          />
        </div>
      </div>

      <div>
        <Label>Padding</Label>
        <Input
          type="text"
          value={element.styles.padding || "20px"}
          onChange={(e) => handleStyleChange("padding", e.target.value)}
          placeholder="20px or 10px 20px"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Margin</Label>
        <Input
          type="text"
          value={element.styles.margin || "0 auto"}
          onChange={(e) => handleStyleChange("margin", e.target.value)}
          placeholder="0 auto"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Max Width</Label>
        <Input
          type="text"
          value={element.styles.maxWidth || "1200px"}
          onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
          placeholder="1200px, 100%"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Border Radius</Label>
        <Input
          type="text"
          value={element.styles.borderRadius || "0px"}
          onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
          placeholder="0px, 8px"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Border</Label>
        <Input
          type="text"
          value={element.styles.border || "none"}
          onChange={(e) => handleStyleChange("border", e.target.value)}
          placeholder="1px solid #ccc"
          className="mt-1.5"
        />
      </div>
    </div>
  )
}
