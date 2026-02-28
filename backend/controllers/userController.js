const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, medical_name, owner_name, phone, email, address, created_at FROM users ORDER BY medical_name');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Add User
exports.addUser = async (req, res) => {
    try {
        const { medical_name, owner_name, phone, email, address, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO users (medical_name, owner_name, phone, email, address, password) VALUES (?, ?, ?, ?, ?, ?)',
            [medical_name, owner_name, phone, email, address, hashedPassword]
        );
        
        res.json({ success: true, message: 'User added successfully', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Phone or email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Search Users (for worker dropdown)
exports.searchUsers = async (req, res) => {
    try {
        const { search } = req.query;
        const [users] = await db.query(
            'SELECT id, medical_name, owner_name, phone, address FROM users WHERE medical_name LIKE ? OR owner_name LIKE ? ORDER BY medical_name LIMIT 10',
            [`%${search}%`, `%${search}%`]
        );
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
