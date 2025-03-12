'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import Image from 'next/image';
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { updateUser } from '@/store/authSlice';

const MONTHLY_PRICE = 9.99;
const ANNUAL_PRICE = 99.99;

const GRASSPASS_BENEFITS = [
  'Free delivery on all orders',
  'Priority dispatch',
  'Exclusive member discounts',
  'Early access to new products',
  'Member-only rewards'
];

export default function GrassPass() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [selectedTier, setSelectedTier] = useState<'Monthly' | 'Annual'>('Annual');

  const handleSubscribe = () => {
    dispatch(updateUser({
      grassPass: {
        tier: selectedTier,
        expiryDate: new Date(Date.now() + (selectedTier === 'Annual' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        autoRenew: true,
        status: 'active'
      }
    }));
    router.push('/');
  };

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-lg border-b border-grass-primary/20 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:text-grass-primary transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">GrassPass</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <Image
              src="/GrassPassLogo.png"
              alt="GrassPass"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold mb-4">Unlock Premium Cannabis Delivery</h2>
          <p className="text-gray-400">
            Join GrassPass for exclusive benefits and unlimited free delivery
          </p>
        </div>

        {/* Benefits */}
        <div className="bg-grass-bg-light rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Member Benefits</h3>
          <div className="space-y-4">
            {GRASSPASS_BENEFITS.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3">
                <CheckIcon className="w-5 h-5 text-grass-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Tiers */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setSelectedTier('Monthly')}
            className={`w-full p-6 rounded-xl border-2 transition-colors ${
              selectedTier === 'Monthly'
                ? 'border-grass-primary bg-grass-primary/10'
                : 'border-gray-800 bg-black'
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h3 className="text-xl font-semibold">Monthly</h3>
                <p className="text-gray-400">Pay monthly, cancel anytime</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${MONTHLY_PRICE}</div>
                <div className="text-sm text-gray-400">/month</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedTier('Annual')}
            className={`w-full p-6 rounded-xl border-2 relative transition-colors ${
              selectedTier === 'Annual'
                ? 'border-grass-primary bg-grass-primary/10'
                : 'border-gray-800 bg-black'
            }`}
          >
            <div className="absolute -top-3 right-4 bg-grass-primary text-black text-sm font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h3 className="text-xl font-semibold">Annual</h3>
                <p className="text-gray-400">Save $20/year</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">${ANNUAL_PRICE}</div>
                <div className="text-sm text-gray-400">/year</div>
              </div>
            </div>
          </button>
        </div>

        {/* Subscribe Button */}
        <button
          onClick={handleSubscribe}
          className="w-full bg-grass-primary hover:bg-grass-primary-light text-white py-4 rounded-xl font-semibold transition-colors"
        >
          Subscribe Now
        </button>

        {/* FAQ */}
        <div className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400">Yes, you can cancel your subscription at any time. No commitments.</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">How do I use my benefits?</h4>
              <p className="text-gray-400">Benefits are automatically applied to your account. Just order as usual!</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Do my points expire?</h4>
              <p className="text-gray-400">GrassPass members' points never expire while subscription is active.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 