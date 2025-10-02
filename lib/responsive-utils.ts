import type { Viewport } from "@/components/editor/viewport-switcher"
import type { EditorElement } from "@/lib/types"

export const BREAKPOINTS = {
  mobile: { min: 0, max: 767, width: 375 },
  tablet: { min: 768, max: 1023, width: 768 },
  desktop: { min: 1024, max: Infinity, width: 1200 },
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

// Common responsive utility classes
export const RESPONSIVE_CLASSES = {
  // Display utilities
  display: {
    'block': 'block',
    'inline-block': 'inline-block',
    'flex': 'flex',
    'inline-flex': 'inline-flex',
    'grid': 'grid',
    'hidden': 'hidden',
  },
  // Flex utilities
  flex: {
    'flex-row': 'flex-row',
    'flex-col': 'flex-col',
    'flex-wrap': 'flex-wrap',
    'flex-nowrap': 'flex-nowrap',
    'justify-start': 'justify-start',
    'justify-center': 'justify-center',
    'justify-end': 'justify-end',
    'justify-between': 'justify-between',
    'items-start': 'items-start',
    'items-center': 'items-center',
    'items-end': 'items-end',
  },
  // Spacing utilities
  spacing: {
    'p-0': 'p-0', 'p-1': 'p-1', 'p-2': 'p-2', 'p-4': 'p-4', 'p-6': 'p-6', 'p-8': 'p-8',
    'm-0': 'm-0', 'm-1': 'm-1', 'm-2': 'm-2', 'm-4': 'm-4', 'm-6': 'm-6', 'm-8': 'm-8',
    'px-0': 'px-0', 'px-2': 'px-2', 'px-4': 'px-4', 'px-6': 'px-6', 'px-8': 'px-8',
    'py-0': 'py-0', 'py-2': 'py-2', 'py-4': 'py-4', 'py-6': 'py-6', 'py-8': 'py-8',
  },
  // Width utilities
  width: {
    'w-full': 'w-full',
    'w-auto': 'w-auto',
    'w-1/2': 'w-1/2',
    'w-1/3': 'w-1/3',
    'w-2/3': 'w-2/3',
    'w-1/4': 'w-1/4',
    'w-3/4': 'w-3/4',
  },
  // Text utilities
  text: {
    'text-left': 'text-left',
    'text-center': 'text-center',
    'text-right': 'text-right',
    'text-sm': 'text-sm',
    'text-base': 'text-base',
    'text-lg': 'text-lg',
    'text-xl': 'text-xl',
    'text-2xl': 'text-2xl',
  }
} as const

export function getResponsiveStyles(element: EditorElement, viewport: Viewport): Record<string, any> {
  const baseStyles = element.styles || {}
  const responsiveStyles = element.responsive_styles?.[viewport] || {}
  
  return {
    ...baseStyles,
    ...responsiveStyles,
  }
}

export function updateResponsiveStyles(
  element: EditorElement,
  viewport: Viewport,
  styles: Record<string, any>
): EditorElement {
  return {
    ...element,
    responsive_styles: {
      ...element.responsive_styles,
      [viewport]: {
        ...element.responsive_styles?.[viewport],
        ...styles,
      },
    },
  }
}

// Helper function to get responsive class names
export function getResponsiveClasses(
  element: EditorElement,
  viewport: Viewport
): string {
  const styles = getResponsiveStyles(element, viewport)
  const classes: string[] = []
  
  // Convert common CSS properties to Tailwind classes
  if (styles.display === 'flex') {
    classes.push('flex')
    if (styles.flexDirection === 'column') classes.push('flex-col')
    if (styles.justifyContent === 'center') classes.push('justify-center')
    if (styles.alignItems === 'center') classes.push('items-center')
  }
  
  if (styles.textAlign) {
    classes.push(`text-${styles.textAlign}`)
  }
  
  if (styles.width === '100%') classes.push('w-full')
  
  return classes.join(' ')
}

// Enhanced responsive breakpoint utilities
export function getBreakpointPrefix(viewport: Viewport): string {
  switch (viewport) {
    case 'mobile': return 'sm:'
    case 'tablet': return 'md:'
    case 'desktop': return 'lg:'
    default: return ''
  }
}

export function generateResponsiveClasses(
  baseClasses: string,
  responsiveOverrides: Partial<Record<Viewport, string>>
): string {
  let classes = baseClasses
  
  Object.entries(responsiveOverrides).forEach(([viewport, overrideClasses]) => {
    if (overrideClasses) {
      const prefix = getBreakpointPrefix(viewport as Viewport)
      const prefixedClasses = overrideClasses
        .split(' ')
        .map(cls => `${prefix}${cls}`)
        .join(' ')
      classes += ` ${prefixedClasses}`
    }
  })
  
  return classes
}

export function getViewportIcon(viewport: Viewport) {
  switch (viewport) {
    case "desktop":
      return "Monitor"
    case "tablet":
      return "Tablet"
    case "mobile":
      return "Smartphone"
    default:
      return "Monitor"
  }
}

export function getViewportWidth(viewport: Viewport): string {
  switch (viewport) {
    case "desktop":
      return `${BREAKPOINTS.desktop.width}px`
    case "tablet":
      return `${BREAKPOINTS.tablet.width}px`
    case "mobile":
      return `${BREAKPOINTS.mobile.width}px`
    default:
      return `${BREAKPOINTS.desktop.width}px`
  }
}

export function generateResponsiveCSS(element: EditorElement): string {
  let css = ""
  
  // Base styles
  if (element.styles) {
    css += `#${element.id} { ${stylesToCSS(element.styles)} }\n`
  }
  
  // Responsive styles
  if (element.responsive_styles) {
    if (element.responsive_styles.tablet) {
      css += `@media (max-width: ${BREAKPOINTS.desktop.min - 1}px) and (min-width: ${BREAKPOINTS.tablet.min}px) {\n`
      css += `  #${element.id} { ${stylesToCSS(element.responsive_styles.tablet)} }\n`
      css += `}\n`
    }
    
    if (element.responsive_styles.mobile) {
      css += `@media (max-width: ${BREAKPOINTS.tablet.min - 1}px) {\n`
      css += `  #${element.id} { ${stylesToCSS(element.responsive_styles.mobile)} }\n`
      css += `}\n`
    }
  }
  
  return css
}

function stylesToCSS(styles: Record<string, any>): string {
  return Object.entries(styles)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value};`
    })
    .join(' ')
}