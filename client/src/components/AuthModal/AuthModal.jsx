import { useState } from 'react'
import './AuthModal.scss'

function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [mode, setMode] = useState('login')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      let result
      if (mode === 'login') {
        result = await onLogin(formData.email, formData.password)
      } else {
        result = await onRegister(formData.name, formData.email, formData.password)
      }

      if (result.success) {
        onClose()
        setFormData({ name: '', email: '', password: '' })
      } else {
        setError(result.error || 'An error occurred')
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError(err.response?.data?.error || err.message || 'Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
  }

  return (
    <div className="auth-modal__overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        
        <h2 className="auth-modal__title">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        
        <p className="auth-modal__subtitle">
          {mode === 'login' 
            ? 'Sign in to track your progress' 
            : 'Join to save your query attempts'}
        </p>

        {error && (
          <div className="message message--error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-modal__form">
          {mode === 'register' && (
            <div className="auth-modal__field">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>
          )}

          <div className="auth-modal__field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-modal__field">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-modal__submit"
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner"></span> Please wait...</>
            ) : (
              mode === 'login' ? 'Sign in' : 'Create account'
            )}
          </button>
        </form>

        <div className="auth-modal__switch">
          {mode === 'login' ? (
            <>Don't have an account? <button onClick={switchMode}>Sign up</button></>
          ) : (
            <>Already have an account? <button onClick={switchMode}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
