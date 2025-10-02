"use client"

import { cn } from "@/lib/utils"
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
  Container
} from "lucide-react"

interface DragPreviewProps {
  type: string
  label: string
  isDragging?: boolean
}

const elementIcons = {
  text: Type,
  image: Image,
  button: MousePointer,
  section: Layout,
  container: Container,
  navbar: Navigation,
  footer: Layers,
  logo: FileImage,
  form: FormInput,
}

export function DragPreview({ type, label, isDragging = false }: DragPreviewProps) {
  const Icon = elementIcons[type as keyof typeof elementIcons] || Square

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50",
        "transform transition-transform duration-200 pointer-events-none",
        isDragging && "rotate-3 scale-105"
      )}
    >
      <Icon className="h-4 w-4 text-gray-600" />
      <span className="text-sm font-medium text-gray-900">{label}</span>
    </div>
  )
}