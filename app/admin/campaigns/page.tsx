'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Send, Image as ImageIcon, Link as LinkIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { createCampaign, sendCampaign } from '@/app/actions/campaigns';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function CampaignsPage() {
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [selectedList, setSelectedList] = useState('');
  const [lists, setLists] = useState<any[]>([]);
  const [senderEmails, setSenderEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLists();
    fetchSenderEmails();
  }, []);

  const fetchSenderEmails = async () => {
    try {
      const response = await fetch('/api/ses/identities');
      if (response.ok) {
        const data = await response.json();
        setSenderEmails(data);
        if (data.length > 0 && !senderEmail) {
          setSenderEmail(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching sender emails:', error);
    }
  };

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists');
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Create campaign
      const campaignResult = await createCampaign({
        name: campaignName || subject,
        subject: subject,
        htmlContent: htmlContent,
        senderName: senderName,
        senderEmail: senderEmail,
        listId: selectedList,
      });

      if (campaignResult.error || !campaignResult.campaign) {
        setError(campaignResult.error || 'Failed to create campaign');
        setLoading(false);
        return;
      }

      // Send campaign
      const sendResult = await sendCampaign(campaignResult.campaign.id);

      if (sendResult.error) {
        setError(sendResult.error);
      } else {
        setSuccess(`Campaign sent successfully! ${sendResult.totalSent} emails sent.`);
        // Reset form
        setCampaignName('');
        setSubject('');
        setHtmlContent('');
        setSenderName('');
        setSenderEmail('');
        setSelectedList('');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send campaign');
    } finally {
      setLoading(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Create Campaign</h2>
          <p className="text-gray-600 mt-1">Design and send your email campaign</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campaign Name */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Campaign Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Weekly Newsletter, Product Launch"
                required
              />
            </div>
          </div>

          {/* Sender Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Sender Information</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender Name
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sender Email
                </label>
                {senderEmails.length > 0 ? (
                  <select
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select verified email...</option>
                    {senderEmails.map((email) => (
                      <option key={email} value={email}>
                        {email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="sender@yourdomain.com"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Using verified identity from AWS SES</p>
                  </>
                )}
                <p className="text-xs text-gray-500 mt-1">Use the identity you verified in AWS SES</p>
              </div>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Campaign Details</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select List
              </label>
              <select
                value={selectedList}
                onChange={(e) => setSelectedList(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a list...</option>
                {lists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name} ({list.total_count} contacts)
                  </option>
                ))}
              </select>
              {lists.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No lists available. Create one first.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your email subject here..."
                maxLength={100}
                required
              />
              <p className="text-xs text-gray-500 mt-1">{subject.length}/100 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Content
              </label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <ReactQuill
                  theme="snow"
                  value={htmlContent}
                  onChange={setHtmlContent}
                  modules={quillModules}
                  className="bg-white"
                />
              </div>
              <div className="mt-4 flex gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Personalization: Use {'{{first_name}}'} for names
                </span>
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Images will be uploaded to your storage
                </span>
              </div>
            </div>
          </div>

          {/* Preview Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="bg-white p-4 rounded border shadow-sm">
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-1">From: {senderName || 'Your Name'}</div>
                  <div className="text-sm text-gray-600 mb-2">Subject: {subject || 'Your Subject'}</div>
                </div>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: htmlContent || '<p>Your email content will appear here...</p>' }}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              disabled={loading || !selectedList || lists.length === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Campaign'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
