'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProductConfirmModal from './ProductConfirmModal';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    image_url?: string;
    strain_type?: string;
    thc?: string;
    metadata: {
      sizes: Array<{
        name: string;
        weight: string;
        price: number;
      }>;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="bg-grass-bg-light rounded-xl overflow-hidden border border-grass-primary/20 hover:border-grass-primary/40 transition-colors cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative h-48">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-grass-primary text-4xl">
              🌿
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-1">{product.name}</h3>
          {product.strain_type && (
            <p className="text-sm text-gray-400 mb-2">{product.strain_type}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="font-bold">${product.metadata.sizes[0].price.toFixed(2)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="bg-grass-primary px-4 py-1 rounded-lg hover:bg-grass-primary-light transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <ProductConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
} 