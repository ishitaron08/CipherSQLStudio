import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assignmentService } from '../../services/api'
import './AssignmentList.scss'

function AssignmentList() {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState({ difficulty: '', category: '' })

  useEffect(() => {
    fetchAssignments()
  }, [filter])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (filter.difficulty) filters.difficulty = filter.difficulty
      if (filter.category) filters.category = filter.category
      
      const data = await assignmentService.getAll(filters)
      if (data.success) {
        setAssignments(data.assignments)
      } else {
        setError('Failed to load assignments')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyClass = (difficulty) => {
    const classes = {
      easy: 'badge--easy',
      medium: 'badge--medium',
      hard: 'badge--hard'
    }
    return classes[difficulty] || 'badge--easy'
  }

  return (
    <div className="assignment-list">
      <header className="assignment-list__header">
        <h1 className="assignment-list__title">SQL Challenges</h1>
        <p className="assignment-list__subtitle">
          Master SQL through hands-on practice with real-world exercises
        </p>
      </header>

      <div className="assignment-list__filters">
        <select 
          className="assignment-list__select"
          value={filter.difficulty}
          onChange={(e) => setFilter(f => ({ ...f, difficulty: e.target.value }))}
        >
          <option value="">All Levels</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className="assignment-list__select"
          value={filter.category}
          onChange={(e) => setFilter(f => ({ ...f, category: e.target.value }))}
        >
          <option value="">All Topics</option>
          <option value="SELECT">SELECT</option>
          <option value="WHERE">WHERE</option>
          <option value="JOIN">JOIN</option>
          <option value="GROUP BY">GROUP BY</option>
          <option value="AGGREGATE">AGGREGATE</option>
          <option value="SUBQUERY">SUBQUERY</option>
        </select>
      </div>

      {loading && (
        <div className="assignment-list__loading">
          <div className="spinner"></div>
          <span>Loading challenges...</span>
        </div>
      )}

      {error && (
        <div className="message message--error">
          <svg className="message__icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="assignment-list__grid">
          {assignments.length === 0 ? (
            <div className="assignment-list__empty">
              <div className="assignment-list__empty-icon">📭</div>
              <p>No challenges found</p>
            </div>
          ) : (
            assignments.map((assignment, index) => (
              <Link 
                key={assignment.id} 
                to={`/assignment/${assignment.id}`}
                className="assignment-card"
                style={{ animationDelay: `${index * 50 + 300}ms` }}
              >
                <div className="assignment-card__header">
                  <span className={getDifficultyClass(assignment.difficulty)}>
                    {assignment.difficulty}
                  </span>
                  <span className="badge--category">
                    {assignment.category}
                  </span>
                </div>
                <h2 className="assignment-card__title">{assignment.title}</h2>
                <p className="assignment-card__description">
                  {assignment.description}
                </p>
                <div className="assignment-card__footer">
                  <span className="assignment-card__cta">
                    Start challenge
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default AssignmentList
