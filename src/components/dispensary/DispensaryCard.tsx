'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Dispensary } from '@/utils/types';
import { StarIcon, ClockIcon, TruckIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { CannabisIcon } from '@/components/icons/CannabisIcon';

interface DispensaryCardProps {
  dispensary: Dispensary;
}

export function DispensaryCard({ dispensary }: DispensaryCardProps) {
  // Format the URL for routing - handle both full URLs and relative paths
  const cleanUrl = encodeURIComponent(dispensary.url);
  
  return (
    <Link href={`/dispensary/${cleanUrl}`}>
      <div className="bg-white bg-opacity-5 rounded-xl overflow-hidden hover:bg-opacity-10 transition-colors">
        <div className="relative h-48">
          <Image
            src={dispensary.logo_url || "/images/dispensaries/placeholder.jpg"}
            alt={dispensary.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-white">{dispensary.name}</h3>
            {dispensary.rating && (
              <div className="flex items-center gap-1">
                <StarIcon className="w-5 h-5 text-yellow-400" />
                <span className="text-white">{dispensary.rating}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
            {dispensary.delivery_time && (
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{dispensary.delivery_time}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <CurrencyDollarIcon className="w-4 h-4" />
              <span>{dispensary.delivery_fee === 0 ? 'Free Delivery' : `$${dispensary.delivery_fee} Delivery`}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              Min. Order ${dispensary.minimum_order}
            </span>
            <span className={`text-sm font-medium ${dispensary.is_open ? 'text-green-500' : 'text-red-500'}`}>
              {dispensary.is_open ? 'Open' : 'Closed'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 