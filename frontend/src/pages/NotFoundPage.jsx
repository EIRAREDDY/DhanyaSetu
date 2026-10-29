import { Link } from 'react-router-dom'
import PublicLayout from '../components/layout/PublicLayout'

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <div className="min-h-96 flex flex-col items-center justify-center text-center px-4 py-20">
        <p className="text-8xl font-bold text-green-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go Home</Link>
      </div>
    </PublicLayout>
  )
}
