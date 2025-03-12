'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeftIcon, ShareIcon, ClipboardIcon, CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const REFERRAL_REWARDS = {
  inviter: 10, // $10 for referring
  invitee: 20  // $20 for new user
};

const MOCK_REFERRALS = [
  {
    id: '1',
    name: 'John D.',
    status: 'completed',
    date: '2024-03-15',
    reward: 10
  },
  {
    id: '2',
    name: 'Sarah M.',
    status: 'pending',
    date: '2024-03-14',
    reward: 10
  }
];

const SHARE_METHODS = [
  {
    name: 'Text Message',
    icon: '💬',
    action: 'sms'
  },
  {
    name: 'WhatsApp',
    icon: '📱',
    action: 'whatsapp'
  },
  {
    name: 'Email',
    icon: '📧',
    action: 'email'
  },
  {
    name: 'Copy Link',
    icon: '🔗',
    action: 'copy'
  }
];

export default function Refer() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);
  const referralCode = 'GRASS10'; // In a real app, this would come from the user's data

  const handleShare = (method: string) => {
    const referralLink = `https://grassapp.com/refer/${referralCode}`;
    const message = `Join GrassApp using my referral code ${referralCode} and get $${REFERRAL_REWARDS.invitee} off your first order!`;

    switch (method) {
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Join%20GrassApp&body=${encodeURIComponent(message)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(referralLink).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
        break;
    }
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
            <h1 className="text-xl font-bold">Refer Friends</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Hero Section */}
        <div className="bg-grass-bg-light rounded-xl p-6 mb-8 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Give $20, Get $10</h2>
            <p className="text-gray-400 mb-6">
              Share GrassApp with friends and you'll both get rewarded
            </p>
            
            {/* Referral Code */}
            <div className="bg-black rounded-lg p-4 mb-6 inline-block">
              <div className="text-sm text-gray-400 mb-1">Your Referral Code</div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{referralCode}</span>
                <button
                  onClick={() => handleShare('copy')}
                  className="p-2 hover:text-grass-primary transition-colors"
                >
                  {copied ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    <ClipboardIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Share Methods */}
            <div className="grid grid-cols-4 gap-4">
              {SHARE_METHODS.map((method) => (
                <button
                  key={method.action}
                  onClick={() => handleShare(method.action)}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-black hover:bg-grass-primary/10 transition-colors"
                >
                  <span className="text-2xl">{method.icon}</span>
                  <span className="text-sm">{method.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-repeat" style={{ backgroundImage: "url('/pattern.png')" }} />
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-grass-primary flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-medium">Share Your Code</h4>
                <p className="text-gray-400">Send your unique referral code to friends</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-grass-primary flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-medium">Friend Orders</h4>
                <p className="text-gray-400">They get ${REFERRAL_REWARDS.invitee} off their first order</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-grass-primary flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-medium">You Get Rewarded</h4>
                <p className="text-gray-400">Earn ${REFERRAL_REWARDS.inviter} when they complete their first order</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral History */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Referral History</h3>
          {MOCK_REFERRALS.length > 0 ? (
            <div className="space-y-4">
              {MOCK_REFERRALS.map((referral) => (
                <div
                  key={referral.id}
                  className="bg-grass-bg-light rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{referral.name}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(referral.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${
                      referral.status === 'completed' ? 'text-grass-primary' : 'text-gray-400'
                    }`}>
                      {referral.status === 'completed' ? `+$${referral.reward}` : 'Pending'}
                    </div>
                    <div className="text-sm text-gray-400">
                      {referral.status === 'completed' ? 'Rewarded' : 'Invited'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-grass-bg-light rounded-xl">
              <ShareIcon className="w-12 h-12 mx-auto text-gray-600 mb-2" />
              <p className="text-gray-400">No referrals yet</p>
              <p className="text-sm text-gray-500">Share your code to start earning rewards</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 