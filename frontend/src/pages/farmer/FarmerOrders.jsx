import { useState, useEffect } from 'react'
import { LayoutDashboard, Sprout, ShoppingBag, User, CheckCircle, XCircle } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageSpinner } from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Alert from '../../components/ui/Alert'
import api from '../../lib/api'

const NAV = [
  { to: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/farmer/crops',     icon: Sprout,          label: 'My Crops' },
  { to: '/farmer/orders',    icon: ShoppingBag,     label: 'Incoming Orders' },
  { to: '/profile',          icon: User,            label: 'Profile' },
]

export default function FarmerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [acting, setActing] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/orders?role=FARMER').then(r => setOrders(r.data.content || r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const updateStatus = async (id, status) => {
    setActing(id)
    try {
      await api.patch(`/orders/${id}/status`, { status })
      setAlert({ type: 'success', msg: `Order ${status.toLowerCase()}.` })
      load()
    } catch (e) {
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Action failed.' })
    } finally { setActing(null) }
  }

  return (
    <DashboardLayout navItems={NAV} title="Incoming Orders">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Incoming Orders</h2>
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} /></div>}
      {loading ? <PageSpinner /> : orders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-xs text-gray-400">{o.orderRef}</p>
                  <p className="font-semibold text-gray-900">{o.cropName}</p>
                  <p className="text-sm text-gray-500">Buyer: {o.buyerName}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                <div><p className="text-gray-400 text-xs">Quantity</p><p className="font-medium">{o.quantity} {o.unit}</p></div>
                <div><p className="text-gray-400 text-xs">Unit Price</p><p className="font-medium">₹{o.unitPrice}</p></div>
                <div><p className="text-gray-400 text-xs">Total</p><p className="font-bold text-green-700">₹{o.totalAmount}</p></div>
                <div><p className="text-gray-400 text-xs">Date</p><p className="font-medium">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p></div>
              </div>
              {o.deliveryAddress && <p className="text-xs text-gray-400 mb-3">Delivery: {o.deliveryAddress}</p>}
              {o.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(o.id, 'ACCEPTED')} disabled={acting === o.id}
                    className="btn-primary text-sm flex items-center gap-1 py-1.5 px-3">
                    <CheckCircle className="w-4 h-4" /> Accept
                  </button>
                  <button onClick={() => updateStatus(o.id, 'REJECTED')} disabled={acting === o.id}
                    className="btn-danger text-sm flex items-center gap-1 py-1.5 px-3">
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
