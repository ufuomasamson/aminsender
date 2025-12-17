import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    // Decode token to get subscriber ID or email
    let subscriberId: string | null = null;
    let email: string | null = null;

    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf-8');
      // Try to use as UUID (subscriber ID) first
      if (decoded.includes('@')) {
        email = decoded;
      } else {
        subscriberId = decoded;
      }
    } catch {
      // If decoding fails, try as email directly
      email = token;
    }

    const supabase = await createClient();

    // Update subscriber to unsubscribed
    let updateQuery = supabase
      .from('subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .is('unsubscribed_at', null);

    if (subscriberId) {
      updateQuery = updateQuery.eq('id', subscriberId);
    } else if (email) {
      updateQuery = updateQuery.eq('email', email);
    } else {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    const { data, error } = await updateQuery.select('email').single();

    if (error) {
      return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      email: data?.email || email,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to unsubscribe' }, { status: 500 });
  }
}
