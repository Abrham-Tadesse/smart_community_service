import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchIssues, updateIssue } from '../issues/issueSlice'
import { Link } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

const IssueManagement = () => {
  const dispatch = useDispatch()
  const { issues, loading } = useSelector((state) => state.issues)
  const [filteredIssues, setFilteredIssues] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    priority: ''
  })
  const [selectedIssues, setSelectedIssues] = useState([])
  const [bulkAction, setBulkAction] = useState('')

  useEffect(() => {
    dispatch(fetchIssues())
  }, [dispatch])

  useEffect(() => {
    filterIssues()
  }, [issues, filters])

  const filterIssues = () => {
    let filtered = [...issues]

    // Apply filters
    if (filters.search) {
      filtered = filtered.filter(issue =>
        issue.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        issue.location?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.category) {
      filtered = filtered.filter(issue => issue.category === filters.category)
    }

    if (filters.status) {
      filtered = filtered.filter(issue => issue.status === filters.status)
    }

    if (filters.priority) {
      filtered = filtered.filter(issue => {
        const score = issue.priorityScore || 5
        if (filters.priority === 'critical') return score >= 9
        if (filters.priority === 'high') return score >= 7 && score < 9
        if (filters.priority === 'medium') return score >= 5 && score < 7
        if (filters.priority === 'low') return score < 5
        return true
      })
    }

    setFilteredIssues(filtered)
  }

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSelectIssue = (issueId) => {
    const idStr = String(issueId)
    setSelectedIssues(prev =>
      prev.includes(idStr)
        ? prev.filter(id => id !== idStr)
        : [...prev, idStr]
    )
  }

  const handleSelectAll = () => {
    if (selectedIssues.length === filteredIssues.length) {
      setSelectedIssues([])
    } else {
      setSelectedIssues(filteredIssues.map(issue => String(issue.id)))
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction) {
      toast.error('Please select an action')
      return
    }

    if (selectedIssues.length === 0) {
      toast.error('Please select issues to perform action on')
      return
    }

    try {
      for (const issueId of selectedIssues) {
        await dispatch(updateIssue({
          id: issueId,
          data: { status: bulkAction }
        })).unwrap()
      }

      toast.success(`Updated ${selectedIssues.length} issue(s)`)
      setSelectedIssues([])
      setBulkAction('')
    } catch (error) {
      toast.error('Failed to perform bulk action')
    }
  }

  const getPriorityBadge = (score) => {
    if (score >= 9) return <span className="badge badge-danger">Critical</span>
    if (score >= 7) return <span className="badge badge-warning">High</span>
    if (score >= 5) return <span className="badge badge-primary">Medium</span>
    return <span className="badge badge-success">Low</span>
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'resolved': return <span className="badge badge-success">Resolved</span>
      case 'in_progress': return <span className="badge badge-info">In Progress</span>
      case 'submitted': return <span className="badge badge-warning">Submitted</span>
      default: return <span className="badge badge-secondary">{status}</span>
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-8">
          <h1 className="section-title">Issue Management</h1>
          <p className="section-subtitle">Manage and monitor all community issues</p>
        </div>

        {/* Bulk Actions */}
        {selectedIssues.length > 0 && (
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div>
                  <span className="font-medium">{selectedIssues.length} issue(s) selected</span>
                </div>
                <div className="flex-1">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select bulk action...</option>
                    <option value="in_progress">Mark as In Progress</option>
                    <option value="submitted">Mark as Pending</option>
                    <option value="resolved">Mark as Resolved</option>
                    <option value="rejected">Reject Issues</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleBulkAction}>
                    Apply Action
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedIssues([])}>
                    Clear Selection
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Search issues..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                <option value="water">Water</option>
                <option value="electricity">Electricity</option>
                <option value="roads">Roads</option>
                <option value="sanitation">Sanitation</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="input-field"
              >
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
              
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="input-field"
              >
                <option value="">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Issues Table */}
        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-center">
              <h3>Issues ({filteredIssues.length})</h3>
              <Button onClick={handleSelectAll} variant="outline" size="small">
                {selectedIssues.length === filteredIssues.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-8">
                <div className="loading-spinner"></div>
                <p className="mt-4 text-gray-600">Loading issues...</p>
              </div>
            ) : filteredIssues.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="w-12">
                        <input
                          type="checkbox"
                          checked={selectedIssues.length === filteredIssues.length && filteredIssues.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th>Issue</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Reported</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedIssues.includes(String(issue.id))}
                            onChange={() => handleSelectIssue(issue.id)}
                          />
                        </td>
                        <td>
                          <div>
                            <Link to={`/issues/${issue.id}`} className="font-medium text-gray-900 hover:text-primary-600">
                              {issue.title}
                            </Link>
                            <div className="text-sm text-gray-500">{issue.location}</div>
                          </div>
                        </td>
                        <td>
                          <span className="capitalize">{issue.category}</span>
                        </td>
                        <td>
                          {getStatusBadge(issue.status)}
                        </td>
                        <td>
                          {getPriorityBadge(issue.priorityScore || 5)}
                        </td>
                        <td>
                          <div className="text-sm">
                            <div>{formatDate(issue.createdAt)}</div>
                            <div className="text-gray-500">by {issue.reportedBy?.name || 'Anonymous'}</div>
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <Link to={`/issues/${issue.id}`} className="btn btn-outline btn-small">
                              View
                            </Link>
                            <Link to={`/admin/issues/${issue.id}/edit`} className="btn btn-primary btn-small">
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-5xl mb-4">📋</div>
                <h3 className="mb-2">No issues found</h3>
                <p className="text-gray-600">
                  {Object.values(filters).some(f => f) 
                    ? 'Try adjusting your filters' 
                    : 'No issues reported yet'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-blue-600">{issues.length}</div>
              <div className="text-gray-600">Total Issues</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {issues.filter(i => i.status === 'submitted').length}
              </div>
              <div className="text-gray-600">Pending</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-green-600">
                {issues.filter(i => i.status === 'resolved').length}
              </div>
              <div className="text-gray-600">Resolved</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-purple-600">
                {issues.filter(i => i.status === 'in_progress').length}
              </div>
              <div className="text-gray-600">In Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueManagement