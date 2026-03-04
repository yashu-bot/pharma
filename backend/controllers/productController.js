const db = require('../config/database');

// Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const { section_id, search } = req.query;
        let query = `
            SELECT p.*, s.name as section_name,
            CASE 
                WHEN p.exp_date < CURRENT_DATE THEN 'expired'
                WHEN p.exp_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
                ELSE 'valid'
            END as expiry_status,
            CASE 
                WHEN p.stock_quantity < 10 THEN 'low'
                ELSE 'normal'
            END as stock_status
            FROM products p 
            JOIN sections s ON p.section_id = s.id
            WHERE 1=1
        `;
        const params = [];
        
        if (section_id) {
            query += ' AND p.section_id = $' + (params.length + 1);
            params.push(section_id);
        }
        
        if (search) {
            query += ' AND p.product_name ILIKE $' + (params.length + 1);
            params.push(`%${search}%`);
        }
        
        query += ' ORDER BY p.product_name';
        
        const [products] = await db.query(query, params);
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get Products for User/Worker (Show all products with availability status)
exports.getAvailableProducts = async (req, res) => {
    try {
        const { section_id } = req.query;
        
        // First, get all products from stock (products table)
        let stockQuery = `
            SELECT 
                p.id,
                p.product_name,
                p.section_id,
                s.name as section_name,
                p.id as stock_id,
                p.mg,
                p.mrp_per_sheet,
                p.selling_price,
                p.scheme,
                p.stock_quantity,
                p.exp_date,
                CASE 
                    WHEN p.exp_date < CURRENT_DATE THEN 'expired'
                    WHEN p.stock_quantity <= 0 THEN 'out_of_stock'
                    WHEN p.exp_date <= CURRENT_DATE + INTERVAL '30 days' THEN 'expiring_soon'
                    ELSE 'available'
                END as availability_status
            FROM products p
            LEFT JOIN sections s ON p.section_id = s.id
            WHERE 1=1
        `;
        
        // Then get products from product_master that are NOT in stock
        let masterQuery = `
            SELECT 
                pm.id,
                pm.name as product_name,
                pm.section_id,
                s.name as section_name,
                NULL as stock_id,
                NULL as mg,
                NULL as mrp_per_sheet,
                NULL as selling_price,
                NULL as scheme,
                NULL as stock_quantity,
                NULL as exp_date,
                'not_available' as availability_status
            FROM product_master pm
            LEFT JOIN sections s ON pm.section_id = s.id
            WHERE NOT EXISTS (
                SELECT 1 FROM products p WHERE p.product_name = pm.name
            )
        `;
        
        const params = [];
        
        if (section_id) {
            stockQuery += ' AND p.section_id = $' + (params.length + 1);
            masterQuery += ' AND pm.section_id = $' + (params.length + 1);
            params.push(section_id);
        }
        
        // Combine both queries with UNION
        const query = `(${stockQuery}) UNION ALL (${masterQuery}) ORDER BY product_name`;
        
        const [products] = await db.query(query, params);
        res.json({ success: true, data: products });
    } catch (error) {
        console.error('Get available products error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get Single Product
exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const [products] = await db.query('SELECT p.*, s.name as section_name FROM products p JOIN sections s ON p.section_id = s.id WHERE p.id = ?', [id]);
        
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        
        res.json({ success: true, data: products[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Add Product
exports.addProduct = async (req, res) => {
    try {
        const { product_name, mg, mrp_per_sheet, selling_price, scheme, mfg_date, exp_date, batch_number, stock_quantity, section_id } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO products (product_name, mg, mrp_per_sheet, selling_price, scheme, mfg_date, exp_date, batch_number, stock_quantity, section_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [product_name, mg, mrp_per_sheet, selling_price, scheme, mfg_date, exp_date, batch_number, stock_quantity, section_id]
        );
        
        res.json({ success: true, message: 'Product added successfully', id: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { product_name, mg, mrp_per_sheet, selling_price, scheme, mfg_date, exp_date, batch_number, stock_quantity, section_id } = req.body;
        
        await db.query(
            'UPDATE products SET product_name = ?, mg = ?, mrp_per_sheet = ?, selling_price = ?, scheme = ?, mfg_date = ?, exp_date = ?, batch_number = ?, stock_quantity = ?, section_id = ? WHERE id = ?',
            [product_name, mg, mrp_per_sheet, selling_price, scheme, mfg_date, exp_date, batch_number, stock_quantity, section_id, id]
        );
        
        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
