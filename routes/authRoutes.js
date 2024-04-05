const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const router = express.Router();

// Register user route
router.post('/register', [
    body('username').notEmpty(),
    body('password').isLength({ min: 6 }),
], authController.register);

// Login user route
router.post('/login', authController.login);

module.exports = router;
