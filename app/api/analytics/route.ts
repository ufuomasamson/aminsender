import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all sends
    const { data: sends, error: sendsError } = await supabase
      .from('sends')
      .select('status, opened, clicked');

    if (sendsError) {
      return NextResponse.json({ error: sendsError.message }, { status: 500 });
    }

    // Calculate stats
    const totalSent = sends?.length || 0;
    const delivered = sends?.filter(s => s.status === 'delivered').length || 0;
    const bounced = sends?.filter(s => s.status === 'bounce').length || 0;
    const opened = sends?.filter(s => s.opened === true).length || 0;
    const clicked = sends?.filter(s => s.clicked === true).length || 0;

    const openRate = delivered > 0 ? Number(((opened / delivered) * 100).toFixed(1)) : 0;
    const clickRate = delivered > 0 ? Number(((clicked / delivered) * 100).toFixed(1)) : 0;

    // Get recent campaigns
    const { data: campaigns } = await supabase
      .from('campaigns')
      .select('id, name, total_sends, successful_sends, sent_at')
      .order('sent_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      stats: {
        totalSent,
        delivered,
        bounced,
        opened,
        clicked,
        openRate,
        clickRate,
      },
      campaigns: campaigns || [],
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
