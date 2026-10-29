import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react'

const VARIANTS = {
  success: { icon: CheckCircle, cls: 'bg-green-50 border-green-200 text-green-800' },
  error:   { icon: XCircle,     cls: 'bg-red-50 border-red-200 text-red-800' },
  warning: { icon: AlertCircle, cls: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  info:    { icon: Info,        cls: 'bg-blue-50 border-blue-200 text-blue-800' },
}

export default function Alert({ type = 'info', message, onClose }) {
  if (!message) return null
  const { icon: Icon, cls } = VARIANTS[type] || VARIANTS.info
  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${cls}`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="flex-shrink-0 opacity-60 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
