'use client';

import React from 'react';
import { Buddy, PastOrder } from '../../types/buddy';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';

interface BuddyProfileProps {
  buddy: Buddy;
  yearsActive: number;
  pastOrders: PastOrder[];
  onBack: () => void;
}

export const BuddyProfile: React.FC<BuddyProfileProps> = ({
  buddy,
  yearsActive,
  pastOrders,
  onBack
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/budz/auth');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-center">
        <button 
          onClick={onBack}
          className="bg-black rounded-full p-2 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
        >
          Logout
        </button>
      </div>

      {/* Header Image */}
      <div className="relative h-64 bg-gradient-to-b from-blue-500 to-gray-900">
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center">
          <div className="relative mb-2">
            <img
              src={buddy.photo_url}
              alt={buddy.name}
              className="w-24 h-24 rounded-full border-4 border-white"
            />
            <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-4 border-gray-900" />
          </div>
          <h1 className="text-2xl font-bold">{buddy.name}</h1>
          <div className="flex items-center mt-2">
            <span className="text-sm bg-blue-500 px-2 py-1 rounded mr-2">MMCC ID: {buddy.mmccId}</span>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-bold">{buddy.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-8">
        <div className="flex justify-around mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{buddy.total_deliveries}</div>
            <div className="text-gray-400">Deliveries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{yearsActive}</div>
            <div className="text-gray-400">Years</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">${buddy.yearToDateEarnings.toFixed(2)}</div>
            <div className="text-gray-400">YTD Earnings</div>
          </div>
        </div>

        {/* Past Orders */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Past Orders</h2>
          <div className="space-y-4">
            {pastOrders.map(order => (
              <div key={order.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{order.dispensary}</h3>
                    <p className="text-sm text-gray-400">Patient ID: {order.patient.mmccId}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-green-500 font-semibold">${order.earnings}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  {order.items.map((item, index) => (
                    <div key={index} className="text-sm flex justify-between">
                      <span>{item.name} ({item.quantity})</span>
                      <span className="text-gray-400">{item.thc} THC</span>
                    </div>
                  ))}
                </div>
                {/* Compliance Badge */}
                {order.complianceChecks.orderCompliant && (
                  <div className="mt-2 flex items-center text-green-500 text-sm">
                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    MMCC Compliant
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tax Info Section */}
        <div className="mt-8 bg-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Tax Information</h3>
          <p className="text-sm text-gray-400 mb-2">
            Remember to track your mileage and expenses for tax deductions. Your 1099-MISC will be available in January.
          </p>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold">
            Download Tax Documents
          </button>
        </div>
      </div>
    </div>
  );
}; 