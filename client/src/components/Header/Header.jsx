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
            <svg className="header__logo-icon" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#171717"/>
              <path d="M10 14C10 12.8954 10.8954 12 12 12H28C29.1046 12 30 12.8954 30 14V26C30 27.1046 29.1046 28 28 28H12C10.8954 28 10 27.1046 10 26V14Z" stroke="#00d4ff" strokeWidth="1.5"/>
              <path d="M10 18H30" stroke="#00d4ff" strokeWidth="1.5"/>
              <circle cx="14" cy="15" r="1" fill="#00d4ff"/>
              <circle cx="18" cy="15" r="1" fill="#00d4ff"/>
              <path d="M14 22L16 24L20 20" stroke="#00d4ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="header__logo-text">CipherSQL</span>
          </Link>

          <nav className="header__nav">
            {user ? (
              <div className="header__user">
                <span className="header__username">{user.name}</span>
                <button className="header__logout-btn" onClick={logout}>
                  Log out
                </button>
              </div>
            ) : (
              <button className="header__login-btn" onClick={() => setShowAuth(true)}>
                Sign in
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
