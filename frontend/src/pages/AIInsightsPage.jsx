import { useState, useEffect } from 'react'
import PublicLayout from '../components/layout/PublicLayout'
import Alert from '../components/ui/Alert'
import { Spinner } from '../components/ui/Spinner'
import { Brain, TrendingUp, Info } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import api from '../lib/api'

const CROPS = ['Wheat', 'Rice', 'Tomato', 'Onion', 'Potato', 'Maize', 'Soybean', 'Cotton']
const HORIZONS = [{ value: 1, label: '1 Month' }, { value: 3, label: '3 Months' }, { value: 6, label: '6 Months' }]

export default function AIInsightsPage() {
  const [crop, setCrop] = useState('Wheat')
  const [horizon, setHorizon] = useState(3)
  const [result, setResult] = useState(null)
  const [modelInfo, setModelInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/ai/model-info').then(r => setModelInfo(r.data)).catch(() => {})
  }, [])

  const predict = async () => {
    setLoading(true); setError(''); setResult(null)
    try {
      const { data } = await api.post('/ai/predict-price', { cropName: crop, horizonMonths: horizon })
      setResult(data)
    } catch (e) {
      setError(e.response?.data?.detail || e.response?.data?.message || 'Prediction service unavailable. Ensure the AI service is running.')
    } finally { setLoading(false) }
  }

  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
            <Brain className="w-6 h-6 text-purple-700" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Crop Price Insights</h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Deep Neural Network estimates for agricultural price trends. Predictions are estimates only — not guaranteed market prices.
          </p>
        </div>

        {/* Model info */}
        {modelInfo && (
          <div className="card mb-6 flex flex-wrap gap-4 text-sm">
            <div><span className="text-gray-400">Model:</span> <span className="font-medium">{modelInfo.modelVersion || 'v1.0'}</span></div>
            <div><span className="text-gray-400">Status:</span> <span className={`font-medium ${modelInfo.modelLoaded ? 'text-green-600' : 'text-red-500'}`}>{modelInfo.modelLoaded ? 'Loaded' : 'Not Loaded'}</span></div>
            {modelInfo.mae && <div><span className="text-gray-400">MAE:</span> <span className="font-medium">₹{modelInfo.mae}</span></div>}
            {modelInfo.rmse && <div><span className="text-gray-400">RMSE:</span> <span className="font-medium">₹{modelInfo.rmse}</span></div>}
            {modelInfo.trainingSamples && <div><span className="text-gray-400">Training samples:</span> <span className="font-medium">{modelInfo.trainingSamples}</span></div>}
          </div>
        )}

        {/* Input form */}
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Get Price Prediction</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Crop</label>
              <select className="input" value={crop} onChange={e => setCrop(e.target.value)}>
                {CROPS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Prediction Horizon</label>
              <select className="input" value={horizon} onChange={e => setHorizon(Number(e.target.value))}>
                {HORIZONS.map(h => <option key={h.value} value={h.value}>{h.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={predict} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? <><Spinner size="sm" /> Predicting…</> : <><TrendingUp className="w-4 h-4" /> Predict Price</>}
              </button>
            </div>
          </div>
          {error && <Alert type="error" message={error} />}
        </div>

        {/* Result */}
        {result && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-xs text-gray-400 mb-1">Current Price</p>
                <p className="text-2xl font-bold text-gray-900">₹{result.currentPrice ?? 'N/A'}</p>
                <p className="text-xs text-gray-400">per {result.unit || 'quintal'}</p>
              </div>
              <div className="card text-center border-2 border-green-200">
                <p className="text-xs text-gray-400 mb-1">Predicted Price ({horizon}M)</p>
                <p className="text-2xl font-bold text-green-700">₹{result.predictedPrice}</p>
                <p className="text-xs text-gray-400">per {result.unit || 'quintal'}</p>
              </div>
              <div className="card text-center">
                <p className="text-xs text-gray-400 mb-1">Trend</p>
                <p className={`text-2xl font-bold ${result.trend === 'UP' ? 'text-green-600' : result.trend === 'DOWN' ? 'text-red-500' : 'text-gray-600'}`}>
                  {result.trend === 'UP' ? '↑ Rising' : result.trend === 'DOWN' ? '↓ Falling' : '→ Stable'}
                </p>
              </div>
            </div>

            {result.historicalData?.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4">Historical Price Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={result.historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => `₹${v}`} />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} name="Price (₹)" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>Predictions are generated by a Deep Neural Network trained on historical agricultural market data. These are estimates only and should not be used as the sole basis for financial decisions. Actual market prices may vary significantly.</p>
            </div>
          </div>
        )}

        {/* Explanation */}
        <div className="card mt-8">
          <h2 className="font-semibold text-gray-900 mb-3">How the Model Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div><strong className="text-gray-900 block mb-1">Input Features</strong>Crop type, month/season, historical prices, recent price changes, available quantity, demand indicators.</div>
            <div><strong className="text-gray-900 block mb-1">Model Architecture</strong>Keras Sequential DNN with Dense layers, ReLU activations, Dropout regularization, and a linear regression output.</div>
            <div><strong className="text-gray-900 block mb-1">Training</strong>Trained on historical APMC market data. Evaluated using MAE and RMSE. Artifacts saved for inference.</div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
