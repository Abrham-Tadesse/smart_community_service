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

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issues" element={<IssueList />} />
            <Route path="/issues/create" element={<CreateIssue />} />
            <Route path="/issues/:id" element={<IssueDetails />} />
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