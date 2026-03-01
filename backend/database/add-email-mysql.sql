-- Add email column to admin table
ALTER TABLE admin ADD COLUMN email VARCHAR(255) AFTER phone;

-- Add email column to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) AFTER phone;

-- Add email column to workers table if not exists  
ALTER TABLE workers ADD COLUMN IF NOT EXISTS email VARCHAR(255) AFTER phone;

-- Create OTP table for password reset
CREATE TABLE IF NOT EXISTS password_reset_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otp_email (email),
    INDEX idx_otp_phone (phone),
    INDEX idx_otp_expires (expires_at)
);
