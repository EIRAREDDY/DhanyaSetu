import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PublicLayout from '../components/layout/PublicLayout'
import Alert from '../components/ui/Alert'
import { Sprout } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh','Assam','Bihar','Chhattisgarh','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana',
  'Uttar Pradesh','Uttarakhand','West Bengal'
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    role: 'FARMER', state: '', district: '', villageOrCity: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const validate = () => {
    if (!form.fullName.trim()) return 'Full name is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Valid email is required.'
    if (!/^\d{10}$/.test(form.phone)) return 'Phone must be 10 digits.'
    if (form.password.length < 8) return 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) return 'Passwords do not match.'
    if (!form.state) return 'State is required.'
    if (!form.district.trim()) return 'District is required.'
    return null
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setLoading(true); setError('')
    try {
      const user = await register(form)
      const routes = { FARMER: '/farmer/dashboard', BUYER: '/buyer/dashboard', TRANSPORTER: '/transporter/dashboard', ADMIN: '/admin/dashboard' }
      navigate(routes[user.role] || '/')
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed. Please try again.')
    } finally { setLoading(false) }
  }

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-700 rounded-xl mb-4">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-1">Join Dhanyasetu today</p>
          </div>
          <div className="card">
            {error && <div className="mb-4"><Alert type="error" message={error} onClose={() => setError('')} /></div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Ramesh Kumar" />
                </div>
                <div>
                  <label className="label">Role *</label>
                  <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
                    <option value="FARMER">Farmer</option>
                    <option value="BUYER">Buyer</option>
                    <option value="TRANSPORTER">Transporter</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Email *</label>
                <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
              </div>
              <div>
                <label className="label">Phone Number *</label>
                <input className="input" type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="10-digit mobile number" maxLength={10} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Password *</label>
                  <input className="input" type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 8 characters" />
                </div>
                <div>
                  <label className="label">Confirm Password *</label>
                  <input className="input" type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repeat password" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">State *</label>
                  <select className="input" value={form.state} onChange={e => set('state', e.target.value)}>
                    <option value="">Select state</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">District *</label>
                  <input className="input" value={form.district} onChange={e => set('district', e.target.value)} placeholder="Your district" />
                </div>
              </div>
              <div>
                <label className="label">Village / City</label>
                <input className="input" value={form.villageOrCity} onChange={e => set('villageOrCity', e.target.value)} placeholder="Village or city name" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-4">
              Already have an account? <Link to="/login" className="text-green-700 font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
