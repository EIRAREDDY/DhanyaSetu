import { useState, useEffect } from 'react'
import { LayoutDashboard, Truck, User } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageSpinner } from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Alert from '../../components/ui/Alert'
import api from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  { to: '/transporter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/profile',               icon: User,            label: 'Profile' },
]

const TRANSITIONS = {
  ASSIGNED:  'PICKED_UP',
  PICKED_UP: 'IN_TRANSIT',
  IN_TRANSIT:'DELIVERED',
}

export default function TransporterDashboard() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [acting, setActing] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/transport/assignments').then(r => setAssignments(r.data.content || r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const advance = async (id, nextStatus) => {
    setActing(id)
    try {
      await api.patch(`/transport/assignments/${id}/status`, { status: nextStatus })
      setAlert({ type: 'success', msg: `Status updated to ${nextStatus.replace(/_/g, ' ')}.` })
      load()
    } catch (e) {
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Update failed.' })
    } finally { setActing(null) }
  }

  const stats = {
    total: assignments.length,
    pending: assignments.filter(a => a.status === 'ASSIGNED').length,
    inTransit: assignments.filter(a => a.status === 'IN_TRANSIT').length,
    done: assignments.filter(a => a.status === 'DELIVERED').length,
  }

  return (
    <DashboardLayout navItems={NAV} title="Transporter Dashboard">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">Welcome, {user?.fullName?.split(' ')[0]}!</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Assigned', value: stats.total, color: 'text-blue-600' },
          { label: 'Pending Pickup', value: stats.pending, color: 'text-yellow-600' },
          { label: 'In Transit', value: stats.inTransit, color: 'text-orange-600' },
          { label: 'Delivered', value: stats.done, color: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} /></div>}

      {loading ? <PageSpinner /> : assignments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Truck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No deliveries assigned yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-xs text-gray-400">Order: {a.orderRef}</p>
                  <p className="font-semibold text-gray-900">{a.cropName} — {a.quantity} {a.unit}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                <div><p className="text-gray-400 text-xs">Pickup</p><p className="font-medium">{a.pickupAddress}</p></div>
                <div><p className="text-gray-400 text-xs">Delivery</p><p className="font-medium">{a.deliveryAddress}</p></div>
                <div><p className="text-gray-400 text-xs">Assigned</p><p className="font-medium">{new Date(a.assignedAt).toLocaleDateString('en-IN')}</p></div>
              </div>
              {TRANSITIONS[a.status] && (
                <button onClick={() => advance(a.id, TRANSITIONS[a.status])} disabled={acting === a.id}
                  className="btn-primary text-sm flex items-center gap-2 py-1.5 px-3">
                  <Truck className="w-4 h-4" />
                  Mark as {TRANSITIONS[a.status].replace(/_/g, ' ')}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
