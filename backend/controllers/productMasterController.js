const db = require('../config/database');

// Get All Product Masters
exports.getAllProductMasters = async (req, res) => {
    try {
        const { search, section_id } = req.query;
        let query = 'SELECT pm.*, s.name as section_name FROM product_master pm LEFT JOIN sections s ON pm.section_id = s.id WHERE 1=1';
        const params = [];
        
        if (search) {
            query += ' AND pm.name ILIKE ?';
            params.push(`%${search}%`);
        }
        
        if (section_id) {
            query += ' AND pm.section_id = ?';
            params.push(section_id);
        }
        
        query += ' ORDER BY pm.name';
        
        const [products] = await db.query(query, params);
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Get product masters error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Add Product Master
exports.addProductMaster = async (req, res) => {
    try {
        const { name, section_id } = req.body;
        await db.query('INSERT INTO product_master (name, section_id) VALUES (?, ?)', [name, section_id || null]);
        res.json({ success: true, message: 'Product added successfully' });
    } catch (error) {
        console.error('Add product master error:', error);
        if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Product already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update Product Master
exports.updateProductMaster = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, section_id } = req.body;
        await db.query('UPDATE product_master SET name = ?, section_id = ? WHERE id = ?', [name, section_id || null, id]);
        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        console.error('Update product master error:', error);
        if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Product name already exists' });
        }
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete Product Master
exports.deleteProductMaster = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM product_master WHERE id = ?', [id]);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product master error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
