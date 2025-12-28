const express = require('express');
const router = express.Router();
const { getHint } = require('../controllers/hint.controller');

// Rate limit hints more strictly
const rateLimit = require('express-rate-limit');

const hintLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 hints per minute
  message: { success: false, error: 'Too many hint requests. Please wait a minute.' }
});

// POST /api/hints - Get a hint for the current query
router.post('/', hintLimiter, getHint);

module.exports = router;
