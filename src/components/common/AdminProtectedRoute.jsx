import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

const AdminProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth)

  // Check if user is authenticated AND is admin
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Allow access if user has role 'admin' OR their email is the configured admin email.
  const isAdminByEmail = (user.email || '').toLowerCase() === 'admin@example.com'
  if (user.role !== 'admin' && !isAdminByEmail) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default AdminProtectedRoute