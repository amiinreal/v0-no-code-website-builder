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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/lib/types"
import { Globe, Download, ExternalLink } from "lucide-react"
import { useState } from "react"

interface PublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project: Project
}

export function PublishDialog({ open, onOpenChange, project }: PublishDialogProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null)

  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/publish`, {
        method: "POST",
      })
      const data = await response.json()
      if (data.success) {
        setPublishedUrl(data.url)
      }
    } catch (error) {
      console.error("Failed to publish:", error)
    } finally {
      setIsPublishing(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/export`)
      const data = await response.json()

      // Create a simple download of the files as JSON
      // In a real app, this would be a ZIP file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${project.name}-export.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Publish Your Website</DialogTitle>
          <DialogDescription>Make your website live or export the code</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="publish" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="publish">Publish Online</TabsTrigger>
            <TabsTrigger value="export">Export Code</TabsTrigger>
          </TabsList>

          <TabsContent value="publish" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Your Website URL</h3>
                </div>
                <div className="space-y-2">
                  <Label>Subdomain</Label>
                  <div className="flex items-center gap-2">
                    <Input value={project.subdomain || ""} disabled className="flex-1" />
                    <span className="text-sm text-muted-foreground">.webara.app</span>
                  </div>
                </div>
              </div>

              {publishedUrl && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                  <p className="mb-2 text-sm font-medium text-green-900 dark:text-green-100">Your website is live!</p>
                  <a
                    href={publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-green-700 hover:underline dark:text-green-300"
                  >
                    {publishedUrl}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 text-sm font-semibold">What happens when you publish?</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Your website will be accessible at your subdomain</li>
                  <li>• All pages and content will be live</li>
                  <li>• You can update and republish anytime</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handlePublish} disabled={isPublishing}>
                {isPublishing ? "Publishing..." : "Publish Website"}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Export Your Code</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Download your website as HTML, CSS, and JavaScript files. You can host them anywhere you like.
                </p>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 text-sm font-semibold">What you'll get:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• HTML files for all your pages</li>
                  <li>• CSS file with all your styles</li>
                  <li>• JavaScript file for interactivity</li>
                  <li>• README with deployment instructions</li>
                </ul>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleExport} disabled={isExporting}>
                <Download className="mr-2 h-4 w-4" />
                {isExporting ? "Exporting..." : "Export Code"}
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
