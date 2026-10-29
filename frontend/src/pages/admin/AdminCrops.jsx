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

export default function AdminCrops() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/marketplace/crops', { params: { size: 50 } })
      .then(r => setCrops(r.data.content || r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout navItems={NAV} title="Crop Listings">
      <h2 className="text-xl font-bold text-gray-900 mb-6">All Crop Listings</h2>
      {loading ? <PageSpinner /> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Crop</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Farmer</th>
              <th className="pb-3 font-medium">Qty</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {crops.map(c => (
                <tr key={c.id}>
                  <td className="py-3 font-medium">{c.cropName}</td>
                  <td className="py-3 text-gray-500">{c.category}</td>
                  <td className="py-3 text-gray-500">{c.farmerName}</td>
                  <td className="py-3">{c.quantity} {c.unit}</td>
                  <td className="py-3 font-medium text-green-700">₹{c.pricePerUnit}/{c.unit}</td>
                  <td className="py-3 text-gray-500">{c.district}, {c.state}</td>
                  <td className="py-3"><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {crops.length === 0 && <p className="text-center text-gray-400 py-8">No listings found.</p>}
        </div>
      )}
    </DashboardLayout>
  )
}
