'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { CartButton } from '@/components/cart/CartButton';
import { addItem } from '@/store/cartSlice';
import { v4 as uuidv4 } from 'uuid';
import { useState, useRef } from 'react';
import { mockProducts } from '@/utils/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import { RootState } from '@/store/store';

const categories = [
  { id: 'flower', name: 'Flower' },
  { id: 'pre-rolls', name: 'Pre-Rolls' },
  { id: 'vaporizers', name: 'Vaporizers' },
  { id: 'edibles', name: 'Edibles' },
  { id: 'concentrates', name: 'Concentrates' },
  { id: 'accessories', name: 'Accessories' },
];

export default function DispensaryMenu() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state: RootState) => state.cart);
  const [selectedCategory, setSelectedCategory] = useState('flower');

  const handleAddToCart = (product: any, size: { name: string; weight: string; price: number }) => {
    dispatch(addItem({
      id: uuidv4(),
      productId: product.id,
      name: `${product.name} - ${size.weight}`,
      price: size.price,
      quantity: 1,
      size: size.name,
      weight: size.weight,
      image_url: product.image_url,
      strain_type: product.strain_type,
      thc: product.thc
    }));
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-grass-primary/20">
        <div className="container mx-auto px-4">
          {/* Top Navigation */}
          <div className="h-16 flex items-center justify-between">
            <button 
              onClick={() => router.back()}
              className="p-2 text-grass-primary hover:text-grass-accent transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <CartButton />
          </div>

          {/* Category Navigation */}
          <nav className="h-12 flex items-center overflow-x-auto">
            <div className="flex space-x-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'text-grass-primary'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content with padding for fixed header */}
      <main className="pt-28">
        <div className="container mx-auto px-4">
          {/* Dispensary Info */}
          <div className="relative h-32 w-32 mx-auto mb-4 rounded-full overflow-hidden">
            <Image
              src="/images/dispensaries/placeholder.jpg"
              alt="Dispensary"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">Dispensary★ 4.5</h1>
          
          {/* Featured Products Carousel */}
          <section className="relative mb-8">
            <h2 className="text-xl font-semibold mb-4">Featured Products</h2>
            
            <div className="relative group">
              <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth">
                <div className="flex gap-4 pb-4 w-max mx-auto">
                  {[...mockProducts, ...mockProducts, ...mockProducts].map((product, index) => (
                    <div 
                      key={`${product.id}-${index}`}
                      className="w-[300px] flex-shrink-0 snap-start"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Scroll Buttons */}
              <button 
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto');
                  if (container) {
                    container.scrollBy({ left: -320, behavior: 'smooth' });
                  }
                }}
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              
              <button 
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  const container = document.querySelector('.overflow-x-auto');
                  if (container) {
                    container.scrollBy({ left: 320, behavior: 'smooth' });
                  }
                }}
              >
                <ArrowRightIcon className="w-6 h-6" />
              </button>
            </div>
          </section>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockProducts.map((product) => (
              <div key={product.id} className="bg-grass-bg-light rounded-xl overflow-hidden">
                <div className="relative h-64">
                  <Image
                    src="/images/products/placeholder.jpg"
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                    <span>{product.strain_type}</span>
                    {product.thc && (
                      <>
                        <span>•</span>
                        <span>THC: {product.thc}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-white/70 mb-4">{product.description}</p>
                  
                  {/* Size Options */}
                  <div className="space-y-2">
                    {product.metadata.sizes.map((size) => (
                      <div key={size.weight} className="flex items-center justify-between">
                        <span className="text-sm">{size.weight}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">${size.price.toFixed(2)}</span>
                          <button
                            onClick={() => handleAddToCart(product, size)}
                            className="bg-grass-primary px-4 py-1 rounded-lg hover:bg-grass-primary-light transition-colors text-sm"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 