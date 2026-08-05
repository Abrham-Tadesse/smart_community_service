import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import logo from '../../assets/image/logo.png';
import { fetchAllNotif,readAll,readOne } from '../../features/notifications/notificationSlice';



const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false) // NEW STATE
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef(null) // NEW REF
  const { user } = useSelector((state) => state.auth);
  const {notifications,unreadCount,loading} = useSelector((state)=>state.notifications);
  const notificationRef = useRef(null);
  // const [notifications, setNotifications] = useState([])
  // const unreadCount = notifications.filter(n => !n.read).length

  const dispatch = useDispatch()
  const navigate = useNavigate()



  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setIsNotificationOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

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




  useEffect(() => {
    if (user) {
      // console.log("Dispatching fetchAllNotif");
   dispatch(fetchAllNotif());
    }
  }, [user, dispatch])

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

// console.log("Notifications:", notifications);


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
              <div 
                className="user-dropdown-btn"
                onClick={toggleDropdown} // USE onClick INSTEAD OF hover
                aria-expanded={isDropdownOpen}
              >
                {/* Notification bell for admin */}
                {user && (
                  <div className="nav-notifications" style={{ display: 'inline-block', marginRight: 12 }}>
                    <button
                      aria-label="Notifications"
                      className="notification-bell"
                      ref={notificationRef}
                      onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(false);
                        setIsNotificationOpen((prev) => !prev);
                        dispatch(fetchAllNotif()); /* toggle separate menu below if needed */}}
                    >
                      🔔
                      {unreadCount > 0 && (
                        <span className="notif-count">{unreadCount}</span>
                      )}
                    </button>
        {isNotificationOpen && (


                    <div ref={notificationRef} className="notif-dropdown" onClick={(e)=>e.stopPropagation()} style={{
    position: "absolute",
    right: 20,
    top: 60,
    width: 300,
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    zIndex: 60,
  }}>
                      <div style={{ padding: 8, borderBottom: '1px solid #eee' }}>
                        <strong>Notifications</strong>
                      </div>
                      <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                        {notifications?.length === 0 && <div style={{ padding: 12 }}>No notifications</div>}
                        {notifications?.map(n => (
                          <div key={n._id} onClick={()=>{
                            if(!n.isRead){
                              dispatch(readOne(n._id));
                            }
                          }} style={{ padding: 8, borderBottom: '1px solid #f4f4f4', background: n.isRead ? 'white' : '#f9fafb' }}>
                            <div style={{ fontSize: 13 }}>{n.message}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{new Date(n.createdAt).toLocaleString()}</div>
                            {n.issue && ( <div style={{ marginTop: 6 }}>
                              <Link to={`/issues/${n.issue}`} onClick={(e) => {
                                e.stopPropagation()
                                dispatch(readOne(n._id));
                                setIsNotificationOpen(false);

                              }}>View Issue</Link>
                            </div>)}
                           
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: 8, borderTop: '1px solid #eee', textAlign: 'right' }}>
                        <button className="btn btn-outline btn-small" onClick={async(e) => {
                          e.stopPropagation()
                          await dispatch(readAll())
                          setIsNotificationOpen(false);
                        }}>Mark all read</button>
                      </div>
                    </div>

      )}
                  </div>
                )}
                
                <div className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                {/* <span>{user.name?.split(' ')[0] || 'User'}</span> */}
                <span className={`dropdown-arrow ${isDropdownOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </div>
              
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