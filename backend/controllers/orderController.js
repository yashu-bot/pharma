const db = require('../config/database');

// Place Order
exports.placeOrder = async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { items, user_id } = req.body;
        const order_type = req.user.role;
        const worker_id = req.user.role === 'worker' ? req.user.id : null;
        
        // Get GST settings
        const [gstSettings] = await connection.query('SELECT sgst_percentage, cgst_percentage FROM admin LIMIT 1');
        
        if (!gstSettings || gstSettings.length === 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'GST settings not configured' });
        }
        
        const { sgst_percentage, cgst_percentage } = gstSettings[0];
        
        // Validate stock and calculate totals
        let subtotal = 0;
        const validatedItems = [];
        
        for (const item of items) {
            const [products] = await connection.query('SELECT * FROM products WHERE id = ? FOR UPDATE', [item.product_id]);
            
            if (products.length === 0) {
                await connection.rollback();
                return res.status(400).json({ success: false, message: `Product not found: ${item.product_id}` });
            }
            
            const product = products[0];
            
            // Check expiry
            if (new Date(product.exp_date) < new Date()) {
                await connection.rollback();
                return res.status(400).json({ success: false, message: `Product expired: ${product.product_name}` });
            }
            
            // Calculate free items based on scheme
            let freeQuantity = 0;
            let totalQuantity = item.quantity;
            let stockDeducted = item.quantity;
            
            if (product.scheme && product.scheme > 0) {
                freeQuantity = Math.floor(item.quantity / product.scheme);
                totalQuantity = item.quantity + freeQuantity;
                stockDeducted = totalQuantity;
            }
            
            // Check stock
            if (product.stock_quantity < stockDeducted) {
                await connection.rollback();
                return res.status(400).json({ 
                    success: false, 
                    message: `Insufficient stock for ${product.product_name}. Available: ${product.stock_quantity}, Required: ${stockDeducted}` 
                });
            }
            
            const itemTotal = product.selling_price * item.quantity;
            subtotal += itemTotal;
            
            validatedItems.push({
                product_id: product.id,
                product_name: product.product_name,
                mg: product.mg,
                mfg_date: product.mfg_date,
                exp_date: product.exp_date,
                batch_number: product.batch_number,
                mrp: product.mrp_per_sheet,
                selling_price: product.selling_price,
                scheme: product.scheme,
                quantity: item.quantity,
                free_quantity: freeQuantity,
                total_quantity: totalQuantity,
                stock_deducted: stockDeducted,
                total: itemTotal,
                new_stock: product.stock_quantity - stockDeducted
            });
        }
        
        // Calculate GST
        const sgst_amount = (subtotal * sgst_percentage) / 100;
        const cgst_amount = (subtotal * cgst_percentage) / 100;
        const grand_total = subtotal + sgst_amount + cgst_amount;
        
        // Insert order
        let order_id;
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, worker_id, order_type, subtotal, sgst_amount, cgst_amount, sgst_percentage, cgst_percentage, grand_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [user_id, worker_id, order_type, subtotal, sgst_amount, cgst_amount, sgst_percentage, cgst_percentage, grand_total]
        );
        
        // Get the inserted order ID
        if (orderResult.id) {
            order_id = orderResult.id;
        } else if (orderResult.insertId) {
            order_id = orderResult.insertId;
        } else {
            const [lastOrder] = await connection.query(
                'SELECT id FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
                [user_id]
            );
            order_id = lastOrder[0].id;
        }
        
        // Insert order items and update stock
        for (const item of validatedItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, product_name, mg, mfg_date, exp_date, batch_number, mrp, selling_price, scheme, quantity, free_quantity, total_quantity, stock_deducted, total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [order_id, item.product_id, item.product_name, item.mg, item.mfg_date, item.exp_date, item.batch_number, item.mrp, item.selling_price, item.scheme, item.quantity, item.free_quantity, item.total_quantity, item.stock_deducted, item.total]
            );
            
            await connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [item.new_stock, item.product_id]);
        }
        
        await connection.commit();
        
        res.json({ 
            success: true, 
            message: 'Order placed successfully', 
            order_id,
            order: {
                subtotal,
                sgst_amount,
                cgst_amount,
                grand_total
            }
        });
    } catch (error) {
        console.error('Place order error:', error);
        await connection.rollback();
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    } finally {
        connection.release();
    }
};

// Get All Orders (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const { start_date, end_date, user_id, worker_id } = req.query;
        
        let query = `
            SELECT o.*, u.medical_name, u.owner_name, u.address as user_address,
            w.name as worker_name
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN workers w ON o.worker_id = w.id
            WHERE 1=1
        `;
        const params = [];
        
        if (start_date && end_date) {
            query += ' AND DATE(o.created_at) BETWEEN $' + (params.length + 1) + ' AND $' + (params.length + 2);
            params.push(start_date, end_date);
        }
        
        if (user_id) {
            query += ' AND o.user_id = $' + (params.length + 1);
            params.push(user_id);
        }
        
        if (worker_id) {
            query += ' AND o.worker_id = $' + (params.length + 1);
            params.push(worker_id);
        }
        
        query += ' ORDER BY o.created_at DESC';
        
        const [orders] = await db.query(query, params);
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get User Orders
exports.getUserOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get Worker Orders
exports.getWorkerOrders = async (req, res) => {
    try {
        const [orders] = await db.query(
            `SELECT o.*, u.medical_name, u.owner_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.worker_id = ?
            ORDER BY o.created_at DESC`,
            [req.user.id]
        );
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get Order Details
exports.getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [orders] = await db.query(
            `SELECT o.*, u.medical_name, u.owner_name, u.address as user_address, u.phone as user_phone,
            w.name as worker_name, a.pharma_name, a.address as pharma_address, a.phone as pharma_phone
            FROM orders o
            JOIN users u ON o.user_id = u.id
            LEFT JOIN workers w ON o.worker_id = w.id
            CROSS JOIN admin a
            WHERE o.id = ?`,
            [id]
        );
        
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        
        const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
        
        res.json({ 
            success: true, 
            data: {
                order: orders[0],
                items
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
