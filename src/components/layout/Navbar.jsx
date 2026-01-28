import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-logo">SCR</div>
          <span>SCRPP</span>
          <span className="navbar-subtitle">Community Platform</span>
        </Link>

        {/* Desktop menu */}
        <div className="navbar-menu">
          <Link to="/" className="navbar-link">Home</Link>
          <Link to="/about" className="navbar-link">About</Link>
          <Link to="/issues" className="navbar-link">Issues</Link>
          <Link to="/contact" className="navbar-link">Contact</Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="user-avatar">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button onClick={handleLogout} className="btn btn-outline">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/login" className="navbar-link">Sign In</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
            About
          </Link>
          <Link to="/issues" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
            Issues
          </Link>
          <Link to="/contact" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
            Contact
          </Link>
          
          {user ? (
            <>
              <div className="mobile-menu-link">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="ml-2">{user.name || 'User'}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-danger btn-full mt-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-menu-link" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-full mt-4" onClick={() => setIsMobileMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar