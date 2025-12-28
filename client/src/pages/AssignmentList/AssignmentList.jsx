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
      <div className="assignment-list__header">
        <h1 className="assignment-list__title">SQL Assignments</h1>
        <p className="assignment-list__subtitle">
          Practice SQL queries with interactive exercises
        </p>
      </div>

      <div className="assignment-list__filters">
        <select 
          className="input assignment-list__select"
          value={filter.difficulty}
          onChange={(e) => setFilter(f => ({ ...f, difficulty: e.target.value }))}
        >
          <option value="">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
          className="input assignment-list__select"
          value={filter.category}
          onChange={(e) => setFilter(f => ({ ...f, category: e.target.value }))}
        >
          <option value="">All Categories</option>
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
          <span>Loading assignments...</span>
        </div>
      )}

      {error && (
        <div className="message message--error">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="assignment-list__grid">
          {assignments.length === 0 ? (
            <p className="assignment-list__empty">No assignments found</p>
          ) : (
            assignments.map((assignment) => (
              <Link 
                key={assignment.id} 
                to={`/assignment/${assignment.id}`}
                className="assignment-card"
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
                  <span className="assignment-card__cta">Start →</span>
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
