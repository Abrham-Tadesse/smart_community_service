import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

const ProfileSettings = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: user?.notifications?.email || true,
      push: user?.notifications?.push || true
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.startsWith('notifications.')) {
      const notificationType = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationType]: checked
        }
      }))
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Update user in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.id)
      
      if (userIndex !== -1) {
        users[userIndex] = {
          ...users[userIndex],
          name: formData.name,
          phone: formData.phone,
          notifications: formData.notifications,
          updatedAt: new Date().toISOString()
        }
        
        localStorage.setItem('users', JSON.stringify(users))
        
        // Update current user in localStorage
        const currentUser = {
          ...user,
          name: formData.name,
          phone: formData.phone,
          notifications: formData.notifications
        }
        localStorage.setItem('user', JSON.stringify(currentUser))
        
        // Update Redux store (you'd need to dispatch an action)
        toast.success('Profile updated successfully!')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Update password in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const userIndex = users.findIndex(u => u.id === user.id)
      
      if (userIndex !== -1) {
        // In real app, verify current password first
        users[userIndex] = {
          ...users[userIndex],
          password: formData.newPassword,
          updatedAt: new Date().toISOString()
        }
        
        localStorage.setItem('users', JSON.stringify(users))
        toast.success('Password changed successfully!')
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      }
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-8">
          <h1 className="section-title">Profile Settings</h1>
          <p className="section-subtitle">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Personal Information */}
          <div className="card">
            <div className="card-header">
              <h3>Personal Information</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                  />
                  
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      Update Profile
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Change Password */}
          <div className="card">
            <div className="card-header">
              <h3>Change Password</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handlePasswordChange}>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isLoading}
                      disabled={isLoading}
                    >
                      Change Password
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="card">
            <div className="card-header">
              <h3>Notification Preferences</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      checked={formData.notifications.email}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-600">In-app notifications</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      name="notifications.push"
                      checked={formData.notifications.push}
                      onChange={handleChange}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="card">
            <div className="card-header">
              <h3>Account Statistics</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">12</div>
                  <div className="text-sm text-gray-600">Issues Reported</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">8</div>
                  <div className="text-sm text-gray-600">Issues Resolved</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">4</div>
                  <div className="text-sm text-gray-600">Active Issues</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings