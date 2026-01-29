import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Analytics = () => {
  const [stats, setStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    pendingIssues: 0,
    responseRate: 0,
    totalUsers: 0
  })

  useEffect(() => {
    const issues = JSON.parse(localStorage.getItem('issues') || '[]')
    const users = JSON.parse(localStorage.getItem('users') || '[]')

    const totalIssues = issues.length
    const resolvedIssues = issues.filter(i => i.status === 'resolved').length
    const pendingIssues = issues.filter(i => i.status !== 'resolved').length
    const totalUsers = users.length

    const recentResolved = issues.filter(i => {
      if (i.status !== 'resolved') return false
      const resolvedDate = new Date(i.updatedAt || i.createdAt)
      const now = new Date()
      const diffDays = (now - resolvedDate) / (1000 * 60 * 60 * 24)
      return diffDays <= 7
    }).length

    const responseRate = totalIssues > 0 ? Math.round((recentResolved / totalIssues) * 100) : 0

    setStats({ totalIssues, resolvedIssues, pendingIssues, responseRate, totalUsers })
  }, [])

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-6">
          <h1 className="section-title">Analytics</h1>
          <p className="section-subtitle">Overview of system metrics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="dashboard-card">
            <p className="text-gray-600">Total Issues</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalIssues}</h3>
            <div className="text-sm text-gray-500 mt-2">Resolved: {stats.resolvedIssues}</div>
            <div className="text-sm text-gray-500">Response Rate: {stats.responseRate}%</div>
          </div>

          <div className="dashboard-card">
            <p className="text-gray-600">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
            <div className="text-sm text-gray-500 mt-2">Active: (placeholder)</div>
          </div>

          <div className="dashboard-card">
            <p className="text-gray-600">Pending Issues</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats.pendingIssues}</h3>
            <div className="text-sm text-gray-500 mt-2">Use filters for details</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <h3>Issue Trends</h3>
            </div>
            <div className="card-body text-gray-500">(Chart placeholder — integrate chart components here)</div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Resolution Time</h3>
            </div>
            <div className="card-body text-gray-500">(Chart placeholder)</div>
          </div>
        </div>

        <div className="mt-8">
          <Link to="/admin/dashboard" className="text-primary-600 hover:underline">← Back to dashboard</Link>
        </div>
      </div>
    </div>
  )
}

export default Analytics
