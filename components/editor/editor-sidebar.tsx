"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEditor } from "./editor-provider"
import { Type, ImageIcon, Square, Layout, Navigation, FileText, Trash2 } from "lucide-react"
import { DraggableElementItem } from "./dnd/draggable-element-item"
import { TextProperties } from "./properties/text-properties"
import { ImageProperties } from "./properties/image-properties"
import { ButtonProperties } from "./properties/button-properties"
import { ContainerProperties } from "./properties/container-properties"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const ELEMENT_TYPES = [
  { type: "section", label: "Section", icon: Layout },
  { type: "container", label: "Container", icon: Square },
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Image", icon: ImageIcon },
  { type: "button", label: "Button", icon: Square },
  { type: "navbar", label: "Navbar", icon: Navigation },
  { type: "footer", label: "Footer", icon: FileText },
]

export function EditorSidebar() {
  const { selectedElement, deleteElement } = useEditor()

  const renderProperties = () => {
    if (!selectedElement) {
      return <p className="text-sm text-muted-foreground">Select an element to edit its properties</p>
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold capitalize">{selectedElement.type}</h3>
            <p className="text-xs text-muted-foreground">ID: {selectedElement.id.slice(0, 8)}...</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => deleteElement(selectedElement.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <Separator />

        {selectedElement.type === "text" && <TextProperties element={selectedElement} />}
        {selectedElement.type === "image" && <ImageProperties element={selectedElement} />}
        {selectedElement.type === "button" && <ButtonProperties element={selectedElement} />}
        {(selectedElement.type === "section" || selectedElement.type === "container") && (
          <ContainerProperties element={selectedElement} />
        )}
        {selectedElement.type === "navbar" && <ContainerProperties element={selectedElement} />}
        {selectedElement.type === "footer" && <ContainerProperties element={selectedElement} />}
      </div>
    )
  }

  return (
    <aside className="w-64 border-r bg-background">
      <Tabs defaultValue="elements" className="h-full">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="elements" className="flex-1">
            Elements
          </TabsTrigger>
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
        </TabsList>
        <TabsContent value="elements" className="m-0 h-[calc(100%-40px)]">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-2">
              <h3 className="mb-3 text-sm font-semibold">Add Elements</h3>
              {ELEMENT_TYPES.map(({ type, label, icon }) => (
                <DraggableElementItem key={type} type={type} label={label} icon={icon} />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="properties" className="m-0 h-[calc(100%-40px)]">
          <ScrollArea className="h-full">
            <div className="p-4">{renderProperties()}</div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
