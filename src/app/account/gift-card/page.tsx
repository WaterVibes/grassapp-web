'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const GIFT_CARD_AMOUNTS = [25, 50, 75, 100, 150, 200];

const GIFT_CARD_DESIGNS = [
  {
    id: 'classic',
    name: 'Classic Green',
    image: '/gift-cards/classic.png',
    description: 'Our signature design with a modern twist'
  },
  {
    id: 'gold',
    name: 'Premium Gold',
    image: '/gift-cards/gold.png',
    description: 'Elegant gold accents on dark background'
  },
  {
    id: 'holiday',
    name: 'Holiday Special',
    image: '/gift-cards/holiday.png',
    description: 'Festive design perfect for gifting'
  }
];

export default function GiftCard() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'check' | 'redeem' | 'purchase'>('check');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [selectedDesign, setSelectedDesign] = useState(GIFT_CARD_DESIGNS[0]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleCheckBalance = () => {
    // In a real app, this would make an API call to check the balance
    console.log('Checking balance for:', giftCardCode);
  };

  const handleRedeemCard = () => {
    // In a real app, this would make an API call to redeem the gift card
    console.log('Redeeming card:', giftCardCode);
  };

  const handlePurchase = () => {
    // In a real app, this would navigate to checkout with the gift card details
    console.log('Purchasing gift card:', {
      amount: selectedAmount,
      design: selectedDesign,
      recipientEmail,
      message
    });
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
            <h1 className="text-xl font-bold">Gift Cards</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Balance Display */}
        <div className="bg-grass-bg-light rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Gift Card Balance</h2>
              <p className="text-gray-400">Your available balance</p>
            </div>
            <div className="text-3xl font-bold text-grass-primary">$0.00</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-grass-primary/20 mb-6">
          <button
            onClick={() => setActiveTab('check')}
            className={`px-4 py-2 ${
              activeTab === 'check'
                ? 'text-grass-primary border-b-2 border-grass-primary'
                : 'text-gray-400'
            }`}
          >
            Check Balance
          </button>
          <button
            onClick={() => setActiveTab('redeem')}
            className={`px-4 py-2 ${
              activeTab === 'redeem'
                ? 'text-grass-primary border-b-2 border-grass-primary'
                : 'text-gray-400'
            }`}
          >
            Redeem Card
          </button>
          <button
            onClick={() => setActiveTab('purchase')}
            className={`px-4 py-2 ${
              activeTab === 'purchase'
                ? 'text-grass-primary border-b-2 border-grass-primary'
                : 'text-gray-400'
            }`}
          >
            Buy Gift Card
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'check' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gift Card Number</label>
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                  placeholder="Enter 16-digit code"
                  className="w-full bg-grass-bg-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary"
                />
              </div>
              <button
                onClick={handleCheckBalance}
                disabled={!giftCardCode}
                className="w-full bg-grass-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grass-primary-light transition-colors"
              >
                Check Balance
              </button>
            </div>
          )}

          {activeTab === 'redeem' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Gift Card Number</label>
                <input
                  type="text"
                  value={giftCardCode}
                  onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                  placeholder="Enter 16-digit code"
                  className="w-full bg-grass-bg-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary"
                />
              </div>
              <button
                onClick={handleRedeemCard}
                disabled={!giftCardCode}
                className="w-full bg-grass-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grass-primary-light transition-colors"
              >
                Redeem Card
              </button>
            </div>
          )}

          {activeTab === 'purchase' && (
            <div className="space-y-6">
              {/* Amount Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Amount</label>
                <div className="grid grid-cols-3 gap-3">
                  {GIFT_CARD_AMOUNTS.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setSelectedAmount(amount)}
                      className={`py-3 rounded-xl font-medium ${
                        selectedAmount === amount
                          ? 'bg-grass-primary text-white'
                          : 'bg-grass-bg-light text-white hover:bg-grass-primary/20'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Design Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Design</label>
                <div className="grid grid-cols-3 gap-4">
                  {GIFT_CARD_DESIGNS.map((design) => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design)}
                      className={`relative rounded-xl overflow-hidden ${
                        selectedDesign.id === design.id
                          ? 'ring-2 ring-grass-primary'
                          : ''
                      }`}
                    >
                      <div className="relative aspect-[2/1]">
                        <Image
                          src={design.image}
                          alt={design.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="text-sm font-medium">{design.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Recipient's Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient's email"
                    className="w-full bg-grass-bg-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Personal Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message..."
                    rows={3}
                    className="w-full bg-grass-bg-light rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-grass-primary resize-none"
                  />
                </div>
              </div>

              {/* Purchase Button */}
              <button
                onClick={handlePurchase}
                disabled={!recipientEmail}
                className="w-full bg-grass-primary text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grass-primary-light transition-colors"
              >
                Purchase Gift Card (${selectedAmount})
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 