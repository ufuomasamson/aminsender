import { NextResponse } from 'next/server'
import { getVerifiedIdentities } from '@/lib/ses'

export async function GET() {
  try {
    const emails = await getVerifiedIdentities()

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: settings } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'sender_email')
      .single()

    if (settings?.value && !emails.includes(settings.value)) {
      emails.unshift(settings.value)
    }

    return NextResponse.json(emails)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

