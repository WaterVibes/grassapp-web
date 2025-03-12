'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addDeliveryAddress, setDefaultAddress } from '@/store/authSlice';
import { ArrowLeftIcon, PlusIcon, TrashIcon, CheckCircleIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface AddressForm {
  street: string;
  unit: string;
  city: string;
  state: string;
  zip: string;
}

export default function Address() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddress, setNewAddress] = useState<AddressForm>({
    street: '',
    unit: '',
    city: '',
    state: '',
    zip: ''
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addDeliveryAddress({
      ...newAddress,
      isVerified: false
    }));
    setShowAddForm(false);
    setNewAddress({
      street: '',
      unit: '',
      city: '',
      state: '',
      zip: ''
    });
  };

  const handleSetDefault = (index: number) => {
    dispatch(setDefaultAddress(index));
  };

  const handleRemoveAddress = (index: number) => {
    // In a real app, we would dispatch a removeAddress action
    console.log('Remove address at index:', index);
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
            <h1 className="text-xl font-bold">Delivery Addresses</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Address List */}
        <div className="space-y-4">
          {user?.deliveryAddresses.map((address, index) => (
            <div
              key={index}
              className="bg-grass-bg-light rounded-xl p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <MapPinIcon className="w-5 h-5 text-grass-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {address.street}
                      {index === user.defaultAddressIndex && (
                        <span className="text-xs bg-grass-primary/20 text-grass-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    {address.unit && (
                      <div className="text-sm text-gray-400">Unit {address.unit}</div>
                    )}
                    <div className="text-sm text-gray-400">
                      {address.city}, {address.state} {address.zip}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {index !== user.defaultAddressIndex && (
                    <>
                      <button
                        onClick={() => handleSetDefault(index)}
                        className="p-2 text-grass-primary hover:text-grass-primary-light transition-colors"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemoveAddress(index)}
                        className="p-2 text-red-500 hover:text-red-400 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Address Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-4 rounded-xl border-2 border-dashed border-grass-primary/20 text-grass-primary hover:bg-grass-primary/10 transition-colors flex items-center justify-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Address
            </button>
          )}

          {/* Add Address Form */}
          {showAddForm && (
            <form onSubmit={handleAddAddress} className="bg-grass-bg-light rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Street Address</label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">Unit/Apt (Optional)</label>
                <input
                  type="text"
                  value={newAddress.unit}
                  onChange={(e) => setNewAddress({ ...newAddress, unit: e.target.value })}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">State</label>
                  <select
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                    required
                  >
                    <option value="">Select</option>
                    <option value="MD">Maryland</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={newAddress.zip}
                  onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                  className="w-full bg-black border border-grass-primary/20 rounded-lg px-4 py-2 focus:border-grass-primary focus:outline-none"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-grass-primary rounded-lg hover:bg-grass-primary-light transition-colors"
                >
                  Add Address
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
} 