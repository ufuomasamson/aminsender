'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState } from 'react';
import { Settings as SettingsIcon, Key, Shield, TestTube } from 'lucide-react';
import { createClient as createSupabaseClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const [awsAccessKeyId, setAwsAccessKeyId] = useState('');
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState('');
  const [awsRegion, setAwsRegion] = useState('');
  const [defaultSenderEmail, setDefaultSenderEmail] = useState('');
  const [testEmail, setTestEmail] = useState('');
  const [testing, setTesting] = useState(false);

  const handleSaveSes = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('AWS SES configuration uses environment variables. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in .env.local or your hosting provider.');
  };

  const handleTestEmail = async () => {
    setTesting(true);
    try {
      const fromEmail = `noreply@yourdomain.com`;
      const res = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: testEmail, from: fromEmail, fromName: 'ZoMail Pro' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      alert('Test email sent via AWS SES');
    } catch (e: any) {
      alert(e.message || 'Failed to send test email');
    } finally {
      setTesting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-1">Configure your ZoMail Pro integration</p>
        </div>

        {/* AWS SES Configuration */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Key className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold">AWS SES Configuration</h3>
          </div>

          <form onSubmit={handleSaveSes} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AWS Access Key ID
              </label>
              <input
                type="password"
                value={awsAccessKeyId}
                onChange={(e) => setAwsAccessKeyId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AKIA..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AWS Secret Access Key
              </label>
              <input
                type="password"
                value={awsSecretAccessKey}
                onChange={(e) => setAwsSecretAccessKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="****************"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">AWS Region</label>
              <input
                type="text"
                value={awsRegion}
                onChange={(e) => setAwsRegion(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="us-east-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test Email</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testing || !testEmail}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  <TestTube className="w-5 h-5" />
                  {testing ? 'Sending...' : 'Send Test'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ensure your domain and sender are verified in SES.</p>
            </div>

            <button
              type="submit"
              disabled={!awsAccessKeyId || !awsSecretAccessKey || !awsRegion}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              Save Guidance
            </button>
          </form>

          <div className="mt-8 border-t pt-6">
            <h4 className="text-lg font-semibold mb-4">Default Sender Email</h4>
            <form onSubmit={handleSaveDefaultSender} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
                <input
                  type="email"
                  value={defaultSenderEmail}
                  onChange={(e) => setDefaultSenderEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="sender@yourdomain.com"
                />
                <p className="text-xs text-gray-500 mt-1">This is used if SES identities cannot be listed.</p>
              </div>
              <button
                type="submit"
                disabled={!defaultSenderEmail}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                Save Sender Email
              </button>
            </form>
          </div>
        </div>

        {/* Email Authentication Setup */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold">Email Authentication (SPF/DKIM/DMARC) for SES</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step 1: Add SPF Record</h4>
              <p className="text-sm text-gray-600 mb-2">
                Add this TXT record to your DNS:
              </p>
              <code className="text-xs bg-white px-3 py-2 rounded block">
                v=spf1 include:amazonses.com ~all
              </code>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step 2: Add DKIM Record</h4>
              <p className="text-sm text-gray-600 mb-2">
                Verify your domain in SES and add the provided CNAME records for DKIM.
              </p>
              <code className="text-xs bg-white px-3 py-2 rounded block">
                AWS Console → SES → Verified identities → Add domain
              </code>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Step 3: Add DMARC Record</h4>
              <p className="text-sm text-gray-600 mb-2">
                Add this TXT record as _dmarc.yourdomain.com:
              </p>
              <code className="text-xs bg-white px-3 py-2 rounded block">
                v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com
              </code>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> These steps ensure your emails land in the inbox and not spam.
                Follow AWS SES{' '}
                <a
                  href="https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  identity and authentication guide
                </a>{' '}
                for detailed instructions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
  const handleSaveDefaultSender = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createSupabaseClient();
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'sender_email', value: defaultSenderEmail });
      if (error) throw new Error(error.message);
      alert('Default sender email saved');
    } catch (err: any) {
      alert(err.message || 'Failed to save sender email');
    }
  };
