import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, ShoppingBag, Sprout, Search } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageSpinner } from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Alert from '../../components/ui/Alert'
import api from '../../lib/api'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users',     icon: Users,           label: 'Users' },
  { to: '/admin/orders',    icon: ShoppingBag,     label: 'Orders' },
  { to: '/admin/crops',     icon: Sprout,          label: 'Crop Listings' },
]

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('ALL')
  const [alert, setAlert] = useState(null)
  const [acting, setActing] = useState(null)

  const load = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (role !== 'ALL') params.role = role
    api.get('/admin/users', { params }).then(r => setUsers(r.data.content || r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [search, role])

  const toggleStatus = async (u) => {
    setActing(u.id)
    try {
      await api.patch(`/admin/users/${u.id}/status`, { enabled: !u.enabled })
      setAlert({ type: 'success', msg: `User ${u.enabled ? 'disabled' : 'enabled'}.` })
      load()
    } catch (e) {
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Action failed.' })
    } finally { setActing(null) }
  }

  return (
    <DashboardLayout navItems={NAV} title="User Management">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Users</h2>
      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} /></div>}

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input sm:w-40" value={role} onChange={e => setRole(e.target.value)}>
          <option value="ALL">All Roles</option>
          <option value="FARMER">Farmers</option>
          <option value="BUYER">Buyers</option>
          <option value="TRANSPORTER">Transporters</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {loading ? <PageSpinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.id}>
                  <td className="py-3 font-medium">{u.fullName}</td>
                  <td className="py-3 text-gray-500">{u.email}</td>
                  <td className="py-3"><StatusBadge status={u.role} /></td>
                  <td className="py-3 text-gray-500">{u.district}, {u.state}</td>
                  <td className="py-3"><StatusBadge status={u.enabled ? 'ACTIVE' : 'DISABLED'} /></td>
                  <td className="py-3">
                    <button onClick={() => toggleStatus(u)} disabled={acting === u.id}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                        u.enabled ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}>
                      {acting === u.id ? '…' : u.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-400 py-8">No users found.</p>}
        </div>
      )}
    </DashboardLayout>
  )
}
