const bcrypt = require('bcryptjs');
const db = require('../config/database');

// Get Admin Profile
exports.getProfile = async (req, res) => {
    try {
        const [admins] = await db.query('SELECT id, pharma_name, address, phone, sgst_percentage, cgst_percentage FROM admin WHERE id = ?', [req.user.id]);
        res.json({ success: true, data: admins[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update Admin Profile
exports.updateProfile = async (req, res) => {
    try {
        const { pharma_name, address, phone } = req.body;
        await db.query('UPDATE admin SET pharma_name = ?, address = ?, phone = ? WHERE id = ?', 
            [pharma_name, address, phone, req.user.id]);
        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Change Password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        
        const [admins] = await db.query('SELECT password FROM admin WHERE id = ?', [req.user.id]);
        const isMatch = await bcrypt.compare(currentPassword, admins[0].password);
        
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE admin SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update GST Settings
exports.updateGST = async (req, res) => {
    try {
        const { sgst_percentage, cgst_percentage } = req.body;
        await db.query('UPDATE admin SET sgst_percentage = ?, cgst_percentage = ? WHERE id = ?', 
            [sgst_percentage, cgst_percentage, req.user.id]);
        res.json({ success: true, message: 'GST settings updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Get GST Settings
exports.getGST = async (req, res) => {
    try {
        const [admins] = await db.query('SELECT sgst_percentage, cgst_percentage FROM admin LIMIT 1');
        res.json({ success: true, data: admins[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Dashboard Analytics
exports.getDashboard = async (req, res) => {
    try {
        const [totalProducts] = await db.query('SELECT COUNT(*) as count FROM products');
        const [totalOrders] = await db.query('SELECT COUNT(*) as count FROM orders');
        const [totalUsers] = await db.query('SELECT COUNT(*) as count FROM users');
        const [totalWorkers] = await db.query('SELECT COUNT(*) as count FROM workers');
        const [lowStock] = await db.query('SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10');
        const [expiringSoon] = await db.query('SELECT COUNT(*) as count FROM products WHERE exp_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY) AND exp_date >= CURDATE()');
        const [recentOrders] = await db.query(`
            SELECT o.*, u.medical_name, u.owner_name 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC LIMIT 5
        `);
        
        res.json({
            success: true,
            data: {
                totalProducts: totalProducts[0].count,
                totalOrders: totalOrders[0].count,
                totalUsers: totalUsers[0].count,
                totalWorkers: totalWorkers[0].count,
                lowStock: lowStock[0].count,
                expiringSoon: expiringSoon[0].count,
                recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
