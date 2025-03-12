'use client';

import React from 'react';
import * as ReactMapGL from 'react-map-gl/maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Buddy } from '../../types/buddy';
import { OrderPickupModal } from './OrderPickupModal';
import { Order } from '@/store/ordersSlice';

interface BuddyHomeScreenProps {
  buddy: Buddy;
  earnings: number;
  onGoOnline: () => void;
  isOnline: boolean;
  onProfileClick: () => void;
  onEarningsClick: () => void;
  onAcceptOrder?: (orderId: string) => void;
  onDeclineOrder?: (orderId: string) => void;
  pendingOrder: Order | null;
}

// Use OpenStreetMap style
const MAPLIBRE_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '&copy; OpenStreetMap Contributors',
      maxzoom: 19
    }
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19
    }
  ]
};

export const BuddyHomeScreen: React.FC<BuddyHomeScreenProps> = ({
  buddy,
  earnings,
  onGoOnline,
  isOnline,
  onProfileClick,
  onEarningsClick,
  onAcceptOrder,
  onDeclineOrder,
  pendingOrder
}) => {
  const [viewState, setViewState] = React.useState({
    latitude: 39.2904,
    longitude: -76.6122,
    zoom: 13
  });

  return (
    <div className="relative h-screen w-full bg-black">
      <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-4">
        {isOnline && (
          <div className="bg-black rounded-full p-1">
            <button 
              onClick={onGoOnline}
              className="bg-red-500 rounded-full px-4 py-2 text-white font-medium"
            >
              END
            </button>
          </div>
        )}
        {!isOnline && <div className="w-10" />} {/* Spacer when button is hidden */}
        
        <button 
          onClick={onEarningsClick}
          className="bg-black rounded-full px-4 py-2 flex items-center justify-center mx-auto hover:bg-grass-bg-light transition-colors"
        >
          <span className="text-white font-bold">${earnings.toFixed(2)}</span>
        </button>

        <button 
          onClick={onProfileClick}
          className="relative"
        >
          <img 
            src={buddy.photo_url} 
            alt="Profile" 
            className="w-10 h-10 rounded-full"
          />
          {buddy.status === 'available' && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
          )}
        </button>
      </div>

      <ReactMapGL.Map
        {...viewState}
        onMove={(evt: ReactMapGL.ViewStateChangeEvent) => setViewState(evt.viewState)}
        style={{width: '100%', height: '100vh'}}
        mapStyle={MAPLIBRE_STYLE}
      >
        {buddy.location && (
          <ReactMapGL.Marker
            longitude={buddy.location.lng}
            latitude={buddy.location.lat}
            anchor="bottom"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs">🚗</span>
            </div>
          </ReactMapGL.Marker>
        )}
      </ReactMapGL.Map>

      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-black h-20 flex flex-col items-center justify-center">
          <div className="text-white text-sm mb-2">You're offline</div>
          <button
            onClick={onGoOnline}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl bg-green-500"
          >
            GO
          </button>
        </div>
      )}

      {/* Order Pickup Modal */}
      {pendingOrder && (
        <OrderPickupModal
          dispensary={{
            name: pendingOrder.location.pickup.address,
            image: '/dispensary-storehouse.jpg'
          }}
          onAccept={() => onAcceptOrder?.(pendingOrder.id)}
          onDecline={() => onDeclineOrder?.(pendingOrder.id)}
          onTimeout={() => {
            console.log('Order timed out:', pendingOrder.id);
            onDeclineOrder?.(pendingOrder.id);
          }}
        />
      )}
    </div>
  );
};

const SearchIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
    />
  </svg>
); 