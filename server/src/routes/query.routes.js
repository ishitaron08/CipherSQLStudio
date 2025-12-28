const express = require('express');
const router = express.Router();
const { 
  executeQuery, 
  getTableSchema, 
  getSampleData,
  getQueryHistory 
} = require('../controllers/query.controller');
const { optionalAuth, protect } = require('../middleware/auth.middleware');

// POST /api/query/execute - Execute SQL query
router.post('/execute', optionalAuth, executeQuery);

// GET /api/query/schema/:tableName - Get table schema
router.get('/schema/:tableName', getTableSchema);

// GET /api/query/sample/:tableName - Get sample data
router.get('/sample/:tableName', getSampleData);

// GET /api/query/history/:assignmentId - Get user's query history (requires auth)
router.get('/history/:assignmentId', protect, getQueryHistory);

module.exports = router;
