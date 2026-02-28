CREATE DATABASE IF NOT EXISTS pharma_db;
USE pharma_db;

-- Admin Table
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pharma_name VARCHAR(255) NOT NULL,
    address TEXT,
    phone VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    sgst_percentage DECIMAL(5,2) DEFAULT 9.00,
    cgst_percentage DECIMAL(5,2) DEFAULT 9.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workers Table
CREATE TABLE workers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users (Medical Store Owners) Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sections Table
CREATE TABLE sections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    mg VARCHAR(50),
    mrp_per_sheet DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    scheme INT DEFAULT NULL COMMENT 'Buy X sheets get 1 free (NULL = no offer)',
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    section_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE,
    INDEX idx_section (section_id),
    INDEX idx_exp_date (exp_date)
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    worker_id INT,
    order_type ENUM('user', 'worker') NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    sgst_amount DECIMAL(10,2) NOT NULL,
    cgst_amount DECIMAL(10,2) NOT NULL,
    sgst_percentage DECIMAL(5,2) NOT NULL,
    cgst_percentage DECIMAL(5,2) NOT NULL,
    grand_total DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_worker (worker_id),
    INDEX idx_created (created_at)
);

-- Order Items Table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    mg VARCHAR(50),
    mfg_date DATE NOT NULL,
    exp_date DATE NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    selling_price DECIMAL(10,2) NOT NULL,
    scheme INT DEFAULT NULL COMMENT 'Buy X get 1 free',
    quantity INT NOT NULL COMMENT 'Quantity ordered by customer',
    free_quantity INT DEFAULT 0 COMMENT 'Free items based on scheme',
    total_quantity INT NOT NULL COMMENT 'Total quantity including free items',
    stock_deducted INT NOT NULL COMMENT 'Actual stock deducted',
    total DECIMAL(10,2) NOT NULL COMMENT 'Total price (only for paid quantity)',
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id)
);

-- Insert default admin (password: admin123)
INSERT INTO admin (pharma_name, address, phone, password) 
VALUES ('Default Pharma', '123 Main Street, City', '1234567890', '$2a$10$rXK5qYhYqYhYqYhYqYhYqOqYhYqYhYqYhYqYhYqYhYqYhYqYhYqYhYq');

-- Insert sample sections
INSERT INTO sections (name) VALUES 
('Tablets'),
('Syrups'),
('Capsules'),
('Injections'),
('Ointments');
USE pharma_db;


