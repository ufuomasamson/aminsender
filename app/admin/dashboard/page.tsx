import AdminLayout from '@/components/AdminLayout';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Mail, Send, AlertCircle, TrendingUp, Users, BarChart3, Activity, Zap, FileText, CheckCircle } from 'lucide-react';
import DashboardChart from '@/components/DashboardChart'
import RecentSendsClient from '@/components/RecentSendsClient'
import { getVerifiedIdentities } from '@/lib/ses'

export const revalidate = 60

export default async function DashboardPage({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const supabase = await createClient();
  const daysParam = (searchParams?.days as string) || '7'
  const days = Math.max(1, Math.min(90, parseInt(daysParam || '7', 10)))
  const fromDate = new Date()
  fromDate.setDate(fromDate.getDate() - days)
  
  // Get metrics (these will be populated once you have data)
  const { count: subscribersCount } = await supabase.from('subscribers').select('*', { count: 'exact', head: true });
  const { count: deliveredCount } = await supabase.from('sends').select('*', { count: 'exact', head: true }).eq('status', 'delivered').gte('created_at', fromDate.toISOString());
  const { count: failedCount } = await supabase.from('sends').select('*', { count: 'exact', head: true }).in('status', ['bounce','dropped']).gte('created_at', fromDate.toISOString());
  const { count: openedCount } = await supabase.from('sends').select('*', { count: 'exact', head: true }).eq('opened', true).gte('created_at', fromDate.toISOString());
  const { count: clickedCount } = await supabase.from('sends').select('*', { count: 'exact', head: true }).eq('clicked', true).gte('created_at', fromDate.toISOString());
  const { count: complaintCount } = await supabase.from('sends').select('*', { count: 'exact', head: true }).eq('complaint', true).gte('created_at', fromDate.toISOString());
  const { data: campaigns } = await supabase.from('campaigns').select('id, name, created_at').order('created_at', { ascending: false }).limit(3);
  const { data: lists } = await supabase.from('lists').select('id, name, total_count, valid_count').limit(5);
  const sesIdents = await getVerifiedIdentities()
  
  const totalSubscribers = subscribersCount || 0;
  const successfulSends = deliveredCount || 0;
  const failedSends = failedCount || 0;
  const totalSent = successfulSends + failedSends;
  const inboxRate = totalSent > 0 ? ((successfulSends / totalSent) * 100).toFixed(1) : 0;
  const openRate = successfulSends > 0 ? ((openedCount! / successfulSends) * 100).toFixed(1) : '0';
  const clickRate = successfulSends > 0 ? ((clickedCount! / successfulSends) * 100).toFixed(1) : '0';
  const bounceRate = totalSent > 0 ? ((failedSends / totalSent) * 100).toFixed(1) : '0';
  const complaintRate = totalSent > 0 ? ((complaintCount! / totalSent) * 100).toFixed(1) : '0';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-600 mt-1">Welcome back! Here's your email performance overview</p>
          </div>
          <Link
            href="/admin/campaigns"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            <Send className="w-5 h-5" />
            New Campaign
          </Link>
        </div>

        {/* Setup Banner */}
        {sesIdents.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            <p className="font-medium">AWS SES setup required</p>
            <p className="text-sm">Verify a sender identity to start sending emails. Go to Settings to configure.</p>
            <Link href="/admin/settings" className="text-yellow-900 underline text-sm">Open Settings</Link>
          </div>
        )}

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Contacts"
            value={totalSubscribers.toLocaleString()}
            icon={<Users className="w-5 h-5" />}
            color="blue"
            trend="+12% this month"
            trendUp={true}
          />
          <MetricCard
            title="Successful Sends"
            value={successfulSends.toLocaleString()}
            icon={<Send className="w-5 h-5" />}
            color="green"
            subtitle="Delivered to inbox"
          />
          <MetricCard
            title="Failed Sends"
            value={failedSends.toLocaleString()}
            icon={<AlertCircle className="w-5 h-5" />}
            color="red"
            subtitle="Bounces & drops"
          />
          <MetricCard
            title="Inbox Rate"
            value={`${inboxRate}%`}
            icon={<TrendingUp className="w-5 h-5" />}
            color="purple"
            subtitle="Delivery success rate"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard title="Open Rate" value={`${openRate}%`} icon={<TrendingUp className="w-5 h-5" />} color="blue" />
          <MetricCard title="Click Rate" value={`${clickRate}%`} icon={<TrendingUp className="w-5 h-5" />} color="green" />
          <MetricCard title="Bounce Rate" value={`${bounceRate}%`} icon={<TrendingUp className="w-5 h-5" />} color="red" />
          <MetricCard title="Complaint Rate" value={`${complaintRate}%`} icon={<TrendingUp className="w-5 h-5" />} color="purple" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            href="/admin/lists"
            icon={<FileText className="w-6 h-6" />}
            title="Upload List"
            description="Import CSV contacts"
            color="blue"
          />
          <QuickActionCard
            href="/admin/campaigns"
            icon={<Mail className="w-6 h-6" />}
            title="Create Campaign"
            description="Design and send emails"
            color="green"
          />
          <QuickActionCard
            href="/admin/lists"
            icon={<CheckCircle className="w-6 h-6" />}
            title="Verify Contacts"
            description="Check email validity"
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Send Performance</h3>
                <p className="text-sm text-gray-600">Daily totals</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <DashboardChart defaultDays={7} />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Sends</h3>
                <p className="text-sm text-gray-600">Latest 20 sends</p>
              </div>
              <Link href={`/api/dashboard/export/sends?days=${days}`} className="text-blue-600 text-sm">Export CSV</Link>
            </div>
            <RecentSends />
          </div>

          {/* Recent Campaigns */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Campaigns</h3>
                <p className="text-sm text-gray-600">Latest activity</p>
              </div>
              <Link href="/admin/campaigns" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                View All
              </Link>
            </div>
            {campaigns && campaigns.length > 0 ? (
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition">
                    <div>
                      <p className="font-medium text-gray-900">{campaign.name}</p>
                      <p className="text-sm text-gray-500">{new Date(campaign.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No campaigns yet</p>
                <Link href="/admin/campaigns" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                  Create your first campaign
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Lists Overview */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Contact Lists</h3>
              <p className="text-sm text-gray-600">Manage your email lists</p>
            </div>
            <Link
              href="/admin/lists"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View All
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
          {lists && lists.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">List Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lists.map((list) => {
                    const validRate = list.total_count > 0 ? ((list.valid_count / list.total_count) * 100).toFixed(0) : 0;
                    return (
                      <tr key={list.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-medium text-gray-900">{list.name}</td>
                        <td className="px-4 py-3 text-gray-600">{list.total_count}</td>
                        <td className="px-4 py-3 text-gray-600">{list.valid_count}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3" />
                            {validRate}% valid
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No lists uploaded yet</p>
              <Link href="/admin/lists" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
                Upload your first list
              </Link>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}

function MetricCard({
  title,
  value,
  icon,
  color,
  trend,
  trendUp,
  subtitle,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple';
  trend?: string;
  trendUp?: boolean;
  subtitle?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm font-medium">{title}</span>
        <div className={`${colorClasses[color]} p-2.5 rounded-lg`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      {trend && (
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className={`w-4 h-4 ${trendUp ? 'text-green-600' : 'text-red-600'}`} />
          <span className={`text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}

function QuickActionCard({
  href,
  icon,
  title,
  description,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  };

  return (
    <Link
      href={href}
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-blue-500 transition-all hover:shadow-md"
    >
      <div className="flex items-center gap-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg transition`}>{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
            </div>
            <div className="mt-3">
              <Link href="/api/dashboard/export/lists" className="text-blue-600 text-sm">Export Lists CSV</Link>
            </div>
        </div>
    </Link>
  );
}
function RecentSends() {
  return (
    <div className="overflow-x-auto">
      {/* client fetch via API */}
      <RecentSendsClient />
    </div>
  )
}
