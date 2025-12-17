import Link from 'next/link';
import { Shield, CheckCircle, Users, ArrowRight, BarChart3, Send, FileCheck, Mail, Star } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
export const metadata = {
  title: 'AminSender – Reliable Bulk Email via AWS SES',
  description: 'Verify your domain, upload lists, and send compliant bulk email with analytics using AWS SES.',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <BrandLogo size={28} />
            <div className="hidden md:flex items-center gap-6">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 transition">Features</Link>
              <Link href="#pricing" className="text-gray-700 hover:text-blue-600 transition">Pricing</Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
              <Link href="#faq" className="text-gray-700 hover:text-blue-600 transition">FAQ</Link>
              <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-semibold">Login</Link>
              <Link
                href="/admin/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-4">Powered by AWS SES</div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Send Compliant Bulk Email with Confidence</h1>
            <p className="text-lg text-gray-700 mb-6">Verify your domain, upload lists, and send email that reaches the inbox. Track delivery, opens, and clicks in one dashboard.</p>
            <div className="flex gap-3">
              <Link href="/admin/login" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#benefits" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-100">Learn More</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">99%</div>
                <div className="text-xs text-gray-600">Deliverability</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">Secure</div>
                <div className="text-xs text-gray-600">SPF/DKIM/DMARC</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">Fast</div>
                <div className="text-xs text-gray-600">Throttled Sending</div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Campaigns</div>
                <div className="text-2xl font-bold">Create</div>
                <div className="mt-2 text-xs text-gray-600">Design, personalize, preview</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Lists</div>
                <div className="text-2xl font-bold">Upload</div>
                <div className="mt-2 text-xs text-gray-600">CSV + verification</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Analytics</div>
                <div className="text-2xl font-bold">Track</div>
                <div className="mt-2 text-xs text-gray-600">Delivery, opens, clicks</div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm text-gray-500">Compliance</div>
                <div className="text-2xl font-bold">Protect</div>
                <div className="mt-2 text-xs text-gray-600">Unsubscribe, bounces</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Choose the plan that's right for you</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <PricingCard plan="Free" price="Free" emails="100 emails/month" features={["Basic verification","Email analytics","CSV upload","Community support","5 lists"]} />
            <PricingCard plan="Pro" price="$29" emails="Unlimited emails" features={["Advanced verification","Rich analytics","Priority support","API access","Custom branding","Unlimited lists"]} highlight />
          </div>
          <p className="text-center text-gray-600 mt-8">All plans include SPF/DKIM/DMARC setup, unsubscribe links, and bounce handling</p>
        </div>
      </section>

      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to manage lists, create campaigns, and measure results</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<FileCheck className="w-8 h-8 text-blue-600" />} title="List Upload & Verification" description="CSV import with verification to reduce bounces and improve performance." />
            <FeatureCard icon={<BarChart3 className="w-8 h-8 text-green-600" />} title="Analytics Dashboard" description="Track delivery, opens, clicks and complaints with clear KPIs and charts." />
            <FeatureCard icon={<Shield className="w-8 h-8 text-purple-600" />} title="Authentication" description="SPF/DKIM/DMARC guidance with unsubscribe and bounce handling built-in." />
            <FeatureCard icon={<Send className="w-8 h-8 text-blue-600" />} title="Campaign Builder" description="Compose HTML emails, personalize with merge tags, preview and send." />
            <FeatureCard icon={<Users className="w-8 h-8 text-green-600" />} title="Admin Control" description="Single admin access with secure storage and Supabase RLS." />
            <FeatureCard icon={<CheckCircle className="w-8 h-8 text-yellow-600" />} title="Compliance" description="Protect reputation with throttling, unsubscribe links, and complaint handling." />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why AminSender</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">A minimal, compliant sending stack optimized for deliverability</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3"><Shield className="w-6 h-6 text-blue-600" /><span className="font-semibold">Inbox Placement</span></div>
              <div className="text-gray-600 text-sm">Authentication guidance and throttling help build sender reputation.</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3"><FileCheck className="w-6 h-6 text-green-600" /><span className="font-semibold">Clean Lists</span></div>
              <div className="text-gray-600 text-sm">CSV upload with verification reduces bounces and improves performance.</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3"><BarChart3 className="w-6 h-6 text-purple-600" /><span className="font-semibold">Actionable Analytics</span></div>
              <div className="text-gray-600 text-sm">Visualize delivery, opens, clicks and complaints to improve campaigns.</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">1</div>
              <div className="font-semibold mb-1">Verify Domain</div>
              <div className="text-gray-600 text-sm">Add DNS records for DKIM; ensure SPF/DMARC for reputation.</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">2</div>
              <div className="font-semibold mb-1">Upload List</div>
              <div className="text-gray-600 text-sm">CSV import with email verification and segmentation.</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold mb-2">3</div>
              <div className="font-semibold mb-1">Send & Track</div>
              <div className="text-gray-600 text-sm">Create campaigns, send, and monitor KPIs in one place.</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Answers for better deliverability and setup</p>
          </div>
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Do I need a verified domain?</div>
              <div className="text-gray-600 text-sm">Yes. Verify your sending domain in AWS SES and add DKIM records for best deliverability.</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Can I send in sandbox?</div>
              <div className="text-gray-600 text-sm">SES sandbox allows sending only to verified recipients. Request production access for general sending.</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">How are bounces handled?</div>
              <div className="text-gray-600 text-sm">SNS webhooks update send status and can automatically unsubscribe complained recipients.</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="font-semibold text-gray-900 mb-2">Is my data secure?</div>
              <div className="text-gray-600 text-sm">Credentials are stored securely; Supabase RLS restricts data access to the admin.</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Deploy on Vercel and Start Sending</h2>
          <p className="text-lg text-gray-700 mb-6">Connect your GitHub repo, add environment variables, and go live with a production URL for AWS SES.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin/login" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/privacy" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-900 hover:bg-gray-100">
              Learn about Compliance
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-95">
            Join thousands of marketers sending emails that actually land in the inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg text-lg"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition text-lg"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Mail className="w-8 h-8 text-blue-400 mr-2" />
                <span className="text-2xl font-bold">AminSender</span>
              </div>
              <p className="text-gray-400 mb-4">Bulk email sending made simple and compliant.</p>
              <p className="text-gray-500 text-sm">Powered by AWS SES for reliable deliverability.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#how-it-works" className="hover:text-white transition">How It Works</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition">About</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">© 2024 AminSender. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-all hover:-translate-y-1">
      <div className="mb-6 bg-gradient-to-br from-blue-50 to-green-50 w-16 h-16 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role, company, stars }: { quote: string; author: string; role: string; company: string; stars: number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <div className="flex gap-1 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-6 leading-relaxed italic">"{quote}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center text-white font-bold">
          {author.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-600">{role}, {company}</div>
        </div>
      </div>
    </div>
  );
}

function StepCard({ number, title, description, icon }: { number: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="text-center group">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-green-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition" />
        <div className="relative bg-gradient-to-br from-blue-600 to-green-600 w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
          {number}
        </div>
        <div className="absolute -top-2 -right-2 bg-white rounded-full p-2 shadow-md">
          <div className="text-blue-600">
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  emails,
  features,
  highlight = false,
}: {
  plan: string;
  price: string;
  emails: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div className={`bg-white p-8 rounded-xl shadow-lg border-2 ${highlight ? 'border-blue-600 ring-4 ring-blue-100' : 'border-gray-200'} transition-all hover:shadow-xl`}>
      {highlight && (
        <div className="inline-block px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2 text-gray-900">{plan}</h3>
      <div className="mb-4">
        <span className="text-5xl font-bold text-gray-900">{price}</span>
        {price !== 'Free' && <span className="text-gray-600 text-lg">/mo</span>}
      </div>
      <p className="text-gray-600 mb-6 font-medium">{emails}</p>
      <ul className="space-y-4 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/admin/login"
        className={`block text-center py-4 rounded-lg font-semibold transition-all ${
          highlight
            ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white hover:shadow-lg hover:scale-105'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Get Started
      </Link>
    </div>
  );
}
