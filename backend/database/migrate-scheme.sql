-- Migration script to update scheme field from VARCHAR to INT
-- Run this if you already have data in your database

USE pharma_db;

-- Backup existing data (optional but recommended)
-- CREATE TABLE products_backup AS SELECT * FROM products;

-- Step 1: Add new columns to products table
ALTER TABLE products 
MODIFY COLUMN scheme INT DEFAULT NULL COMMENT 'Buy X sheets get 1 free (NULL = no offer)';

-- Step 2: Add new columns to order_items table
ALTER TABLE order_items 
ADD COLUMN free_quantity INT DEFAULT 0 COMMENT 'Free items based on scheme' AFTER quantity,
ADD COLUMN total_quantity INT NOT NULL DEFAULT 0 COMMENT 'Total quantity including free items' AFTER free_quantity,
ADD COLUMN stock_deducted INT NOT NULL DEFAULT 0 COMMENT 'Actual stock deducted' AFTER total_quantity;

-- Step 3: Update existing order_items to set default values
UPDATE order_items 
SET free_quantity = 0, 
    total_quantity = quantity, 
    stock_deducted = quantity 
WHERE free_quantity IS NULL OR total_quantity = 0 OR stock_deducted = 0;

-- Step 4: Update scheme column comment
ALTER TABLE order_items 
MODIFY COLUMN scheme INT DEFAULT NULL COMMENT 'Buy X get 1 free';

SELECT 'Migration completed successfully!' as message;
