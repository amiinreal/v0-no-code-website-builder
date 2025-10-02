"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Grid, Move, AlignCenter } from "lucide-react"

interface SnapToGridProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  gridSize: number
  onGridSizeChange: (size: number) => void
}

export function SnapToGrid({ enabled, onToggle, gridSize, onGridSizeChange }: SnapToGridProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Grid className="h-4 w-4" />
          Snap to Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="grid-toggle" className="text-sm">Enable Grid</Label>
          <Switch
            id="grid-toggle"
            checked={enabled}
            onCheckedChange={onToggle}
          />
        </div>
        
        {enabled && (
          <div className="space-y-2">
            <Label className="text-xs">Grid Size (px)</Label>
            <Input
              type="number"
              value={gridSize}
              onChange={(e) => onGridSizeChange(parseInt(e.target.value) || 10)}
              min={5}
              max={50}
              className="h-8"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface GridOverlayProps {
  enabled: boolean
  gridSize: number
}

export function GridOverlay({ enabled, gridSize }: GridOverlayProps) {
  if (!enabled) return null

  const gridStyle = {
    backgroundImage: `
      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${gridSize}px ${gridSize}px`,
  }

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-10"
      style={gridStyle}
    />
  )
}

// Utility functions for snapping coordinates to grid
export function snapToGrid(value: number, gridSize: number): number {
  return Math.round(value / gridSize) * gridSize
}

export function snapPositionToGrid(
  position: { x: number; y: number },
  gridSize: number
): { x: number; y: number } {
  return {
    x: snapToGrid(position.x, gridSize),
    y: snapToGrid(position.y, gridSize)
  }
}

export function snapSizeToGrid(
  size: { width: number; height: number },
  gridSize: number
): { width: number; height: number } {
  return {
    width: Math.max(gridSize, snapToGrid(size.width, gridSize)),
    height: Math.max(gridSize, snapToGrid(size.height, gridSize))
  }
}

// Hook for managing grid state
export function useSnapToGrid(initialGridSize = 10) {
  const [enabled, setEnabled] = useState(false)
  const [gridSize, setGridSize] = useState(initialGridSize)

  const snapValue = (value: number) => {
    return enabled ? snapToGrid(value, gridSize) : value
  }

  const snapPosition = (position: { x: number; y: number }) => {
    return enabled ? snapPositionToGrid(position, gridSize) : position
  }

  const snapSize = (size: { width: number; height: number }) => {
    return enabled ? snapSizeToGrid(size, gridSize) : size
  }

  return {
    enabled,
    gridSize,
    setEnabled,
    setGridSize,
    snapValue,
    snapPosition,
    snapSize
  }
}