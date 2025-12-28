import { useState } from 'react'
import { authService } from '../../services/api'
import './SettingsModal.scss'

function SettingsModal({ isOpen, onClose, user }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const result = await authService.changePassword(
        formData.currentPassword,
        formData.newPassword
      )

      if (result.success) {
        setSuccess('Password changed successfully!')
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setError(result.error || 'Failed to change password')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="settings-modal__overlay" onClick={onClose}>
      <div className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <button className="settings-modal__close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <h2 className="settings-modal__title">Settings</h2>

        <div className="settings-modal__section">
          <h3 className="settings-modal__section-title">Account</h3>
          <div className="settings-modal__info">
            <div className="settings-modal__info-row">
              <span className="settings-modal__label">Name</span>
              <span className="settings-modal__value">{user?.name || 'Not set'}</span>
            </div>
            <div className="settings-modal__info-row">
              <span className="settings-modal__label">Email</span>
              <span className="settings-modal__value">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="settings-modal__section">
          <h3 className="settings-modal__section-title">Change Password</h3>

          {error && <div className="message message--error">{error}</div>}
          {success && <div className="message message--success">{success}</div>}

          <form onSubmit={handleSubmit} className="settings-modal__form">
            <div className="settings-modal__field">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="settings-modal__field">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="settings-modal__field">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="settings-modal__submit"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
