"use client"

import { useId } from "react"

// Counter for generating unique IDs within a session
let idCounter = 0

/**
 * Generates a stable ID that's consistent between server and client
 * Uses a counter-based approach to avoid hydration mismatches
 */
export function generateStableId(prefix: string = "element"): string {
  return `${prefix}-${++idCounter}`
}

/**
 * Hook for generating stable IDs in React components
 * Uses React's useId for hydration-safe ID generation
 */
export function useStableId(prefix: string = "element"): string {
  const reactId = useId()
  return `${prefix}-${reactId}`
}

/**
 * Generates a UUID-like ID but with a deterministic approach for SSR
 * Falls back to crypto.randomUUID() only on the client side
 */
export function generateHydrationSafeId(): string {
  // On server side or during hydration, use a counter-based approach
  if (typeof window === "undefined" || !window.crypto?.randomUUID) {
    return generateStableId("elem")
  }
  
  // On client side after hydration, use crypto.randomUUID
  return crypto.randomUUID()
}

/**
 * Reset the counter (useful for testing or when starting fresh)
 */
export function resetIdCounter(): void {
  idCounter = 0
}