'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeftIcon, GiftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const AVAILABLE_REWARDS = [
  {
    id: 1,
    name: '$5 Off Your Next Order',
    points: 500,
    description: 'Get $5 off your next order over $50',
    expiresIn: '30 days after redemption',
    image: '/rewards/discount.png'
  },
  {
    id: 2,
    name: 'Free Delivery',
    points: 750,
    description: 'One free delivery on your next order',
    expiresIn: '14 days after redemption',
    image: '/rewards/delivery.png'
  },
  {
    id: 3,
    name: '$10 Off Premium Flower',
    points: 1000,
    description: 'Get $10 off any premium flower purchase',
    expiresIn: '30 days after redemption',
    image: '/rewards/flower.png'
  },
  {
    id: 4,
    name: 'VIP Early Access',
    points: 2000,
    description: 'Get early access to new products for 1 month',
    expiresIn: '30 days after redemption',
    image: '/rewards/vip.png'
  }
];

const REWARDS_HISTORY = [
  {
    id: 'RWD-001',
    name: '$5 Off Your Next Order',
    points: 500,
    redeemedAt: '2024-03-15T10:30:00Z',
    status: 'used',
    orderId: 'ORD-789'
  },
  {
    id: 'RWD-002',
    name: 'Free Delivery',
    points: 750,
    redeemedAt: '2024-03-10T15:45:00Z',
    status: 'expired',
    orderId: null
  }
];

export default function Rewards() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'available' | 'history'>('available');

  const handleRedeemReward = (rewardId: number) => {
    // In a real app, this would make an API call to redeem the reward
    console.log('Redeeming reward:', rewardId);
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
            <h1 className="text-xl font-bold">Rewards</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Points Balance */}
        <div className="bg-grass-bg-light rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">{user?.grassPoints || 0}</h2>
              <p className="text-gray-400">Available Points</p>
            </div>
            <div className="relative w-12 h-12">
              <Image
                src="/GrassPointsLogo.png"
                alt="GrassPoints"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="text-sm text-gray-400">
            Earn 1 point for every $1 spent
            {user?.grassPass && <span className="text-grass-primary"> • 2x points with GrassPass</span>}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-2 text-center rounded-lg transition-colors ${
              activeTab === 'available'
                ? 'bg-grass-primary text-white'
                : 'bg-grass-bg-light text-gray-400'
            }`}
          >
            Available Rewards
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-center rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-grass-primary text-white'
                : 'bg-grass-bg-light text-gray-400'
            }`}
          >
            History
          </button>
        </div>

        {/* Available Rewards */}
        {activeTab === 'available' && (
          <div className="space-y-4">
            {AVAILABLE_REWARDS.map((reward) => (
              <div
                key={reward.id}
                className="bg-grass-bg-light rounded-xl p-4 flex gap-4"
              >
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={reward.image}
                    alt={reward.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold">{reward.name}</h3>
                    <span className="text-grass-primary font-medium">
                      {reward.points} pts
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{reward.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Expires: {reward.expiresIn}
                    </span>
                    <button
                      onClick={() => handleRedeemReward(reward.id)}
                      disabled={!user || (user.grassPoints || 0) < reward.points}
                      className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                        (!user || (user.grassPoints || 0) < reward.points)
                          ? 'bg-gray-800 text-gray-500'
                          : 'bg-grass-primary hover:bg-grass-primary-light text-white'
                      }`}
                    >
                      {(!user || (user.grassPoints || 0) < reward.points)
                        ? 'Not Enough Points'
                        : 'Redeem'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rewards History */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {REWARDS_HISTORY.length === 0 ? (
              <div className="text-center py-8">
                <GiftIcon className="w-12 h-12 mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No rewards history yet</p>
              </div>
            ) : (
              REWARDS_HISTORY.map((reward) => (
                <div
                  key={reward.id}
                  className="bg-grass-bg-light rounded-xl p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{reward.name}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(reward.redeemedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      reward.status === 'used'
                        ? 'bg-green-500/20 text-green-500'
                        : 'bg-red-500/20 text-red-500'
                    }`}>
                      {reward.status.charAt(0).toUpperCase() + reward.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{reward.points} points</span>
                    {reward.orderId && (
                      <span className="text-grass-primary">
                        Order #{reward.orderId}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
} 