-- Add 'delivered' status to orders table
-- Run this on your PostgreSQL database

-- Drop the existing constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;

-- Add new constraint with 'delivered' status
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('pending', 'processing', 'completed', 'delivered', 'cancelled'));
