import PublicLayout from '../components/layout/PublicLayout'
import { Sprout, Users, Truck, ShieldCheck, Code2, Brain, GitBranch } from 'lucide-react'

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Dhanyasetu</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A digital bridge connecting farmers, buyers, and transporters through transparent, technology-driven agricultural commerce.
          </p>
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Our Purpose</h2>
          <p className="text-gray-600 leading-relaxed">
            Indian agriculture faces persistent challenges: fragmented supply chains, information asymmetry between farmers and buyers, price volatility, and post-harvest losses. Dhanyasetu addresses these by providing a unified digital platform where farmers can publish produce, buyers can discover and purchase directly, and transporters can manage deliveries — all with full transparency and AI-assisted price insights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { icon: Sprout, title: 'Farmers', desc: 'Small and medium agricultural producers who need direct market access without depending on intermediaries.' },
            { icon: Users, title: 'Buyers', desc: 'Wholesalers, retailers, and food processors seeking verified, quality-graded produce at transparent prices.' },
            { icon: Truck, title: 'Transporters', desc: 'Logistics providers who manage last-mile delivery from farm to buyer.' },
            { icon: ShieldCheck, title: 'Administrators', desc: 'Platform operators who ensure quality, resolve disputes, and maintain system integrity.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
              </div>
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          ))}
        </div>

        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Technical Innovation</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Code2 className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Service-Oriented Architecture (SOA)</h3>
                <p className="text-sm text-gray-500 mt-1">Independent microservices for users, crops, orders, transport, and notifications — orchestrated through an API Gateway and Eureka service registry.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-purple-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Deep Neural Network (PDNC)</h3>
                <p className="text-sm text-gray-500 mt-1">A Keras Sequential DNN trained on historical agricultural market data to estimate future crop price trends. Served via a Python FastAPI inference service.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GitBranch className="w-5 h-5 text-orange-700" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Advanced Software Engineering (ASE)</h3>
                <p className="text-sm text-gray-500 mt-1">Agile development with Git branching, Docker Compose, Kubernetes manifests, GitHub Actions CI/CD, and Prometheus/Grafana monitoring.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-800">
          <strong>Academic Project Notice:</strong> Dhanyasetu is developed as an academic demonstration project. All statistics, partnerships, and impact figures shown are for demonstration purposes only. This platform does not process real financial transactions.
        </div>
      </div>
    </PublicLayout>
  )
}
