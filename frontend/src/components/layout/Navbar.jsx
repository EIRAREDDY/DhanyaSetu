import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Sprout, Bell, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/marketplace', label: 'Marketplace' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/ai-insights', label: 'AI Insights' },
  { to: '/about', label: 'About' },
]

const ROLE_DASHBOARD = {
  FARMER: '/farmer/dashboard',
  BUYER: '/buyer/dashboard',
  TRANSPORTER: '/transporter/dashboard',
  ADMIN: '/admin/dashboard',
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }
  const isActive = (to) => location.pathname === to

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-green-700 p-1.5 rounded-lg">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-green-800 text-lg">Dhanyasetu</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(l => (
              <Link key={l.to} to={l.to}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(l.to) ? 'text-green-700 bg-green-50' : 'text-gray-600 hover:text-green-700 hover:bg-gray-50'
                }`}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setDropOpen(v => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-700" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.fullName?.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                    <Link to={ROLE_DASHBOARD[user.role]} onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/notifications" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Bell className="w-4 h-4" /> Notifications
                    </Link>
                    <Link to="/profile" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <hr className="my-1" />
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2" onClick={() => setOpen(v => !v)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-1">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link to={ROLE_DASHBOARD[user.role]} onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm text-gray-700">Dashboard</Link>
              <button onClick={() => { handleLogout(); setOpen(false) }}
                className="block px-3 py-2 text-sm text-red-600 w-full text-left">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary text-sm flex-1 text-center">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm flex-1 text-center">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
