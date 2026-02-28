-- PostgreSQL Schema for Pharma Management System
-- Run this after creating database on Render

-- Admin Table
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    pharma_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    sgst_percentage DECIMAL(5,2) DEFAULT 9.00,
    cgst_percentage DECIMAL(5,2) DEFAULT 9.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workers Table
CREATE TABLE IF NOT EXISTS workers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (Medical Store Owners) Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    medical_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections Table
CREATE TABLE IF NOT EXISTS sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    mg VARCHAR(50),
    mrp_per_sheet DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    scheme INT DEFAULT NULL,
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    section_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_products_section ON products(section_id);
CREATE INDEX IF NOT EXISTS idx_products_exp_date ON products(exp_date);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    worker_id INT,
    order_type VARCHAR(10) NOT NULL CHECK (order_type IN ('user', 'worker')),
    subtotal DECIMAL(10,2) NOT NULL,
    sgst_amount DECIMAL(10,2) NOT NULL,
    cgst_amount DECIMAL(10,2) NOT NULL,
    sgst_percentage DECIMAL(5,2) NOT NULL,
    cgst_percentage DECIMAL(5,2) NOT NULL,
    grand_total DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'delivered', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_worker ON orders(worker_id);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    mg VARCHAR(50),
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    scheme INT DEFAULT NULL,
    quantity INT NOT NULL,
    free_quantity INT DEFAULT 0,
    total_quantity INT NOT NULL,
    stock_deducted INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Insert default admin (password: admin123)
INSERT INTO admin (pharma_name, address, phone, password) 
VALUES ('Default Pharma', '123 Main Street, City', '1234567890', '$2a$10$3kABLzIb42q.nFWSrW33Ru14HIZWkwVz1XuUr9pjpLnRIyBo6bSRq')
ON CONFLICT (phone) DO NOTHING;

-- Insert sample sections
INSERT INTO sections (name) VALUES 
('Tablets'),
('Syrups'),
('Capsules'),
('Injections'),
('Ointments')
ON CONFLICT (name) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for products table
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
