import { Link } from 'react-router-dom'
import { Sprout, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-950 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-600 p-1.5 rounded-lg">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">Dhanyasetu</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Connecting farmers to better opportunities. From harvest to market, one trusted digital bridge.
            </p>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /><span>contact@dhanyasetu.in</span></div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /><span>+91 98765 43210</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>Bengaluru, Karnataka, India</span></div>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/marketplace', 'Marketplace'], ['/how-it-works', 'How It Works'], ['/ai-insights', 'AI Insights'], ['/about', 'About']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-900 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Dhanyasetu. Academic project — demonstration data only. Not a commercial platform.
        </div>
      </div>
    </footer>
  )
}
