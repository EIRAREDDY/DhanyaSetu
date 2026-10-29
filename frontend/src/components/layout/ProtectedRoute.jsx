import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ROLE_HOME = {
  FARMER: '/farmer/dashboard',
  BUYER: '/buyer/dashboard',
  TRANSPORTER: '/transporter/dashboard',
  ADMIN: '/admin/dashboard',
}

export function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles && !roles.includes(user.role)) {
    return <Navigate to={ROLE_HOME[user.role] || '/'} replace />
  }
  return children
}

export function GuestRoute({ children }) {
  const { user } = useAuth()
  if (user) return <Navigate to={ROLE_HOME[user.role] || '/'} replace />
  return children
}
