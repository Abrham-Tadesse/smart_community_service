import { Link } from 'react-router-dom'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <div className="flex items-center gap-2 mb-4">
              <div className="navbar-logo">SCR</div>
              <span className="font-bold">SCRPP</span>
            </div>
            <p>Smart Community Request & Prioritization Platform</p>
            <p className="mt-2 text-gray-400">Empowering communities through technology</p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/issues">Issues</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h3>Resources</h3>
            <ul className="footer-links">
              <li><Link to="/issues/create">Report Issue</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <ul className="footer-links">
              <li>Addis Ababa, Ethiopia</li>
              <li>+251 11 123 4567</li>
              <li>support@scrpp.gov.et</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {currentYear} Smart Community Platform. All rights reserved.</p>
          <p className="mt-2">A citizen-centric solution for community development</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer