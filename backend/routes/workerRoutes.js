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

router.delete('/:id', workerController.deleteWorker);

module.exports = router;
