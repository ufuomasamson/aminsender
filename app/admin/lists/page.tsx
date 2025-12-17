'use client';

import AdminLayout from '@/components/AdminLayout';
import { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Copy, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';
import { uploadList, verifyList } from '@/app/actions/lists';
import { useRouter } from 'next/navigation';

export default function ListsPage() {
  const [uploading, setUploading] = useState(false);
  const [lists, setLists] = useState<any[]>([]);
  const [pastedEmails, setPastedEmails] = useState('');
  const [listName, setListName] = useState('');
  const [activeTab, setActiveTab] = useState<'csv' | 'paste'>('csv');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await fetch('/api/lists');
      if (response.ok) {
        const data = await response.json();
        setLists(data);
      }
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteEmails = async () => {
    if (!pastedEmails.trim() || !listName.trim()) {
      setError('Please provide both list name and email addresses');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Parse emails (support both newline and comma separated)
      const emailLines = pastedEmails
        .split(/[\n,;]+/)
        .map(email => email.trim())
        .filter(email => email.length > 0 && email.includes('@'));

      if (emailLines.length === 0) {
        setError('No valid email addresses found');
        setUploading(false);
        return;
      }

      // Create contacts array
      const contacts = emailLines.map(email => ({
        email: email.toLowerCase(),
        name: email.split('@')[0],
      }));

      // Upload to Supabase
      const result = await uploadList({
        name: listName,
        contacts: contacts,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(`Successfully imported ${contacts.length} emails!`);
        // Clear form
        setPastedEmails('');
        setListName('');
        // Refresh lists
        fetchLists();
        // Switch to CSV tab after a moment
        setTimeout(() => setActiveTab('csv'), 2000);
      }
    } catch (error: any) {
      setError(error.message || 'Error processing emails. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      const text = await file.text();
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const data = results.data as any[];
          
          if (data.length === 0) {
            setError('CSV file is empty or has no valid data');
            setUploading(false);
            return;
          }

          // Extract list name from filename (without extension)
          const fileName = file.name.replace(/\.csv$/i, '');
          
          // Parse contacts from CSV
          const contacts = data
            .filter(row => row.email || row.Email || row.EMAIL)
            .map(row => ({
              email: (row.email || row.Email || row.EMAIL || '').toString().toLowerCase().trim(),
              name: (row.name || row.Name || row.NAME || '').toString().trim() || undefined,
              ...row,
            }))
            .filter(contact => contact.email && contact.email.includes('@'));

          if (contacts.length === 0) {
            setError('No valid email addresses found in CSV');
            setUploading(false);
            return;
          }

          // Upload to Supabase
          const result = await uploadList({
            name: fileName,
            contacts: contacts,
          });

          if (result.error) {
            setError(result.error);
          } else {
            setSuccess(`Successfully imported ${contacts.length} contacts from CSV!`);
            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            // Refresh lists
            fetchLists();
          }
          setUploading(false);
        },
        error: (error: any) => {
          setError('Error parsing CSV file: ' + error.message);
          setUploading(false);
        },
      });
    } catch (error: any) {
      setError(error.message || 'Error reading CSV file');
      setUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Contact Lists</h2>
            <p className="text-gray-600 mt-1">Manage your email subscriber lists</p>
          </div>
        </div>

        {/* Upload Section - Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Tab Buttons */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('csv')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                  activeTab === 'csv'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-5 h-5 inline-block mr-2" />
                Upload CSV File
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition ${
                  activeTab === 'paste'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Copy className="w-5 h-5 inline-block mr-2" />
                Paste Emails
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}
            {activeTab === 'csv' ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Contact List (CSV)</h3>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Drag and drop your CSV file here, or click to browse
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Choose CSV File'}
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    CSV format: email, name, and optional custom fields (one per row)
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paste Your Emails</h3>
                <p className="text-gray-600 mb-6">
                  Simply copy and paste your email addresses below (one per line or separated by commas)
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      List Name
                    </label>
                    <input
                      type="text"
                      value={listName}
                      onChange={(e) => setListName(e.target.value)}
                      placeholder="e.g., Customer List, Newsletter Subscribers"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Addresses
                    </label>
                    <textarea
                      value={pastedEmails}
                      onChange={(e) => setPastedEmails(e.target.value)}
                      placeholder="email1@example.com&#10;email2@example.com&#10;email3@example.com&#10;&#10;Or separate by commas:&#10;email1@example.com, email2@example.com, email3@example.com"
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {pastedEmails.split(/[\n,;]+/).filter(e => e.trim()).length} email(s) detected
                    </p>
                  </div>
                  
                  <button
                    onClick={handlePasteEmails}
                    disabled={!pastedEmails.trim() || !listName.trim() || uploading}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Processing...' : 'Import Emails'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lists Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Your Lists</h3>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">Loading lists...</p>
            </div>
          ) : lists.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No lists uploaded yet</p>
              <p className="text-sm text-gray-500">Upload a CSV file or paste emails to create your first list</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">List Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Contacts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Contacts</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lists.map((list) => (
                    <tr key={list.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{list.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{list.total_count}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {list.valid_count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {new Date(list.uploaded_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-4">
                        <button className="text-blue-600 hover:underline">Verify</button>
                        <button
                          onClick={() => router.push(`/admin/lists/${list.id}`)}
                          className="text-blue-600 hover:underline"
                        >
                          Manage
                        </button>
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
