-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL, -- 'en', 'es', 'fr', 'de', 'ar', etc.
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, language_code)
);

-- Enable RLS on translations
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for translations
CREATE POLICY "Users can view translations of their projects"
  ON translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = translations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create translations in their projects"
  ON translations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = translations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update translations in their projects"
  ON translations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = translations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete translations in their projects"
  ON translations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = translations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create translation_strings table (stores actual translations)
CREATE TABLE IF NOT EXISTS translation_strings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id UUID NOT NULL REFERENCES translations(id) ON DELETE CASCADE,
  element_id UUID NOT NULL REFERENCES elements(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL, -- 'text', 'alt', 'placeholder', etc.
  translated_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(translation_id, element_id, field_name)
);

-- Enable RLS on translation_strings
ALTER TABLE translation_strings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for translation_strings
CREATE POLICY "Users can view translation strings of their projects"
  ON translation_strings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM translations 
      JOIN projects ON projects.id = translations.project_id
      WHERE translations.id = translation_strings.translation_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create translation strings in their projects"
  ON translation_strings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM translations 
      JOIN projects ON projects.id = translations.project_id
      WHERE translations.id = translation_strings.translation_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update translation strings in their projects"
  ON translation_strings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM translations 
      JOIN projects ON projects.id = translations.project_id
      WHERE translations.id = translation_strings.translation_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete translation strings in their projects"
  ON translation_strings FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM translations 
      JOIN projects ON projects.id = translations.project_id
      WHERE translations.id = translation_strings.translation_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create index for better query performance
CREATE INDEX idx_translations_project_id ON translations(project_id);
CREATE INDEX idx_translation_strings_translation_id ON translation_strings(translation_id);
CREATE INDEX idx_translation_strings_element_id ON translation_strings(element_id);
