const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const userController = require('../controllers/userController');

// Admin routes
router.get('/', auth(['admin']), userController.getAllUsers);

router.post('/', auth(['admin']), [
    body('medical_name').notEmpty().withMessage('Medical name is required'),
    body('owner_name').notEmpty().withMessage('Owner name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], userController.addUser);

router.delete('/:id', auth(['admin']), userController.deleteUser);

// Worker route for searching users
router.get('/search', auth(['worker']), userController.searchUsers);

module.exports = router;
