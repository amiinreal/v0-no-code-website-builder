"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEditor } from "./editor-provider"
import type { EditorElement } from "@/lib/types"
import { generateHydrationSafeId } from "@/lib/utils/stable-id"

interface NavbarPreset {
  id: string
  name: string
  description: string
  preview: string
  elements: Partial<Pick<EditorElement, 'type' | 'content' | 'styles' | 'responsive_styles'> & {
    children?: Partial<Pick<EditorElement, 'type' | 'content' | 'styles' | 'responsive_styles'>>[]
  }>[]
}

const NAVBAR_PRESETS: NavbarPreset[] = [
  {
    id: "simple-navbar",
    name: "Simple Navbar",
    description: "Clean navbar with logo and navigation links",
    preview: "Logo | Home About Contact",
    elements: [
      {
        type: "logo",
        content: { text: "Brand", imageUrl: "" },
        styles: { fontSize: "24px", fontWeight: "bold", color: "#000" }
      },
      {
        type: "container",
        styles: { display: "flex", gap: "24px", alignItems: "center" },
        children: [
          {
            type: "text",
            content: { text: "Home" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          },
          {
            type: "text", 
            content: { text: "About" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          },
          {
            type: "text",
            content: { text: "Contact" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          }
        ]
      }
    ]
  },
  {
    id: "cta-navbar",
    name: "CTA Navbar",
    description: "Navbar with call-to-action button",
    preview: "Logo | Home About | Get Started",
    elements: [
      {
        type: "logo",
        content: { text: "Brand", imageUrl: "" },
        styles: { fontSize: "24px", fontWeight: "bold", color: "#000" }
      },
      {
        type: "container",
        styles: { display: "flex", gap: "24px", alignItems: "center" },
        children: [
          {
            type: "text",
            content: { text: "Home" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          },
          {
            type: "text",
            content: { text: "About" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          }
        ]
      },
      {
        type: "button",
        content: { text: "Get Started" },
        styles: {
          backgroundColor: "#3b82f6",
          color: "white",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer"
        }
      }
    ]
  },
  {
    id: "centered-navbar",
    name: "Centered Navbar",
    description: "Logo centered with navigation on sides",
    preview: "Home About | LOGO | Services Contact",
    elements: [
      {
        type: "container",
        styles: { display: "flex", gap: "24px", alignItems: "center" },
        children: [
          {
            type: "text",
            content: { text: "Home" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          },
          {
            type: "text",
            content: { text: "About" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          }
        ]
      },
      {
        type: "logo",
        content: { text: "BRAND", imageUrl: "" },
        styles: { fontSize: "28px", fontWeight: "bold", color: "#000", margin: "0 auto" }
      },
      {
        type: "container",
        styles: { display: "flex", gap: "24px", alignItems: "center" },
        children: [
          {
            type: "text",
            content: { text: "Services" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          },
          {
            type: "text",
            content: { text: "Contact" },
            styles: { color: "#000", textDecoration: "none", cursor: "pointer" }
          }
        ]
      }
    ]
  },
  {
    id: "minimal-navbar",
    name: "Minimal Navbar",
    description: "Ultra-clean minimal design",
    preview: "Brand | Home Work Contact",
    elements: [
      {
        type: "text",
        content: { text: "Brand" },
        styles: { fontSize: "20px", fontWeight: "500", color: "#000" }
      },
      {
        type: "container",
        styles: { display: "flex", gap: "32px", alignItems: "center" },
        children: [
          {
            type: "text",
            content: { text: "Home" },
            styles: { color: "#666", fontSize: "14px", cursor: "pointer" }
          },
          {
            type: "text",
            content: { text: "Work" },
            styles: { color: "#666", fontSize: "14px", cursor: "pointer" }
          },
          {
            type: "text",
            content: { text: "Contact" },
            styles: { color: "#666", fontSize: "14px", cursor: "pointer" }
          }
        ]
      }
    ]
  }
]

interface NavbarPresetsProps {
  onSelectPreset: (preset: NavbarPreset) => void
}

export function NavbarPresets({ onSelectPreset }: NavbarPresetsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  const handleSelectPreset = (preset: NavbarPreset) => {
    setSelectedPreset(preset.id)
    onSelectPreset(preset)
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Navbar Templates</h3>
        <p className="text-xs text-muted-foreground mb-4">
          Choose a pre-built navbar style to get started quickly
        </p>
      </div>
      
      <div className="grid gap-3">
        {NAVBAR_PRESETS.map((preset) => (
          <Card 
            key={preset.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPreset === preset.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => handleSelectPreset(preset)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{preset.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">Template</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground mb-2">
                {preset.description}
              </p>
              <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-600">
                {preset.preview}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground">
        💡 After selecting a template, you can customize each element using the Style panel
      </div>
    </div>
  )
}

// Helper function to create navbar elements from preset
export function createNavbarFromPreset(
  preset: NavbarPreset,
  parentId: string,
  pageId: string
): EditorElement[] {
  const elements: EditorElement[] = []
  
  preset.elements.forEach((elementData, index) => {
    const element: EditorElement = {
      id: generateHydrationSafeId(),
      page_id: pageId,
      type: elementData.type!,
      parent_id: parentId,
      position: index,
      content: elementData.content || {},
      styles: elementData.styles || {},
      responsive_styles: elementData.responsive_styles || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      children: []
    }
    
    // Handle nested children
    if (elementData.children) {
      const childElements = elementData.children.map((childData, childIndex) => ({
        id: generateHydrationSafeId(),
        page_id: pageId,
        type: childData.type!,
        parent_id: element.id,
        position: childIndex,
        content: childData.content || {},
        styles: childData.styles || {},
        responsive_styles: childData.responsive_styles || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        children: []
      }))
      
      element.children = childElements
      elements.push(element, ...childElements)
    } else {
      elements.push(element)
    }
  })
  
  return elements
}