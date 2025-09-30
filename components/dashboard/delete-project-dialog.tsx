"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import type { Project } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface DeleteProjectDialogProps {
  project: Project | null
  onOpenChange: (open: boolean) => void
}

export function DeleteProjectDialog({ project, onOpenChange }: DeleteProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!project) return

    setIsLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("projects").delete().eq("id", project.id)

      if (error) throw error

      // Update usage tracking
      const { data: usage } = await supabase.from("usage_tracking").select("*").eq("user_id", user.id).single()

      if (usage && usage.project_count > 0) {
        await supabase
          .from("usage_tracking")
          .update({ project_count: usage.project_count - 1 })
          .eq("user_id", user.id)
      }

      router.refresh()
      onOpenChange(false)
    } catch (error: unknown) {
      console.error("Failed to delete project:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={!!project} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Project</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{project?.name}&quot;? This action cannot be undone and will
            permanently delete all pages and data associated with this project.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
