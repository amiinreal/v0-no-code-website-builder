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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import type { TableColumn, UserTable } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"

interface CreateTableDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  onTableCreated: (table: UserTable) => void
}

export function CreateTableDialog({ open, onOpenChange, projectId, onTableCreated }: CreateTableDialogProps) {
  const [tableName, setTableName] = useState("")
  const [columns, setColumns] = useState<TableColumn[]>([{ name: "", type: "text", required: false }])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleAddColumn = () => {
    setColumns([...columns, { name: "", type: "text", required: false }])
  }

  const handleRemoveColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index))
  }

  const handleColumnChange = (index: number, field: keyof TableColumn, value: any) => {
    const newColumns = [...columns]
    newColumns[index] = { ...newColumns[index], [field]: value }
    setColumns(newColumns)
  }

  const handleCreate = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Validate
      if (!tableName.trim()) throw new Error("Table name is required")
      if (columns.some((col) => !col.name.trim())) throw new Error("All columns must have a name")

      const { data, error } = await supabase
        .from("user_tables")
        .insert({
          project_id: projectId,
          name: tableName,
          schema: { columns },
        })
        .select()
        .single()

      if (error) throw error

      onTableCreated(data)
      onOpenChange(false)
      setTableName("")
      setColumns([{ name: "", type: "text", required: false }])
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to create table")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
          <DialogDescription>Define your table structure with columns and data types</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="tableName">Table Name</Label>
            <Input
              id="tableName"
              placeholder="products"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Columns</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddColumn}>
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </Button>
            </div>

            {columns.map((column, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Column name"
                  value={column.name}
                  onChange={(e) => handleColumnChange(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Select value={column.type} onValueChange={(value) => handleColumnChange(index, "type", value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => handleRemoveColumn(index)}
                  disabled={columns.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!tableName || isLoading}>
            {isLoading ? "Creating..." : "Create Table"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
