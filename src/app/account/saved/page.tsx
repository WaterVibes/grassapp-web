'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeftIcon, HeartIcon, MapPinIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

const SAVED_DISPENSARIES = [
  {
    id: 'DSP-001',
    name: 'Green Leaf Dispensary',
    image: '/dispensaries/green-leaf.jpg',
    rating: 4.8,
    totalReviews: 324,
    address: '123 Cannabis Ave, Baltimore, MD',
    distance: '1.2',
    hours: '9:00 AM - 9:00 PM',
    isOpen: true,
    tags: ['Flower', 'Edibles', 'Concentrates'],
    deals: [
      'Buy 1 Get 1 50% off Edibles',
      '20% off First Time Customers'
    ]
  },
  {
    id: 'DSP-002',
    name: 'Herbal Wellness Co',
    image: '/dispensaries/herbal-wellness.jpg',
    rating: 4.6,
    totalReviews: 256,
    address: '456 Medical Blvd, Baltimore, MD',
    distance: '2.4',
    hours: '10:00 AM - 8:00 PM',
    isOpen: true,
    tags: ['Premium Flower', 'Vapes', 'CBD'],
    deals: [
      'Daily Deals on Select Strains',
      'Senior Discount Tuesdays'
    ]
  },
  {
    id: 'DSP-003',
    name: 'MediCanna',
    image: '/dispensaries/medicanna.jpg',
    rating: 4.9,
    totalReviews: 412,
    address: '789 Health St, Baltimore, MD',
    distance: '3.1',
    hours: '8:00 AM - 10:00 PM',
    isOpen: false,
    tags: ['Organic', 'Concentrates', 'Pre-rolls'],
    deals: [
      'Happy Hour 4-7PM Daily',
      'New Patient Special'
    ]
  }
];

export default function SavedDispensaries() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDispensaries = SAVED_DISPENSARIES.filter(
    dispensary => dispensary.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveSaved = (dispensaryId: string) => {
    // In a real app, this would make an API call to remove from saved
    console.log('Remove from saved:', dispensaryId);
  };

  const handleDispensaryClick = (dispensaryId: string) => {
    // In a real app, this would navigate to the dispensary detail page
    router.push(`/dispensary/${dispensaryId}`);
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
            <h1 className="text-xl font-bold">Saved Stores</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Search */}
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search saved stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-grass-bg-light rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-grass-primary"
          />
        </div>

        {/* Saved Dispensaries List */}
        <div className="space-y-4">
          {filteredDispensaries.length === 0 ? (
            <div className="text-center py-8">
              <HeartIcon className="w-12 h-12 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400">No saved stores found</p>
            </div>
          ) : (
            filteredDispensaries.map((dispensary) => (
              <div
                key={dispensary.id}
                className="bg-grass-bg-light rounded-xl overflow-hidden"
              >
                {/* Image and Quick Actions */}
                <div className="relative h-48">
                  <Image
                    src={dispensary.image}
                    alt={dispensary.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => handleRemoveSaved(dispensary.id)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                  >
                    <HeartSolidIcon className="w-6 h-6 text-grass-primary" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 
                        className="text-lg font-semibold hover:text-grass-primary cursor-pointer transition-colors"
                        onClick={() => handleDispensaryClick(dispensary.id)}
                      >
                        {dispensary.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span>{dispensary.rating}</span>
                        <span>•</span>
                        <span>{dispensary.totalReviews} reviews</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-400">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span>{dispensary.distance} mi</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        <span className={dispensary.isOpen ? 'text-green-500' : 'text-red-500'}>
                          {dispensary.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-400 mb-3">
                    {dispensary.address}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {dispensary.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-grass-primary/20 text-grass-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Deals */}
                  <div className="space-y-1">
                    {dispensary.deals.map((deal) => (
                      <div
                        key={deal}
                        className="text-sm text-grass-primary flex items-center gap-2"
                      >
                        <span className="text-xl">•</span>
                        {deal}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
} 