const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const productController = require('../controllers/productController');

// Admin routes
router.get('/all', auth(['admin']), productController.getAllProducts);
router.post('/', auth(['admin']), [
    body('product_name').notEmpty().withMessage('Product name is required'),
    body('mrp_per_sheet').isFloat({ min: 0 }).withMessage('Valid MRP is required'),
    body('selling_price').isFloat({ min: 0 }).withMessage('Valid selling price is required'),
    body('mfg_date').optional({ checkFalsy: true }).isDate().withMessage('Valid manufacturing date is required'),
    body('exp_date').optional({ checkFalsy: true }).isDate().withMessage('Valid expiry date is required'),
    body('batch_number').optional({ checkFalsy: true }),
    body('mg').optional({ checkFalsy: true }),
    body('scheme').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Scheme must be a positive number'),
    body('stock_quantity').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
    body('section_id').isInt().withMessage('Valid section is required'),
    validate
], productController.addProduct);

router.put('/:id', auth(['admin']), [
    body('product_name').notEmpty().withMessage('Product name is required'),
    body('mrp_per_sheet').isFloat({ min: 0 }).withMessage('Valid MRP is required'),
    body('selling_price').isFloat({ min: 0 }).withMessage('Valid selling price is required'),
    body('mfg_date').optional({ checkFalsy: true }).isDate().withMessage('Valid manufacturing date is required'),
    body('exp_date').optional({ checkFalsy: true }).isDate().withMessage('Valid expiry date is required'),
    body('batch_number').optional({ checkFalsy: true }),
    body('mg').optional({ checkFalsy: true }),
    body('scheme').optional({ checkFalsy: true }).isInt({ min: 0 }).withMessage('Scheme must be a positive number'),
    body('stock_quantity').isInt({ min: 0 }).withMessage('Valid stock quantity is required'),
    body('section_id').isInt().withMessage('Valid section is required'),
    validate
], productController.updateProduct);

router.delete('/:id', auth(['admin']), productController.deleteProduct);

// Worker and User routes (available products only)
router.get('/', auth(['worker', 'user']), productController.getAvailableProducts);
router.get('/:id', auth(['admin', 'worker', 'user']), productController.getProduct);

module.exports = router;
