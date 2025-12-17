import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, getVerifiedDomains } from '@/lib/ses'

export async function POST(req: NextRequest) {
  try {
    const { to, from, fromName } = await req.json()
    if (!to || !from) return NextResponse.json({ error: 'to and from are required' }, { status: 400 })
    const domains = await getVerifiedDomains()
    const senderDomain = (from || '').split('@')[1]
    if (!senderDomain || !domains.includes(senderDomain)) {
      return NextResponse.json({ error: `Sender domain ${senderDomain} is not verified in AWS SES ${process.env.AWS_REGION}` }, { status: 400 })
    }

    await sendEmail({ to, from, fromName, subject: 'SES Test Email', html: '<p>This is a test email from ZoMail Pro via AWS SES.</p>' })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to send test email' }, { status: 500 })
  }
}
