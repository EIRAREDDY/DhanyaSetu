import PublicLayout from '../components/layout/PublicLayout'
import { Sprout, Search, ShoppingCart, CheckCircle, Truck, Package, Code2, Brain, GitBranch } from 'lucide-react'

const STEPS = [
  { icon: Sprout,       title: 'Farmer Publishes Produce',   desc: 'Farmer registers, creates a profile, and adds crop listings with quantity, quality grade, price, and location.' },
  { icon: Search,       title: 'Buyer Discovers Produce',    desc: 'Buyer searches the marketplace, filters by crop, location, price, and quality, and views detailed listings.' },
  { icon: ShoppingCart, title: 'Buyer Places Order',         desc: 'Buyer selects quantity, reviews the total price, and submits an order. Inventory is reserved.' },
  { icon: CheckCircle,  title: 'Farmer Confirms',            desc: 'Farmer receives a notification, reviews the order, and accepts or rejects it.' },
  { icon: Truck,        title: 'Transporter Assigned',       desc: 'Admin or system assigns a transporter. Transporter updates status: Assigned → Picked Up → In Transit.' },
  { icon: Package,      title: 'Delivery Completed',         desc: 'Transporter marks delivery complete. Buyer confirms receipt. Order status becomes Completed.' },
]

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Dhanyasetu Works</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A transparent, end-to-end agricultural supply chain from farm to buyer.
          </p>
        </div>

        {/* Journey */}
        <div className="space-y-6 mb-16">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                {i < STEPS.length - 1 && <div className="w-0.5 h-8 bg-green-200 mt-2" />}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-green-600">STEP {String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{s.title}</h3>
                <p className="text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Academic subjects */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Subject Implementation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">SOA</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Service-Oriented Architecture</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Spring Cloud Gateway</li>
              <li>• Eureka Service Registry</li>
              <li>• User, Crop, Order, Transport, Notification services</li>
              <li>• REST-based inter-service communication</li>
              <li>• JWT authentication at gateway</li>
            </ul>
          </div>
          <div className="card border-l-4 border-purple-500">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">PDNC</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Principles of Deep Neural Computation</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Keras Sequential DNN</li>
              <li>• Historical price dataset</li>
              <li>• Feature engineering & scaling</li>
              <li>• MAE / RMSE evaluation</li>
              <li>• FastAPI inference service</li>
            </ul>
          </div>
          <div className="card border-l-4 border-orange-500">
            <div className="flex items-center gap-2 mb-3">
              <GitBranch className="w-5 h-5 text-orange-600" />
              <h3 className="font-bold text-gray-900">ASE</h3>
            </div>
            <p className="text-sm text-gray-500 mb-3">Advanced Software Engineering</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Agile epics & user stories</li>
              <li>• Git branching strategy</li>
              <li>• Docker & Docker Compose</li>
              <li>• Kubernetes manifests</li>
              <li>• GitHub Actions CI/CD</li>
              <li>• Prometheus & Grafana</li>
            </ul>
          </div>
        </div>

        {/* Architecture */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Architecture Overview</h2>
          <div className="bg-gray-50 rounded-lg p-4 font-mono text-xs text-gray-700 overflow-x-auto">
            <pre>{`
  Browser / Mobile
       │
       ▼
  [React Frontend :3000]
       │  REST (JWT)
       ▼
  [API Gateway :8080]  ←→  [Eureka Registry :8761]
       │
  ┌────┴──────────────────────────────────┐
  │                                       │
  ▼                                       ▼
[User Service :8081]          [Crop Service :8082]
[Order Service :8083]         [Transport Service :8084]
[Notification Service :8085]  [AI Service :8000 Python]
       │
       ▼
  [MySQL :3306]          [AI Model (TensorFlow/Keras)]
            `}</pre>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
