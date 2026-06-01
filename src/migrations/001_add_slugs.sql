-- Add slug column to movies table
ALTER TABLE movies ADD COLUMN slug TEXT;

-- Add slug column to series table
ALTER TABLE series ADD COLUMN slug TEXT;

-- Create indexes for faster lookups by slug
CREATE INDEX IF NOT EXISTS idx_movies_slug ON movies(slug);
CREATE INDEX IF NOT EXISTS idx_series_slug ON series(slug);

-- Note: To backfill existing content, you will need to update each row.
-- Since SQLite/D1 doesn't have a built-in slugify function, you should use
-- a Cloudflare Worker script to iterate through all records, generate a slug
-- from the title, and update the record.
