import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthModal from '../AuthModal/AuthModal'
import './Header.scss'

function Header() {
  const { user, login, register, logout } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header__container">
          <Link to="/" className="header__logo">
            <svg className="header__logo-icon" viewBox="0 0 100 100" fill="none">
              <rect width="100" height="100" rx="12" fill="#1a1a2e"/>
              <ellipse cx="50" cy="35" rx="30" ry="12" stroke="#4a9eff" strokeWidth="4" fill="none"/>
              <path d="M20 35 L20 65 Q20 77 50 77 Q80 77 80 65 L80 35" stroke="#4a9eff" strokeWidth="4" fill="none"/>
              <ellipse cx="50" cy="65" rx="30" ry="12" stroke="#4a9eff" strokeWidth="4" fill="none"/>
              <line x1="20" y1="50" x2="80" y2="50" stroke="#4a9eff" strokeWidth="4"/>
            </svg>
            <span className="header__logo-text">CipherSQLStudio</span>
          </Link>

          <nav className="header__nav">
            {user ? (
              <div className="header__user">
                <span className="header__username">{user.name}</span>
                <button className="btn--ghost" onClick={logout}>
                  Logout
                </button>
              </div>
            ) : (
              <button className="btn--secondary" onClick={() => setShowAuth(true)}>
                Login
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={login}
        onRegister={register}
      />
    </>
  )
}

export default Header
