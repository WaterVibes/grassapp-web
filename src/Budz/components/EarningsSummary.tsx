'use client';

import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface EarningsSummaryProps {
  onBack: () => void;
  dailyEarnings: number;
  weeklyEarnings: number;
  payoutHistory: Array<{
    id: string;
    amount: number;
    status: 'processing' | 'completed' | 'failed';
    method: 'ach' | 'instant';
    date: string;
    estimatedArrival?: string;
  }>;
}

export const EarningsSummary: React.FC<EarningsSummaryProps> = ({
  onBack,
  dailyEarnings,
  weeklyEarnings,
  payoutHistory
}) => {
  return (
    <div className="min-h-screen bg-grass-bg text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onBack}
            className="p-2 hover:text-grass-primary transition-colors"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Earnings</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Daily Summary */}
      <div className="p-6">
        <div className="bg-grass-bg-light rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Today's Earnings</h2>
          <div className="text-4xl font-bold text-grass-primary mb-2">
            ${dailyEarnings.toFixed(2)}
          </div>
          <div className="text-sm text-gray-400">
            Week to date: ${weeklyEarnings.toFixed(2)}
          </div>
        </div>

        {/* Payout History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Payout History</h2>
          <div className="bg-grass-bg-light rounded-xl divide-y divide-white/10">
            {payoutHistory.map(payout => (
              <div key={payout.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium">${payout.amount.toFixed(2)}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(payout.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${
                      payout.status === 'completed' ? 'text-green-500' :
                      payout.status === 'processing' ? 'text-yellow-500' :
                      'text-red-500'
                    }`}>
                      {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {payout.method.toUpperCase()}
                    </div>
                  </div>
                </div>
                {payout.status === 'processing' && payout.estimatedArrival && (
                  <div className="text-sm text-yellow-500">
                    Estimated arrival: {new Date(payout.estimatedArrival).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ACH Notice */}
        <div className="mt-6 p-4 bg-grass-bg-light rounded-xl">
          <div className="text-sm text-gray-400">
            <p className="mb-2">
              <strong>ACH Transfer Times:</strong>
            </p>
            <p>Standard ACH transfers typically take 2-3 business days to process. Transfers initiated after 5 PM EST or on weekends/holidays will begin processing the next business day.</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 