"use client"

import React from "react"
import { cn } from "@/lib/utils"
import type { EditorElement } from "@/lib/types"

interface NavbarComponentProps {
  element: EditorElement
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  children?: React.ReactNode
  isPreview?: boolean
}

export function NavbarComponent({ element, className, style, onClick, children, isPreview = false }: NavbarComponentProps) {
  return (
    <nav 
      className={cn(
        "relative w-full bg-white border-b border-gray-200 shadow-sm",
        "flex items-center justify-between",
        "px-4 sm:px-6 lg:px-8",
        "min-h-[64px]",
        className
      )}
      style={style}
      onClick={onClick}
      suppressHydrationWarning
    >
      {children}
    </nav>
  )
}