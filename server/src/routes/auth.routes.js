const express = require('express');
const router = express.Router();
const { register, login, getMe, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/auth/register - Register new user
router.post('/register', register);

// POST /api/auth/login - Login user
router.post('/login', login);

// GET /api/auth/me - Get current user (protected)
router.get('/me', protect, getMe);

// PUT /api/auth/password - Change password (protected)
router.put('/password', protect, changePassword);

module.exports = router;
