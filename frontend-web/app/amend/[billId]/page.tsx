'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

export default function AmendBillPage() {
  const router = useRouter();
  const params = useParams();
  const billId = params.billId as string;
  const { isAuthenticated } = useAuth();

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/onboarding');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (content.trim().length < 10) {
      setError('Amendment must be at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      await api.createAmendment(billId, content);
      router.push(`/bill/${billId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit amendment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ✏️ Propose Amendment
        </h1>
        <p className="text-gray-600 mb-6">
          Share your ideas to improve this bill. Your proposal will be reviewed
          by AI for clarity and appropriateness.
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={10}
            placeholder="Describe your proposed amendment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Amendment'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
