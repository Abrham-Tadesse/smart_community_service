import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchIssues } from './issueSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { getPriorityLabel } from '../../utils/priorityCalculator'

const IssueList = () => {
  const dispatch = useDispatch()
  const { issues, loading } = useSelector((state) => state.issues)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredIssues, setFilteredIssues] = useState([])

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  useEffect(() => {
    // Filter issues based on search term
    const filtered = issues.filter(issue => {
      if (!issue) return false
      
      const matchesSearch = !searchTerm || 
        (issue.title && issue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.description && issue.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      return matchesSearch
    })
    
    setFilteredIssues(filtered)
  }, [issues, searchTerm])

  const getStatusColor = (status) => {
    switch(status) {
      case 'resolved': return 'badge-success'
      case 'in_progress': return 'badge-info'
      case 'verified': return 'badge-primary'
      case 'submitted': return 'badge-warning'
      default: return 'badge-warning'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  // Function to refresh issues
  const refreshIssues = () => {
    dispatch(fetchIssues())
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="issues-header">
          <div>
            <h1 className="issues-title">Community Issues</h1>
            <p className="issues-subtitle">
              View and track reported community issues
              <button 
                onClick={refreshIssues}
                className="ml-4 btn btn-secondary btn-small"
              >
                Refresh
              </button>
            </p>
          </div>
          <Link to="/issues/create">
            <Button>Report New Issue</Button>
          </Link>
        </div>

        {/* Debug info - remove in production */}
        <div className="alert alert-info mb-4">
          <p>Total issues in storage: {issues.length}</p>
          <p>Filtered issues: {filteredIssues.length}</p>
          <button 
            onClick={() => console.log('All issues:', issues)}
            className="btn btn-outline btn-small mt-2"
          >
            Debug: Log Issues
          </button>
        </div>

        {/* Filters and Search */}
        <div className="issues-filters">
          <div className="filter-grid">
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <select className="input-field">
              <option value="">All Categories</option>
              <option value="water">Water Supply</option>
              <option value="electricity">Electricity</option>
              <option value="roads">Roads & Transportation</option>
              <option value="sanitation">Sanitation</option>
            </select>

            <select className="input-field">
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="verified">Verified</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            <select className="input-field">
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>

        {/* Issues List */}
        <div className="issues-list">
          {loading ? (
            <div className="card-body text-center">
              <div className="loading-spinner"></div>
              <p className="mt-4 text-gray-600">Loading issues...</p>
            </div>
          ) : filteredIssues.length > 0 ? (
            filteredIssues.map((issue) => {
              const priorityInfo = getPriorityLabel(issue.priorityScore || 5)
              
              return (
                <div key={issue.id} className="issue-item">
                  <div className="issue-header">
                    <div>
                      <Link to={`/issues/${issue.id}`} className="issue-title">
                        {issue.title || 'Untitled Issue'}
                      </Link>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`badge ${getStatusColor(issue.status)}`}>
                          {issue.status ? issue.status.replace('_', ' ') : 'Submitted'}
                        </span>
                        <span className={`badge ${priorityInfo.color}`}>
                          {priorityInfo.label} Priority
                        </span>
                        <span className="text-gray-500 text-sm">
                          Score: {issue.priorityScore || 5}/10
                        </span>
                      </div>
                    </div>
                    
                    <Link to={`/issues/${issue.id}`} className="btn btn-outline">
                      View Details
                    </Link>
                  </div>
                  
                  <p className="mb-4 text-gray-600">
                    {issue.description ? 
                      (issue.description.length > 200 ? 
                        issue.description.substring(0, 200) + '...' : 
                        issue.description) 
                      : 'No description provided'}
                  </p>
                  
                  <div className="issue-meta">
                    <div className="issue-meta-item">
                      <span>📍</span>
                      {issue.location || 'Location not specified'}
                    </div>
                    <div className="issue-meta-item">
                      <span>📅</span>
                      {formatDate(issue.createdAt)}
                    </div>
                    <div className="issue-meta-item">
                      <span>👥</span>
                      {issue.affectedPeople || 1} affected
                    </div>
                    <div className="issue-meta-item">
                      <span>🏷️</span>
                      {issue.category ? issue.category.charAt(0).toUpperCase() + issue.category.slice(1) : 'Other'}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="card-body text-center">
              <div className="text-gray-400 text-5xl mb-4">📝</div>
              <h3 className="mb-2">No issues found</h3>
              <p className="mb-4 text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'No issues have been reported yet'}
              </p>
              <Link to="/issues/create" className="btn btn-primary">
                Report the first issue
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default IssueList