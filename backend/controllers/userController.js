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
        
        await db.query(
            'INSERT INTO users (medical_name, owner_name, phone, email, address, password) VALUES (?, ?, ?, ?, ?, ?)',
            [medical_name, owner_name, phone, email, address, hashedPassword]
        );
        
        res.json({ success: true, message: 'User added successfully' });
    } catch (error) {
        console.error('Add user error:', error);
        if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Phone or email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update User
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { medical_name, owner_name, phone, email, address, password } = req.body;
        
        // Build update query dynamically based on provided fields
        let updateFields = [];
        let values = [];
        
        if (medical_name) {
            updateFields.push('medical_name = ?');
            values.push(medical_name);
        }
        if (owner_name) {
            updateFields.push('owner_name = ?');
            values.push(owner_name);
        }
        if (phone) {
            updateFields.push('phone = ?');
            values.push(phone);
        }
        if (email) {
            updateFields.push('email = ?');
            values.push(email);
        }
        if (address !== undefined) {
            updateFields.push('address = ?');
            values.push(address);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push('password = ?');
            values.push(hashedPassword);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }
        
        values.push(id);
        const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
        
        await db.query(sql, values);
        res.json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
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
