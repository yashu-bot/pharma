const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// GST Settings - GET is public (needed for order calculations), PUT requires admin
router.get('/gst', adminController.getGST);
router.put('/gst', auth(['admin']), [
    body('sgst_percentage').isFloat({ min: 0, max: 100 }).withMessage('Valid SGST percentage is required'),
    body('cgst_percentage').isFloat({ min: 0, max: 100 }).withMessage('Valid CGST percentage is required'),
    validate
], adminController.updateGST);

// All other routes require admin authentication
router.use(auth(['admin']));

// Profile
router.get('/profile', adminController.getProfile);
router.put('/profile', [
    body('pharma_name').notEmpty().withMessage('Pharma name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    validate
], adminController.updateProfile);

// Change Password
router.post('/change-password', [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    validate
], adminController.changePassword);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

module.exports = router;
