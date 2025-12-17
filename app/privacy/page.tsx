import Link from 'next/link'
import BrandLogo from '@/components/BrandLogo'

export const metadata = {
  title: 'Privacy – AminSender',
  description: 'How AminSender handles your data securely and responsibly.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BrandLogo size={28} />
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-gray-700 hover:text-blue-600 transition">Features</Link>
              <Link href="/#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
              <Link href="/#faq" className="text-gray-700 hover:text-blue-600 transition">FAQ</Link>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-semibold">Login</Link>
              <Link href="/admin/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-700 mb-6">We respect your privacy. AminSender stores only the data required to operate your email campaigns and analytics.</p>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Contact data you upload is used solely for sending and tracking emails.</li>
                <li>API keys and credentials are stored securely and are never shared.</li>
                <li>You may request deletion of data at any time.</li>
              </ul>
              <p className="text-gray-700 mt-6">For questions, contact support at <a className="text-blue-600" href="mailto:hello@yourdomain.com">hello@yourdomain.com</a>.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
