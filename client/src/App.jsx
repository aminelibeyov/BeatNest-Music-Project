import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Import context
import { AuthProvider } from './context/AuthContext'

// Import pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import SongDetail from './pages/SongDetail'
import Contact from './pages/Contact'
import AdminPanel from './pages/AdminPanel'
import Search from './pages/Search'
import Premium from './pages/Premium'
import Wishlist from './pages/Wishlist'
import Library from './pages/Library'
import AdminApproval from './pages/AdminApproval'
import AdminArtists from './pages/AdminArtists'
import AdminArtistDetail from './pages/AdminArtistDetail'
import SongUpload from './pages/SongUpload'
import ArtistSongs from './pages/ArtistSongs'
import AdminLayout from './layouts/AdminLayout'

// Import components
import Navigation from './components/Common/Navigation'
import Footer from './components/Common/Footer'
import PageLoader from './components/Common/PageLoader'

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

function AppRoutes() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdminRoute && <Navigation />}
      <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/song/:id" element={<ProtectedRoute><SongDetail /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminPanel />} />
            <Route path="approval" element={<AdminApproval />} />
            <Route path="artists" element={<AdminArtists />} />
            <Route path="artists/:artistId" element={<AdminArtistDetail />} />
          </Route>
          <Route path="/admin/panel" element={<Navigate to="/admin" replace />} />

          {/* Artist Routes */}
          <Route path="/artist/upload" element={<ProtectedRoute requiredRole="artist"><SongUpload /></ProtectedRoute>} />
          <Route path="/artist/songs" element={<ProtectedRoute requiredRole="artist"><ArtistSongs /></ProtectedRoute>} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <PageLoader />
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
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}

export default App
