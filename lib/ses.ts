import { SESv2Client, SendEmailCommand, ListEmailIdentitiesCommand } from '@aws-sdk/client-sesv2'

function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    'http://localhost:3001'
  )
}

function getClient(region?: string) {
  const r = region || process.env.AWS_REGION
  if (!r) throw new Error('AWS_REGION is not configured')
  return new SESv2Client({ region: r })
}

export async function getVerifiedIdentities() {
  const primary = process.env.AWS_REGION || ''
  const extra = (process.env.AWS_SES_REGIONS || '').split(',').map(s => s.trim()).filter(Boolean)
  const fallbacks = ['us-east-1', 'us-west-2', 'eu-west-1']
  const regions = [...new Set([primary, ...extra, ...fallbacks].filter(Boolean))]

  const emails: string[] = []

  for (const region of regions) {
    try {
      const client = getClient(region)
      const res = await client.send(new ListEmailIdentitiesCommand({}))
      for (const id of res?.EmailIdentities || []) {
        if (id.IdentityType === 'EMAIL_ADDRESS' && id.IdentityName) {
          emails.push(id.IdentityName)
        } else if (id.IdentityType === 'DOMAIN' && id.IdentityName) {
          const domain = id.IdentityName
          emails.push(`noreply@${domain}`)
          emails.push(`hello@${domain}`)
          emails.push(`support@${domain}`)
          emails.push(`contact@${domain}`)
        }
      }
      if (emails.length) break
    } catch {}
  }

  return [...new Set(emails)]
}

export async function getVerifiedDomains() {
  const primary = process.env.AWS_REGION || ''
  const extra = (process.env.AWS_SES_REGIONS || '').split(',').map(s => s.trim()).filter(Boolean)
  const fallbacks = ['us-east-1', 'us-west-2', 'eu-west-1']
  const regions = [...new Set([primary, ...extra, ...fallbacks].filter(Boolean))]

  const domains: string[] = []
  for (const region of regions) {
    try {
      const client = getClient(region)
      const res = await client.send(new ListEmailIdentitiesCommand({}))
      for (const id of res?.EmailIdentities || []) {
        if (id.IdentityType === 'DOMAIN' && id.IdentityName) domains.push(id.IdentityName)
      }
      if (domains.length) break
    } catch {}
  }
  return [...new Set(domains)]
}

export async function sendEmail(data: {
  to: string
  from: string
  fromName?: string
  subject: string
  html: string
  replyTo?: string
}) {
  const client = getClient()

  let displayName = data.fromName && data.fromName.trim() ? data.fromName.trim() : 'AminSender'
  displayName = displayName.replace(/[<>"]/g, '').trim()

  const baseUrl = getBaseUrl()
  const unsubscribeToken = Buffer.from(data.to).toString('base64url')
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${unsubscribeToken}`
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
      <p>You're receiving this email because you subscribed to our mailing list.</p>
      <p style="margin-top: 10px;">Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Unsubscribe</a></p>
      <p style="margin-top: 10px; font-size: 11px; color: #999;">© ${new Date().getFullYear()} ${displayName}. All rights reserved.</p>
    </div>
  `
  const finalHtml = data.html.includes('unsubscribe') ? data.html : data.html + footer
  const plainText = finalHtml
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim() + `\n\n${unsubscribeUrl}`

  const cmd = new SendEmailCommand({
    FromEmailAddress: data.from,
    Destination: { ToAddresses: [data.to] },
    ReplyToAddresses: [data.replyTo || data.from],
    Content: {
      Simple: {
        Subject: { Data: data.subject },
        Body: { Html: { Data: finalHtml }, Text: { Data: plainText } },
      },
    },
    ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET,
  })

  return client.send(cmd)
}

export async function sendBulkEmail(
  emails: Array<{
    to: string
    subject: string
    html: string
    substitutions?: Record<string, string>
    subscriberId?: string
  }>,
  fromEmail: string,
  fromName?: string,
  campaignId?: string
) {
  // Conservative throttle retained for reputation building
  const batchSize = 1
  const delayBetweenBatches = 3000
  const client = getClient()
  let displayName = (fromName && fromName.trim()) ? fromName.trim() : 'AminSender'
  displayName = displayName.replace(/[<>"]/g, '').replace(/\s+/g, ' ').trim()

  const baseUrl = getBaseUrl()

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize)

    for (const email of batch) {
      const token = email.subscriberId ? Buffer.from(email.subscriberId).toString('base64url') : Buffer.from(email.to).toString('base64url')
      const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${token}`
      const footer = `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; text-align: center;">
          <p>You're receiving this email because you subscribed to our mailing list.</p>
          <p style="margin-top: 10px;">Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #666; text-decoration: underline;">Unsubscribe</a></p>
          <p style="margin-top: 10px; font-size: 11px; color: #999;">© ${new Date().getFullYear()} ${displayName}. All rights reserved.</p>
        </div>
      `
      const finalHtml = email.html.includes('unsubscribe') ? email.html : email.html + footer
      const plainText = finalHtml
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/\s+/g, ' ')
        .trim() + `\n\n${unsubscribeUrl}`

      const cmd = new SendEmailCommand({
        FromEmailAddress: fromEmail,
        Destination: { ToAddresses: [email.to] },
        ReplyToAddresses: [fromEmail],
        Content: {
          Simple: {
            Subject: { Data: email.subject },
            Body: { Html: { Data: finalHtml }, Text: { Data: plainText } },
          },
        },
        ConfigurationSetName: process.env.AWS_SES_CONFIGURATION_SET,
      })

      await client.send(cmd)
    }

    if (i + batchSize < emails.length) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches))
    }
  }
}
