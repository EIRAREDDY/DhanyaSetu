import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { MapPin, Calendar, Star, ArrowLeft, ShoppingCart, User } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { PageSpinner } from '../components/ui/Spinner'
import StatusBadge from '../components/ui/StatusBadge'
import Alert from '../components/ui/Alert'
import Modal from '../components/ui/Modal'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function CropDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [crop, setCrop] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [qty, setQty] = useState(1)
  const [orderModal, setOrderModal] = useState(false)
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState('')
  const [orderError, setOrderError] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')

  useEffect(() => {
    api.get(`/marketplace/crops/${id}`)
      .then(r => setCrop(r.data))
      .catch(() => setError('Crop not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const placeOrder = async () => {
    if (!deliveryAddress.trim()) { setOrderError('Delivery address is required.'); return }
    setOrderLoading(true); setOrderError('')
    try {
      await api.post('/orders', { cropListingId: crop.id, quantity: qty, deliveryAddress })
      setOrderSuccess('Order placed successfully!')
      setOrderModal(false)
      setTimeout(() => navigate('/buyer/orders'), 1500)
    } catch (e) {
      setOrderError(e.response?.data?.message || 'Failed to place order.')
    } finally { setOrderLoading(false) }
  }

  if (loading) return <PublicLayout><PageSpinner /></PublicLayout>
  if (error || !crop) return <PublicLayout><div className="p-8 text-center text-red-600">{error || 'Not found'}</div></PublicLayout>

  const total = (qty * crop.pricePerUnit).toFixed(2)

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
        {orderSuccess && <Alert type="success" message={orderSuccess} className="mb-4" />}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="h-72 lg:h-96 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center overflow-hidden">
            {crop.imageUrl
              ? <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover rounded-xl" />
              : <span className="text-8xl">🌾</span>}
          </div>
          {/* Details */}
          <div>
            <div className="flex items-start justify-between mb-3">
              <h1 className="text-3xl font-bold text-gray-900">{crop.cropName}</h1>
              <StatusBadge status={crop.status} />
            </div>
            <p className="text-gray-500 mb-4">{crop.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Category</p>
                <p className="font-medium">{crop.category}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Quality Grade</p>
                <p className="font-medium flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" />{crop.qualityGrade}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Available Qty</p>
                <p className="font-medium">{crop.quantity} {crop.unit}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Price</p>
                <p className="font-bold text-green-700 text-lg">₹{crop.pricePerUnit}/{crop.unit}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">Location</p>
                <p className="font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{crop.district}, {crop.state}</p>
              </div>
              {crop.harvestDate && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Harvest Date</p>
                  <p className="font-medium flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(crop.harvestDate).toLocaleDateString('en-IN')}</p>
                </div>
              )}
            </div>
            {crop.farmerName && (
              <div className="flex items-center gap-2 mb-5 text-sm text-gray-600">
                <User className="w-4 h-4" /> Listed by <strong>{crop.farmerName}</strong>
              </div>
            )}
            {/* Order section */}
            {crop.status === 'AVAILABLE' && (
              user?.role === 'BUYER' ? (
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <label className="label mb-0 whitespace-nowrap">Quantity ({crop.unit})</label>
                    <input type="number" min={1} max={crop.quantity} value={qty}
                      onChange={e => setQty(Math.min(crop.quantity, Math.max(1, Number(e.target.value))))}
                      className="input w-24" />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">Subtotal</span>
                    <span className="text-xl font-bold text-green-700">₹{total}</span>
                  </div>
                  <button onClick={() => setOrderModal(true)} className="btn-primary w-full flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Place Order
                  </button>
                </div>
              ) : !user ? (
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-500 text-sm mb-3">Sign in as a buyer to place an order.</p>
                  <Link to="/login" className="btn-primary">Sign In</Link>
                </div>
              ) : null
            )}
          </div>
        </div>
      </div>

      {orderModal && (
        <Modal title="Confirm Order" onClose={() => setOrderModal(false)}>
          {orderError && <Alert type="error" message={orderError} className="mb-4" />}
          <div className="space-y-3 mb-4 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Crop</span><span className="font-medium">{crop.cropName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-medium">{qty} {crop.unit}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Unit Price</span><span className="font-medium">₹{crop.pricePerUnit}</span></div>
            <div className="flex justify-between border-t pt-2"><span className="font-semibold">Total</span><span className="font-bold text-green-700 text-base">₹{total}</span></div>
          </div>
          <div className="mb-4">
            <label className="label">Delivery Address *</label>
            <textarea className="input" rows={3} value={deliveryAddress} onChange={e => setDeliveryAddress(e.target.value)} placeholder="Full delivery address" />
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-700 mb-4">
            This is a simulated payment workflow for academic demonstration. No real money is transferred.
          </div>
          <div className="flex gap-3">
            <button onClick={() => setOrderModal(false)} className="btn-secondary flex-1">Cancel</button>
            <button onClick={placeOrder} disabled={orderLoading} className="btn-primary flex-1">
              {orderLoading ? 'Placing…' : 'Confirm Order'}
            </button>
          </div>
        </Modal>
      )}
    </PublicLayout>
  )
}
