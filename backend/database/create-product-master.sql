-- Create product_master table for storing product names only
-- Run this on your PostgreSQL database

CREATE TABLE IF NOT EXISTS product_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_product_master_name ON product_master(name);
