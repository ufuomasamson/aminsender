import Link from 'next/link'
import { Shield, CheckCircle, BarChart3, Users } from 'lucide-react'
import BrandLogo from '@/components/BrandLogo'

export const metadata = {
  title: 'About – AminSender',
  description: 'AminSender helps teams send compliant bulk email with reliable inbox placement using AWS SES.',
}

export default function AboutPage() {
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-4">AminSender</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Built for Reliable, Compliant Bulk Email</h1>
            <p className="text-lg text-gray-700 mb-6">We focus on the essentials: verified domains, clean lists, clear analytics and built-in compliance to protect sender reputation.</p>
            <div className="flex gap-3">
              <Link href="/admin/login" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Get Started</Link>
              <Link href="/privacy" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-100">Privacy</Link>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Deliverability</div>
                <div className="text-2xl font-bold">Authentication</div>
                <div className="mt-2 text-xs text-gray-600">SPF/DKIM/DMARC</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Lists</div>
                <div className="text-2xl font-bold">Verification</div>
                <div className="mt-2 text-xs text-gray-600">Reduce bounces</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Analytics</div>
                <div className="text-2xl font-bold">KPIs</div>
                <div className="mt-2 text-xs text-gray-600">Opens, clicks</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Compliance</div>
                <div className="text-2xl font-bold">Protection</div>
                <div className="mt-2 text-xs text-gray-600">Unsubscribe, bounces</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Value title="Deliverability First" icon={<Shield className="w-6 h-6 text-blue-600" />} description="Authentication guidance and sensible throttling help build sender reputation." />
            <Value title="Data Minimalism" icon={<Users className="w-6 h-6 text-green-600" />} description="We store only what’s required and enforce Supabase RLS for access control." />
            <Value title="Clarity Over Complexity" icon={<BarChart3 className="w-6 h-6 text-purple-600" />} description="A focused workflow: verify domain, upload lists, send and measure." />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Send with Confidence?</h2>
          <p className="text-lg text-gray-700 mb-6">Connect your repo to Vercel, configure environment variables, and request SES production access with your live URL.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/admin/login" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Get Started</Link>
            <Link href="/terms" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-100">Terms</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Value({ title, icon, description }: { title: string; icon: React.ReactNode; description: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <div className="font-semibold text-gray-900">{title}</div>
      </div>
      <div className="text-gray-600 text-sm">{description}</div>
    </div>
  )
}
