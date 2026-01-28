import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchIssues } from '../issues/issueSlice'

const CitizenDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { issues } = useSelector((state) => state.issues)

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  // Calculate stats
  const userIssues = issues.filter(issue => 
    issue.reportedBy?.id === user?.id
  )
  
  const totalIssues = issues.length
  const userTotalIssues = userIssues.length
  const userPendingIssues = userIssues.filter(issue => 
    issue.status === 'submitted' || issue.status === 'verified'
  ).length
  const userResolvedIssues = userIssues.filter(issue => 
    issue.status === 'resolved'
  ).length
  
  const activeIssues = issues.filter(issue => 
    issue.status !== 'resolved'
  ).length
  
  const resolvedToday = issues.filter(issue => {
    if (issue.status !== 'resolved') return false
    const today = new Date().toDateString()
    const resolvedDate = new Date(issue.updatedAt || issue.createdAt).toDateString()
    return today === resolvedDate
  }).length

  return (
    <div className="page-container">
      <div className="container">
        <div className="issues-header">
          <div>
            <h1 className="issues-title">Dashboard</h1>
            <p className="issues-subtitle">Welcome to your community dashboard, {user?.name || 'User'}</p>
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

          {/* User Stats */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Your Reports</h3>
            <div className="space-y-4">
              <div className="stats-row">
                <span className="stat-label">Total Issues</span>
                <span className="stat-value">{userTotalIssues}</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Pending</span>
                <span className="stat-value text-warning">{userPendingIssues}</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Resolved</span>
                <span className="stat-value text-success">{userResolvedIssues}</span>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="dashboard-card">
            <h3 className="dashboard-card-title">Community Stats</h3>
            <div className="space-y-4">
              <div className="stats-row">
                <span className="stat-label">Active Issues</span>
                <span className="stat-value">{activeIssues}</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Resolved Today</span>
                <span className="stat-value text-success">{resolvedToday}</span>
              </div>
              <div className="stats-row">
                <span className="stat-label">Total Reported</span>
                <span className="stat-value text-primary">{totalIssues}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Issues */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Community Issues</h3>
          </div>
          <div className="card-body">
            {issues.length > 0 ? (
              <div className="space-y-4">
                {issues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link to={`/issues/${issue.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                          {issue.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`badge ${issue.status === 'resolved' ? 'badge-success' : 'badge-warning'} text-xs`}>
                            {issue.status || 'submitted'}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {issue.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {issues.length > 5 && (
                  <div className="text-center mt-4">
                    <Link to="/issues" className="text-primary-600 hover:text-primary-800">
                      View all {issues.length} issues →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-5xl mb-4">📝</div>
                <p className="text-gray-600 mb-2">No issues reported yet</p>
                <p className="text-gray-500 mb-4">Be the first to report a community issue!</p>
                <Link to="/issues/create" className="btn btn-primary">
                  Report an Issue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CitizenDashboard