import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from '../pages/Home'
import About from '../pages/About'
import Contact from '../pages/Contact'
import Login from '../features/auth/Login'
import Register from '../features/auth/Register'
import Dashboard from '../features/dashboard/CitizenDashboard'
import IssueList from '../features/issues/IssueList'
import CreateIssue from '../features/issues/CreateIssue'
import IssueDetails from '../features/issues/IssueDetails'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import NotFound from '../pages/NotFound'
import ProfileSettings from '../features/profile/ProfileSettings'
import MyIssues from '../features/issues/MyIssues'
import AdminDashboard from '../features/dashboard/AdminDashboard'
import UserManagement from '../features/admin/UserManagement'
import IssueManagement from '../features/admin/IssueManagement'
// import Analytics from '../features/admin/Analytics'
// import SystemSettings from '../features/admin/SystemSettings'
import AdminProtectedRoute from '../components/common/AdminProtectedRoute'
import CitizenDashboard from '../features/dashboard/CitizenDashboard'
import Analytics from '../features/admin/Analytics'
import SystemSetting from '../features/admin/SystemSetting'
function AppRoutes() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/profile/settings" element={<ProfileSettings />} />
          <Route path="/my-issues" element={<MyIssues />} />
         
        
          {/* Protected routes */}
          
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={
            user?.email === 'admin@example.com' ? <AdminDashboard /> : <CitizenDashboard />
             } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issues" element={<IssueList />} />
            <Route path="/issues/create" element={<CreateIssue />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
          </Route>
   
              {/* Admin-only routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/issues" element={<IssueManagement />} />
            <Route path="/admin/analytics" element={<Analytics />} />
              <Route path="/admin/settings" element={<SystemSetting />} />
              {/* <Route path="/admin/settings" element={<SystemSettings />} /> */}
          </Route>
                  {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default AppRoutes