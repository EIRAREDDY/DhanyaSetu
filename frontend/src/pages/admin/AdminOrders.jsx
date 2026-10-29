import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, ShoppingBag, Sprout } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageSpinner } from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import api from '../../lib/api'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',     icon: Users,           label: 'Users' },
  { to: '/admin/orders',    icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/crops',     icon: Sprout,          label: 'Crop Listings' },
]

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/orders').then(r => setOrders(r.data.content || r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout navItems={NAV} title="Order Management">
      <h2 className="text-xl font-bold text-gray-900 mb-6">All Orders</h2>
      {loading ? <PageSpinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Order Ref</th>
              <th className="pb-3 font-medium">Crop</th>
              <th className="pb-3 font-medium">Buyer</th>
              <th className="pb-3 font-medium">Farmer</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o => (
                <tr key={o.id}>
                  <td className="py-3 font-mono text-xs">{o.orderRef}</td>
                  <td className="py-3">{o.cropName}</td>
                  <td className="py-3 text-gray-500">{o.buyerName}</td>
                  <td className="py-3 text-gray-500">{o.farmerName}</td>
                  <td className="py-3 font-medium">₹{o.totalAmount}</td>
                  <td className="py-3"><StatusBadge status={o.status} /></td>
                  <td className="py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && <p className="text-center text-gray-400 py-8">No orders found.</p>}
        </div>
      )}
    </DashboardLayout>
  )
}
