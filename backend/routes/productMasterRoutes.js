const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const productMasterController = require('../controllers/productMasterController');

// Admin routes
router.get('/', auth(['admin']), productMasterController.getAllProductMasters);

router.post('/', auth(['admin']), [
    body('name').notEmpty().withMessage('Product name is required'),
    validate
], productMasterController.addProductMaster);

router.put('/:id', auth(['admin']), [
    body('name').notEmpty().withMessage('Product name is required'),
    validate
], productMasterController.updateProductMaster);

router.delete('/:id', auth(['admin']), productMasterController.deleteProductMaster);

module.exports = router;
