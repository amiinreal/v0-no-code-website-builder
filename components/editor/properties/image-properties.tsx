"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { EditorElement } from "@/lib/types"
import { useEditor } from "../editor-provider"

interface ImagePropertiesProps {
  element: EditorElement
}

export function ImageProperties({ element }: ImagePropertiesProps) {
  const { updateElement } = useEditor()

  const handleContentChange = (field: string, value: any) => {
    updateElement(element.id, {
      content: { ...element.content, [field]: value },
    })
  }

  const handleStyleChange = (field: string, value: any) => {
    updateElement(element.id, {
      styles: { ...element.styles, [field]: value },
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Image URL</Label>
        <Input
          type="text"
          value={element.content.src || ""}
          onChange={(e) => handleContentChange("src", e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Alt Text</Label>
        <Input
          type="text"
          value={element.content.alt || ""}
          onChange={(e) => handleContentChange("alt", e.target.value)}
          placeholder="Image description"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Width</Label>
        <Input
          type="text"
          value={element.styles.width || "auto"}
          onChange={(e) => handleStyleChange("width", e.target.value)}
          placeholder="auto, 100%, 400px"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Height</Label>
        <Input
          type="text"
          value={element.styles.height || "auto"}
          onChange={(e) => handleStyleChange("height", e.target.value)}
          placeholder="auto, 100%, 300px"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Border Radius</Label>
        <Input
          type="text"
          value={element.styles.borderRadius || "0px"}
          onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
          placeholder="0px, 8px, 50%"
          className="mt-1.5"
        />
      </div>
    </div>
  )
}
