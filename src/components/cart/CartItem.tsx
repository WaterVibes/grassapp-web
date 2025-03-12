'use client';

import { CartItem as CartItemType } from '@/store/cartSlice';
import Image from 'next/image';
import { useAppDispatch } from '@/store/hooks';
import { removeItem, updateItemQuantity } from '@/store/cartSlice';
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { CannabisIcon } from '@/components/icons/CannabisIcon';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const dispatch = useAppDispatch();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateItemQuantity({ itemId: item.id, quantity: newQuantity }));
  };

  const handleRemove = () => {
    dispatch(removeItem(item.id));
  };

  return (
    <div className="group relative flex gap-4 p-4 bg-grass-bg-light rounded-xl border border-grass-primary/20 hover:border-grass-primary/40 transition-all duration-300">
      {/* Product Image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-grass-primary">
            <CannabisIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white truncate">{item.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              {item.strain_type && <span>{item.strain_type}</span>}
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-all duration-300"
            aria-label="Remove item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>

        {/* THC/CBD Content */}
        {(item.thc || item.cbd) && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
            {item.thc && <span>THC: {item.thc}</span>}
            {item.thc && item.cbd && <span>•</span>}
            {item.cbd && <span>CBD: {item.cbd}</span>}
          </div>
        )}

        {/* Quantity and Price Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3 bg-grass-bg rounded-lg p-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="p-1 rounded-md hover:bg-grass-primary/10 text-grass-primary transition-colors"
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-white">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="p-1 rounded-md hover:bg-grass-primary/10 text-grass-primary transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">
              ${(item.price * item.quantity).toFixed(2)}
            </div>
            {item.quantity > 1 && (
              <div className="text-sm text-gray-400">
                ${item.price.toFixed(2)} each
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 