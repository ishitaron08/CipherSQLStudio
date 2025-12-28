import { useState } from 'react'
import './SchemaViewer.scss'

function SchemaViewer({ tables, sampleData }) {
  const [expandedTables, setExpandedTables] = useState(
    tables ? tables.map(t => t.name) : []
  )

  const toggleTable = (tableName) => {
    setExpandedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    )
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="schema-viewer__empty">
        No table information available
      </div>
    )
  }

  return (
    <div className="schema-viewer">
      {tables.map((table) => (
        <div key={table.name} className="schema-table">
          <button 
            className="schema-table__header"
            onClick={() => toggleTable(table.name)}
            aria-expanded={expandedTables.includes(table.name)}
          >
            <span className="schema-table__icon">
              {expandedTables.includes(table.name) ? '▼' : '▶'}
            </span>
            <span className="schema-table__name">{table.name}</span>
            <span className="schema-table__count">
              {table.columns?.length || 0} columns
            </span>
          </button>

          {expandedTables.includes(table.name) && (
            <div className="schema-table__content">
              {/* Column Schema */}
              <div className="schema-table__columns">
                <h4 className="schema-table__subtitle">Columns</h4>
                <table className="schema-columns">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Constraints</th>
                    </tr>
                  </thead>
                  <tbody>
                    {table.columns?.map((col) => (
                      <tr key={col.name}>
                        <td className="schema-columns__name">{col.name}</td>
                        <td className="schema-columns__type">{col.type}</td>
                        <td className="schema-columns__constraints">
                          {col.constraints || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sample Data */}
              {sampleData && sampleData[table.name] && (
                <div className="schema-table__sample">
                  <h4 className="schema-table__subtitle">Sample Data</h4>
                  <div className="schema-table__sample-wrapper">
                    <table className="sample-data">
                      <thead>
                        <tr>
                          {Object.keys(sampleData[table.name][0] || {}).map(key => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sampleData[table.name].slice(0, 5).map((row, idx) => (
                          <tr key={idx}>
                            {Object.values(row).map((val, vidx) => (
                              <td key={vidx}>
                                {val === null ? <span className="null-value">NULL</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default SchemaViewer
