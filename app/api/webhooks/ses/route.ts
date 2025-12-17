import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // SNS wraps actual SES event in body.Message (stringified JSON)
    const message = body?.Message
    if (!message) {
      return NextResponse.json({ error: 'Invalid SNS payload' }, { status: 400 })
    }

    const event = JSON.parse(message)
    const type = event?.notificationType

    if (!type) {
      return NextResponse.json({ error: 'Unknown SES event' }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ success: true })
    }
    const supabase = createClient(supabaseUrl, supabaseKey)

    if (type === 'Delivery') {
      const mail = event.mail
      const delivery = event.delivery
      const email = mail?.destination?.[0]
      if (email) {
        await supabase
          .from('sends')
          .update({ status: 'delivered', updated_at: new Date().toISOString() })
          .eq('email', email)
      }
    } else if (type === 'Bounce') {
      const mail = event.mail
      const email = mail?.destination?.[0]
      if (email) {
        await supabase
          .from('sends')
          .update({ status: 'bounce', updated_at: new Date().toISOString() })
          .eq('email', email)
      }
    } else if (type === 'Complaint') {
      const mail = event.mail
      const email = mail?.destination?.[0]
      if (email) {
        await supabase
          .from('sends')
          .update({ complaint: true, updated_at: new Date().toISOString() })
          .eq('email', email)

        // Optionally mark subscriber as unsubscribed
        await supabase
          .from('subscribers')
          .update({ unsubscribed_at: new Date().toISOString() })
          .eq('email', email)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SES webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
