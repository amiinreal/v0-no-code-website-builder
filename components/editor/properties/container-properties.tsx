"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { EditorElement } from "@/lib/types"
import { useEditor } from "../editor-provider"
import { normalizeInlineStyles } from "@/lib/style-normalizer"

interface ContainerPropertiesProps {
  element: EditorElement
}

export function ContainerProperties({ element }: ContainerPropertiesProps) {
  const { updateElement } = useEditor()

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
        <Label>Display Type</Label>
        <Select
          value={element.styles?.display || "block"}
          onValueChange={(value) => handleStyleChange("display", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select display type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="block">Block</SelectItem>
            <SelectItem value="flex">Flex</SelectItem>
            <SelectItem value="grid">Grid</SelectItem>
            <SelectItem value="inline-block">Inline Block</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {element.styles?.display === "flex" && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Flexbox Layout</h4>
            
            <div>
              <Label>Flex Direction</Label>
              <Select
                value={element.styles?.flexDirection || "row"}
                onValueChange={(value) => handleStyleChange("flexDirection", value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Justify Content</Label>
              <Select
                value={element.styles?.justifyContent || "flex-start"}
                onValueChange={(value) => handleStyleChange("justifyContent", value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="space-between">Space Between</SelectItem>
                  <SelectItem value="space-around">Space Around</SelectItem>
                  <SelectItem value="space-evenly">Space Evenly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Align Items</Label>
              <Select
                value={element.styles?.alignItems || "stretch"}
                onValueChange={(value) => handleStyleChange("alignItems", value)}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stretch">Stretch</SelectItem>
                  <SelectItem value="flex-start">Start</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="flex-end">End</SelectItem>
                  <SelectItem value="baseline">Baseline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Gap</Label>
              <Input
                type="text"
                value={element.styles?.gap || ""}
                onChange={(e) => handleStyleChange("gap", e.target.value)}
                placeholder="e.g., 16px, 1rem"
                className="mt-1.5"
              />
            </div>
          </div>
        </>
      )}

      {element.styles?.display === "grid" && (
        <>
          <Separator />
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Grid Layout</h4>
            
            <div>
              <Label>Grid Template Columns</Label>
              <Input
                type="text"
                value={element.styles?.gridTemplateColumns || ""}
                onChange={(e) => handleStyleChange("gridTemplateColumns", e.target.value)}
                placeholder="e.g., 1fr 1fr, repeat(3, 1fr)"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Grid Template Rows</Label>
              <Input
                type="text"
                value={element.styles?.gridTemplateRows || ""}
                onChange={(e) => handleStyleChange("gridTemplateRows", e.target.value)}
                placeholder="e.g., auto, 100px 200px"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Grid Gap</Label>
              <Input
                type="text"
                value={element.styles?.gap || ""}
                onChange={(e) => handleStyleChange("gap", e.target.value)}
                placeholder="e.g., 16px, 1rem"
                className="mt-1.5"
              />
            </div>
          </div>
        </>
      )}

      <Separator />

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
          value={element.styles.margin || ""}
          onChange={(e) => handleStyleChange("margin", e.target.value)}
          placeholder="e.g., 16px, 1rem 2rem"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Border Radius</Label>
        <Input
          type="text"
          value={element.styles.borderRadius || ""}
          onChange={(e) => handleStyleChange("borderRadius", e.target.value)}
          placeholder="e.g., 8px, 0.5rem"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Min Height</Label>
        <Input
          type="text"
          value={element.styles.minHeight || ""}
          onChange={(e) => handleStyleChange("minHeight", e.target.value)}
          placeholder="e.g., 200px, 50vh"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Width</Label>
        <Input
          type="text"
          value={element.styles.width || ""}
          onChange={(e) => handleStyleChange("width", e.target.value)}
          placeholder="e.g., 100%, 500px, auto"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Height</Label>
        <Input
          type="text"
          value={element.styles.height || ""}
          onChange={(e) => handleStyleChange("height", e.target.value)}
          placeholder="e.g., auto, 300px, 50vh"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Max Width</Label>
        <Input
          type="text"
          value={element.styles.maxWidth || ""}
          onChange={(e) => handleStyleChange("maxWidth", e.target.value)}
          placeholder="e.g., 1200px, 100%"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Border</Label>
        <Input
          type="text"
          value={element.styles.border || ""}
          onChange={(e) => handleStyleChange("border", e.target.value)}
          placeholder="e.g., 1px solid #ccc"
          className="mt-1.5"
        />
      </div>
    </div>
  )
}
