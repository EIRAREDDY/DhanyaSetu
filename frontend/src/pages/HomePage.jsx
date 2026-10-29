import { Link } from 'react-router-dom'
import { ArrowRight, Sprout, TrendingUp, Truck, ShieldCheck, BarChart2, Users } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const DEMO_PRICE_DATA = [
  { month: 'Jan', wheat: 2100, rice: 3200, tomato: 1800 },
  { month: 'Feb', wheat: 2200, rice: 3100, tomato: 2200 },
  { month: 'Mar', wheat: 2050, rice: 3300, tomato: 2800 },
  { month: 'Apr', wheat: 2300, rice: 3400, tomato: 1600 },
  { month: 'May', wheat: 2400, rice: 3200, tomato: 1400 },
  { month: 'Jun', wheat: 2350, rice: 3500, tomato: 1900 },
]

const FEATURES = [
  { icon: Sprout,     title: 'Crop Listings',         desc: 'Farmers publish produce with quality grades, quantities, and pricing.' },
  { icon: Users,      title: 'Direct Buyer Connect',  desc: 'Buyers discover verified produce directly from farmers.' },
  { icon: TrendingUp, title: 'AI Price Insights',     desc: 'Deep neural network estimates future crop price trends.' },
  { icon: Truck,      title: 'Order Tracking',        desc: 'Real-time delivery status from pickup to doorstep.' },
  { icon: ShieldCheck,title: 'Transparent Transactions', desc: 'Every order, payment, and delivery is recorded and auditable.' },
  { icon: BarChart2,  title: 'Market Analytics',      desc: 'Dashboards for farmers, buyers, transporters, and admins.' },
]

const STEPS = [
  { n: '01', title: 'Farmer Registers',    desc: 'Farmer creates an account and publishes available produce.' },
  { n: '02', title: 'Buyer Discovers',     desc: 'Buyer searches the marketplace and views crop details.' },
  { n: '03', title: 'Order Placed',        desc: 'Buyer places an order; farmer receives a notification.' },
  { n: '04', title: 'Farmer Confirms',     desc: 'Farmer accepts or rejects the order.' },
  { n: '05', title: 'Transport Assigned',  desc: 'A transporter is assigned and picks up the produce.' },
  { n: '06', title: 'Delivery Completed',  desc: 'Buyer receives produce; order is marked complete.' },
]

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-block bg-green-700/50 text-green-200 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              Agricultural Technology Platform
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-5">
              A Smarter Bridge Between<br />
              <span className="text-green-300">Farmers and Markets</span>
            </h1>
            <p className="text-green-100 text-lg mb-8 max-w-xl">
              Dhanyasetu connects agricultural producers directly with buyers and logistics services — reducing middlemen, improving prices, and bringing transparency to every transaction.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace" className="btn-primary flex items-center gap-2">
                Explore Marketplace <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/register" className="bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors border border-white/20">
                Join Dhanyasetu
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From harvest to delivery in six transparent steps.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <div key={s.n} className="flex gap-4 p-5 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all">
                <span className="text-2xl font-bold text-green-200 flex-shrink-0">{s.n}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Platform Features</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="card hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge-yellow mb-3 inline-block">AI-Powered Insights</span>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Predict Crop Prices with Deep Learning</h2>
              <p className="text-gray-500 mb-6">
                Our Deep Neural Network analyzes historical market data to estimate future crop price trends, helping farmers and buyers make informed decisions.
              </p>
              <Link to="/ai-insights" className="btn-primary inline-flex items-center gap-2">
                Explore AI Insights <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Sample Price Trends</h3>
                <span className="badge-yellow text-xs">Demonstration Data</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={DEMO_PRICE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="wheat" stroke="#16a34a" strokeWidth={2} dot={false} name="Wheat (₹/q)" />
                  <Line type="monotone" dataKey="rice" stroke="#ca8a04" strokeWidth={2} dot={false} name="Rice (₹/q)" />
                  <Line type="monotone" dataKey="tomato" stroke="#dc2626" strokeWidth={2} dot={false} name="Tomato (₹/q)" />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-400 mt-2 text-center">* Synthetic demonstration data. Real predictions require trained model.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-green-300">For Farmers</h2>
              <ul className="space-y-3 text-green-100">
                {['Publish produce directly without middlemen', 'Set your own price and quality grade', 'Receive orders and manage inventory', 'Track deliveries in real time', 'Access AI price trend estimates'].map(b => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6 text-green-300">For Buyers</h2>
              <ul className="space-y-3 text-green-100">
                {['Discover verified produce from farmers', 'Compare prices and quality grades', 'Place orders with transparent pricing', 'Track delivery status end-to-end', 'View order history and spending analytics'].map(b => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">✓</span> {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-gray-500 mb-8">Join Dhanyasetu and be part of a transparent agricultural marketplace.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="btn-primary">Create Account</Link>
            <Link to="/how-it-works" className="btn-secondary">Learn More</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
