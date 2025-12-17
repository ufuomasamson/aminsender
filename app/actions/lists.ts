'use server';

import { createClient } from '@/lib/supabase/server';
import { verifyEmailsBatch } from '@/lib/email-verification';

export async function uploadList(data: {
  name: string;
  contacts: Array<{ email: string; name?: string; [key: string]: any }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Create list record
  const { data: list, error: listError } = await supabase
    .from('lists')
    .insert({
      name: data.name,
      total_count: data.contacts.length,
      created_by: user.id,
    })
    .select()
    .single();

  if (listError) {
    return { error: listError.message };
  }

  // Insert subscribers (mark as verified by default, can verify later)
  const subscribers = data.contacts.map((contact) => ({
    email: contact.email,
    name: contact.name,
    custom_fields: contact,
    list_id: list.id,
    verified: true, // Default to verified, can verify properly later
    verification_status: 'unknown',
  }));

  // Insert in batches to avoid limits
  const batchSize = 100;
  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);
    const { error: insertError } = await supabase.from('subscribers').upsert(batch, {
      onConflict: 'email',
      ignoreDuplicates: false,
    });

    if (insertError) {
      return { error: insertError.message };
    }
  }

  // Update valid_count (all imported are considered valid initially)
  await supabase
    .from('lists')
    .update({ valid_count: subscribers.length })
    .eq('id', list.id);

  return { success: true, list };
}

export async function verifyList(listId: string, useAPI: boolean = false) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Unauthorized' };
  }

  // Get subscribers
  const { data: subscribers, error } = await supabase
    .from('subscribers')
    .select('email')
    .eq('list_id', listId);

  if (error || !subscribers) {
    return { error: 'Failed to get subscribers' };
  }

  const emails = subscribers.map((s) => s.email);
  const results = await verifyEmailsBatch(emails, useAPI);

  // Update subscribers with verification results
  for (const result of results) {
    await supabase
      .from('subscribers')
      .update({
        verified: result.valid,
        verification_status: result.valid ? 'valid' : 'invalid',
        verification_date: new Date().toISOString(),
      })
      .eq('email', result.email);
  }

  // Update list counts
  const validCount = results.filter((r) => r.valid).length;
  await supabase
    .from('lists')
    .update({ valid_count: validCount })
    .eq('id', listId);

  return {
    success: true,
    total: results.length,
    valid: validCount,
    invalid: results.length - validCount,
  };
}
