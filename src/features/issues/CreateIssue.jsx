import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createIssue } from './issueSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { calculatePriorityScore } from '../../utils/priorityCalculator'
import { toast } from 'react-toastify'

const ISSUE_CATEGORIES = [
  { id: 'water', label: 'Water Supply' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'roads', label: 'Roads & Transportation' },
  { id: 'sanitation', label: 'Sanitation & Garbage' },
  { id: 'security', label: 'Security' },
  { id: 'health', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'other', label: 'Other' },
]

const CreateIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    severity: 'medium',
    location: '',
    affectedPeople: 1,
    durationHours: 1,
    areaImportance: 'medium',
    image: null,
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.issues)
  const { user } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: e.target.files[0],
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to report an issue')
      navigate('/login')
      return
    }

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error('Please enter a title for the issue')
      return
    }
    
    if (!formData.category) {
      toast.error('Please select a category')
      return
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description')
      return
    }
    
    if (!formData.location.trim()) {
      toast.error('Please enter a location')
      return
    }

    // Calculate priority score
    const priorityScore = calculatePriorityScore({
      severity: formData.severity,
      affectedPeople: parseInt(formData.affectedPeople),
      durationHours: parseInt(formData.durationHours),
      areaImportance: formData.areaImportance,
    })

    const issueData = {
      title: formData.title,
      category: formData.category,
      description: formData.description,
      severity: formData.severity,
      location: formData.location,
      affectedPeople: parseInt(formData.affectedPeople),
      durationHours: parseInt(formData.durationHours),
      areaImportance: formData.areaImportance,
      priorityScore,
      image: formData.image,
    }

    try {
      await dispatch(createIssue(issueData)).unwrap()
      toast.success('Issue reported successfully!')
      navigate('/issues')
    } catch (err) {
      toast.error(err || 'Failed to report issue')
    }
  }

  return (
    <div className="page-container">
      <div className="container create-issue-container">
        <div className="mb-8">
          <h1 className="section-title">Report a Community Issue</h1>
          <p className="section-subtitle">
            Help improve your community by reporting issues that need attention
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div>
              <div className="form-section">
                <h3 className="form-section-title">Issue Details</h3>
                
                <Input
                  label="Issue Title *"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of the issue"
                />

                <div className="input-group">
                  <label className="input-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {ISSUE_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="input-field"
                    placeholder="Provide detailed information about the issue..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="input-group">
                    <label className="input-label">Severity Level</label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <Input
                    label="People Affected *"
                    type="number"
                    name="affectedPeople"
                    value={formData.affectedPeople}
                    onChange={handleChange}
                    required
                    min="1"
                  />
                </div>

                <Input
                  label="Location *"
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Street, neighborhood, or landmark"
                />

                <div className="input-group">
                  <label className="input-label">Upload Photo (Optional)</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleChange}
                    accept="image/*"
                    className="input-field"
                  />
                  <p className="text-gray-500 text-sm mt-1">
                    Upload a clear photo of the issue (max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="form-section">
                <h3 className="form-section-title">Priority Factors</h3>
                
                <div className="input-group">
                  <label className="input-label">Duration (hours)</label>
                  <input
                    type="number"
                    name="durationHours"
                    value={formData.durationHours}
                    onChange={handleChange}
                    required
                    min="1"
                    className="input-field"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Area Importance</label>
                  <select
                    name="areaImportance"
                    value={formData.areaImportance}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="low">Low (Residential)</option>
                    <option value="medium">Medium (Commercial)</option>
                    <option value="high">High (Public Service)</option>
                    <option value="critical">Critical (Emergency Service)</option>
                  </select>
                </div>

                <div className="alert alert-info">
                  <h4 className="mb-2">Priority Information</h4>
                  <p className="text-sm">
                    Your issue will be automatically prioritized based on:
                    <ul className="mt-1">
                      <li>Severity level</li>
                      <li>Number of people affected</li>
                      <li>Duration of the issue</li>
                      <li>Importance of the area</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/issues')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
            >
              Submit Issue
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateIssue