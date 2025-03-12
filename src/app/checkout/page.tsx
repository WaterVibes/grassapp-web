'use client';

import { useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { clearCart } from '@/store/cartSlice';
import { placeOrder } from '@/store/ordersSlice';
import { calculateDeliveryFee } from '@/utils/api';
import { v4 as uuidv4 } from 'uuid';
import { RootState } from '@/store/store';

type PaymentMethod = 'ach' | 'crypto' | null;
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed';

export default function Checkout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [deliveryOption, setDeliveryOption] = useState<'delivery' | 'pickup'>('delivery');
  const [pickupTime, setPickupTime] = useState<'standard' | 'scheduled'>('standard');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [customTipAmount, setCustomTipAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
  const [achDetails, setAchDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountName: ''
  });
  const [cryptoWallet, setCryptoWallet] = useState('');
  const { items } = useAppSelector((state: RootState) => state.cart);

  // Mock distance (in miles) from dispensary to delivery address
  const mockDistance = 4.5;
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryOption === 'delivery' ? calculateDeliveryFee(mockDistance) : 0;
  const tip = customTipAmount ? parseFloat(customTipAmount) : (subtotal * tipPercentage) / 100;
  const total = subtotal + deliveryFee + tip;

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setPaymentStatus('pending');
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'ach') {
      return (
        achDetails.accountNumber.length >= 8 &&
        achDetails.routingNumber.length === 9 &&
        achDetails.accountName.length > 0
      );
    } else if (paymentMethod === 'crypto') {
      return cryptoWallet.length >= 26; // Basic validation for crypto wallet address
    }
    return false;
  };

  const handlePlaceOrder = async () => {
    if (!paymentMethod || !validatePaymentDetails()) {
      alert('Please complete payment details before placing order');
      return;
    }

    setPaymentStatus('processing');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would make actual payment processing calls
      setPaymentStatus('completed');

      // Create new order
      const order = {
        id: uuidv4(),
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size,
          weight: item.weight
        })),
        status: 'preparing' as const,
        deliveryTime: '30-35 min',
        total,
        subtotal,
        deliveryFee,
        tip,
        deliveryOption,
        paymentMethod,
        location: {
          pickup: {
            address: '123 Cannabis Street',
            lat: 39.2904,
            lng: -76.6122
          },
          delivery: {
            address: '123 Main Street, Apt 4B\nBaltimore, MD 21201',
            lat: 39.2950,
            lng: -76.6150
          }
        },
        createdAt: new Date().toISOString()
      };

      if (deliveryOption === 'delivery') {
        dispatch(placeOrder({
          ...order,
          status: 'seeking_buddy' as const
        }));
      } else {
        dispatch(placeOrder(order));
      }

      dispatch(clearCart());
      router.push('/order-confirmation');
    } catch (error) {
      setPaymentStatus('failed');
      alert('Payment failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-grass-bg text-white">
      {/* Header */}
      <div className="sticky top-0 bg-black border-b border-grass-primary/20 z-50">
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:text-grass-accent transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold ml-4">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Delivery Options */}
        <div className="bg-grass-bg-light rounded-xl border border-grass-primary/20 p-6 space-y-6 mb-6">
          <h2 className="text-lg font-semibold">Delivery Options</h2>
          
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="radio"
                checked={deliveryOption === 'delivery'}
                onChange={() => setDeliveryOption('delivery')}
                className="form-radio text-grass-primary"
              />
              <span className="ml-2">Delivery (${deliveryFee.toFixed(2)} - {mockDistance} miles away)</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                checked={deliveryOption === 'pickup'}
                onChange={() => setDeliveryOption('pickup')}
                className="form-radio text-grass-primary"
              />
              <span className="ml-2">Pickup</span>
            </label>
          </div>

          {deliveryOption === 'pickup' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Pickup Time</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={pickupTime === 'standard'}
                    onChange={() => setPickupTime('standard')}
                    className="form-radio text-grass-primary"
                  />
                  <span className="ml-2">Standard (20-30 min)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={pickupTime === 'scheduled'}
                    onChange={() => setPickupTime('scheduled')}
                    className="form-radio text-grass-primary"
                  />
                  <span className="ml-2">Schedule for Later</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Tip Options */}
        <div className="bg-grass-bg-light rounded-xl border border-grass-primary/20 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add a Tip</h2>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[10, 15, 20, 25].map((percentage) => (
              <button
                key={percentage}
                onClick={() => {
                  setTipPercentage(percentage);
                  setCustomTipAmount('');
                }}
                className={`py-2 rounded-lg border ${
                  tipPercentage === percentage && !customTipAmount
                    ? 'bg-grass-primary border-grass-primary text-white'
                    : 'border-grass-primary/20 hover:border-grass-primary/40'
                }`}
              >
                {percentage}%
              </button>
            ))}
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.01"
                value={customTipAmount}
                onChange={(e) => {
                  setCustomTipAmount(e.target.value);
                  setTipPercentage(0);
                }}
                placeholder="Custom"
                className="w-full py-2 px-3 rounded-lg border border-grass-primary/20 bg-transparent focus:border-grass-primary focus:outline-none text-center"
              />
              {customTipAmount && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-400 text-center">
            100% of tips go to your delivery buddy
          </p>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-grass-bg-light rounded-xl border border-grass-primary/20 p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
          <div className="space-y-4">
            <button
              onClick={() => handlePaymentMethodSelect('ach')}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'ach'
                  ? 'border-grass-primary bg-grass-primary/10'
                  : 'border-grass-primary/20 hover:border-grass-primary/40'
              }`}
            >
              <div className="text-left">
                <h3 className="font-semibold">ACH Bank Transfer</h3>
                <p className="text-sm text-gray-400">Connect your bank account</p>
              </div>
            </button>

            <button
              onClick={() => handlePaymentMethodSelect('crypto')}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                paymentMethod === 'crypto'
                  ? 'border-grass-primary bg-grass-primary/10'
                  : 'border-grass-primary/20 hover:border-grass-primary/40'
              }`}
            >
              <div className="text-left">
                <h3 className="font-semibold">Cryptocurrency</h3>
                <p className="text-sm text-gray-400">Pay with your crypto wallet</p>
              </div>
            </button>
          </div>

          {/* ACH Details Form */}
          {paymentMethod === 'ach' && (
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Account Name</label>
                <input
                  type="text"
                  value={achDetails.accountName}
                  onChange={(e) => setAchDetails(prev => ({ ...prev, accountName: e.target.value }))}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  placeholder="Enter account holder name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <input
                  type="text"
                  value={achDetails.accountNumber}
                  onChange={(e) => setAchDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Routing Number</label>
                <input
                  type="text"
                  value={achDetails.routingNumber}
                  onChange={(e) => setAchDetails(prev => ({ ...prev, routingNumber: e.target.value }))}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  placeholder="Enter routing number"
                />
              </div>
            </div>
          )}

          {/* Crypto Wallet Form */}
          {paymentMethod === 'crypto' && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Wallet Address</label>
              <input
                type="text"
                value={cryptoWallet}
                onChange={(e) => setCryptoWallet(e.target.value)}
                className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                placeholder="Enter your crypto wallet address"
              />
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-grass-bg-light rounded-xl border border-grass-primary/20 p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          
          <div className="space-y-2 text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {deliveryOption === 'delivery' && (
              <div className="flex justify-between">
                <span>Delivery Fee ({mockDistance} miles)</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tip ({tipPercentage}%)</span>
              <span>${tip.toFixed(2)}</span>
            </div>
            <div className="h-px bg-grass-primary/20 my-2"></div>
            <div className="flex justify-between text-lg text-white font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={handlePlaceOrder}
            disabled={!paymentMethod || !validatePaymentDetails() || paymentStatus === 'processing'}
            className={`w-full py-3 px-6 rounded-xl transition-colors duration-300 mt-4 ${
              !paymentMethod || !validatePaymentDetails() || paymentStatus === 'processing'
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-grass-primary hover:bg-grass-primary-light'
            }`}
          >
            {paymentStatus === 'processing' ? 'Processing Payment...' : 'Place Order'}
          </button>
          
          {paymentStatus === 'failed' && (
            <p className="text-red-500 text-sm text-center mt-2">
              Payment failed. Please try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 