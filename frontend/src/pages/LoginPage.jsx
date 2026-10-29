import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicLayout from '../components/layout/PublicLayout'
import Alert from '../components/ui/Alert'
import { Sprout } from 'lucide-react'

const ROLE_ROUTES = { FARMER: '/farmer/dashboard', BUYER: '/buyer/dashboard', TRANSPORTER: '/transporter/dashboard', ADMIN: '/admin/dashboard' }

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (!email || !password) { setError('Email and password are required.'); return }
    setLoading(true); setError('')
    try {
      const user = await login(email, password)
      const from = location.state?.from?.pathname || ROLE_ROUTES[user.role] || '/'
      navigate(from, { replace: true })
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-700 rounded-xl mb-4">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">Sign in to your Dhanyasetu account</p>
          </div>
          <div className="card">
            {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoFocus />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-500">
              <strong>Demo accounts (after seeding):</strong><br />
              farmer@demo.com / password123<br />
              buyer@demo.com / password123<br />
              admin@demo.com / password123
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account? <Link to="/register" className="text-green-700 font-medium hover:underline">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
