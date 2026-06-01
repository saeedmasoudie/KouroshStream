-- Migration: Replace next_episode_date with day-of-week based release schedule
-- This migration improves the countdown system by using recurring release schedule
-- instead of manually setting specific dates every week.

-- Add new columns for recurring release schedule
ALTER TABLE series ADD COLUMN release_day_of_week INTEGER;  -- 0=Sunday, 1=Monday, ..., 6=Saturday
ALTER TABLE series ADD COLUMN release_time TEXT;             -- Format: "HH:MM" (24-hour)

-- Optional: If you want to convert existing next_episode_date values to the new system,
-- you'll need to manually determine the day of week for each series.
-- Example conversions (uncomment and modify as needed):
-- UPDATE series SET release_day_of_week = 5, release_time = '20:00' WHERE id = 'series-id-1'; -- Friday 8PM
-- UPDATE series SET release_day_of_week = 0, release_time = '21:00' WHERE id = 'series-id-2'; -- Sunday 9PM

-- Create index for better performance when querying series by release day
CREATE INDEX IF NOT EXISTS idx_series_release_day ON series(release_day_of_week);

-- Drop the old index (if it exists)
DROP INDEX IF EXISTS idx_series_next_episode_date;

-- Optional: Remove old column after confirming new system works
-- WARNING: Only run this after you've verified the new system is working correctly
-- ALTER TABLE series DROP COLUMN next_episode_date;
