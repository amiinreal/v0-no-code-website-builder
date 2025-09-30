"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import type { Translation, Page, EditorElement, TranslationString } from "@/lib/types"
import { Save } from "lucide-react"
import { useEffect, useState } from "react"

interface TranslationEditorProps {
  translation: Translation
  pages: Page[]
  projectId: string
}

export function TranslationEditor({ translation, pages, projectId }: TranslationEditorProps) {
  const [selectedPage, setSelectedPage] = useState<Page | null>(pages[0] || null)
  const [elements, setElements] = useState<EditorElement[]>([])
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (selectedPage) {
      loadPageElements()
    }
  }, [selectedPage])

  const loadPageElements = async () => {
    if (!selectedPage) return

    const { data: elementsData } = await supabase
      .from("elements")
      .select("*")
      .eq("page_id", selectedPage.id)
      .order("order_index")

    const { data: translationStrings } = await supabase
      .from("translation_strings")
      .select("*")
      .eq("translation_id", translation.id)

    setElements(elementsData || [])

    const translationsMap: Record<string, string> = {}
    translationStrings?.forEach((ts: TranslationString) => {
      translationsMap[`${ts.element_id}-${ts.field_name}`] = ts.translated_value
    })
    setTranslations(translationsMap)
  }

  const handleTranslationChange = (elementId: string, fieldName: string, value: string) => {
    setTranslations({
      ...translations,
      [`${elementId}-${fieldName}`]: value,
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Delete existing translations for this page
      const elementIds = elements.map((el) => el.id)
      await supabase
        .from("translation_strings")
        .delete()
        .eq("translation_id", translation.id)
        .in("element_id", elementIds)

      // Insert new translations
      const translationStrings = Object.entries(translations)
        .filter(([_, value]) => value.trim() !== "")
        .map(([key, value]) => {
          const [elementId, fieldName] = key.split("-")
          return {
            translation_id: translation.id,
            element_id: elementId,
            field_name: fieldName,
            translated_value: value,
          }
        })

      if (translationStrings.length > 0) {
        await supabase.from("translation_strings").insert(translationStrings)
      }
    } catch (error) {
      console.error("Failed to save translations:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getTranslatableFields = (element: EditorElement): { field: string; label: string; value: string }[] => {
    const fields: { field: string; label: string; value: string }[] = []

    switch (element.type) {
      case "text":
        fields.push({ field: "text", label: "Text", value: element.content.text || "" })
        break
      case "button":
        fields.push({ field: "text", label: "Button Text", value: element.content.text || "" })
        break
      case "image":
        fields.push({ field: "alt", label: "Alt Text", value: element.content.alt || "" })
        break
      case "navbar":
        fields.push({ field: "brand", label: "Brand Name", value: element.content.brand || "" })
        break
      case "footer":
        fields.push({ field: "text", label: "Footer Text", value: element.content.text || "" })
        break
    }

    return fields
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Translate Content</h2>
          <p className="text-sm text-muted-foreground">Translate text for each element on your pages</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Translations"}
        </Button>
      </div>

      <Tabs value={selectedPage?.id} onValueChange={(id) => setSelectedPage(pages.find((p) => p.id === id) || null)}>
        <TabsList>
          {pages.map((page) => (
            <TabsTrigger key={page.id} value={page.id}>
              {page.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {pages.map((page) => (
          <TabsContent key={page.id} value={page.id} className="space-y-4">
            {elements.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-sm text-muted-foreground">No elements to translate on this page</p>
                </CardContent>
              </Card>
            ) : (
              elements
                .filter((el) => getTranslatableFields(el).length > 0)
                .map((element) => (
                  <Card key={element.id}>
                    <CardHeader>
                      <CardTitle className="text-base capitalize">{element.type}</CardTitle>
                      <CardDescription>Element ID: {element.id.slice(0, 8)}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {getTranslatableFields(element).map(({ field, label, value }) => (
                        <div key={field} className="grid gap-2">
                          <Label>
                            {label}
                            <span className="ml-2 text-xs text-muted-foreground">(Original: {value})</span>
                          </Label>
                          <Input
                            placeholder={`Translate "${value}"`}
                            value={translations[`${element.id}-${field}`] || ""}
                            onChange={(e) => handleTranslationChange(element.id, field, e.target.value)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
