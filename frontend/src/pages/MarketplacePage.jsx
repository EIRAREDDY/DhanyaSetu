import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, X, MapPin, Calendar, Star } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import { PageSpinner } from '../components/ui/Spinner'
import StatusBadge from '../components/ui/StatusBadge'
import Pagination from '../components/ui/Pagination'
import Alert from '../components/ui/Alert'
import api from '../lib/api'

const CATEGORIES = ['All', 'Cereals', 'Pulses', 'Vegetables', 'Fruits', 'Oilseeds', 'Spices', 'Others']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function MarketplacePage() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [filters, setFilters] = useState({
    search: '', category: 'All', minPrice: '', maxPrice: '', sort: 'newest'
  })
  const [showFilters, setShowFilters] = useState(false)

  const fetchCrops = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const params = { page, size: 12 }
      if (filters.search) params.search = filters.search
      if (filters.category !== 'All') params.category = filters.category
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.sort) params.sort = filters.sort
      const { data } = await api.get('/marketplace/crops', { params })
      setCrops(data.content || data)
      setTotalPages(data.totalPages || 1)
    } catch {
      setError('Failed to load marketplace. Please try again.')
    } finally { setLoading(false) }
  }, [page, filters])

  useEffect(() => { fetchCrops() }, [fetchCrops])

  const setFilter = (k, v) => { setFilters(f => ({ ...f, [k]: v })); setPage(0) }
  const clearFilters = () => { setFilters({ search: '', category: 'All', minPrice: '', maxPrice: '', sort: 'newest' }); setPage(0) }

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Agricultural Marketplace</h1>
          <p className="text-gray-500">Discover fresh produce directly from farmers across India.</p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input pl-9" placeholder="Search crops…" value={filters.search}
              onChange={e => setFilter('search', e.target.value)} />
          </div>
          <select className="input sm:w-48" value={filters.sort} onChange={e => setFilter('sort', e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setShowFilters(v => !v)}
            className="btn-secondary flex items-center gap-2 whitespace-nowrap">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="card mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="label">Category</label>
                <select className="input" value={filters.category} onChange={e => setFilter('category', e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Min Price (₹/kg)</label>
                <input className="input" type="number" value={filters.minPrice} onChange={e => setFilter('minPrice', e.target.value)} placeholder="0" />
              </div>
              <div>
                <label className="label">Max Price (₹/kg)</label>
                <input className="input" type="number" value={filters.maxPrice} onChange={e => setFilter('maxPrice', e.target.value)} placeholder="Any" />
              </div>
              <div className="flex items-end">
                <button onClick={clearFilters} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <X className="w-4 h-4" /> Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setFilter('category', c)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filters.category === c ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}>{c}</button>
          ))}
        </div>

        {error && <Alert type="error" message={error} className="mb-4" />}

        {loading ? <PageSpinner /> : crops.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No crops found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {crops.map(crop => <CropCard key={crop.id} crop={crop} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </div>
    </PublicLayout>
  )
}

function CropCard({ crop }) {
  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col">
      <div className="h-40 bg-gradient-to-br from-green-100 to-green-50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {crop.imageUrl
          ? <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover rounded-lg" />
          : <span className="text-5xl">🌾</span>}
      </div>
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-900">{crop.cropName}</h3>
        <StatusBadge status={crop.status} />
      </div>
      <div className="text-sm text-gray-500 space-y-1 flex-1">
        <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{crop.district}, {crop.state}</div>
        {crop.harvestDate && <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Harvested: {new Date(crop.harvestDate).toLocaleDateString('en-IN')}</div>}
        <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500" />Grade: {crop.qualityGrade}</div>
        <div>Qty: {crop.quantity} {crop.unit}</div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-green-700">₹{crop.pricePerUnit}</span>
          <span className="text-xs text-gray-400">/{crop.unit}</span>
        </div>
        <Link to={`/marketplace/${crop.id}`} className="btn-primary text-xs py-1.5 px-3">View Details</Link>
      </div>
    </div>
  )
}
