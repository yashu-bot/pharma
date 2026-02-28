const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get All Workers
exports.getAllWorkers = async (req, res) => {
    try {
        const [workers] = await db.query('SELECT id, name, phone, email, created_at FROM workers ORDER BY name');
        res.json({ success: true, data: workers });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Add Worker
exports.addWorker = async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.query(
            'INSERT INTO workers (name, phone, email, password) VALUES (?, ?, ?, ?)',
            [name, phone, email, hashedPassword]
        );
        
        res.json({ success: true, message: 'Worker added successfully', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Phone or email already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete Worker
exports.deleteWorker = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM workers WHERE id = ?', [id]);
        res.json({ success: true, message: 'Worker deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
