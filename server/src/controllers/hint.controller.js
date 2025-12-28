const hintService = require('../services/hint.service');
const { getAssignmentWithHintContext } = require('./assignment.controller');

// Generate hint for user's query
exports.getHint = async (req, res) => {
  try {
    const { assignmentId, userQuery, errorMessage } = req.body;

    if (!assignmentId) {
      return res.status(400).json({
        success: false,
        error: 'Assignment ID is required'
      });
    }

    // Get assignment details including hint context
    const assignment = await getAssignmentWithHintContext(assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    // Generate hint using LLM
    const result = await hintService.generateHint({
      question: assignment.description,
      userQuery: userQuery || '',
      errorMessage: errorMessage || '',
      tables: assignment.tables || [],
      hintContext: assignment.hintContext || ''
    });

    res.json(result);
  } catch (error) {
    console.error('Get hint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hint'
    });
  }
};
