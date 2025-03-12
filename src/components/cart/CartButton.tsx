'use client';

import { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '@/store/hooks';
import { CartDrawer } from './CartDrawer';
import { RootState } from '@/store/store';

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useAppSelector((state: RootState) => state.cart);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-white hover:text-grass-accent transition-colors"
        aria-label="Open cart"
      >
        <ShoppingCartIcon className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-grass-accent text-grass-bg text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
} 