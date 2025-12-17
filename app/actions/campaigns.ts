'use server';

import { createClient } from '@/lib/supabase/server';
import { sendBulkEmail, getVerifiedDomains } from '@/lib/ses';

export async function createCampaign(data: {
  name: string;
  subject: string;
  htmlContent: string;
  senderName: string;
  senderEmail: string;
  listId: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Create campaign record
  const { data: campaign, error } = await supabase
    .from('campaigns')
    .insert({
      name: data.name,
      subject: data.subject,
      html_content: data.htmlContent,
      sender_name: data.senderName,
      sender_email: data.senderEmail,
      list_id: data.listId,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { success: true, campaign };
}

export async function sendCampaign(campaignId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Get campaign
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (campaignError || !campaign) {
    return { error: 'Campaign not found' };
  }

  // Preflight: verify sender email domain is verified in SES
  try {
    const domains = await getVerifiedDomains()
    const senderDomain = (campaign.sender_email || '').split('@')[1]
    if (!senderDomain) return { error: 'Sender email is invalid' }
    const isVerified = domains.some(d => d.toLowerCase() === senderDomain.toLowerCase())
    if (!isVerified) {
      return { error: `Sender domain ${senderDomain} is not verified in AWS SES ${process.env.AWS_REGION}. Verify the domain or use a verified identity.` }
    }
  } catch (e: any) {
    return { error: e.message || 'Failed to validate sender domain' }
  }

  // Get subscribers (not unsubscribed)
  const { data: subscribers, error: subscribersError } = await supabase
    .from('subscribers')
    .select('id, email, name')
    .eq('list_id', campaign.list_id)
    .is('unsubscribed_at', null);

  if (subscribersError || !subscribers || subscribers.length === 0) {
    return { error: 'No subscribers found in this list. Make sure the list has contacts.' };
  }

  // Update campaign status to sending
  await supabase
    .from('campaigns')
    .update({
      status: 'sending',
      total_sends: subscribers.length,
    })
    .eq('id', campaignId);

  // Create send records first
  const sendRecords = subscribers.map((sub) => ({
    campaign_id: campaign.id,
    subscriber_id: sub.id,
    email: sub.email,
    status: 'pending',
  }));

  const { error: insertError } = await supabase.from('sends').insert(sendRecords);

  if (insertError) {
    return { error: 'Failed to create send records: ' + insertError.message };
  }

  // Prepare emails for SES (with unsubscribe support)
  const emails = subscribers.map((sub) => ({
    to: sub.email,
    subject: campaign.subject.replace(/\{\{first_name\}\}/g, sub.name || 'there'),
    html: campaign.html_content.replace(/\{\{first_name\}\}/g, sub.name || 'there'),
    substitutions: {
      name: sub.name || 'there',
    },
    subscriberId: sub.id, // Include subscriber ID for unsubscribe
  }));

  try {
    // Send via AWS SES with throttling
    // For new domains: VERY slow to build reputation (avoid spam filters)
    // Start with 1-2 emails/second for first few weeks
    const batchSize = 1; // Very conservative for new domains (1 email at a time)
    const delayBetweenBatches = 3000; // 3 seconds between each email (helps reputation)
    let successfulSends = 0;
    let failedSends = 0;

    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchSubscribers = subscribers.slice(i, i + batchSize);

      try {
        await sendBulkEmail(batch, campaign.sender_email, campaign.sender_name, campaign.id);

        // Update send records to queued
        const batchEmails = batch.map((e) => e.to);
        await supabase
          .from('sends')
          .update({ status: 'queued' })
          .eq('campaign_id', campaignId)
          .in('email', batchEmails);

        successfulSends += batch.length;
      } catch (batchError: any) {
        // Mark batch as failed
        const batchEmails = batch.map((e) => e.to);
        await supabase
          .from('sends')
          .update({ 
            status: 'dropped',
            status_message: batchError.message || 'Send failed'
          })
          .eq('campaign_id', campaignId)
          .in('email', batchEmails);

        failedSends += batch.length;
      }

      // Wait before next batch (throttling for better deliverability)
      if (i + batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
      }
    }

    // Update campaign status
    await supabase
      .from('campaigns')
      .update({
        status: 'sent',
        successful_sends: successfulSends,
        failed_sends: failedSends,
        sent_at: new Date().toISOString(),
      })
      .eq('id', campaignId);

    const summary = failedSends > 0 ? `Queued ${successfulSends}, dropped ${failedSends}` : `Queued ${successfulSends}`
    return { success: true, message: summary, totalSent: emails.length, successful: successfulSends, failed: failedSends };
  } catch (error: any) {
    // Update campaign status to failed
    await supabase
      .from('campaigns')
      .update({ status: 'failed' })
      .eq('id', campaignId);

    return { error: error.message || 'Failed to send campaign' };
  }
}
