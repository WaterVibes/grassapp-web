'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CartItem } from './CartItem';
import { clearCart } from '@/store/cartSlice';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

export function Cart() {
  const { items, dispensaryUrl, isLoading, error } = useAppSelector((state: RootState) => state.cart);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + tax;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grass-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Error loading cart: {error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center p-8">
        <ShoppingCartIcon className="w-16 h-16 mx-auto text-grass-primary/50 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-400">Add some products to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Cart</h2>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-red-500 hover:text-red-400 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      {/* Cart Summary */}
      <div className="bg-grass-bg-light rounded-xl p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        
        <div className="space-y-2 text-gray-400">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="h-px bg-grass-primary/20 my-2"></div>
          <div className="flex justify-between text-lg text-white font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <button 
          onClick={() => router.push('/checkout')}
          className="w-full bg-grass-primary hover:bg-grass-primary-light text-white py-3 px-6 rounded-xl transition-colors duration-300 mt-4"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
} 