-- Add updated_at column to seasons table for consistency with other tables
ALTER TABLE seasons ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
