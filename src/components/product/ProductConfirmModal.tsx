import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useAppDispatch } from '@/store/hooks';
import { addItem } from '@/store/cartSlice';
import { v4 as uuidv4 } from 'uuid';

interface Size {
  name: string;
  weight: string;
  price: number;
}

interface ProductConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    image_url?: string;
    strain_type?: string;
    thc?: string;
    metadata: {
      sizes: Size[];
    };
  };
}

export default function ProductConfirmModal({ isOpen, onClose, product }: ProductConfirmModalProps) {
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (!selectedSize) return;

    dispatch(addItem({
      id: uuidv4(),
      productId: product.id,
      name: product.name,
      price: selectedSize.price,
      quantity: 1,
      size: selectedSize.name,
      weight: selectedSize.weight,
      image_url: product.image_url,
      strain_type: product.strain_type,
      thc: product.thc
    }));

    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
      onClose();
      setSelectedSize(null);
    }, 1500);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
          <div className="fixed inset-0 bg-black/80" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-grass-bg-light p-6 shadow-xl transition-all">
                {showConfirmation ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="w-16 h-16 rounded-full bg-grass-primary flex items-center justify-center mb-4">
                      <CheckIcon className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-semibold text-white">Added to Cart!</p>
                  </div>
                ) : (
                  <>
                    <Dialog.Title className="text-lg font-semibold mb-4">
                      Select Size
                    </Dialog.Title>

                    <div className="mb-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-20 h-20 bg-black/50 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-grass-primary">
                              🌿
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          {product.strain_type && (
                            <p className="text-sm text-gray-400">{product.strain_type}</p>
                          )}
                          {product.thc && (
                            <p className="text-sm text-gray-400">THC: {product.thc}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {product.metadata?.sizes?.map((size) => (
                          <button
                            key={size.name}
                            onClick={() => setSelectedSize(size)}
                            className={`p-3 rounded-lg border ${
                              selectedSize?.name === size.name
                                ? 'border-grass-primary bg-grass-primary/10'
                                : 'border-white/10 hover:border-grass-primary/50'
                            }`}
                          >
                            <div className="text-sm font-medium">{size.name}</div>
                            <div className="text-xs text-gray-400">{size.weight}</div>
                            <div className="mt-1">${size.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleAddToCart}
                        disabled={!selectedSize}
                        className="px-4 py-2 rounded-lg bg-grass-primary hover:bg-grass-primary-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 