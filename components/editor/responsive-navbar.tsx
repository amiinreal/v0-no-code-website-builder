"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { EditorElement } from "@/lib/types"
import { RenderElement } from "./render-element"
import type { Viewport } from "./viewport-switcher"
import { normalizeInlineStyles, mergeStyles } from "@/lib/style-normalizer"

interface ResponsiveNavbarProps {
  element: EditorElement
  viewport?: Viewport
  isPreview?: boolean
  children?: React.ReactNode
}

export function ResponsiveNavbar({ 
  element, 
  viewport = "desktop", 
  isPreview = false,
  children 
}: ResponsiveNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkViewport()
    window.addEventListener('resize', checkViewport)
    
    return () => window.removeEventListener('resize', checkViewport)
  }, [])

  // Close mobile menu when viewport changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false)
    }
  }, [isMobile])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Get navbar styles and normalize them to prevent conflicts
  const navbarStyles = element.styles || {}
  const responsiveStyles = element.responsive_styles?.[viewport] || {}
  const combinedStyles = normalizeInlineStyles(mergeStyles(navbarStyles, responsiveStyles))

  // Base navbar classes
  const baseClasses = "w-full bg-white border-b border-gray-200 relative z-50"
  
  // Container classes for different layouts
  const containerClasses = isMobile 
    ? "px-4 py-3" 
    : "px-6 py-4 max-w-7xl mx-auto"

  return (
    <nav 
      className={baseClasses}
      style={combinedStyles}
    >
      <div className={containerClasses}>
        {/* Desktop Layout */}
        <div className={`${isMobile ? 'hidden' : 'flex'} items-center justify-between`}>
          {children || (
            <div className="text-center text-gray-400 py-8">
              Drop elements here to build your navbar
            </div>
          )}
        </div>

        {/* Mobile Layout */}
        <div className={`${isMobile ? 'flex' : 'hidden'} items-center justify-between`}>
          {/* Mobile Logo/Brand Area */}
          <div className="flex-1">
            {element.children && element.children.length > 0 && (
              <div className="flex items-center">
                {/* Render first child (typically logo) */}
                <RenderElement 
                  element={element.children[0]} 
                  viewport={viewport}
                  isPreview={isPreview}
                />
              </div>
            )}
          </div>

          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="p-2"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobile && isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="px-4 py-2 space-y-2">
              {element.children && element.children.slice(1).map((child, index) => (
                <div key={child.id} className="py-2 border-b border-gray-100 last:border-b-0">
                  <RenderElement 
                    element={child} 
                    viewport={viewport}
                    isPreview={isPreview}
                  />
                </div>
              ))}
              
              {(!element.children || element.children.length <= 1) && (
                <div className="text-center text-gray-400 py-4">
                  Add navigation elements
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  )
}

// Enhanced navbar component with responsive behavior
export function EnhancedNavbarComponent({ 
  element, 
  viewport = "desktop", 
  isPreview = false,
  children 
}: ResponsiveNavbarProps) {
  // Determine layout based on navbar configuration
  const hasChildren = element.children && element.children.length > 0
  const navbarConfig = element.content?.config || {}
  
  // Different navbar layouts
  const layouts = {
    default: "flex items-center justify-between",
    centered: "flex items-center justify-center space-x-8",
    stacked: "flex flex-col items-center space-y-4",
    sidebar: "flex items-start"
  }
  
  const currentLayout = navbarConfig.layout || 'default'
  const layoutClasses = layouts[currentLayout as keyof typeof layouts] || layouts.default
  
  // Responsive behavior
  const isResponsive = navbarConfig.responsive !== false
  
  if (isResponsive) {
    return (
      <ResponsiveNavbar 
        element={element}
        viewport={viewport}
        isPreview={isPreview}
      >
        {hasChildren ? (
          <div className={layoutClasses}>
            {element.children!.map((child) => (
              <RenderElement 
                key={child.id}
                element={child} 
                viewport={viewport}
                isPreview={isPreview}
              />
            ))}
          </div>
        ) : children}
      </ResponsiveNavbar>
    )
  }
  
  // Non-responsive navbar (original behavior)
  return (
    <nav className="w-full" style={normalizeInlineStyles(element.styles || {})}>
      <div className={`px-6 py-4 ${layoutClasses}`}>
        {hasChildren ? (
          element.children!.map((child) => (
            <RenderElement 
              key={child.id}
              element={child} 
              viewport={viewport}
              isPreview={isPreview}
            />
          ))
        ) : (
          children || (
            <div className="text-center text-gray-400 py-8">
              Drop elements here to build your navbar
            </div>
          )
        )}
      </div>
    </nav>
  )
}