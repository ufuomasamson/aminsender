import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('lists')
      .select('id,name,total_count,valid_count,uploaded_at')
      .order('uploaded_at', { ascending: false })
      .limit(1000)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const header = 'id,name,total_count,valid_count,uploaded_at\n'
    const rows = (data || []).map((r) => `${r.id},${r.name},${r.total_count},${r.valid_count},${r.uploaded_at}`).join('\n')
    const csv = header + rows
    return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv' } })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

