const db = require('../config/database');

// Get All Sections
exports.getAllSections = async (req, res) => {
    try {
        const [sections] = await db.query('SELECT * FROM sections ORDER BY name');
        res.json({ success: true, data: sections });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Add Section
exports.addSection = async (req, res) => {
    try {
        const { name } = req.body;
        const [result] = await db.query('INSERT INTO sections (name) VALUES (?)', [name]);
        res.json({ success: true, message: 'Section added successfully', id: result.insertId });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Section already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update Section
exports.updateSection = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await db.query('UPDATE sections SET name = ? WHERE id = ?', [name, id]);
        res.json({ success: true, message: 'Section updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete Section
exports.deleteSection = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM sections WHERE id = ?', [id]);
        res.json({ success: true, message: 'Section deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
