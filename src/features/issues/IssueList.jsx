import { Link } from 'react-router-dom'

const CitizenDashboard = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="issues-header">
          <div>
            <h1 className="issues-title">Dashboard</h1>
            <p className="issues-subtitle">Welcome to your community dashboard</p>
          </div>
          <Link to="/issues/create" className="btn btn-primary">
            Report New Issue
          </Link>
        </div>

        <div className="dashboard-grid">
          {/* Quick Actions */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Quick Actions</h3>
            <div className="space-y-4">
              <Link to="/issues/create" className="btn btn-primary btn-full">
                Report New Issue
              </Link>
              <Link to="/issues" className="btn btn-outline btn-full">
                View All Issues
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Your Reports</h3>
            <div className="space-y-4">
              <div className="stats-row">
                <span className="stat-label">Total Issues</span>
                <span className="stat-value">0</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Pending</span>
                <span className="stat-value text-warning">0</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Resolved</span>
                <span className="stat-value text-success">0</span>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Community Stats</h3>
            <div className="space-y-4">
              <div className="stats-row">
                <span className="stat-label">Active Issues</span>
                <span className="stat-value">0</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Resolved Today</span>
                <span className="stat-value text-success">0</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Response Rate</span>
                <span className="stat-value text-primary">0%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Community Issues</h3>
          </div>
          <div className="card-body text-center">
            <div className="text-gray-400 text-5xl mb-4">📝</div>
            <p className="text-gray-600 mb-2">No issues reported yet</p>
            <p className="text-gray-500 mb-4">Be the first to report a community issue!</p>
            <Link to="/issues/create" className="btn btn-primary">
              Report an Issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitizenDashboard