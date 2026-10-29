import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Sprout, ShoppingBag, User, Plus, Edit2, Trash2, Eye } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { PageSpinner } from '../../components/ui/Spinner'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import Alert from '../../components/ui/Alert'
import api from '../../lib/api'

const NAV = [
  { to: '/farmer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/farmer/crops',     icon: Sprout,          label: 'My Crops' },
  { to: '/farmer/orders',    icon: ShoppingBag,     label: 'Incoming Orders' },
  { to: '/profile',          icon: User,            label: 'Profile' },
]

const CATEGORIES = ['Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Oilseeds', 'Spices', 'Others']
const UNITS = ['kg', 'quintal', 'tonne', 'dozen', 'piece']
const GRADES = ['A', 'B', 'C', 'Premium', 'Standard']

const EMPTY_FORM = {
  cropName: '', category: 'Cereals', quantity: '', unit: 'kg',
  qualityGrade: 'A', pricePerUnit: '', harvestDate: '',
  state: '', district: '', villageOrCity: '', description: ''
}

export default function FarmerCrops() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [alert, setAlert] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/crops/my').then(r => setCrops(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const openAdd = () => { setForm(EMPTY_FORM); setModal('add') }
  const openEdit = c => { setForm({ ...c, harvestDate: c.harvestDate?.split('T')[0] || '' }); setSelected(c); setModal('edit') }
  const openDelete = c => { setSelected(c); setModal('delete') }

  const save = async () => {
    setSaving(true)
    try {
      if (modal === 'add') await api.post('/crops', form)
      else await api.put(`/crops/${selected.id}`, form)
      setAlert({ type: 'success', msg: `Crop ${modal === 'add' ? 'added' : 'updated'} successfully.` })
      setModal(null); load()
    } catch (e) {
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Failed to save crop.' })
    } finally { setSaving(false) }
  }

  const deleteCrop = async () => {
    setSaving(true)
    try {
      await api.delete(`/crops/${selected.id}`)
      setAlert({ type: 'success', msg: 'Crop deleted.' })
      setModal(null); load()
    } catch (e) {
      setAlert({ type: 'error', msg: e.response?.data?.message || 'Failed to delete.' })
    } finally { setSaving(false) }
  }

  return (
    <DashboardLayout navItems={NAV} title="My Crops">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Crop Listings</h2>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Crop
        </button>
      </div>

      {alert && <div className="mb-4"><Alert type={alert.type} message={alert.msg} onClose={() => setAlert(null)} /></div>}

      {loading ? <PageSpinner /> : crops.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Sprout className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No crops listed yet.</p>
          <button onClick={openAdd} className="btn-primary mt-4">Add Your First Crop</button>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-400 border-b border-gray-100">
              <th className="pb-3 font-medium">Crop</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Qty</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Grade</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {crops.map(c => (
                <tr key={c.id}>
                  <td className="py-3 font-medium">{c.cropName}</td>
                  <td className="py-3 text-gray-500">{c.category}</td>
                  <td className="py-3">{c.quantity} {c.unit}</td>
                  <td className="py-3 font-medium text-green-700">₹{c.pricePerUnit}/{c.unit}</td>
                  <td className="py-3">{c.qualityGrade}</td>
                  <td className="py-3"><StatusBadge status={c.status} /></td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <Link to={`/marketplace/${c.id}`} className="p-1.5 hover:bg-gray-100 rounded-lg" title="View"><Eye className="w-4 h-4 text-gray-500" /></Link>
                      <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-blue-50 rounded-lg" title="Edit"><Edit2 className="w-4 h-4 text-blue-500" /></button>
                      <button onClick={() => openDelete(c)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Add Crop Listing' : 'Edit Crop'} onClose={() => setModal(null)} size="lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Crop Name *</label><input className="input" value={form.cropName} onChange={e => set('cropName', e.target.value)} /></div>
            <div><label className="label">Category *</label>
              <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="label">Quantity *</label><input className="input" type="number" value={form.quantity} onChange={e => set('quantity', e.target.value)} /></div>
            <div><label className="label">Unit *</label>
              <select className="input" value={form.unit} onChange={e => set('unit', e.target.value)}>
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div><label className="label">Quality Grade *</label>
              <select className="input" value={form.qualityGrade} onChange={e => set('qualityGrade', e.target.value)}>
                {GRADES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div><label className="label">Price per {form.unit} (₹) *</label><input className="input" type="number" value={form.pricePerUnit} onChange={e => set('pricePerUnit', e.target.value)} /></div>
            <div><label className="label">Harvest Date</label><input className="input" type="date" value={form.harvestDate} onChange={e => set('harvestDate', e.target.value)} /></div>
            <div><label className="label">State *</label><input className="input" value={form.state} onChange={e => set('state', e.target.value)} /></div>
            <div><label className="label">District *</label><input className="input" value={form.district} onChange={e => set('district', e.target.value)} /></div>
            <div><label className="label">Village / City</label><input className="input" value={form.villageOrCity} onChange={e => set('villageOrCity', e.target.value)} /></div>
          </div>
          <div className="mt-4"><label className="label">Description</label>
            <textarea className="input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={save} disabled={saving} className="btn-primary flex-1">{saving ? 'Saving…' : 'Save Crop'}</button>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {modal === 'delete' && (
        <Modal title="Delete Crop" onClose={() => setModal(null)} size="sm">
          <p className="text-gray-600 mb-5">Are you sure you want to delete <strong>{selected?.cropName}</strong>? This cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => setModal(null)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={deleteCrop} disabled={saving} className="btn-danger flex-1">{saving ? 'Deleting…' : 'Delete'}</button>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}
