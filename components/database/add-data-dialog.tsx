"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"
import type { UserTable } from "@/lib/types"
import { useState } from "react"

interface AddDataDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: UserTable
  onDataAdded: () => void
}

export function AddDataDialog({ open, onOpenChange, table, onDataAdded }: AddDataDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleChange = (columnName: string, value: any) => {
    setFormData({ ...formData, [columnName]: value })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("table_data").insert({
        table_id: table.id,
        data: formData,
      })

      if (error) throw error

      onDataAdded()
      setFormData({})
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to add data")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Row to {table.name}</DialogTitle>
          <DialogDescription>Enter data for each column</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {table.schema.columns.map((column) => (
            <div key={column.name} className="grid gap-2">
              <Label htmlFor={column.name}>
                {column.name} {column.required && <span className="text-destructive">*</span>}
              </Label>
              <Input
                id={column.name}
                type={column.type === "number" ? "number" : column.type === "date" ? "date" : "text"}
                value={formData[column.name] || ""}
                onChange={(e) => handleChange(column.name, e.target.value)}
                required={column.required}
              />
            </div>
          ))}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Adding..." : "Add Row"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
