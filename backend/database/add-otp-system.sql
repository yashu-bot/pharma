-- Add email field to users table if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add email field to workers table if not exists
ALTER TABLE workers ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add email field to admin table if not exists
ALTER TABLE admin ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Create OTP table for password reset
CREATE TABLE IF NOT EXISTS password_reset_otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_email ON password_reset_otps(email);
CREATE INDEX IF NOT EXISTS idx_otp_phone ON password_reset_otps(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON password_reset_otps(expires_at);
