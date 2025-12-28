const prisma = require('../lib/prisma');

// Get all assignments
exports.getAllAssignments = async (req, res) => {
  try {
    const { difficulty, category } = req.query;

    const where = { isActive: true };
    if (difficulty) where.difficulty = difficulty;
    if (category) where.category = category;

    const assignments = await prisma.assignment.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        order: true
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    res.json({
      success: true,
      count: assignments.length,
      assignments
    });
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignments'
    });
  }
};

// Get single assignment with full details
exports.getAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        difficulty: true,
        category: true,
        tables: true,
        sampleData: true,
        expectedResultDescription: true,
        order: true
        // hintContext intentionally excluded
      }
    });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment'
    });
  }
};

// Get assignment with hint context (for hint service - internal use)
exports.getAssignmentWithHintContext = async (assignmentId) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId }
    });
    return assignment;
  } catch (error) {
    console.error('Get assignment with hint context error:', error);
    return null;
  }
};
