'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface Bill {
  id: string;
  title: string;
  summary: string;
  aiSummary?: string;
  status: string;
  introducedDate?: string;
  lastActionDate?: string;
  sponsor?: string;
  level: 'federal' | 'state';
  state?: string;
  chamber?: 'house' | 'senate';
  billNumber: string;
  fullTextUrl?: string;
  upvotes: number;
  downvotes: number;
}

export const useBills = (params?: any) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const response = await api.getBillsFeed(params);
      setBills(response.data.data.bills);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchBills();
  };

  return { bills, loading, error, refetch };
};
