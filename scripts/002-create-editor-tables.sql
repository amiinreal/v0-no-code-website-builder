-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_home BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, slug)
);

-- Enable RLS on pages
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages
CREATE POLICY "Users can view pages of their projects"
  ON pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = pages.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create pages in their projects"
  ON pages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = pages.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update pages in their projects"
  ON pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = pages.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete pages in their projects"
  ON pages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = pages.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create elements table (stores the page structure)
CREATE TABLE IF NOT EXISTS elements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES elements(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'section', 'container', 'text', 'image', 'button', 'form', 'navbar', 'footer'
  content JSONB DEFAULT '{}', -- stores element-specific data
  styles JSONB DEFAULT '{}', -- stores CSS properties
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on elements
ALTER TABLE elements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for elements
CREATE POLICY "Users can view elements of their pages"
  ON elements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages 
      JOIN projects ON projects.id = pages.project_id
      WHERE pages.id = elements.page_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create elements in their pages"
  ON elements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pages 
      JOIN projects ON projects.id = pages.project_id
      WHERE pages.id = elements.page_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update elements in their pages"
  ON elements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pages 
      JOIN projects ON projects.id = pages.project_id
      WHERE pages.id = elements.page_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete elements in their pages"
  ON elements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pages 
      JOIN projects ON projects.id = pages.project_id
      WHERE pages.id = elements.page_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create index for better query performance
CREATE INDEX idx_elements_page_id ON elements(page_id);
CREATE INDEX idx_elements_parent_id ON elements(parent_id);
CREATE INDEX idx_pages_project_id ON pages(project_id);
