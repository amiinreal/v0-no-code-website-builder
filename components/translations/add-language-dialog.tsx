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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"
import type { Translation } from "@/lib/types"
import { SUPPORTED_LANGUAGES } from "@/lib/types"
import { useState } from "react"

interface AddLanguageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  existingLanguages: string[]
  onLanguageAdded: (translation: Translation) => void
}

export function AddLanguageDialog({
  open,
  onOpenChange,
  projectId,
  existingLanguages,
  onLanguageAdded,
}: AddLanguageDialogProps) {
  const [languageCode, setLanguageCode] = useState("")
  const [isDefault, setIsDefault] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const availableLanguages = SUPPORTED_LANGUAGES.filter((lang) => !existingLanguages.includes(lang.code))

  const handleAdd = async () => {
    setIsLoading(true)
    setError(null)

    try {
      if (!languageCode) throw new Error("Please select a language")

      const { data, error } = await supabase
        .from("translations")
        .insert({
          project_id: projectId,
          language_code: languageCode,
          is_default: isDefault,
        })
        .select()
        .single()

      if (error) throw error

      onLanguageAdded(data)
      onOpenChange(false)
      setLanguageCode("")
      setIsDefault(false)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to add language")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Language</DialogTitle>
          <DialogDescription>Add a new language to translate your website</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="language">Language</Label>
            <Select value={languageCode} onValueChange={setLanguageCode}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {availableLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="default" checked={isDefault} onCheckedChange={(checked) => setIsDefault(checked === true)} />
            <Label htmlFor="default" className="text-sm font-normal">
              Set as default language
            </Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!languageCode || isLoading}>
            {isLoading ? "Adding..." : "Add Language"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
