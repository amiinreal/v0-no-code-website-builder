"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Project, UserTable } from "@/lib/types"
import { Plus, Database, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { CreateTableDialog } from "./create-table-dialog"
import { TableView } from "./table-view"

interface DatabaseManagerProps {
  project: Project
  tables: UserTable[]
}

export function DatabaseManager({ project, tables: initialTables }: DatabaseManagerProps) {
  const [tables, setTables] = useState(initialTables)
  const [selectedTable, setSelectedTable] = useState<UserTable | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b bg-background px-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/editor/${project.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Editor
            </Link>
          </Button>
          <div className="h-6 w-px bg-border" />
          <div>
            <h1 className="font-semibold">Database Manager</h1>
            <p className="text-xs text-muted-foreground">{project.name}</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Table
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-background p-4">
          <h3 className="mb-4 text-sm font-semibold">Tables</h3>
          {tables.length === 0 ? (
            <p className="text-sm text-muted-foreground">No tables yet</p>
          ) : (
            <div className="space-y-2">
              {tables.map((table) => (
                <Button
                  key={table.id}
                  variant={selectedTable?.id === table.id ? "secondary" : "ghost"}
                  className="w-full justify-start bg-transparent"
                  onClick={() => setSelectedTable(table)}
                >
                  <Database className="mr-2 h-4 w-4" />
                  {table.name}
                </Button>
              ))}
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-auto p-6">
          {selectedTable ? (
            <TableView table={selectedTable} projectId={project.id} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Database className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No table selected</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {tables.length === 0 ? "Create your first table to get started" : "Select a table from the sidebar"}
                </p>
                {tables.length === 0 && (
                  <Button onClick={() => setIsCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Table
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <CreateTableDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        projectId={project.id}
        onTableCreated={(table) => {
          setTables([...tables, table])
          setSelectedTable(table)
        }}
      />
    </div>
  )
}
