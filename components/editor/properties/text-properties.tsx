"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { EditorElement } from "@/lib/types"
import { useEditor } from "../editor-provider"
import { normalizeInlineStyles } from "@/lib/style-normalizer"

interface TextPropertiesProps {
  element: EditorElement
}

export function TextProperties({ element }: TextPropertiesProps) {
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
        <Label>Text Content</Label>
        <Textarea
          value={element.content.text || ""}
          onChange={(e) => handleContentChange("text", e.target.value)}
          placeholder="Enter text..."
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Tag</Label>
        <Select value={element.content.tag || "p"} onValueChange={(value) => handleContentChange("tag", value)}>
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">Paragraph</SelectItem>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="h4">Heading 4</SelectItem>
            <SelectItem value="span">Span</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Font Size</Label>
        <Input
          type="text"
          value={element.styles.fontSize || "16px"}
          onChange={(e) => handleStyleChange("fontSize", e.target.value)}
          placeholder="16px"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Color</Label>
        <div className="flex gap-2 mt-1.5">
          <Input
            type="color"
            value={element.styles.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            className="w-16 h-10"
          />
          <Input
            type="text"
            value={element.styles.color || "#000000"}
            onChange={(e) => handleStyleChange("color", e.target.value)}
            placeholder="#000000"
          />
        </div>
      </div>

      <div>
        <Label>Font Weight</Label>
        <Select
          value={element.styles.fontWeight || "normal"}
          onValueChange={(value) => handleStyleChange("fontWeight", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="bold">Bold</SelectItem>
            <SelectItem value="lighter">Lighter</SelectItem>
            <SelectItem value="600">Semi Bold</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
