'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { ArrowLeftIcon, ChatBubbleLeftIcon, MapPinIcon, TruckIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { Order } from '@/store/ordersSlice';
import { RootState } from '@/store/store';
import * as ReactMapGL from 'react-map-gl/maplibre';
import type { StyleSpecification } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

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

export default function OrderStatus() {
  const router = useRouter();
  const { activeOrder, hasActiveOrder } = useAppSelector((state: RootState) => state.orders);
  const [viewState, setViewState] = useState({
    latitude: 39.2904,
    longitude: -76.6122,
    zoom: 13
  });

  useEffect(() => {
    if (!hasActiveOrder) {
      router.push('/');
    }
  }, [hasActiveOrder, router]);

  // Update map view when buddy location changes
  useEffect(() => {
    if (activeOrder?.buddy?.location) {
      setViewState(prev => ({
        ...prev,
        latitude: activeOrder.buddy!.location!.lat,
        longitude: activeOrder.buddy!.location!.lng
      }));
    }
  }, [activeOrder?.buddy?.location]);

  if (!activeOrder) {
    return null;
  }

  const { buddy, assignment } = activeOrder;
  const timeLeft = assignment?.route.estimated_duration || '12 min. left';

  return (
    <div className="min-h-screen bg-grass-bg text-white">
      {/* Header */}
      <header className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:text-grass-accent transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold ml-4">Order Status</h1>
          </div>
        </div>
      </header>

      {/* Map Section */}
      <div className="h-48 bg-grass-bg-light relative">
        <ReactMapGL.Map
          {...viewState}
          onMove={(evt: ReactMapGL.ViewStateChangeEvent) => setViewState(evt.viewState)}
          style={{width: '100%', height: '100%'}}
          mapStyle={MAPLIBRE_STYLE}
        >
          {/* Pickup Location Marker */}
          {activeOrder.location?.pickup && (
            <ReactMapGL.Marker
              longitude={activeOrder.location.pickup.lng}
              latitude={activeOrder.location.pickup.lat}
              anchor="bottom"
            >
              <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">P</span>
              </div>
            </ReactMapGL.Marker>
          )}

          {/* Delivery Location Marker */}
          {activeOrder.location?.delivery && (
            <ReactMapGL.Marker
              longitude={activeOrder.location.delivery.lng}
              latitude={activeOrder.location.delivery.lat}
              anchor="bottom"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">D</span>
              </div>
            </ReactMapGL.Marker>
          )}

          {/* Buddy Location Marker */}
          {buddy?.location && (
            <ReactMapGL.Marker
              longitude={buddy.location.lng}
              latitude={buddy.location.lat}
              anchor="bottom"
            >
              <div className="w-8 h-8 bg-grass-primary rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">🚗</span>
              </div>
            </ReactMapGL.Marker>
          )}
        </ReactMapGL.Map>
      </div>

      {/* Buddy Info */}
      <div className="container mx-auto px-4 -mt-6">
        <div className="bg-grass-bg-light rounded-xl border border-grass-primary/20 p-6">
          {buddy ? (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={buddy.photo_url}
                    alt={buddy.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-semibold">{buddy.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>Rating: {buddy.rating}</span>
                    <StarIcon className="w-4 h-4 text-yellow-400" />
                    <span>•</span>
                    <span>{buddy.total_deliveries} deliveries</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-full bg-grass-primary/10 hover:bg-grass-primary/20 transition-colors">
                <ChatBubbleLeftIcon className="w-6 h-6 text-grass-primary" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center h-24 text-gray-400">
              <TruckIcon className="w-6 h-6 mr-2" />
              <span>Assigning a Buddy to your order...</span>
            </div>
          )}

          {/* Timeline */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Timeline</h3>
            <div className="relative">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-grass-primary/20"></div>
              
              <div className="space-y-8">
                <div className="relative flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full ${
                    activeOrder.status === 'preparing' ? 'bg-grass-primary' : 'bg-grass-primary/20'
                  } flex items-center justify-center z-10`}>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <p className="font-medium">Preparing</p>
                    <p className="text-sm text-gray-400">
                      {assignment?.assigned_at ? new Date(assignment.assigned_at).toLocaleTimeString() : '45 mins'}
                    </p>
                  </div>
                </div>

                <div className="relative flex items-center gap-4">
                  <div className={`w-6 h-6 rounded-full ${
                    activeOrder.status === 'delivering' ? 'bg-grass-primary' : 'bg-grass-primary/20'
                  } flex items-center justify-center z-10`}>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                  <div>
                    <p className="font-medium">Delivery</p>
                    <p className="text-sm text-gray-400">{timeLeft}</p>
                  </div>
                </div>

                {activeOrder.status === 'completed' && (
                  <div className="relative flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-grass-primary flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-400">
                        {assignment?.delivered_at ? new Date(assignment.delivered_at).toLocaleTimeString() : ''}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mt-6 bg-grass-bg-light rounded-xl border border-grass-primary/20 p-6">
          <h3 className="text-lg font-semibold mb-4">Order Details</h3>
          <div className="space-y-4">
            {activeOrder.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-grass-primary">{item.quantity}x</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.size} ({item.weight})</p>
                  </div>
                </div>
                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-grass-primary/20">
            <div className="space-y-2 text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${activeOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${activeOrder.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tip</span>
                <span>${activeOrder.tip.toFixed(2)}</span>
              </div>
              <div className="h-px bg-grass-primary/20 my-2"></div>
              <div className="flex justify-between text-lg text-white font-semibold">
                <span>Total</span>
                <span>${activeOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 