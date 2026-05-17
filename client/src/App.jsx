import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import context
import { AuthProvider } from './context/AuthContext'

// Import pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import SongDetail from './pages/SongDetail'
import Contact from './pages/Contact'
import AdminPanel from './pages/AdminPanel'
import Search from './pages/Search'
import Premium from './pages/Premium'
import Wishlist from './pages/Wishlist'
import Library from './pages/Library'
import AdminApproval from './pages/AdminApproval'

// Import components
import Navigation from './components/Common/Navigation'

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')

  if (!token || !user) {
    return <Navigate to="/login" />
  }

  if (requiredRole) {
    const parsedUser = JSON.parse(user)
    if (parsedUser.role !== requiredRole) {
      return <Navigate to="/" />
    }
  }

  return children
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Navigation />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/song/:id" element={<ProtectedRoute><SongDetail /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/panel" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/approval" element={<ProtectedRoute requiredRole="admin"><AdminApproval /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
