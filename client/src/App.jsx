import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'

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

import Navigation from './components/Common/Navigation'
import Footer from './components/Common/Footer'
import PageLoader from './components/Common/PageLoader'

const AdminArtistRedirect = () => {
  const { artistId } = useParams()
  return <Navigate to={`/admin/artists/${artistId}`} replace />
}

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, token, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-500" />
      </div>
    )
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return children
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
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/song/:id" element={<ProtectedRoute><SongDetail /></ProtectedRoute>} />
          <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
          <Route path="/premium" element={<ProtectedRoute><Premium /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="/admin/approval" element={<ProtectedRoute requiredRole="admin"><AdminApproval /></ProtectedRoute>} />
          <Route path="/admin/artists" element={<ProtectedRoute requiredRole="admin"><AdminArtists /></ProtectedRoute>} />
          <Route path="/admin/artists/:artistId" element={<ProtectedRoute requiredRole="admin"><AdminArtistDetail /></ProtectedRoute>} />
          <Route path="/panel/admin" element={<Navigate to="/admin" replace />} />
          <Route path="/panel/admin/approval" element={<Navigate to="/admin/approval" replace />} />
          <Route path="/panel/admin/artists" element={<Navigate to="/admin/artists" replace />} />
          <Route path="/panel/admin/artists/:artistId" element={<AdminArtistRedirect />} />

          <Route path="/artist/upload" element={<ProtectedRoute requiredRole="artist"><SongUpload /></ProtectedRoute>} />
          <Route path="/artist/songs" element={<ProtectedRoute requiredRole="artist"><ArtistSongs /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </AuthProvider>
    </Router>
  )
}

export default App
