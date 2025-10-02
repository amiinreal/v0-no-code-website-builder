-- Fix elements table schema to match TypeScript interface
-- This script should be run in the Supabase SQL Editor

-- Add responsive_styles column if it doesn't exist
ALTER TABLE elements 
ADD COLUMN IF NOT EXISTS responsive_styles JSONB;

-- Rename order_index to position if order_index exists
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'elements' 
        AND column_name = 'order_index'
    ) THEN
        ALTER TABLE elements RENAME COLUMN order_index TO position;
    END IF;
END $$;

-- Verify the schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'elements' 
ORDER BY ordinal_position;