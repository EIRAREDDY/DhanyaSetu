import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Users, ShoppingBag, Sprout, Settings } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageSpinner } from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import api from '../../lib/api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',     icon: Users,           label: 'Users' },
  { to: '/admin/orders',    icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/crops',     icon: Sprout,          label: 'Crop Listings' },
]

const PIE_COLORS = ['#16a34a', '#2563eb', '#ca8a04', '#dc2626']

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout navItems={NAV} title="Admin Dashboard"><PageSpinner /></DashboardLayout>

  const roleData = [
    { name: 'Farmers', value: stats?.farmers ?? 0 },
    { name: 'Buyers', value: stats?.buyers ?? 0 },
    { name: 'Transporters', value: stats?.transporters ?? 0 },
    { name: 'Admins', value: stats?.admins ?? 0 },
  ]

  return (
    <DashboardLayout navItems={NAV} title="Admin Dashboard">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Overview</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: stats?.totalUsers ?? 0, color: 'text-blue-600' },
          { label: 'Active Listings', value: stats?.activeListings ?? 0, color: 'text-green-700' },
          { label: 'Total Orders', value: stats?.totalOrders ?? 0, color: 'text-purple-600' },
          { label: 'Completed Orders', value: stats?.completedOrders ?? 0, color: 'text-orange-600' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Orders</h3>
          {stats?.monthlyOrders?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-8">No data yet.</p>}
        </div>
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">User Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={roleData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {roleData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/users" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">View, enable, or disable accounts</p>
          </div>
        </Link>
        <Link to="/admin/orders" className="card hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Manage Orders</p>
            <p className="text-sm text-gray-500">Inspect and moderate orders</p>
          </div>
        </Link>
      </div>
    </DashboardLayout>
  )
}
