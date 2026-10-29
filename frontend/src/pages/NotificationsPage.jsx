import { useState, useEffect } from 'react'
import { Bell, Check } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { PageSpinner } from '../components/ui/Spinner'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/notifications').then(r => setNotifications(r.data || [])).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`).catch(() => {})
    setNotifications(ns => ns.map(n => n.id === id ? { ...n, read: true } : n))
  }

  if (!user) return <PublicLayout><div className="p-8 text-center text-gray-500">Please log in to view notifications.</div></PublicLayout>

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6" /> Notifications
        </h1>
        {loading ? <PageSpinner /> : notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => (
              <div key={n.id} className={`card flex items-start gap-3 ${!n.read ? 'border-l-4 border-green-500' : ''}`}>
                <div className="flex-1">
                  <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="p-1.5 hover:bg-green-50 rounded-lg" title="Mark as read">
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
