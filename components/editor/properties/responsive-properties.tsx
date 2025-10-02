"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEditor } from "../editor-provider"
import type { EditorElement } from "@/lib/types"
import type { Viewport } from "../viewport-switcher"
import { Monitor, Tablet, Smartphone, Copy, RotateCcw } from "lucide-react"
import { updateResponsiveStyles } from "@/lib/responsive-utils"
import { useState } from "react"

interface ResponsivePropertiesProps {
  element: EditorElement
  currentViewport: Viewport
}

export function ResponsiveProperties({ element, currentViewport }: ResponsivePropertiesProps) {
  const { updateElement } = useEditor()
  const [activeTab, setActiveTab] = useState<Viewport>(currentViewport)

  const handleStyleChange = (viewport: Viewport, field: string, value: any) => {
    const updatedElement = updateResponsiveStyles(element, viewport, { [field]: value })
    updateElement(element.id, {
      responsive_styles: updatedElement.responsive_styles,
    })
  }

  const copyFromViewport = (fromViewport: Viewport, toViewport: Viewport) => {
    const sourceStyles = fromViewport === "desktop" 
      ? element.styles 
      : element.responsive_styles?.[fromViewport] || {}
    
    const updatedElement = updateResponsiveStyles(element, toViewport, sourceStyles)
    updateElement(element.id, {
      responsive_styles: updatedElement.responsive_styles,
    })
  }

  const resetViewport = (viewport: Viewport) => {
    const updatedElement = { ...element }
    if (updatedElement.responsive_styles) {
      delete updatedElement.responsive_styles[viewport]
    }
    updateElement(element.id, {
      responsive_styles: updatedElement.responsive_styles,
    })
  }

  const getViewportStyles = (viewport: Viewport) => {
    if (viewport === "desktop") {
      return element.styles || {}
    }
    return element.responsive_styles?.[viewport] || {}
  }

  const renderStyleControls = (viewport: Viewport) => {
    const styles = getViewportStyles(viewport)
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">
            {viewport === "desktop" ? "Desktop" : viewport === "tablet" ? "Tablet" : "Mobile"} Styles
          </h4>
          <div className="flex gap-1">
            {viewport !== "desktop" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyFromViewport("desktop", viewport)}
                  title="Copy from Desktop"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resetViewport(viewport)}
                  title="Reset to inherit"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Width</Label>
            <Input
              type="text"
              value={styles.width || ""}
              onChange={(e) => handleStyleChange(viewport, "width", e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Height</Label>
            <Input
              type="text"
              value={styles.height || ""}
              onChange={(e) => handleStyleChange(viewport, "height", e.target.value)}
              placeholder="auto"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Padding</Label>
            <Input
              type="text"
              value={styles.padding || ""}
              onChange={(e) => handleStyleChange(viewport, "padding", e.target.value)}
              placeholder="0"
              className="h-8 text-xs"
            />
          </div>
          <div>
            <Label className="text-xs">Margin</Label>
            <Input
              type="text"
              value={styles.margin || ""}
              onChange={(e) => handleStyleChange(viewport, "margin", e.target.value)}
              placeholder="0"
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Display</Label>
          <Select
            value={styles.display || "default"}
            onValueChange={(value) => handleStyleChange(viewport, "display", value === "default" ? "" : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Default" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="block">Block</SelectItem>
              <SelectItem value="flex">Flex</SelectItem>
              <SelectItem value="grid">Grid</SelectItem>
              <SelectItem value="inline-block">Inline Block</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {styles.display === "flex" && (
          <>
            <div>
              <Label className="text-xs">Flex Direction</Label>
              <Select
                value={styles.flexDirection || "default"}
                onValueChange={(value) => handleStyleChange(viewport, "flexDirection", value === "default" ? "" : value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Row" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="row">Row</SelectItem>
                  <SelectItem value="column">Column</SelectItem>
                  <SelectItem value="row-reverse">Row Reverse</SelectItem>
                  <SelectItem value="column-reverse">Column Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Justify Content</Label>
                <Select
                  value={styles.justifyContent || "default"}
                  onValueChange={(value) => handleStyleChange(viewport, "justifyContent", value === "default" ? "" : value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Start" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Align Items</Label>
                <Select
                  value={styles.alignItems || "default"}
                  onValueChange={(value) => handleStyleChange(viewport, "alignItems", value === "default" ? "" : value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Stretch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="stretch">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        )}

        <div>
          <Label className="text-xs">Font Size</Label>
          <Input
            type="text"
            value={styles.fontSize || ""}
            onChange={(e) => handleStyleChange(viewport, "fontSize", e.target.value)}
            placeholder="16px"
            className="h-8 text-xs"
          />
        </div>

        <div>
          <Label className="text-xs">Text Align</Label>
          <Select
            value={styles.textAlign || "default"}
            onValueChange={(value) => handleStyleChange(viewport, "textAlign", value === "default" ? "" : value)}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Left" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
              <SelectItem value="justify">Justify</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium">Responsive Design</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Customize styles for different screen sizes
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Viewport)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="desktop" className="flex items-center gap-1">
            <Monitor className="h-3 w-3" />
            <span className="hidden sm:inline">Desktop</span>
          </TabsTrigger>
          <TabsTrigger value="tablet" className="flex items-center gap-1">
            <Tablet className="h-3 w-3" />
            <span className="hidden sm:inline">Tablet</span>
          </TabsTrigger>
          <TabsTrigger value="mobile" className="flex items-center gap-1">
            <Smartphone className="h-3 w-3" />
            <span className="hidden sm:inline">Mobile</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desktop" className="mt-4">
          {renderStyleControls("desktop")}
        </TabsContent>

        <TabsContent value="tablet" className="mt-4">
          {renderStyleControls("tablet")}
        </TabsContent>

        <TabsContent value="mobile" className="mt-4">
          {renderStyleControls("mobile")}
        </TabsContent>
      </Tabs>
    </div>
  )
}