import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { assignmentService, queryService, hintService } from '../../services/api'
import SchemaViewer from '../../components/SchemaViewer/SchemaViewer'
import ResultsTable from '../../components/ResultsTable/ResultsTable'
import HintPanel from '../../components/HintPanel/HintPanel'
import './AssignmentAttempt.scss'

function AssignmentAttempt() {
  const { id } = useParams()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Editor state
  const [query, setQuery] = useState('SELECT ')
  const [executing, setExecuting] = useState(false)
  const [results, setResults] = useState(null)
  const [queryError, setQueryError] = useState(null)
  
  // Hint state
  const [hint, setHint] = useState(null)
  const [hintLoading, setHintLoading] = useState(false)
  
  // Mobile panel state
  const [activePanel, setActivePanel] = useState('question')
  
  // Results panel state
  const [isResultsExpanded, setIsResultsExpanded] = useState(false)

  useEffect(() => {
    fetchAssignment()
  }, [id])

  const fetchAssignment = async () => {
    try {
      setLoading(true)
      const data = await assignmentService.getById(id)
      if (data.success) {
        setAssignment(data.assignment)
      } else {
        setError('Assignment not found')
      }
    } catch (err) {
      setError('Failed to load assignment')
    } finally {
      setLoading(false)
    }
  }

  const executeQuery = async () => {
    if (!query.trim() || executing) return
    
    try {
      setExecuting(true)
      setQueryError(null)
      setResults(null)
      
      const data = await queryService.execute(query, id)
      
      if (data.success) {
        setResults(data)
        setIsResultsExpanded(true)
      } else {
        setQueryError(data.error)
        setIsResultsExpanded(true)
      }
    } catch (err) {
      setQueryError('Failed to execute query')
      setIsResultsExpanded(true)
    } finally {
      setExecuting(false)
    }
  }

  const getHint = async () => {
    if (hintLoading) return
    
    try {
      setHintLoading(true)
      const data = await hintService.getHint(id, query, queryError)
      
      if (data.success) {
        setHint(data.hint)
      } else {
        setHint('Unable to generate hint. Please try again.')
      }
    } catch (err) {
      setHint('Failed to get hint. Please try again later.')
    } finally {
      setHintLoading(false)
    }
  }

  const handleEditorChange = (value) => {
    setQuery(value || '')
  }

  const handleKeyDown = (e) => {
    // Ctrl/Cmd + Enter to execute
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      executeQuery()
    }
  }

  if (loading) {
    return (
      <div className="assignment-attempt__loading">
        <div className="spinner"></div>
        <span>Loading challenge...</span>
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="assignment-attempt__error">
        <div className="message message--error">{error || 'Assignment not found'}</div>
        <Link to="/" className="btn--primary">Back to Challenges</Link>
      </div>
    )
  }

  return (
    <div className="assignment-attempt" onKeyDown={handleKeyDown}>
      {/* Mobile Tab Navigation */}
      <div className="assignment-attempt__tabs">
        <button 
          className={`assignment-attempt__tab ${activePanel === 'question' ? 'active' : ''}`}
          onClick={() => setActivePanel('question')}
        >
          Problem
        </button>
        <button 
          className={`assignment-attempt__tab ${activePanel === 'editor' ? 'active' : ''}`}
          onClick={() => setActivePanel('editor')}
        >
          Editor
        </button>
        <button 
          className={`assignment-attempt__tab ${activePanel === 'results' ? 'active' : ''}`}
          onClick={() => setActivePanel('results')}
        >
          Results
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="assignment-attempt__layout">
        {/* Left Column: Question & Schema */}
        <div className={`assignment-attempt__left ${activePanel === 'question' ? 'active' : ''}`}>
          {/* Question Panel */}
          <div className={`assignment-attempt__panel question-panel ${activePanel === 'question' ? 'active' : ''}`}>
            <div className="panel__header">
              <h2 className="panel__title">Challenge</h2>
              <Link to="/" className="back-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back
              </Link>
            </div>
            <div className="panel__content">
              <div className="question-panel__badges">
                <span className={`badge--${assignment.difficulty}`}>
                  {assignment.difficulty}
                </span>
                <span className="badge--category">{assignment.category}</span>
              </div>
              <h3 className="question-panel__title">{assignment.title}</h3>
              <p className="question-panel__description">{assignment.description}</p>
              
              {assignment.expectedResultDescription && (
                <div className="question-panel__expected">
                  <h4>Expected Output</h4>
                  <p>{assignment.expectedResultDescription}</p>
                </div>
              )}

              <div className="question-panel__schema">
                <h4 className="schema-title">Tables & Schema</h4>
                <SchemaViewer 
                  tables={assignment.tables} 
                  sampleData={assignment.sampleData}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editor & Results */}
        <div className={`assignment-attempt__right ${activePanel === 'editor' || activePanel === 'results' ? 'active' : ''}`}>
          {/* Editor Panel */}
          <div className={`assignment-attempt__panel editor-panel ${activePanel === 'editor' ? 'active' : ''}`}>
            <div className="panel__header">
              <h2 className="panel__title">SQL Editor</h2>
              <div className="editor-panel__actions">
                <button 
                  className="editor-panel__hint-btn"
                  onClick={getHint}
                  disabled={hintLoading}
                >
                  {hintLoading ? <span className="spinner spinner--sm"></span> : '💡'} 
                  Hint
                </button>
                <button 
                  className="editor-panel__run-btn"
                  onClick={executeQuery}
                  disabled={executing}
                >
                  {executing ? <span className="spinner spinner--sm"></span> : (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 2.5L11 7L3 11.5V2.5Z" fill="currentColor"/>
                    </svg>
                  )}
                  Run
                </button>
              </div>
            </div>
            <div className="editor-panel__editor">
              <Editor
                height="100%"
                defaultLanguage="sql"
                theme="vs-dark"
                value={query}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  tabSize: 2,
                  padding: { top: 16, bottom: 16 },
                  renderLineHighlight: 'line',
                  cursorBlinking: 'smooth',
                  smoothScrolling: true,
                }}
              />
            </div>
            <HintPanel hint={hint} loading={hintLoading} onClose={() => setHint(null)} />
          </div>

          {/* Results Panel */}
          <div className={`assignment-attempt__panel results-panel ${activePanel === 'results' ? 'active' : ''} ${isResultsExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="panel__header" onClick={() => setIsResultsExpanded(!isResultsExpanded)} style={{ cursor: 'pointer' }}>
              <div className="panel__header-left">
                <button className="results-toggle-btn">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: isResultsExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <h2 className="panel__title">Results</h2>
              </div>
              {results && (
                <span className="results-panel__meta">
                  {results.rowCount} row{results.rowCount !== 1 ? 's' : ''} 
                  {results.truncated && ' (truncated)'} 
                  • {results.executionTimeMs}ms
                </span>
              )}
            </div>
            {isResultsExpanded && (
              <div className="panel__content">
                <ResultsTable 
                  results={results} 
                  error={queryError}
                  executing={executing}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssignmentAttempt