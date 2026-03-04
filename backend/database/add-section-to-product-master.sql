-- Add section_id to product_master table
-- Run this on your PostgreSQL database

ALTER TABLE product_master 
ADD COLUMN section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL;

-- Create index for faster filtering by section
CREATE INDEX IF NOT EXISTS idx_product_master_section ON product_master(section_id);
