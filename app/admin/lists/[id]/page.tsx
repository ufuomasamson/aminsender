'use client'

import AdminLayout from '@/components/AdminLayout'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Search, ArrowLeft, MailCheck, XCircle } from 'lucide-react'

export default function ManageListPage() {
  const params = useParams()
  const router = useRouter()
  const listId = (params?.id as string) || ''

  const [subscribers, setSubscribers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!listId) return
    ;(async () => {
      try {
        const res = await fetch(`/api/lists/${listId}/subscribers`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data?.error || 'Failed to load subscribers')
        }
        const data = await res.json()
        setSubscribers(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [listId])

  const filtered = subscribers.filter((s) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      (s.email || '').toLowerCase().includes(q) ||
      (s.name || '').toLowerCase().includes(q)
    )
  })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/admin/lists')} className="flex items-center gap-2 text-blue-600 hover:underline">
            <ArrowLeft className="w-5 h-5" /> Back to Lists
          </button>
          <div className="text-sm text-gray-600">List ID: {listId}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Manage List</h2>
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search email or name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <XCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-gray-600">Loading subscribers...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-600">No subscribers found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscribed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unsubscribed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{s.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{s.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          {s.verified ? (
                            <MailCheck className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          {s.verification_status || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.subscribed_at ? new Date(s.subscribed_at).toLocaleString() : '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{s.unsubscribed_at ? new Date(s.unsubscribed_at).toLocaleString() : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

