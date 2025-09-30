"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Project, Translation, Page } from "@/lib/types"
import { SUPPORTED_LANGUAGES } from "@/lib/types"
import { Plus, Languages, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { AddLanguageDialog } from "./add-language-dialog"
import { TranslationEditor } from "./translation-editor"

interface TranslationsManagerProps {
  project: Project
  translations: Translation[]
  pages: Page[]
}

export function TranslationsManager({ project, translations: initialTranslations, pages }: TranslationsManagerProps) {
  const [translations, setTranslations] = useState(initialTranslations)
  const [selectedLanguage, setSelectedLanguage] = useState<Translation | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const getLanguageName = (code: string) => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.name || code
  }

  const getLanguageFlag = (code: string) => {
    return SUPPORTED_LANGUAGES.find((lang) => lang.code === code)?.flag || "🌐"
  }

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
            <h1 className="font-semibold">Translations</h1>
            <p className="text-xs text-muted-foreground">{project.name}</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Language
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r bg-background p-4">
          <h3 className="mb-4 text-sm font-semibold">Languages</h3>
          {translations.length === 0 ? (
            <p className="text-sm text-muted-foreground">No languages yet</p>
          ) : (
            <div className="space-y-2">
              {translations.map((translation) => (
                <Button
                  key={translation.id}
                  variant={selectedLanguage?.id === translation.id ? "secondary" : "ghost"}
                  className="w-full justify-start bg-transparent"
                  onClick={() => setSelectedLanguage(translation)}
                >
                  <span className="mr-2">{getLanguageFlag(translation.language_code)}</span>
                  {getLanguageName(translation.language_code)}
                  {translation.is_default && <span className="ml-auto text-xs text-muted-foreground">(Default)</span>}
                </Button>
              ))}
            </div>
          )}
        </aside>

        <main className="flex-1 overflow-auto p-6">
          {selectedLanguage ? (
            <TranslationEditor translation={selectedLanguage} pages={pages} projectId={project.id} />
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Languages className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No language selected</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {translations.length === 0
                    ? "Add your first language to get started"
                    : "Select a language from the sidebar"}
                </p>
                {translations.length === 0 && (
                  <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Language
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>

      <AddLanguageDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        projectId={project.id}
        existingLanguages={translations.map((t) => t.language_code)}
        onLanguageAdded={(translation) => {
          setTranslations([...translations, translation])
          setSelectedLanguage(translation)
        }}
      />
    </div>
  )
}
