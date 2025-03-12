'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { Product } from '@/utils/api';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/cartSlice';
import { v4 as uuidv4 } from 'uuid';

interface Size {
  name: string;
  weight: string;
  price: number;
}

interface ProductModalProps {
  product: Product;
  dispensaryUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ product, dispensaryUrl, isOpen, onClose }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<Size>(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useAppDispatch();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    dispatch(addItem({
      id: uuidv4(),
      product_id: product.id,
      quantity,
      name: `${product.name} - ${selectedSize.weight}`,
      price: selectedSize.price,
      image_url: product.image,
      strain_type: product.strain_type,
      thc: product.thc,
      cbd: product.cbd,
      metadata: {
        size: selectedSize.weight,
        original_price: selectedSize.price
      },
      added_at: new Date().toISOString()
    }));
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-4"
            >
              <Dialog.Panel className="relative transform rounded-xl bg-grass-bg-dark p-6 shadow-xl transition-all w-full max-w-lg">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                {/* Product Image */}
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-black mb-6">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={500}
                      height={500}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-grass-bg-light">
                      <span className="text-grass-primary">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-white mb-2">
                    {product.name}
                  </Dialog.Title>
                  {(product.strain_type || product.thc || product.cbd) && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      {product.strain_type && <span>{product.strain_type}</span>}
                      {product.thc && <span>THC: {product.thc}</span>}
                      {product.cbd && <span>CBD: {product.cbd}</span>}
                    </div>
                  )}
                  {product.description && (
                    <p className="text-gray-400">{product.description}</p>
                  )}
                </div>

                {/* Size Selection */}
                <RadioGroup value={selectedSize} onChange={setSelectedSize} className="mb-6">
                  <RadioGroup.Label className="text-sm font-medium text-white mb-3">
                    Size
                  </RadioGroup.Label>
                  <div className="grid grid-cols-2 gap-3">
                    {product.sizes.map((size) => (
                      <RadioGroup.Option
                        key={size.weight}
                        value={size}
                        className={({ active, checked }) =>
                          `${
                            active ? 'ring-2 ring-grass-primary ring-offset-2 ring-offset-grass-bg-dark' : ''
                          }
                          ${checked ? 'bg-grass-primary' : 'bg-white/5'}
                          relative flex cursor-pointer rounded-lg px-4 py-3 focus:outline-none`
                        }
                      >
                        {({ checked }) => (
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center">
                              <div className="text-sm">
                                <RadioGroup.Label
                                  as="p"
                                  className={`font-medium ${
                                    checked ? 'text-white' : 'text-gray-300'
                                  }`}
                                >
                                  {size.weight}
                                </RadioGroup.Label>
                              </div>
                            </div>
                            <RadioGroup.Description
                              as="span"
                              className={`${
                                checked ? 'text-white' : 'text-gray-400'
                              }`}
                            >
                              ${size.price.toFixed(2)}
                            </RadioGroup.Description>
                          </div>
                        )}
                      </RadioGroup.Option>
                    ))}
                  </div>
                </RadioGroup>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 rounded-full hover:bg-white/5"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="text-xl font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 rounded-full hover:bg-white/5"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-grass-primary hover:bg-grass-primary-light text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    Add to Cart - ${(selectedSize.price * quantity).toFixed(2)}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 