'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
      handleUnsubscribe(token);
    } else {
      setError('Invalid unsubscribe link');
      setLoading(false);
    }
  }, []);

  const handleUnsubscribe = async (token: string) => {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setEmail(data.email || '');
      } else {
        setError(data.error || 'Failed to unsubscribe');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {loading ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing unsubscribe request...</p>
          </div>
        ) : success ? (
          <div>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Successfully Unsubscribed</h1>
            {email && (
              <p className="text-gray-600 mb-4">
                <strong>{email}</strong> has been removed from our mailing list.
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              You will no longer receive emails from us. We're sorry to see you go!
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Return to Homepage
            </Link>
          </div>
        ) : (
          <div>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Unsubscribe Failed</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Return to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
