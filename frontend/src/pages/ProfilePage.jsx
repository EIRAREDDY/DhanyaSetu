import { useState } from 'react'
import { User, Lock } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import Alert from '../components/ui/Alert'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwAlert, setPwAlert] = useState(null)
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setPwForm(f => ({ ...f, [k]: v }))

  const changePassword = async e => {
    e.preventDefault()
    if (pwForm.newPassword.length < 8) { setPwAlert({ type: 'error', msg: 'New password must be at least 8 characters.' }); return }
    if (pwForm.newPassword !== pwForm.confirmPassword) { setPwAlert({ type: 'error', msg: 'Passwords do not match.' }); return }
    setSaving(true); setPwAlert(null)
    try {
      await api.patch('/users/me/password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
      setPwAlert({ type: 'success', msg: 'Password updated successfully.' })
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (e) {
      setPwAlert({ type: 'error', msg: e.response?.data?.message || 'Failed to update password.' })
    } finally { setSaving(false) }
  }

  if (!user) return (
    <PublicLayout>
      <div className="p-8 text-center text-gray-500">Please log in to view your profile.</div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6" /> My Profile
        </h1>

        {/* Profile info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-900">Account Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Full Name', value: user.fullName },
              { label: 'Email', value: user.email },
              { label: 'Phone', value: user.phone },
              { label: 'Role', value: user.role },
              { label: 'State', value: user.state },
              { label: 'District', value: user.district },
              { label: 'Village / City', value: user.villageOrCity || '—' },
            ].map(f => (
              <div key={f.label}>
                <p className="text-gray-400 text-xs mb-0.5">{f.label}</p>
                <p className="font-medium text-gray-900">{f.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Change password */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" /> Change Password
          </h2>
          {pwAlert && <div className="mb-4"><Alert type={pwAlert.type} message={pwAlert.msg} onClose={() => setPwAlert(null)} /></div>}
          <form onSubmit={changePassword} className="space-y-4">
            <div>
              <label className="label">Current Password</label>
              <input className="input" type="password" value={pwForm.currentPassword} onChange={e => set('currentPassword', e.target.value)} />
            </div>
            <div>
              <label className="label">New Password</label>
              <input className="input" type="password" value={pwForm.newPassword} onChange={e => set('newPassword', e.target.value)} placeholder="Min 8 characters" />
            </div>
            <div>
              <label className="label">Confirm New Password</label>
              <input className="input" type="password" value={pwForm.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </PublicLayout>
  )
}
