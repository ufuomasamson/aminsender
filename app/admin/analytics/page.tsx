'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Mail, Send, Eye, MousePointer } from 'lucide-react';

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSent: 0,
    delivered: 0,
    bounced: 0,
    opened: 0,
    clicked: 0,
    openRate: 0,
    clickRate: 0,
  });
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setCampaigns(data.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600 mt-1">Track your email campaign performance</p>
        </div>

        {/* Key Metrics */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Sent"
              value={stats.totalSent.toLocaleString()}
              icon={<Send className="w-8 h-8" />}
              color="blue"
            />
            <MetricCard
              title="Delivered"
              value={stats.delivered.toLocaleString()}
              icon={<Mail className="w-8 h-8" />}
              color="green"
            />
            <MetricCard
              title="Bounced"
              value={stats.bounced.toLocaleString()}
              icon={<TrendingDown className="w-8 h-8" />}
              color="red"
            />
            <MetricCard
              title="Opened"
              value={stats.opened.toLocaleString()}
              icon={<Eye className="w-8 h-8" />}
              color="purple"
            />
            <MetricCard
              title="Clicked"
              value={stats.clicked.toLocaleString()}
              icon={<MousePointer className="w-8 h-8" />}
              color="orange"
            />
          </div>
        )}

        {/* Rate Metrics */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Open Rate</h3>
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">{stats.openRate}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(stats.openRate, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Industry average: ~22% open rate
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Click Rate</h3>
                <div className="flex items-center gap-2 text-blue-600">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-semibold">{stats.clickRate}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(stats.clickRate, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Industry average: ~3% click rate
              </p>
            </div>
          </div>
        )}

        {/* Chart Placeholder */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Campaign Performance Over Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            Detailed charts will appear here once integrated with SendGrid webhook data
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No campaigns sent yet</p>
              <p className="text-sm">Start by creating your first campaign</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opens</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{campaign.name}</td>
                      <td className="px-4 py-3 text-gray-600">{campaign.total_sends || 0}</td>
                      <td className="px-4 py-3 text-gray-600">{campaign.successful_sends || 0}</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                      <td className="px-4 py-3 text-gray-600">-</td>
                      <td className="px-4 py-3 text-gray-500 text-sm">
                        {campaign.sent_at ? new Date(campaign.sent_at).toLocaleDateString() : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'red' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">{title}</span>
        <div className={colorClasses[color]}>{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
