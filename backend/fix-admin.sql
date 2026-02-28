-- Fix Admin Password
-- This will set the password to "admin123"

USE pharma_db;

-- Delete existing admin if any
DELETE FROM admin WHERE phone = '1234567890';

-- Insert admin with correct bcrypt hash for "admin123"
INSERT INTO admin (pharma_name, address, phone, password, sgst_percentage, cgst_percentage) 
VALUES (
    'Default Pharma', 
    '123 Main Street, City', 
    '1234567890', 
    '$2a$10$3kABLzIb42q.nFWSrW33Ru14HIZWkwVz1XuUr9pjpLnRIyBo6bSRq',
    9.00,
    9.00
);

SELECT 'Admin account created successfully!' as message;
SELECT 'Phone: 1234567890' as login_phone;
SELECT 'Password: admin123' as login_password;
