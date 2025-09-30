-- Create user_tables table (stores custom tables created by users)
CREATE TABLE IF NOT EXISTS user_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  schema JSONB NOT NULL, -- stores column definitions
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, name)
);

-- Enable RLS on user_tables
ALTER TABLE user_tables ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_tables
CREATE POLICY "Users can view tables of their projects"
  ON user_tables FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = user_tables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create tables in their projects"
  ON user_tables FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = user_tables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tables in their projects"
  ON user_tables FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = user_tables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete tables in their projects"
  ON user_tables FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = user_tables.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create table_data table (stores actual data for user tables)
CREATE TABLE IF NOT EXISTS table_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES user_tables(id) ON DELETE CASCADE,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on table_data
ALTER TABLE table_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies for table_data
CREATE POLICY "Users can view data of their tables"
  ON table_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_tables 
      JOIN projects ON projects.id = user_tables.project_id
      WHERE user_tables.id = table_data.table_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create data in their tables"
  ON table_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_tables 
      JOIN projects ON projects.id = user_tables.project_id
      WHERE user_tables.id = table_data.table_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update data in their tables"
  ON table_data FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_tables 
      JOIN projects ON projects.id = user_tables.project_id
      WHERE user_tables.id = table_data.table_id 
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete data in their tables"
  ON table_data FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_tables 
      JOIN projects ON projects.id = user_tables.project_id
      WHERE user_tables.id = table_data.table_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Create index for better query performance
CREATE INDEX idx_table_data_table_id ON table_data(table_id);
CREATE INDEX idx_user_tables_project_id ON user_tables(project_id);
