'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/onboarding');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
            {user.firstName?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Location Info
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">ZIP Code</span>
                <span className="font-semibold text-gray-900">
                  {user.zipCode || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">State</span>
                <span className="font-semibold text-gray-900">
                  {user.state || 'Not set'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">District</span>
                <span className="font-semibold text-gray-900">
                  {user.district || 'Not set'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
