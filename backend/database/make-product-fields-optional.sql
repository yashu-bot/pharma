-- Make mfg_date, exp_date, and batch_number optional in products table
-- Run this on your PostgreSQL database

ALTER TABLE products ALTER COLUMN mfg_date DROP NOT NULL;
ALTER TABLE products ALTER COLUMN exp_date DROP NOT NULL;
ALTER TABLE products ALTER COLUMN batch_number DROP NOT NULL;
