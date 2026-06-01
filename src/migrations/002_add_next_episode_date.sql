-- Migration: Add next_episode_date column to series table
-- This allows tracking when the next episode will be released for ongoing series

-- Add next_episode_date column to series table
ALTER TABLE series ADD COLUMN next_episode_date DATETIME;

-- Create an index for better performance when querying upcoming episodes
CREATE INDEX IF NOT EXISTS idx_series_next_episode_date ON series(next_episode_date);
