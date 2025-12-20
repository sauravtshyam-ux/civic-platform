'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';

interface Bill {
  id: string;
  title: string;
  summary: string;
  aiSummary?: string;
  status: string;
  introducedDate?: string;
  sponsor?: string;
  level: 'federal' | 'state';
  state?: string;
  billNumber: string;
  upvotes: number;
  downvotes: number;
  amendments: Amendment[];
}

interface Amendment {
  id: string;
  content: string;
  cleanedContent?: string;
  upvotes: number;
  downvotes: number;
  user: {
    firstName?: string;
    lastName?: string;
  };
}

export default function BillDetailPage() {
  const router = useRouter();
  const params = useParams();
  const billId = params.billId as string;
  const { isAuthenticated } = useAuth();

  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/onboarding');
      return;
    }
    fetchBill();
  }, [billId, isAuthenticated]);

  const fetchBill = async () => {
    try {
      const response = await api.getBillById(billId);
      setBill(response.data.data.bill);
    } catch (error) {
      console.error('Failed to fetch bill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      await api.voteBill(billId, voteType);
      setUserVote(userVote === voteType ? null : voteType);
      await fetchBill();
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-gray-600">Bill not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <span
            className={`px-4 py-2 rounded-lg text-sm font-semibold text-white ${
              bill.level === 'federal' ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            {bill.level === 'federal' ? '🏛️ Federal' : `📍 ${bill.state}`}
          </span>
          <span className="text-gray-500 font-medium">{bill.billNumber}</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">{bill.title}</h1>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
          <p className="text-sm text-gray-600">
            <strong>Sponsor:</strong> {bill.sponsor || 'Unknown'}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Status:</strong> {bill.status}
          </p>
          {bill.introducedDate && (
            <p className="text-sm text-gray-600">
              <strong>Introduced:</strong>{' '}
              {new Date(bill.introducedDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary 📝</h2>
          <p className="text-gray-700 leading-relaxed">
            {bill.aiSummary || bill.summary}
          </p>
        </div>

        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => handleVote('upvote')}
            className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
              userVote === 'upvote'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👍 {bill.upvotes}
          </button>
          <button
            onClick={() => handleVote('downvote')}
            className={`flex-1 py-3 rounded-lg font-bold transition-colors ${
              userVote === 'downvote'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👎 {bill.downvotes}
          </button>
        </div>

        <button
          onClick={() => router.push(`/amend/${billId}`)}
          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary-dark mb-8"
        >
          ✏️ Propose Amendment
        </button>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Community Amendments ({bill.amendments.length})
          </h2>
          {bill.amendments.length === 0 ? (
            <p className="text-gray-600 italic">
              No amendments yet. Be the first!
            </p>
          ) : (
            <div className="space-y-4">
              {bill.amendments.map((amendment) => (
                <div
                  key={amendment.id}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <p className="text-sm font-semibold text-primary mb-2">
                    {amendment.user.firstName || 'Anonymous'}{' '}
                    {amendment.user.lastName || ''}
                  </p>
                  <p className="text-gray-700 mb-3">
                    {amendment.cleanedContent || amendment.content}
                  </p>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>👍 {amendment.upvotes}</span>
                    <span>👎 {amendment.downvotes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
