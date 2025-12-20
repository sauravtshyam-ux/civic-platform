'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useBills } from '@/hooks/useBills';
import BillCard from '@/components/BillCard';

export default function ExplorePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { bills, loading: billsLoading, refetch } = useBills();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/onboarding');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || billsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bills...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Your Bills Feed 📜
        </h1>
        {user?.state && (
          <p className="text-gray-600">
            {user.state} {user.district ? `District ${user.district}` : ''}
          </p>
        )}
      </div>

      {bills.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 mb-4">No bills found</p>
          <button
            onClick={refetch}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  );
}
