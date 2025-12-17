'use client'

import { useEffect, useState } from 'react'

export default function RecentSendsClient() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/dashboard/recent-sends')
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || 'Failed')
        return r.json()
      })
      .then((data) => setRows(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (error) return <div className="text-red-600 text-sm">{error}</div>
  if (loading) return <div className="text-gray-600 text-sm">Loading...</div>

  if (rows.length === 0) return <div className="text-gray-600 text-sm">No sends yet</div>

  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {rows.map((r) => (
          <tr key={`${r.campaign_id}-${r.email}-${r.updated_at}`}>
            <td className="px-4 py-3 font-mono text-sm">{r.email}</td>
            <td className="px-4 py-3">{r.status}</td>
            <td className="px-4 py-3">{r.campaign_id}</td>
            <td className="px-4 py-3 text-gray-500">{new Date(r.updated_at).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

