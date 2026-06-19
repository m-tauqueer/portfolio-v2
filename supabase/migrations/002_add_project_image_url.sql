-- Add project screenshot paths (run once in Supabase SQL Editor)
ALTER TABLE portfolio_projects ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';
