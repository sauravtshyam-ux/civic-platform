'use client';

import Link from 'next/link';
import { Bill } from '@/hooks/useBills';

interface BillCardProps {
  bill: Bill;
}

export default function BillCard({ bill }: BillCardProps) {
  const displaySummary = bill.aiSummary || bill.summary;
  const truncatedSummary =
    displaySummary.length > 200
      ? displaySummary.substring(0, 200) + '...'
      : displaySummary;

  return (
    <Link href={`/bill/${bill.id}`}>
      <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-3">
          <span
            className={`px-3 py-1 rounded-md text-xs font-semibold text-white ${
              bill.level === 'federal' ? 'bg-primary' : 'bg-secondary'
            }`}
          >
            {bill.level === 'federal' ? '🏛️ Federal' : `📍 ${bill.state}`}
          </span>
          <span className="text-sm text-gray-500 font-medium">
            {bill.billNumber}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{bill.title}</h3>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncatedSummary}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <span className="text-sm font-semibold text-gray-700">
              👍 {bill.upvotes}
            </span>
            <span className="text-sm font-semibold text-gray-700">
              👎 {bill.downvotes}
            </span>
          </div>
          <span className="text-xs text-gray-500 italic">{bill.status}</span>
        </div>
      </div>
    </Link>
  );
}
