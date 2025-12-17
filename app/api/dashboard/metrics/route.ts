import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const daysParam = searchParams.get('days')
    const days = Math.max(1, Math.min(90, parseInt(daysParam || '7', 10)))
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    const { data: sends, error } = await supabase
      .from('sends')
      .select('status, opened, clicked, created_at')
      .gte('created_at', fromDate.toISOString())

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const buckets: Record<string, { delivered: number; bounce: number; complaint: number; opened: number; clicked: number }> = {}
    for (let i = 0; i < days; i++) {
      const d = new Date(fromDate)
      d.setDate(d.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      buckets[key] = { delivered: 0, bounce: 0, complaint: 0, opened: 0, clicked: 0 }
    }

    let totals = { delivered: 0, bounce: 0, complaint: 0, opened: 0, clicked: 0 }
    for (const s of sends || []) {
      const key = new Date(s.created_at).toISOString().slice(0, 10)
      const bucket = buckets[key]
      if (!bucket) continue
      if (s.status === 'delivered') { bucket.delivered++; totals.delivered++ }
      if (s.status === 'bounce') { bucket.bounce++; totals.bounce++ }
      if (s.status === 'dropped') { bucket.bounce++; totals.bounce++ }
      if (s.complaint === true || s.status === 'complaint') { bucket.complaint++; totals.complaint++ }
      if (s.opened === true) { bucket.opened++; totals.opened++ }
      if (s.clicked === true) { bucket.clicked++; totals.clicked++ }
    }

    const series = Object.entries(buckets).map(([date, b]) => ({ date, ...b }))
    return NextResponse.json({ days, totals, series })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

