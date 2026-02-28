const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const authController = require('../controllers/authController');

// Admin Login
router.post('/admin/login', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], authController.adminLogin);

// Worker Login
router.post('/worker/login', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], authController.workerLogin);

// User Login
router.post('/user/login', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
], authController.userLogin);

// Forgot Password
router.post('/forgot-password', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
    body('role').isIn(['admin', 'worker', 'user']).withMessage('Valid role is required'),
    validate
], authController.forgotPassword);

module.exports = router;
