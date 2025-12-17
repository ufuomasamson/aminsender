'use client'

import { useEffect, useState } from 'react'

export default function DashboardChart({ defaultDays = 7 }: { defaultDays?: number }) {
  const [days, setDays] = useState(defaultDays)
  const [series, setSeries] = useState<Array<{ date: string; delivered: number; bounce: number; complaint: number; opened: number; clicked: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/dashboard/metrics?days=${days}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || 'Failed')
        return r.json()
      })
      .then((data) => {
        setSeries(data.series || [])
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [days])

  const maxVal = Math.max(1, ...series.map((d) => d.delivered + d.bounce + d.complaint))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded border ${days === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
            >
              Last {d} days
            </button>
          ))}
        </div>
      </div>
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
      {loading ? (
        <div className="h-64 flex items-center justify-center text-gray-600">Loading chart...</div>
      ) : (
        <div className="h-64 grid grid-cols-[repeat(auto-fit,minmax(16px,1fr))] gap-1 items-end">
          {series.map((d) => {
            const total = d.delivered + d.bounce + d.complaint
            const h = Math.round((total / maxVal) * 100)
            return (
              <div key={d.date} className="flex flex-col items-center">
                <div className="w-3 sm:w-4 bg-gray-200 rounded overflow-hidden" style={{ height: '100%' }}>
                  <div className="bg-green-500" style={{ height: `${Math.round((d.delivered / maxVal) * 100)}%` }} />
                  <div className="bg-red-500" style={{ height: `${Math.round((d.bounce / maxVal) * 100)}%` }} />
                  <div className="bg-yellow-500" style={{ height: `${Math.round((d.complaint / maxVal) * 100)}%` }} />
                </div>
                <div className="mt-1 text-[10px] text-gray-500 rotate-45 origin-left">{d.date.slice(5)}</div>
              </div>
            )
          })}
        </div>
      )}
      <div className="mt-3 text-xs text-gray-600 flex gap-4">
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-green-500 inline-block rounded" />Delivered</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-red-500 inline-block rounded" />Bounce</span>
        <span className="inline-flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 inline-block rounded" />Complaint</span>
      </div>
    </div>
  )
}

