import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const daysParam = searchParams.get('days') || '30'
    const days = Math.max(1, Math.min(365, parseInt(daysParam, 10)))
    const fromDate = new Date()
    fromDate.setDate(fromDate.getDate() - days)

    const { data, error } = await supabase
      .from('sends')
      .select('email,status,campaign_id,updated_at')
      .gte('updated_at', fromDate.toISOString())
      .order('updated_at', { ascending: false })
      .limit(1000)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const header = 'email,status,campaign_id,updated_at\n'
    const rows = (data || []).map((r) => `${r.email},${r.status},${r.campaign_id},${r.updated_at}`).join('\n')
    const csv = header + rows
    return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv' } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

