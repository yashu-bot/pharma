const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// Place order (worker and user)
router.post('/', auth(['worker', 'user']), [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.product_id').isInt().withMessage('Valid product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Valid quantity is required'),
    body('user_id').isInt().withMessage('Valid user ID is required'),
    validate
], orderController.placeOrder);

// Get orders
router.get('/admin/all', auth(['admin']), orderController.getAllOrders);
router.get('/user/my-orders', auth(['user']), orderController.getUserOrders);
router.get('/worker/my-orders', auth(['worker']), orderController.getWorkerOrders);

// Get order details
router.get('/:id', auth(['admin', 'worker', 'user']), orderController.getOrderDetails);

// Update order status (admin only)
router.put('/:id/status', auth(['admin']), [
    body('status').isIn(['pending', 'processing', 'completed', 'delivered', 'cancelled']).withMessage('Valid status is required'),
    validate
], orderController.updateOrderStatus);

module.exports = router;
