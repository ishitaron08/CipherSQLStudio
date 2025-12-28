const prisma = require('../lib/prisma');

// Execute SQL query directly on PostgreSQL
exports.executeQuery = async (req, res) => {
  try {
    const { query, assignmentId } = req.body;
    const userId = req.user?.id;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query is required'
      });
    }

    // Validate query - only allow SELECT statements for safety
    const normalizedQuery = query.trim().toLowerCase();
    const dangerousKeywords = ['drop', 'delete', 'truncate', 'alter', 'insert', 'update', 'create', 'grant', 'revoke'];
    
    for (const keyword of dangerousKeywords) {
      if (normalizedQuery.startsWith(keyword) || normalizedQuery.includes(` ${keyword} `)) {
        return res.status(400).json({
          success: false,
          error: `${keyword.toUpperCase()} statements are not allowed. Only SELECT queries are permitted.`
        });
      }
    }

    if (!normalizedQuery.startsWith('select')) {
      return res.status(400).json({
        success: false,
        error: 'Only SELECT queries are allowed'
      });
    }

    const startTime = Date.now();

    try {
      // Execute raw SQL query
      const result = await prisma.$queryRawUnsafe(query);
      const executionTimeMs = Date.now() - startTime;

      // Get column names from first row
      const columns = result.length > 0 ? Object.keys(result[0]) : [];

      // Log the attempt if we have an assignmentId
      if (assignmentId) {
        try {
          await prisma.queryAttempt.create({
            data: {
              userId: userId || null,
              assignmentId,
              query,
              success: true,
              executionTimeMs,
              rowsReturned: result.length
            }
          });
        } catch (logError) {
          console.error('Failed to log query attempt:', logError);
        }
      }

      res.json({
        success: true,
        columns,
        rows: result,
        rowCount: result.length,
        executionTimeMs
      });
    } catch (queryError) {
      const executionTimeMs = Date.now() - startTime;

      // Log failed attempt
      if (assignmentId) {
        try {
          await prisma.queryAttempt.create({
            data: {
              userId: userId || null,
              assignmentId,
              query,
              success: false,
              errorMessage: queryError.message,
              executionTimeMs
            }
          });
        } catch (logError) {
          console.error('Failed to log query attempt:', logError);
        }
      }

      res.json({
        success: false,
        error: queryError.message,
        executionTimeMs
      });
    }
  } catch (error) {
    console.error('Execute query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute query'
    });
  }
};

// Get table schema
exports.getTableSchema = async (req, res) => {
  try {
    const { tableName } = req.params;

    if (!tableName) {
      return res.status(400).json({
        success: false,
        error: 'Table name is required'
      });
    }

    const schema = await prisma.$queryRaw`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns
      WHERE table_name = ${tableName}
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;

    res.json({
      success: true,
      tableName,
      schema
    });
  } catch (error) {
    console.error('Get table schema error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch table schema'
    });
  }
};

// Get sample data from table
exports.getSampleData = async (req, res) => {
  try {
    const { tableName } = req.params;
    const { limit = 5 } = req.query;

    if (!tableName) {
      return res.status(400).json({
        success: false,
        error: 'Table name is required'
      });
    }

    // Validate table name to prevent SQL injection
    const validTables = ['employees', 'customers', 'orders'];
    if (!validTables.includes(tableName.toLowerCase())) {
      return res.status(400).json({
        success: false,
        error: 'Invalid table name'
      });
    }

    const rows = await prisma.$queryRawUnsafe(
      `SELECT * FROM ${tableName} LIMIT ${parseInt(limit)}`
    );

    res.json({
      success: true,
      tableName,
      rows,
      rowCount: rows.length
    });
  } catch (error) {
    console.error('Get sample data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sample data'
    });
  }
};

// Get user's query history for an assignment
exports.getQueryHistory = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required to view history'
      });
    }

    const history = await prisma.queryAttempt.findMany({
      where: {
        userId,
        assignmentId
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: {
        query: true,
        success: true,
        errorMessage: true,
        executionTimeMs: true,
        createdAt: true
      }
    });

    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get query history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch query history'
    });
  }
};

// Get list of available tables
exports.getTables = async (req, res) => {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name IN ('employees', 'customers', 'orders')
      ORDER BY table_name
    `;

    res.json({
      success: true,
      tables: tables.map(t => t.table_name)
    });
  } catch (error) {
    console.error('Get tables error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tables'
    });
  }
};
