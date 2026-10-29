import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, GuestRoute } from './components/layout/ProtectedRoute'

import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import HowItWorksPage from './pages/HowItWorksPage'
import MarketplacePage from './pages/MarketplacePage'
import CropDetailPage from './pages/CropDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AIInsightsPage from './pages/AIInsightsPage'
import NotificationsPage from './pages/NotificationsPage'
import NotFoundPage from './pages/NotFoundPage'

import FarmerDashboard from './pages/farmer/FarmerDashboard'
import FarmerCrops from './pages/farmer/FarmerCrops'
import FarmerOrders from './pages/farmer/FarmerOrders'

import BuyerDashboard from './pages/buyer/BuyerDashboard'
import BuyerOrders from './pages/buyer/BuyerOrders'

import TransporterDashboard from './pages/transporter/TransporterDashboard'

import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCrops from './pages/admin/AdminCrops'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/marketplace/:id" element={<CropDetailPage />} />
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Guest only */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Farmer */}
          <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['FARMER']}><FarmerDashboard /></ProtectedRoute>} />
          <Route path="/farmer/crops" element={<ProtectedRoute roles={['FARMER']}><FarmerCrops /></ProtectedRoute>} />
          <Route path="/farmer/orders" element={<ProtectedRoute roles={['FARMER']}><FarmerOrders /></ProtectedRoute>} />

          {/* Buyer */}
          <Route path="/buyer/dashboard" element={<ProtectedRoute roles={['BUYER']}><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/buyer/orders" element={<ProtectedRoute roles={['BUYER']}><BuyerOrders /></ProtectedRoute>} />

          {/* Transporter */}
          <Route path="/transporter/dashboard" element={<ProtectedRoute roles={['TRANSPORTER']}><TransporterDashboard /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['ADMIN']}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/crops" element={<ProtectedRoute roles={['ADMIN']}><AdminCrops /></ProtectedRoute>} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
