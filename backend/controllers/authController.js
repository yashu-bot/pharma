const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { sendOTPEmail, generateOTP } = require('../services/emailService');

// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// Admin Login
exports.adminLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        const [admins] = await db.query('SELECT * FROM admin WHERE phone = ?', [phone]);
        
        if (admins.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const admin = admins[0];
        const isMatch = await bcrypt.compare(password, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = generateToken(admin.id, 'admin');
        
        res.json({
            success: true,
            token,
            user: {
                id: admin.id,
                pharma_name: admin.pharma_name,
                phone: admin.phone,
                role: 'admin'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Worker Login
exports.workerLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        const [workers] = await db.query('SELECT * FROM workers WHERE phone = ?', [phone]);
        
        if (workers.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const worker = workers[0];
        const isMatch = await bcrypt.compare(password, worker.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = generateToken(worker.id, 'worker');
        
        res.json({
            success: true,
            token,
            user: {
                id: worker.id,
                name: worker.name,
                phone: worker.phone,
                email: worker.email,
                role: 'worker'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// User Login
exports.userLogin = async (req, res) => {
    try {
        const { phone, password } = req.body;
        
        const [users] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = generateToken(user.id, 'user');
        
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                medical_name: user.medical_name,
                owner_name: user.owner_name,
                phone: user.phone,
                email: user.email,
                address: user.address,
                role: 'user'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Request OTP for Password Reset
exports.requestOTP = async (req, res) => {
    try {
        const { phone, email, role } = req.body;
        
        // Validate role
        if (!['admin', 'worker', 'user'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        
        // Determine table based on role
        let table = role === 'admin' ? 'admin' : role === 'worker' ? 'workers' : 'users';
        
        // Check if user exists with phone and email
        const [records] = await db.query(
            `SELECT * FROM ${table} WHERE phone = $1 AND email = $2`,
            [phone, email]
        );
        
        if (records.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No account found with this phone and email combination' 
            });
        }
        
        const user = records[0];
        const userName = user.pharma_name || user.name || user.owner_name || 'User';
        
        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        
        // Delete old OTPs for this email
        await db.query(
            'DELETE FROM password_reset_otps WHERE email = $1 AND role = $2',
            [email, role]
        );
        
        // Store OTP in database
        await db.query(
            'INSERT INTO password_reset_otps (email, phone, role, otp, expires_at) VALUES ($1, $2, $3, $4, $5)',
            [email, phone, role, otp, expiresAt]
        );
        
        // Send OTP via email
        await sendOTPEmail(email, otp, userName);
        
        res.json({ 
            success: true, 
            message: 'OTP sent to your email successfully. Valid for 10 minutes.' 
        });
    } catch (error) {
        console.error('Request OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send OTP. Please try again.',
            error: error.message 
        });
    }
};

// Verify OTP and Reset Password
exports.verifyOTPAndResetPassword = async (req, res) => {
    try {
        const { phone, email, otp, newPassword, confirmPassword, role } = req.body;
        
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        
        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }
        
        // Find valid OTP
        const [otpRecords] = await db.query(
            `SELECT * FROM password_reset_otps 
             WHERE email = $1 AND phone = $2 AND role = $3 AND otp = $4 
             AND is_used = FALSE AND expires_at > CURRENT_TIMESTAMP`,
            [email, phone, role, otp]
        );
        
        if (otpRecords.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired OTP. Please request a new one.' 
            });
        }
        
        // Mark OTP as used
        await db.query(
            'UPDATE password_reset_otps SET is_used = TRUE WHERE id = $1',
            [otpRecords[0].id]
        );
        
        // Update password
        let table = role === 'admin' ? 'admin' : role === 'worker' ? 'workers' : 'users';
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await db.query(
            `UPDATE ${table} SET password = $1 WHERE phone = $2 AND email = $3`,
            [hashedPassword, phone, email]
        );
        
        res.json({ 
            success: true, 
            message: 'Password reset successfully. You can now login with your new password.' 
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reset password. Please try again.',
            error: error.message 
        });
    }
};

// Forgot Password (Old method - kept for backward compatibility)
exports.forgotPassword = async (req, res) => {
    try {
        const { phone, email, newPassword, confirmPassword, role } = req.body;
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        
        let table = role === 'admin' ? 'admin' : role === 'worker' ? 'workers' : 'users';
        
        const [records] = await db.query(`SELECT * FROM ${table} WHERE phone = ? AND email = ?`, [phone, email]);
        
        if (records.length === 0) {
            return res.status(404).json({ success: false, message: 'Phone or email not found' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query(`UPDATE ${table} SET password = ? WHERE phone = ?`, [hashedPassword, phone]);
        
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Direct Password Reset (for User/Worker without OTP)
exports.directResetPassword = async (req, res) => {
    try {
        const { phone, email, newPassword, confirmPassword, role } = req.body;
        
        // Validate role (only user and worker allowed for direct reset)
        if (!['worker', 'user'].includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Direct password reset is only available for users and workers' 
            });
        }
        
        // Validate passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }
        
        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
        }
        
        // Determine table based on role
        let table = role === 'worker' ? 'workers' : 'users';
        
        // Check if user exists with phone and email
        const [records] = await db.query(
            `SELECT * FROM ${table} WHERE phone = $1 AND email = $2`,
            [phone, email]
        );
        
        if (records.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No account found with this phone and email combination' 
            });
        }
        
        // Update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        await db.query(
            `UPDATE ${table} SET password = $1 WHERE phone = $2 AND email = $3`,
            [hashedPassword, phone, email]
        );
        
        res.json({ 
            success: true, 
            message: 'Password reset successfully. You can now login with your new password.' 
        });
    } catch (error) {
        console.error('Direct reset password error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to reset password. Please try again.',
            error: error.message 
        });
    }
};
