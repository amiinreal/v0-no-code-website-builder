"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DraggableElementItem } from "./dnd/draggable-element-item"
import { useEditor } from "./editor-provider"
import { StylePanel } from "./properties/style-panel"
import { NavbarPresets, createNavbarFromPreset } from "./navbar-presets"
import type { Viewport } from "./viewport-switcher"
import type { EditorElement } from "@/lib/types"
import { 
  Type, 
  Image, 
  Square, 
  Navigation, 
  Layout,
  MousePointer,
  FileImage,
  FormInput,
  Layers,
  Container,
  Box,
  Star,
  Minus,
  FileText,
  Zap
} from "lucide-react"

const ELEMENT_TYPES = [
  {
    type: "section" as const,
    label: "Section",
    icon: Layout,
    category: "Layout",
  },
  {
    type: "container" as const,
    label: "Container",
    icon: Box,
    category: "Layout",
  },
  {
    type: "navbar" as const,
    label: "Navbar",
    icon: Navigation,
    category: "Smart Components",
  },
  {
    type: "hero" as const,
    label: "Hero Section",
    icon: Star,
    category: "Smart Components",
  },
  {
    type: "footer" as const,
    label: "Footer",
    icon: Minus,
    category: "Smart Components",
  },
  {
    type: "form" as const,
    label: "Form",
    icon: FileText,
    category: "Smart Components",
  },
  {
    type: "text" as const,
    label: "Text",
    icon: Type,
    category: "Content",
  },
  {
    type: "image" as const,
    label: "Image",
    icon: Image,
    category: "Content",
  },
  {
    type: "button" as const,
    label: "Button",
    icon: MousePointer,
    category: "Content",
  },
  {
    type: "logo" as const,
    label: "Logo",
    icon: Zap,
    category: "Content",
  },
]

interface EditorSidebarProps {
  viewport: Viewport
}

export function EditorSidebar({ viewport }: EditorSidebarProps) {
  const { selectedElement } = useEditor()

  const renderProperties = () => {
    if (!selectedElement) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          Select an element to edit its properties
        </div>
      )
    }

    switch (selectedElement.type) {
      case "text":
        return <TextProperties element={selectedElement} />
      case "image":
        return <ImageProperties element={selectedElement} />
      case "logo":
        return <LogoProperties element={selectedElement} />
      case "button":
        return <ButtonProperties element={selectedElement} />
      case "section":
        return <SectionProperties element={selectedElement} />
      case "container":
        return <ContainerProperties element={selectedElement} />
      case "navbar":
        return <NavbarProperties element={selectedElement} />
      case "footer":
        return <FooterProperties element={selectedElement} />
      case "form":
        return <FormProperties element={selectedElement} />
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            Properties for {selectedElement.type} coming soon
          </div>
        )
    }
  }

  return (
    <div className="w-80 border-l bg-background">
      <Tabs defaultValue="elements" className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="responsive">Responsive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="elements" className="p-4 space-y-2">
          <h3 className="font-semibold mb-4">Drag elements to canvas</h3>
          <div className="grid grid-cols-2 gap-2">
            {ELEMENT_TYPES.map((element) => (
              <DraggableElementItem
                key={element.type}
                type={element.type}
                label={element.label}
                icon={element.icon}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="properties" className="p-0">
          {renderProperties()}
        </TabsContent>

        <TabsContent value="responsive" className="p-4">
          {selectedElement ? (
            <StylePanel key={selectedElement.id} element={selectedElement} viewport={viewport} />
          ) : (
            <div className="text-center text-muted-foreground">
              Select an element to edit responsive styles
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Placeholder property components - these will be implemented in the next phase
function TextProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Text Properties</h3>
      <p className="text-sm text-muted-foreground">Text editing properties coming soon</p>
    </div>
  )
}

function ImageProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Image Properties</h3>
      <p className="text-sm text-muted-foreground">Image editing properties coming soon</p>
    </div>
  )
}

function LogoProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Logo Properties</h3>
      <p className="text-sm text-muted-foreground">Logo editing properties coming soon</p>
    </div>
  )
}

function ButtonProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Button Properties</h3>
      <p className="text-sm text-muted-foreground">Button editing properties coming soon</p>
    </div>
  )
}

function SectionProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Section Properties</h3>
      <p className="text-sm text-muted-foreground">Section editing properties coming soon</p>
    </div>
  )
}

function ContainerProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Container Properties</h3>
      <p className="text-sm text-muted-foreground">Container editing properties coming soon</p>
    </div>
  )
}

function NavbarProperties({ element }: { element: any }) {
  const { updateElement, addElement, currentPage } = useEditor()
  
  const handleSelectPreset = (preset: any) => {
    if (!currentPage) return
    
    // Create elements from preset
    const newElements = createNavbarFromPreset(preset, element.id, currentPage.id)
    
    // Add all new elements to the editor
     newElements.forEach((newElement: EditorElement) => {
       addElement(newElement)
     })
    
    // Update navbar configuration
    updateElement(element.id, {
      content: {
        ...element.content,
        config: {
          responsive: true,
          layout: preset.id.includes('centered') ? 'centered' : 'default'
        }
      }
    })
  }
  
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Navbar Properties</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The navbar is now fully responsive with hamburger menu support! Choose a template or customize manually.
        </p>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Features:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 📱 Responsive design with mobile hamburger menu</li>
          <li>• 🎨 Pre-built templates for quick setup</li>
          <li>• 🔧 Fully customizable elements</li>
          <li>• 📐 Multiple layout options</li>
        </ul>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 Use the <strong>Responsive</strong> tab to customize styling for different screen sizes
        </p>
      </div>
      
      <NavbarPresets onSelectPreset={handleSelectPreset} />
    </div>
  )
}

function FooterProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Footer Properties</h3>
      <p className="text-sm text-muted-foreground">Footer editing properties coming soon</p>
    </div>
  )
}

function FormProperties({ element }: { element: any }) {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Form Properties</h3>
      <p className="text-sm text-muted-foreground">Form editing properties coming soon</p>
    </div>
  )
}
