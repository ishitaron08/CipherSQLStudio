const express = require('express');
const router = express.Router();
const { getAllAssignments, getAssignment } = require('../controllers/assignment.controller');

// GET /api/assignments - Get all assignments
router.get('/', getAllAssignments);

// GET /api/assignments/:id - Get single assignment
router.get('/:id', getAssignment);

module.exports = router;
