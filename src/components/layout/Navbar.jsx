import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { useCallback } from 'react'
import logo from '../../assets/image/logo.png'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // NEW STATE
  const dropdownRef = useRef(null) // NEW REF
  const { user } = useSelector((state) => state.auth)
  const [notifications, setNotifications] = useState([])
  const unreadCount = notifications.filter(n => !n.read).length
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Load notifications (admin only)
  const loadNotifications = useCallback(() => {
    try {
      const all = JSON.parse(localStorage.getItem('notifications') || '[]')
      setNotifications(all || [])
    } catch (e) {
      setNotifications([])
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'admin' || (user?.email || '').toLowerCase() === 'admin@example.com') {
      loadNotifications()
      const handler = () => loadNotifications()
      window.addEventListener('notificationsUpdated', handler)
      window.addEventListener('storage', handler)
      return () => {
        window.removeEventListener('notificationsUpdated', handler)
        window.removeEventListener('storage', handler)
      }
    }
  }, [user, loadNotifications])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
    setIsDropdownOpen(false) // Close dropdown after logout
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // Close dropdown when a link is clicked
  const handleDropdownLinkClick = () => {
    setIsDropdownOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" className="navbar-logo" />
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
            <div className="user-dropdown" ref={dropdownRef}> {/* ADD REF HERE */}
              <button 
                className="user-dropdown-btn"
                onClick={toggleDropdown} // USE onClick INSTEAD OF hover
                aria-expanded={isDropdownOpen}
              >
                {/* Notification bell for admin */}
                {(user?.role === 'admin' || (user?.email || '').toLowerCase() === 'admin@example.com') && (
                  <div className="nav-notifications" style={{ display: 'inline-block', marginRight: 12 }}>
                    <button
                      aria-label="Notifications"
                      className="notification-bell"
                      onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false); /* toggle separate menu below if needed */ loadNotifications(); const el = document.getElementById('notif-dropdown'); if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block' }}
                    >
                      🔔
                      {unreadCount > 0 && (
                        <span className="notif-count">{unreadCount}</span>
                      )}
                    </button>
                    <div id="notif-dropdown" className="notif-dropdown" onClick={(e)=>e.stopPropagation()} style={{ display: 'none', position: 'absolute', right: 20, top: 60, width: 300, background: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 60 }}>
                      <div style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                        <strong>Notifications</strong>
                      </div>
                      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {notifications.length === 0 && <div style={{ padding: 12 }}>No notifications</div>}
                        {notifications.map(n => (
                          <div key={n.id} style={{ padding: 8, borderBottom: '1px solid #f4f4f4', background: n.read ? 'white' : '#f9fafb' }}>
                            <div style={{ fontSize: 13 }}>{n.title}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
                            <div style={{ marginTop: 6 }}>
                              <Link to={`/issues/${n.issueId}`} onClick={(e) => {
                                e.stopPropagation()
                                // mark read
                                try {
                                  const all = JSON.parse(localStorage.getItem('notifications') || '[]')
                                  const next = all.map(x => x.id === n.id ? { ...x, read: true } : x)
                                  localStorage.setItem('notifications', JSON.stringify(next))
                                  window.dispatchEvent(new CustomEvent('notificationsUpdated'))
                                } catch (e) {}
                                // close notif dropdown
                                const el = document.getElementById('notif-dropdown')
                                if (el) el.style.display = 'none'
                              }}>View Issue</Link>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>
                        <button className="btn btn-outline btn-small" onClick={(e) => {
                          e.stopPropagation()
                          try {
                            const all = JSON.parse(localStorage.getItem('notifications') || '[]')
                            const next = all.map(x => ({ ...x, read: true }))
                            localStorage.setItem('notifications', JSON.stringify(next))
                            window.dispatchEvent(new CustomEvent('notificationsUpdated'))
                          } catch (e) {}
                          // close the dropdown and refresh local state
                          const el = document.getElementById('notif-dropdown')
                          if (el) el.style.display = 'none'
                          try { loadNotifications() } catch (e) {}
                        }}>Mark all read</button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* <span>{user.name?.split(' ')[0] || 'User'}</span> */}
                <span className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
              {/* Show dropdown based on state, not CSS hover */}
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link 
                    to="/dashboard" 
                    className="dropdown-item"
                    onClick={handleDropdownLinkClick}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/my-issues" 
                    className="dropdown-item"
                    onClick={handleDropdownLinkClick}
                  >
                    My Issues
                  </Link>
                  <Link 
                    to="/profile/settings" 
                    className="dropdown-item"
                    onClick={handleDropdownLinkClick}
                  >
                    Profile Settings
                  </Link>
                  <Link 
                    to="/issues/create" 
                    className="dropdown-item"
                    onClick={handleDropdownLinkClick}
                  >
                    Report Issue
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item logout"
                  >
                    Logout
                  </button>
                </div>
              )}
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
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className="mobile-menu-link" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="mobile-menu-link" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link 
            to="/issues" 
            className="mobile-menu-link" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Issues
          </Link>
          <Link 
            to="/contact" 
            className="mobile-menu-link" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </Link>
          
          {user ? (
            <>
              <div className="mobile-user-info">
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  {/* <div className="user-name">{user.name || 'User'}</div> */}
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
              
              <Link 
                to="/dashboard" 
                className="mobile-menu-link" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/my-issues" 
                className="mobile-menu-link" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Issues
              </Link>
              <Link 
                to="/profile/settings" 
                className="mobile-menu-link" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile Settings
              </Link>
              <Link 
                to="/issues/create" 
                className="mobile-menu-link" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Report Issue
              </Link>
              
              <button 
                onClick={() => { 
                  handleLogout(); 
                  setIsMobileMenuOpen(false); 
                }} 
                className="btn btn-danger btn-full"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="mobile-menu-link" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="btn btn-primary btn-full" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
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