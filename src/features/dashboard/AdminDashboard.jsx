import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { accessingAllUsers, adminDashboard,accessingAllIssues } from '../admin/adminSlice'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const {dashboard,issues,loading} = useSelector((state) => state.admin);
  
  
  useEffect(() => {
    dispatch(adminDashboard());
    dispatch(accessingAllIssues());
  }, [dispatch])
  
  // Quick actions for admin
  const quickActions = [
    { title: 'Manage Users', icon: '👥', link: '/admin/users', color: 'bg-blue-500' },
    { title: 'View All Issues', icon: '📋', link: '/admin/issues', color: 'bg-green-500' },
    { title: 'Analytics', icon: '📊', link: '/admin/analytics', color: 'bg-purple-500' },
    { title: 'System Settings', icon: '⚙️', link: '/admin/settings', color: 'bg-yellow-500' }
  ]

  // Recent activity
  const recentActivity = [
    { type: 'issue', text: 'New water issue reported in Bole', time: '10 min ago' },
    { type: 'user', text: 'New user registered: John Doe', time: '25 min ago' },
    { type: 'resolve', text: 'Street light issue resolved', time: '1 hour ago' },
    { type: 'comment', text: '5 new comments on road repair issue', time: '2 hours ago' }
  ]

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-8">
          <h1 className="section-title">Admin Dashboard</h1>
          <p className="section-subtitle">Welcome back, {user?.name || 'Admin'}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Issues</p>
                <h3 className="text-2xl font-bold text-gray-900">{dashboard.totalIssues}</h3>
              </div>
              <div className="text-3xl text-blue-500">📋</div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm items-start">
                <span>In Progress: {dashboard.inProgress}</span>

                <div className="flex flex-col items-end">
                  <span>Resolved: {dashboard.resolved}</span>
                  <span className="text-sm text-gray-500 mt-1">Response Rate: {dashboard.responseRate}%</span>
                </div>
               </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{dashboard.totalUsers}</h3>
              </div>
              <div className="text-3xl text-green-500">👥</div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-sm">
                <span>Active: {dashboard.activeUsers}</span>
                {/* <span>Response Rate: {responseRate}%</span> */}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Issues This Week</p>
                <h3 className="text-2xl font-bold text-gray-900">24</h3>
              </div>
              <div className="text-3xl text-purple-500">📈</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                <span className="text-green-600">↑ 12%</span> from last week
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">Avg. Resolution Time</p>
                <h3 className="text-2xl font-bold text-gray-900">3.2 days</h3>
              </div>
              <div className="text-3xl text-yellow-500">⏱️</div>
            </div>
            <div className="mt-4">
              <div className="text-sm text-gray-600">
                Target: <span className="text-green-600">2.5 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="dashboard-card hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                  {action.icon}
                </div>
                <h4 className="font-medium text-gray-900">{action.title}</h4>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Issues */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Issues</h3>
              <Link to="/admin/issues" className="text-primary-600 hover:text-primary-800 text-sm">
                View all →
              </Link>
            </div>
            <div className="card-body">
              {issues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="border-b border-gray-200 pb-3 mb-3 last:border-0 last:mb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <Link to={`/issues/${issue.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                        {issue.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge ${issue.status === 'resolved' ? 'badge-success' : 'badge-warning'} text-xs`}>
                          {issue.status || 'submitted'}
                        </span>
                        <span className="text-gray-500 text-sm">{issue.category}</span>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {issues.length === 0 && (
                <p className="text-gray-500 text-center py-4">No issues reported yet</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="card-body">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-gray-200 pb-3 mb-3 last:border-0 last:mb-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === 'issue' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'user' ? 'bg-green-100 text-green-600' :
                    activity.type === 'resolve' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {activity.type === 'issue' ? '📋' :
                     activity.type === 'user' ? '👤' :
                     activity.type === 'resolve' ? '✅' : '💬'}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.text}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card mt-8">
          <div className="card-header">
            <h3>Issues by Category</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['water', 'electricity', 'roads', 'sanitation'].map((category) => {
                const count = issues.filter(i => i.category === category).length
                const percentage = issues.length > 0 ? Math.round((count / issues.length) * 100) : 0
                
                return (
                  <div key={category} className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{count}</div>
                    <div className="text-sm font-medium text-gray-900 capitalize">{category}</div>
                    <div className="text-xs text-gray-500">{percentage}% of total</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard