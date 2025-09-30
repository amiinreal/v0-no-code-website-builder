"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/client"
import type { TableData, UserTable } from "@/lib/types"
import { Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { AddDataDialog } from "./add-data-dialog"

interface TableViewProps {
  table: UserTable
  projectId: string
}

export function TableView({ table }: TableViewProps) {
  const [data, setData] = useState<TableData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [table.id])

  const loadData = async () => {
    setIsLoading(true)
    const { data: tableData } = await supabase.from("table_data").select("*").eq("table_id", table.id)
    setData(tableData || [])
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    await supabase.from("table_data").delete().eq("id", id)
    loadData()
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{table.name}</h2>
          <p className="text-sm text-muted-foreground">{table.schema.columns.length} columns</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : data.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="mb-4 text-sm text-muted-foreground">No data yet</p>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Row
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                {table.schema.columns.map((col) => (
                  <TableHead key={col.name}>{col.name}</TableHead>
                ))}
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  {table.schema.columns.map((col) => (
                    <TableCell key={col.name}>{String(row.data[col.name] || "")}</TableCell>
                  ))}
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(row.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddDataDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        table={table}
        onDataAdded={() => {
          loadData()
          setIsAddOpen(false)
        }}
      />
    </div>
  )
}
