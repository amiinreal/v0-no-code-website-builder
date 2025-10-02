/**
 * Style Normalizer Utility
 * 
 * Prevents React warnings by ensuring shorthand and longhand CSS properties
 * are never mixed in inline styles. Normalizes styles to use either all
 * shorthand or all longhand properties consistently.
 */

export interface CSSStyleObject {
  [key: string]: string | number | undefined
}

// Define property groups that can conflict
const PROPERTY_GROUPS = {
  padding: {
    shorthand: 'padding',
    longhands: ['paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft']
  },
  margin: {
    shorthand: 'margin',
    longhands: ['marginTop', 'marginRight', 'marginBottom', 'marginLeft']
  },
  border: {
    shorthand: 'border',
    longhands: ['borderTop', 'borderRight', 'borderBottom', 'borderLeft']
  },
  borderWidth: {
    shorthand: 'borderWidth',
    longhands: ['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth']
  },
  borderStyle: {
    shorthand: 'borderStyle',
    longhands: ['borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle']
  },
  borderColor: {
    shorthand: 'borderColor',
    longhands: ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor']
  },
  borderRadius: {
    shorthand: 'borderRadius',
    longhands: ['borderTopLeftRadius', 'borderTopRightRadius', 'borderBottomRightRadius', 'borderBottomLeftRadius']
  },
  background: {
    shorthand: 'background',
    longhands: ['backgroundColor', 'backgroundImage', 'backgroundRepeat', 'backgroundPosition', 'backgroundSize']
  },
  font: {
    shorthand: 'font',
    longhands: ['fontStyle', 'fontVariant', 'fontWeight', 'fontSize', 'lineHeight', 'fontFamily']
  },
  outline: {
    shorthand: 'outline',
    longhands: ['outlineWidth', 'outlineStyle', 'outlineColor']
  }
}

/**
 * Expands shorthand properties into their longhand equivalents
 */
function expandShorthand(property: string, value: string | number): CSSStyleObject {
  const result: CSSStyleObject = {}
  
  switch (property) {
    case 'padding':
    case 'margin': {
      const values = String(value).split(/\s+/)
      const [top, right = top, bottom = top, left = right] = values
      const prefix = property === 'padding' ? 'padding' : 'margin'
      
      result[`${prefix}Top`] = top
      result[`${prefix}Right`] = right
      result[`${prefix}Bottom`] = bottom
      result[`${prefix}Left`] = left
      break
    }
    
    case 'border': {
      // Simple border expansion - for more complex cases, additional parsing needed
      result.borderTop = value
      result.borderRight = value
      result.borderBottom = value
      result.borderLeft = value
      break
    }
    
    case 'borderWidth': {
      const values = String(value).split(/\s+/)
      const [top, right = top, bottom = top, left = right] = values
      
      result.borderTopWidth = top
      result.borderRightWidth = right
      result.borderBottomWidth = bottom
      result.borderLeftWidth = left
      break
    }
    
    case 'borderStyle': {
      const values = String(value).split(/\s+/)
      const [top, right = top, bottom = top, left = right] = values
      
      result.borderTopStyle = top
      result.borderRightStyle = right
      result.borderBottomStyle = bottom
      result.borderLeftStyle = left
      break
    }
    
    case 'borderColor': {
      const values = String(value).split(/\s+/)
      const [top, right = top, bottom = top, left = right] = values
      
      result.borderTopColor = top
      result.borderRightColor = right
      result.borderBottomColor = bottom
      result.borderLeftColor = left
      break
    }
    
    case 'borderRadius': {
      const values = String(value).split(/\s+/)
      const [topLeft, topRight = topLeft, bottomRight = topLeft, bottomLeft = topRight] = values
      
      result.borderTopLeftRadius = topLeft
      result.borderTopRightRadius = topRight
      result.borderBottomRightRadius = bottomRight
      result.borderBottomLeftRadius = bottomLeft
      break
    }
    
    default:
      result[property] = value
  }
  
  return result
}

/**
 * Combines longhand properties into shorthand when possible
 */
function combineToShorthand(styles: CSSStyleObject, group: typeof PROPERTY_GROUPS[keyof typeof PROPERTY_GROUPS]): CSSStyleObject {
  const { shorthand, longhands } = group
  const longhandValues = longhands.map(prop => styles[prop]).filter(val => val !== undefined)
  
  // Only combine if all longhands are present and have the same value (for simple cases)
  if (longhandValues.length === longhands.length) {
    const result = { ...styles }
    
    // Remove longhand properties
    longhands.forEach(prop => delete result[prop])
    
    // Add shorthand
    if (shorthand === 'padding' || shorthand === 'margin') {
      const [top, right, bottom, left] = longhandValues
      if (top === right && right === bottom && bottom === left) {
        result[shorthand] = top
      } else if (top === bottom && right === left) {
        result[shorthand] = `${top} ${right}`
      } else if (right === left) {
        result[shorthand] = `${top} ${right} ${bottom}`
      } else {
        result[shorthand] = `${top} ${right} ${bottom} ${left}`
      }
    } else {
      // For other properties, use the first value or combine as needed
      result[shorthand] = longhandValues[0]
    }
    
    return result
  }
  
  return styles
}

/**
 * Normalizes CSS styles to prevent shorthand/longhand conflicts
 * 
 * Strategy:
 * 1. If both shorthand and longhand properties exist, expand shorthand to longhands
 * 2. Remove any undefined values
 * 3. Optionally combine longhands back to shorthand for cleaner output
 */
export function normalizeStyles(
  styles: CSSStyleObject, 
  options: { preferShorthand?: boolean } = {}
): CSSStyleObject {
  if (!styles || typeof styles !== 'object') {
    return {}
  }
  
  let normalized = { ...styles }
  
  // Process each property group
  Object.values(PROPERTY_GROUPS).forEach(group => {
    const { shorthand, longhands } = group
    
    const hasShorthand = normalized[shorthand] !== undefined
    const hasLonghands = longhands.some(prop => normalized[prop] !== undefined)
    
    if (hasShorthand && hasLonghands) {
      // Conflict detected - expand shorthand and remove it
      const expanded = expandShorthand(shorthand, normalized[shorthand]!)
      
      // Remove the shorthand property
      delete normalized[shorthand]
      
      // Apply expanded properties, but don't override existing longhands
      Object.entries(expanded).forEach(([prop, value]) => {
        if (normalized[prop] === undefined) {
          normalized[prop] = value
        }
      })
    } else if (hasShorthand && options.preferShorthand === false) {
      // Expand shorthand even if no conflict (for consistency)
      const expanded = expandShorthand(shorthand, normalized[shorthand]!)
      delete normalized[shorthand]
      Object.assign(normalized, expanded)
    } else if (hasLonghands && options.preferShorthand === true) {
      // Try to combine longhands to shorthand
      normalized = combineToShorthand(normalized, group)
    }
  })
  
  // Remove undefined values
  Object.keys(normalized).forEach(key => {
    if (normalized[key] === undefined || normalized[key] === null || normalized[key] === '') {
      delete normalized[key]
    }
  })
  
  return normalized
}

/**
 * Normalizes styles specifically for React inline styles
 * Always expands to longhands to prevent React warnings
 */
export function normalizeInlineStyles(styles: CSSStyleObject): React.CSSProperties {
  return normalizeStyles(styles, { preferShorthand: false }) as React.CSSProperties
}

/**
 * Normalizes styles for CSS output (can use shorthands for cleaner CSS)
 */
export function normalizeCSSStyles(styles: CSSStyleObject): CSSStyleObject {
  return normalizeStyles(styles, { preferShorthand: true })
}

/**
 * Utility to safely merge multiple style objects
 */
export function mergeStyles(...styleObjects: (CSSStyleObject | undefined)[]): CSSStyleObject {
  const merged = styleObjects.reduce((acc, styles) => {
    if (styles && typeof styles === 'object') {
      return { ...acc, ...styles }
    }
    return acc
  }, {} as CSSStyleObject)
  
  // Ensure merged is a valid CSSStyleObject before normalizing
  const validMerged: CSSStyleObject = merged || {}
  return normalizeStyles(validMerged)
}

/**
 * Validates that styles don't have conflicting properties
 * Returns warnings for debugging
 */
export function validateStyles(styles: CSSStyleObject): string[] {
  const warnings: string[] = []
  
  Object.values(PROPERTY_GROUPS).forEach(group => {
    const { shorthand, longhands } = group
    
    const hasShorthand = styles[shorthand] !== undefined
    const hasLonghands = longhands.some(prop => styles[prop] !== undefined)
    
    if (hasShorthand && hasLonghands) {
      warnings.push(
        `Conflicting properties detected: ${shorthand} and ${longhands.filter(prop => styles[prop] !== undefined).join(', ')}`
      )
    }
  })
  
  return warnings
}