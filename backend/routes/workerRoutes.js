const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const workerController = require('../controllers/workerController');

// All routes require admin authentication
router.use(auth(['admin']));

router.get('/', workerController.getAllWorkers);

router.post('/', [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], workerController.addWorker);

router.put('/:id', [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('phone').optional().notEmpty().withMessage('Phone cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
], workerController.updateWorker);

router.delete('/:id', workerController.deleteWorker);

module.exports = router;
