const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

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

// Forgot Password
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
