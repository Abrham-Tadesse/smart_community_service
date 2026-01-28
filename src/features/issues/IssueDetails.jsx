import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchIssueById } from './issueSlice'
import Button from '../../components/common/Button'
import { getPriorityLabel } from '../../utils/priorityCalculator'

const IssueDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentIssue, loading } = useSelector((state) => state.issues)

  useEffect(() => {
    if (id) {
      dispatch(fetchIssueById(id))
    }
  }, [id, dispatch])

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
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="container text-center">
          <div className="loading-spinner"></div>
          <p className="mt-4 text-gray-600">Loading issue details...</p>
        </div>
      </div>
    )
  }

  if (!currentIssue) {
    return (
      <div className="page-container">
        <div className="container text-center">
          <h2 className="section-title mb-4">Issue Not Found</h2>
          <p className="mb-6 text-gray-600">The issue you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/issues')}>
            Back to Issues
          </Button>
        </div>
      </div>
    )
  }

  const priorityInfo = getPriorityLabel(currentIssue.priorityScore || 5)

  return (
    <div className="page-container">
      <div className="container">
        <Button
          variant="outline"
          onClick={() => navigate('/issues')}
          className="mb-6"
        >
          ← Back to Issues
        </Button>

        <div className="card">
          <div className="card-header">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="section-title">{currentIssue.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`badge ${getStatusColor(currentIssue.status)}`}>
                    {currentIssue.status?.replace('_', ' ') || 'Submitted'}
                  </span>
                  <span className={`badge ${priorityInfo.color}`}>
                    {priorityInfo.label} Priority
                  </span>
                  <span className="text-gray-500">
                    Priority Score: {currentIssue.priorityScore || 5}/10
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Reported</p>
                <p className="font-medium">
                  {formatDate(currentIssue.createdAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div>
                <h3 className="mb-4">Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700">{currentIssue.description}</p>
                </div>

                <div className="alert alert-info mt-6">
                  <h4 className="mb-2">Priority Factors</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm">Severity Level</p>
                      <p className="font-medium">{currentIssue.severity || 'Medium'}</p>
                    </div>
                    <div>
                      <p className="text-sm">People Affected</p>
                      <p className="font-medium">{currentIssue.affectedPeople || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm">Duration</p>
                      <p className="font-medium">{currentIssue.durationHours || 'N/A'} hours</p>
                    </div>
                    <div>
                      <p className="text-sm">Area Importance</p>
                      <p className="font-medium">{currentIssue.areaImportance || 'Medium'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="card">
                  <div className="card-body">
                    <h3 className="mb-4">Issue Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-medium">
                          {currentIssue.category?.charAt(0).toUpperCase() + currentIssue.category?.slice(1) || 'Other'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">{currentIssue.location || 'Not specified'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Reported By</p>
                        <p className="font-medium">{currentIssue.reportedBy?.name || 'Anonymous'}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Contact</p>
                        <p className="font-medium">{currentIssue.reportedBy?.email || 'Not available'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <Button className="btn-full">
                    Add Comment
                  </Button>
                  <Button variant="outline" className="btn-full">
                    Share Issue
                  </Button>
                  <Button variant="danger" className="btn-full">
                    Report Inappropriate
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4">Updates & Comments</h3>
              <div className="card">
                <div className="card-body text-center">
                  <div className="text-gray-400 text-5xl mb-4">💬</div>
                  <p className="text-gray-600 mb-2">No updates or comments yet</p>
                  <p className="text-gray-500">Be the first to comment on this issue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IssueDetails