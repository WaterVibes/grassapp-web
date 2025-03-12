'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import Link from 'next/link';
import { RootState } from '@/store/store';
import { MapPinIcon } from '@heroicons/react/24/outline';

export default function OrderConfirmation() {
  const router = useRouter();
  const { activeOrder } = useAppSelector((state: RootState) => state.orders);
  const { user } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!activeOrder) {
      router.push('/');
    }
  }, [activeOrder, router]);

  if (!activeOrder) {
    return null;
  }

  // Get the delivery address from user's verified addresses
  const deliveryAddress = user?.deliveryAddresses[user.defaultAddressIndex];

  return (
    <div className="min-h-screen bg-grass-bg text-white">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Order Confirmation Card */}
        <div className="bg-black rounded-3xl border border-grass-primary/20 p-8 mb-6">
          <h1 className="text-3xl font-bold text-center mb-6">We Are On The Way!</h1>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-xl">Order Number</span>
              <span className="text-xl font-bold">#{activeOrder.id.slice(-5).toUpperCase()}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-xl">Estimated Delivery</span>
              <span className="text-xl font-bold">30-35 min</span>
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-black rounded-3xl border border-grass-primary/20 p-8 mb-6">
          <h2 className="text-3xl font-bold mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            {activeOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            
            <div className="h-px bg-grass-primary/20 my-4"></div>
            
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${activeOrder.subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>${activeOrder.deliveryFee.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span>Tip</span>
              <span>${activeOrder.tip.toFixed(2)}</span>
            </div>
            
            <div className="h-px bg-grass-primary/20 my-4"></div>
            
            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>${activeOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address Card */}
        <div className="bg-black rounded-3xl border border-grass-primary/20 p-8 mb-6">
          <h2 className="text-3xl font-bold mb-4">Delivery Address</h2>
          {deliveryAddress ? (
            <div className="space-y-2">
              <div className="text-xl">
                <p>{deliveryAddress.street}</p>
                {deliveryAddress.unit && <p>Unit {deliveryAddress.unit}</p>}
                <p>{deliveryAddress.city}, {deliveryAddress.state} {deliveryAddress.zip}</p>
              </div>
              {activeOrder.deliveryOption === 'delivery' && (
                <>
                  <div className="mt-4 flex items-center text-grass-primary">
                    <MapPinIcon className="w-5 h-5 mr-2" />
                    <span>Delivery Instructions:</span>
                  </div>
                  <p className="text-gray-400">
                    Please have your MMCC card ready for verification upon delivery.
                  </p>
                  {deliveryAddress.isVerified && (
                    <div className="mt-2 px-3 py-1 bg-grass-primary/20 text-grass-primary inline-block rounded-full text-sm">
                      ✓ Verified Address
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-xl text-red-500">No delivery address provided</p>
          )}
        </div>

        {/* Back to Home Button */}
        <Link 
          href="/"
          className="block w-full bg-black text-white text-center py-4 rounded-full border border-white/20 hover:bg-grass-bg-light transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 