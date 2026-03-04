const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
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

// Request OTP for Password Reset
router.post('/request-otp', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').isIn(['admin', 'worker', 'user']).withMessage('Valid role is required'),
    validate
], authController.requestOTP);

// Verify OTP and Reset Password
router.post('/verify-otp-reset', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
    body('role').isIn(['admin', 'worker', 'user']).withMessage('Valid role is required'),
    validate
], authController.verifyOTPAndResetPassword);

// Direct Password Reset (for User/Worker without OTP)
router.post('/direct-reset-password', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
    body('role').isIn(['worker', 'user']).withMessage('Valid role is required'),
    validate
], authController.directResetPassword);

// Forgot Password
router.post('/forgot-password', [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required'),
    body('role').isIn(['admin', 'worker', 'user']).withMessage('Valid role is required'),
    validate
], authController.forgotPassword);

// Verify Token
router.get('/verify', auth(['admin', 'worker', 'user']), (req, res) => {
    res.json({ 
        success: true, 
        user: {
            id: req.user.id,
            role: req.user.role
        }
    });
});

module.exports = router;
