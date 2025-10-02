"use client"

import { useState } from "react"
import { useEditor } from "../editor-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { 
  Type, 
  Palette, 
  Layout, 
  Square, 
  Image as ImageIcon,
  Layers,
  Monitor,
  Tablet,
  Smartphone
} from "lucide-react"
import type { EditorElement } from "@/lib/types"
import type { Viewport } from "../viewport-switcher"
import { updateResponsiveStyles, getResponsiveStyles, BREAKPOINTS } from "@/lib/responsive-utils"
import { DESIGN_TOKENS, getColor, getFontSize, getSpacing, getBorderRadius, getShadow } from "@/lib/design-tokens"
import { normalizeInlineStyles } from "@/lib/style-normalizer"

interface StylePanelProps {
  element: EditorElement
  viewport: Viewport
}

export function StylePanel({ element, viewport }: StylePanelProps) {
  const { updateElement } = useEditor()
  const [activeTab, setActiveTab] = useState("typography")

  const currentStyles = getResponsiveStyles(element, viewport)

  const updateStyle = (property: string, value: string | number) => {
    // Create normalized styles to prevent shorthand/longhand conflicts
    const newStyles = normalizeInlineStyles({ [property]: value })
    const updatedElement = updateResponsiveStyles(element, viewport, newStyles)
    updateElement(element.id, { responsive_styles: updatedElement.responsive_styles })
  }

  const updateMultipleStyles = (styles: Record<string, string | number>) => {
    // Normalize all styles to prevent conflicts
    const normalizedStyles = normalizeInlineStyles(styles)
    const updatedElement = updateResponsiveStyles(element, viewport, normalizedStyles)
    updateElement(element.id, { responsive_styles: updatedElement.responsive_styles })
  }

  const getViewportIcon = (viewport: Viewport) => {
    switch (viewport) {
      case "desktop": return <Monitor className="h-4 w-4" />
      case "tablet": return <Tablet className="h-4 w-4" />
      case "mobile": return <Smartphone className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      {/* Viewport Indicator */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            {getViewportIcon(viewport)}
            Editing {viewport} styles
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="typography" className="text-xs">
            <Type className="h-3 w-3 mr-1" />
            Text
          </TabsTrigger>
          <TabsTrigger value="spacing" className="text-xs">
            <Layout className="h-3 w-3 mr-1" />
            Space
          </TabsTrigger>
          <TabsTrigger value="background" className="text-xs">
            <Palette className="h-3 w-3 mr-1" />
            BG
          </TabsTrigger>
          <TabsTrigger value="border" className="text-xs">
            <Square className="h-3 w-3 mr-1" />
            Border
          </TabsTrigger>
        </TabsList>

        <TabsContent value="typography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Typography</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Font Family */}
              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <Select 
                  value={currentStyles.fontFamily || "inherit"} 
                  onValueChange={(value) => updateStyle("fontFamily", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inherit">Inherit</SelectItem>
                    <SelectItem value={DESIGN_TOKENS.typography.fontFamilies.sans.join(', ')}>Inter (Sans Serif)</SelectItem>
                    <SelectItem value={DESIGN_TOKENS.typography.fontFamilies.serif.join(', ')}>Georgia (Serif)</SelectItem>
                    <SelectItem value={DESIGN_TOKENS.typography.fontFamilies.mono.join(', ')}>Fira Code (Monospace)</SelectItem>
                    <SelectItem value="system-ui, sans-serif">System UI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="text-xs">Font Size</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[parseInt(currentStyles.fontSize?.toString().replace('px', '') || '16')]}
                    onValueChange={(value: number[]) => updateStyle("fontSize", `${value[0]}px`)}
                    max={72}
                    min={8}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={parseInt(currentStyles.fontSize?.toString().replace('px', '') || '16')}
                    onChange={(e) => updateStyle("fontSize", `${e.target.value}px`)}
                    className="w-16 h-8"
                    min={8}
                    max={72}
                  />
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-2">
                <Label className="text-xs">Font Weight</Label>
                <Select 
                  value={currentStyles.fontWeight?.toString() || "400"} 
                  onValueChange={(value) => updateStyle("fontWeight", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semibold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <Label className="text-xs">Text Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={currentStyles.color?.toString() || "#000000"}
                    onChange={(e) => updateStyle("color", e.target.value)}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={currentStyles.color?.toString() || "#000000"}
                    onChange={(e) => updateStyle("color", e.target.value)}
                    className="flex-1 h-8"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Text Align */}
              <div className="space-y-2">
                <Label className="text-xs">Text Align</Label>
                <Select 
                  value={currentStyles.textAlign?.toString() || "left"} 
                  onValueChange={(value) => updateStyle("textAlign", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="justify">Justify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Spacing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Margin */}
              <div className="space-y-2">
                <Label className="text-xs">Margin</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Top</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.marginTop?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("marginTop", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Right</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.marginRight?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("marginRight", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Bottom</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.marginBottom?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("marginBottom", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Left</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.marginLeft?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("marginLeft", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Padding */}
              <div className="space-y-2">
                <Label className="text-xs">Padding</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Top</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.paddingTop?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("paddingTop", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Right</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.paddingRight?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("paddingRight", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Bottom</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.paddingBottom?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("paddingBottom", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Left</Label>
                    <Input
                      type="number"
                      value={parseInt(currentStyles.paddingLeft?.toString().replace('px', '') || '0')}
                      onChange={(e) => updateStyle("paddingLeft", `${e.target.value}px`)}
                      className="h-8"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="background" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Background Color */}
              <div className="space-y-2">
                <Label className="text-xs">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={currentStyles.backgroundColor?.toString() || "#ffffff"}
                    onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={currentStyles.backgroundColor?.toString() || ""}
                    onChange={(e) => updateStyle("backgroundColor", e.target.value)}
                    className="flex-1 h-8"
                    placeholder="transparent"
                  />
                </div>
              </div>

              {/* Background Image */}
              <div className="space-y-2">
                <Label className="text-xs">Background Image</Label>
                <Input
                  type="url"
                  value={currentStyles.backgroundImage?.toString().replace('url(', '').replace(')', '') || ""}
                  onChange={(e) => updateStyle("backgroundImage", e.target.value ? `url(${e.target.value})` : "")}
                  className="h-8"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Background Size */}
              <div className="space-y-2">
                <Label className="text-xs">Background Size</Label>
                <Select 
                  value={currentStyles.backgroundSize?.toString() || "cover"} 
                  onValueChange={(value) => updateStyle("backgroundSize", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="100% 100%">Stretch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Background Position */}
              <div className="space-y-2">
                <Label className="text-xs">Background Position</Label>
                <Select 
                  value={currentStyles.backgroundPosition?.toString() || "center"} 
                  onValueChange={(value) => updateStyle("backgroundPosition", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="top">Top</SelectItem>
                    <SelectItem value="bottom">Bottom</SelectItem>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="top left">Top Left</SelectItem>
                    <SelectItem value="top right">Top Right</SelectItem>
                    <SelectItem value="bottom left">Bottom Left</SelectItem>
                    <SelectItem value="bottom right">Bottom Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="border" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Border & Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Border Width */}
              <div className="space-y-2">
                <Label className="text-xs">Border Width</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[parseInt(currentStyles.borderWidth?.toString().replace('px', '') || '0')]}
                    onValueChange={(value: number[]) => updateStyle("borderWidth", `${value[0]}px`)}
                    max={10}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={parseInt(currentStyles.borderWidth?.toString().replace('px', '') || '0')}
                    onChange={(e) => updateStyle("borderWidth", `${e.target.value}px`)}
                    className="w-16 h-8"
                    min={0}
                    max={10}
                  />
                </div>
              </div>

              {/* Border Color */}
              <div className="space-y-2">
                <Label className="text-xs">Border Color</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="color"
                    value={currentStyles.borderColor?.toString() || "#000000"}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    className="w-12 h-8 p-1 border rounded"
                  />
                  <Input
                    type="text"
                    value={currentStyles.borderColor?.toString() || ""}
                    onChange={(e) => updateStyle("borderColor", e.target.value)}
                    className="flex-1 h-8"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Border Style */}
              <div className="space-y-2">
                <Label className="text-xs">Border Style</Label>
                <Select 
                  value={currentStyles.borderStyle?.toString() || "solid"} 
                  onValueChange={(value) => updateStyle("borderStyle", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Border Radius */}
              <div className="space-y-2">
                <Label className="text-xs">Border Radius</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    value={[parseInt(currentStyles.borderRadius?.toString().replace('px', '') || '0')]}
                    onValueChange={(value: number[]) => updateStyle("borderRadius", `${value[0]}px`)}
                    max={50}
                    min={0}
                    step={1}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={parseInt(currentStyles.borderRadius?.toString().replace('px', '') || '0')}
                    onChange={(e) => updateStyle("borderRadius", `${e.target.value}px`)}
                    className="w-16 h-8"
                    min={0}
                    max={50}
                  />
                </div>
              </div>

              {/* Box Shadow */}
              <div className="space-y-2">
                <Label className="text-xs">Box Shadow</Label>
                <Select 
                  value={currentStyles.boxShadow?.toString() || "none"} 
                  onValueChange={(value) => updateStyle("boxShadow", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="0 1px 3px rgba(0,0,0,0.1)">Small</SelectItem>
                    <SelectItem value="0 4px 6px rgba(0,0,0,0.1)">Medium</SelectItem>
                    <SelectItem value="0 10px 15px rgba(0,0,0,0.1)">Large</SelectItem>
                    <SelectItem value="0 20px 25px rgba(0,0,0,0.1)">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}