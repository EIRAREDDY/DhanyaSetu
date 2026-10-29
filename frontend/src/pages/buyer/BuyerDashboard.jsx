import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, ShoppingBag, Store, User } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageSpinner } from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const NAV = [
  { to: '/buyer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/buyer/orders',    icon: ShoppingBag,     label: 'My Orders' },
  { to: '/marketplace',     icon: Store,           label: 'Marketplace' },
  { to: '/profile',         icon: User,            label: 'Profile' },
]

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/buyer/dashboard'),
      api.get('/orders?role=BUYER&size=5')
    ]).then(([s, o]) => {
      setStats(s.data)
      setRecentOrders(o.data.content || o.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout navItems={NAV} title="Dashboard"><PageSpinner /></DashboardLayout>

  return (
    <DashboardLayout navItems={NAV} title="Buyer Dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Welcome back, {user?.fullName?.split(' ')[0]}!</h2>
        <p className="text-gray-500 text-sm">{user?.district}, {user?.state}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Orders', value: stats?.totalOrders ?? 0, color: 'text-blue-600' },
          { label: 'Pending', value: stats?.pendingOrders ?? 0, color: 'text-yellow-600' },
          { label: 'Active Deliveries', value: stats?.activeDeliveries ?? 0, color: 'text-orange-600' },
          { label: 'Completed', value: stats?.completedOrders ?? 0, color: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">Monthly Spending (₹)</h3>
          {stats?.monthlySpending?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.monthlySpending}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `₹${v}`} />
                <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-8">No spending data yet.</p>}
        </div>
        <div className="card flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
            <p className="text-sm text-gray-500 mb-4">Browse fresh produce from farmers across India.</p>
          </div>
          <Link to="/marketplace" className="btn-primary text-sm text-center">Browse Marketplace</Link>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Recent Orders</h3>
          <Link to="/buyer/orders" className="text-sm text-green-700 hover:underline">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">No orders yet. <Link to="/marketplace" className="text-green-700 hover:underline">Browse marketplace</Link></p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-2 font-medium">Order Ref</th>
                <th className="pb-2 font-medium">Crop</th>
                <th className="pb-2 font-medium">Amount</th>
                <th className="pb-2 font-medium">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map(o => (
                  <tr key={o.id}>
                    <td className="py-2 font-mono text-xs">{o.orderRef}</td>
                    <td className="py-2">{o.cropName}</td>
                    <td className="py-2 font-medium">₹{o.totalAmount}</td>
                    <td className="py-2"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
