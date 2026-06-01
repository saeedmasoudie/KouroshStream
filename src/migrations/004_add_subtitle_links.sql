-- Add subtitle_link column to movies table
ALTER TABLE movies ADD COLUMN subtitle_link TEXT;

-- Add subtitle_link column to seasons table
ALTER TABLE seasons ADD COLUMN subtitle_link TEXT;
