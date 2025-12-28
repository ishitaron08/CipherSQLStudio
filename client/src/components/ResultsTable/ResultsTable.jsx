import './ResultsTable.scss'

function ResultsTable({ results, error, executing }) {
  if (executing) {
    return (
      <div className="results-table__loading">
        <div className="spinner"></div>
        <span>Executing query...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="results-table__error">
        <div className="results-table__error-icon">✕</div>
        <div className="results-table__error-content">
          <h4>Query Error</h4>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="results-table__empty">
        <div className="results-table__empty-icon">📊</div>
        <p>Run a query to see results</p>
        <span className="results-table__empty-hint">Press Ctrl+Enter to execute</span>
      </div>
    )
  }

  if (results.rows.length === 0) {
    return (
      <div className="results-table__empty">
        <div className="results-table__empty-icon">📭</div>
        <p>Query returned no results</p>
      </div>
    )
  }

  return (
    <div className="results-table">
      <div className="results-table__wrapper">
        <table className="results-table__table">
          <thead>
            <tr>
              <th className="results-table__row-num">#</th>
              {results.columns.map((col, idx) => (
                <th key={idx}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.rows.map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td className="results-table__row-num">{rowIdx + 1}</td>
                {results.columns.map((col, colIdx) => (
                  <td key={colIdx}>
                    {row[col] === null ? (
                      <span className="results-table__null">NULL</span>
                    ) : (
                      String(row[col])
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {results.truncated && (
        <div className="results-table__truncated">
          Results truncated to 1000 rows
        </div>
      )}
    </div>
  )
}

export default ResultsTable
