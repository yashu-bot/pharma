const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const sectionController = require('../controllers/sectionController');

// Get all sections (accessible by all authenticated users)
router.get('/', auth(['admin', 'worker', 'user']), sectionController.getAllSections);

// Admin only routes
router.post('/', auth(['admin']), [
    body('name').notEmpty().withMessage('Section name is required'),
    validate
], sectionController.addSection);

router.put('/:id', auth(['admin']), [
    body('name').notEmpty().withMessage('Section name is required'),
    validate
], sectionController.updateSection);

router.delete('/:id', auth(['admin']), sectionController.deleteSection);

module.exports = router;
