import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchIssues } from './issueSlice'
import Button from '../../components/common/Button'
import { getPriorityLabel } from '../../utils/priorityCalculator'

const MyIssues = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { issues, loading } = useSelector((state) => state.issues)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])
  
  // Filter issues reported by current user
  const myIssues = issues.filter(issue => 
    issue.reportedBy?.id === user?.id
  )
  
  // Apply status filter
  const filteredIssues = myIssues.filter(issue => {
    if (filter === 'all') return true
    if (filter === 'active') return issue.status !== 'resolved'
    if (filter === 'resolved') return issue.status === 'resolved'
    return issue.status === filter
  })
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'badge-success'
      case 'in_progress': return 'badge-info'
      case 'submitted': return 'badge-warning'
      default: return 'badge-warning'
    }
  }
  
  const getStatusCount = (status) => {
    if (status === 'all') return myIssues.length
    if (status === 'active') return myIssues.filter(i => i.status !== 'resolved').length
    return myIssues.filter(i => i.status === status).length
  }
  
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  const statusTabs = [
    { id: 'all', label: 'All Issues', count: getStatusCount('all') },
    { id: 'active', label: 'Active', count: getStatusCount('active') },
    { id: 'submitted', label: 'Submitted', count: getStatusCount('submitted') },
    { id: 'in_progress', label: 'In Progress', count: getStatusCount('in_progress') },
    { id: 'resolved', label: 'Resolved', count: getStatusCount('resolved') }
  ]

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-8">
          <h1 className="section-title">My Reported Issues</h1>
          <p className="section-subtitle">Track all issues you have reported</p>
        </div>
        
        {/* Status Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {statusTabs.map(tab => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setFilter(tab.id)}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                filter === tab.id
                  ? 'bg-white text-primary-600'
                  : 'bg-gray-300 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        
        {/* Issues List */}
        <div className="issues-list">
          {loading ? (
            <div className="card-body text-center">
              <div className="loading-spinner"></div>
              <p className="mt-4 text-gray-600">Loading your issues...</p>
            </div>
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => {
              const priorityInfo = getPriorityLabel(issue.priorityScore || 5)
              
              return (
                <div key={issue.id} className="issue-item">
                  <div className="issue-header">
                    <div>
                      <Link to={`/issues/${issue.id}`} className="issue-title">
                        {issue.title}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`badge ${getStatusColor(issue.status)}`}>
                          {issue.status?.replace('_', ' ') || 'Submitted'}
                        </span>
                        <span className={`badge ${priorityInfo.color}`}>
                          {priorityInfo.label} Priority
                        </span>
                        <span className="text-gray-500 text-sm">
                          Reported: {formatDate(issue.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <Link to={`/issues/${issue.id}`} className="btn btn-outline">
                      View Details
                    </Link>
                  </div>
                  
                  <p className="mb-4 text-gray-600">
                    {issue.description?.substring(0, 200)}...
                  </p>
                  
                  <div className="issue-meta">
                    <div className="issue-meta-item">
                      <span>📍</span>
                      {issue.location || 'Location not specified'}
                    </div>
                    <div className="issue-meta-item">
                      <span>🏷️</span>
                      {issue.category ? issue.category.charAt(0).toUpperCase() + issue.category.slice(1) : 'Other'}
                    </div>
                    <div className="issue-meta-item">
                      <span>👥</span>
                      {issue.affectedPeople || 1} affected
                    </div>
                    {issue.updatedAt && (
                      <div className="issue-meta-item">
                        <span>🔄</span>
                        Last update: {formatDate(issue.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="card-body text-center">
              <div className="text-gray-400 text-5xl mb-4">
                {filter === 'resolved' ? '✅' : '📝'}
              </div>
              <h3 className="mb-2">
                {filter === 'all' ? 'No issues reported yet' :
                 filter === 'resolved' ? 'No resolved issues' :
                 `No ${filter} issues`}
              </h3>
              <p className="mb-4 text-gray-600">
                {filter === 'all' 
                  ? 'Start by reporting your first community issue' 
                  : 'Check back later for updates'}
              </p>
              {filter === 'all' && (
                <Link to="/issues/create" className="btn btn-primary">
                  Report Your First Issue
                </Link>
              )}
            </div>
          )}
        </div>
        
        {/* Stats Summary */}
        {myIssues.length > 0 && (
          <div className="card mt-8">
            <div className="card-body">
              <h3 className="mb-4">Your Reporting Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{myIssues.length}</div>
                  <div className="text-sm text-gray-600">Total Reported</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {myIssues.filter(i => i.status === 'submitted').length}
                  </div>
                  <div className="text-sm text-blue-600">Awaiting Review</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {myIssues.filter(i => i.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-yellow-600">In Progress</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {myIssues.filter(i => i.status === 'resolved').length}
                  </div>
                  <div className="text-sm text-green-600">Resolved</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyIssues