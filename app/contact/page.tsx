export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-6">Contact</h1>
      <p className="text-gray-700 mb-6">Reach us at <a className="text-blue-600" href="mailto:hello@yourdomain.com">hello@yourdomain.com</a> or use the form below.</p>
      <form className="space-y-4">
        <input type="text" placeholder="Name" className="w-full px-4 py-2 border border-gray-300 rounded" />
        <input type="email" placeholder="Email" className="w-full px-4 py-2 border border-gray-300 rounded" />
        <textarea placeholder="Message" rows={6} className="w-full px-4 py-2 border border-gray-300 rounded" />
        <button type="button" className="px-6 py-2 bg-blue-600 text-white rounded">Send</button>
      </form>
    </div>
  )
}

