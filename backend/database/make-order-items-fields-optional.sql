-- Make optional fields nullable in order_items table
-- Run this on your PostgreSQL database on Render

ALTER TABLE order_items 
ALTER COLUMN mg DROP NOT NULL,
ALTER COLUMN mfg_date DROP NOT NULL,
ALTER COLUMN batch_number DROP NOT NULL,
ALTER COLUMN scheme DROP NOT NULL;
