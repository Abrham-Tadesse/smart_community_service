import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { toast } from 'react-toastify'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]')
    setUsers(storedUsers)
  }

  const filterUsers = () => {
    let filtered = users
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      )
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }
    
    setFilteredUsers(filtered)
  }

  const handleRoleChange = async (userId, newRole) => {
    if (!confirm(`Change this user's role to ${newRole}?`)) return
    
    setLoading(true)
    
    try {
      // Update in localStorage
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, role: newRole, updatedAt: new Date().toISOString() } : user
      )
      
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
      
      toast.success('User role updated successfully')
    } catch (error) {
      toast.error('Failed to update user role')
    } finally {
      setLoading(false)
    }
  }

  const handleUserStatus = async (userId, action) => {
    if (action === 'disable' && !confirm('Disable this user account?')) return
    if (action === 'enable' && !confirm('Enable this user account?')) return
    
    setLoading(true)
    
    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { 
          ...user, 
          status: action === 'disable' ? 'disabled' : 'active',
          updatedAt: new Date().toISOString() 
        } : user
      )
      
      localStorage.setItem('users', JSON.stringify(updatedUsers))
      setUsers(updatedUsers)
      
      toast.success(`User account ${action === 'disable' ? 'disabled' : 'enabled'}`)
    } catch (error) {
      toast.error('Failed to update user status')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const roles = {
      citizen: { label: 'Citizen', color: 'badge-primary' },
      officer: { label: 'Officer', color: 'badge-info' },
      admin: { label: 'Admin', color: 'badge-success' }
    }
    
    const roleInfo = roles[role] || { label: role, color: 'badge-secondary' }
    return <span className={`badge ${roleInfo.color}`}>{roleInfo.label}</span>
  }

  const getStatusBadge = (status) => {
    if (status === 'disabled') {
      return <span className="badge badge-danger">Disabled</span>
    }
    return <span className="badge badge-success">Active</span>
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="mb-8">
          <h1 className="section-title">User Management</h1>
          <p className="section-subtitle">Manage user accounts and permissions</p>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Roles</option>
                <option value="citizen">Citizen</option>
                <option value="officer">Officer</option>
                <option value="admin">Admin</option>
              </select>
              
              <Button onClick={loadUsers} variant="outline">
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="card-header">
            <h3>Users ({filteredUsers.length})</h3>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="text-center py-8">
                <div className="loading-spinner"></div>
                <p className="mt-4 text-gray-600">Loading users...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="user-avatar">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="space-y-1">
                            {getRoleBadge(user.role)}
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className="text-sm border rounded px-2 py-1"
                              disabled={loading}
                            >
                              <option value="citizen">Citizen</option>
                              <option value="officer">Officer</option>
                              <option value="admin">Admin</option>
                            </select>
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(user.status || 'active')}
                        </td>
                        <td>
                          <div className="text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            {user.status === 'disabled' ? (
                              <Button
                                size="small"
                                onClick={() => handleUserStatus(user.id, 'enable')}
                                disabled={loading}
                              >
                                Enable
                              </Button>
                            ) : (
                              <Button
                                variant="danger"
                                size="small"
                                onClick={() => handleUserStatus(user.id, 'disable')}
                                disabled={loading}
                              >
                                Disable
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-5xl mb-4">👥</div>
                <h3 className="mb-2">No users found</h3>
                <p className="text-gray-600">
                  {searchTerm || roleFilter !== 'all' 
                    ? 'Try adjusting your search filters' 
                    : 'No users registered yet'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-blue-600">
                {users.filter(u => u.role === 'citizen').length}
              </div>
              <div className="text-gray-600">Citizens</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-green-600">
                {users.filter(u => u.role === 'officer').length}
              </div>
              <div className="text-gray-600">Officers</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
              <div className="text-gray-600">Admins</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserManagement