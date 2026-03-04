const db = require('../config/database');

// Get All Product Masters
exports.getAllProductMasters = async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM product_master';
        const params = [];
        
        if (search) {
            query += ' WHERE name ILIKE ?';
            params.push(`%${search}%`);
        }
        
        query += ' ORDER BY name';
        
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
        const { name } = req.body;
        await db.query('INSERT INTO product_master (name) VALUES (?)', [name]);
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
        const { name } = req.body;
        await db.query('UPDATE product_master SET name = ? WHERE id = ?', [name, id]);
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
