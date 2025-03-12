'use client';

import React, { useState, useEffect } from 'react';
import * as ReactMapGL from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { OrderAssignment } from '../../types/buddy';
import { IDVerification } from './IDVerification';
import { checkCompliance } from '../utils/complianceCheck';
import type { StyleSpecification } from 'maplibre-gl';
import { ChatBubbleLeftIcon, PaperAirplaneIcon, MapPinIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface DeliveryNavigationProps {
  assignment: OrderAssignment;
  currentStep: 'pickup' | 'delivery';
  estimatedTime: number;
  distance: string;
  onPickupComplete: () => void;
  onDeliveryComplete: (success: boolean) => void;
  onMessageSend: (message: string) => void;
  userLocation: { lat: number; lng: number };
  isMockOrder?: boolean;
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

const routeLayer = {
  id: 'route',
  type: 'line',
  layout: {
    'line-join': 'round',
    'line-cap': 'round'
  },
  paint: {
    'line-color': '#3b82f6',
    'line-width': 4
  }
} as const;

export const DeliveryNavigation: React.FC<DeliveryNavigationProps> = ({
  assignment,
  currentStep,
  estimatedTime,
  distance,
  onPickupComplete,
  onDeliveryComplete,
  onMessageSend,
  userLocation,
  isMockOrder = false,
}) => {
  console.log('🔍 DeliveryNavigation props:', { currentStep, isMockOrder });
  
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [isAtLocation, setIsAtLocation] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'patient' | 'documents' | 'order' | null>('patient');

  const location = currentStep === 'pickup' ? assignment?.route?.pickup : assignment?.route?.delivery;
  const customerName = currentStep === 'pickup' ? assignment?.dispensary?.name : assignment?.patient?.name;

  const [viewState, setViewState] = React.useState({
    latitude: location?.lat ?? 0,
    longitude: location?.lng ?? 0,
    zoom: 14,
    bearing: 0,
    pitch: 45
  });

  // Create a GeoJSON route between pickup and delivery
  const routeData = React.useMemo(() => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [assignment?.route?.pickup?.lng ?? 0, assignment?.route?.pickup?.lat ?? 0],
        [assignment?.route?.delivery?.lng ?? 0, assignment?.route?.delivery?.lat ?? 0]
      ]
    }
  }), [assignment]);

  useEffect(() => {
    if (!location || !userLocation) return;

    // Only check location for delivery step or non-mock pickup
    if (currentStep === 'delivery' || !isMockOrder) {
      const distanceToTarget = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        location.lat,
        location.lng
      );
      
      // Consider "at location" if within 50 meters
      setIsAtLocation(distanceToTarget <= 50);
    }
  }, [userLocation, location, currentStep, isMockOrder]);

  // Update view state when location changes
  useEffect(() => {
    if (location) {
      setViewState(prev => ({
        ...prev,
        latitude: location.lat,
        longitude: location.lng
      }));
    }
  }, [location]);

  // Haversine formula to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const handleNext = () => {
    console.log('🚚 Attempting pickup completion...');
    console.log('isMockOrder:', isMockOrder);
    console.log('isAtLocation:', isAtLocation);
    
    if (currentStep === 'pickup') {
      // For pickup, complete immediately if it's a mock order
      // or if the driver is at the location for real orders
      if (isMockOrder || isAtLocation) {
        console.log('✅ Conditions met, calling onPickupComplete...');
        onPickupComplete();
      } else {
        console.log('❌ Conditions not met for pickup completion');
      }
    } else {
      // For delivery, show verification immediately for mock orders
      // or only when at location for real orders
      if (isMockOrder || isAtLocation) {
        setShowVerification(true);
      }
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    if (success) {
      setShowVerification(false);
      onDeliveryComplete(true);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onMessageSend(message);
      setMessage('');
    }
  };

  return (
    <div className="relative h-screen">
      {/* Map Section */}
      <div className="h-[60vh]">
        <ReactMapGL.Map
          {...viewState}
          onMove={(evt: ReactMapGL.ViewStateChangeEvent) => setViewState(evt.viewState)}
          style={{width: '100%', height: '100%'}}
          mapStyle={MAPLIBRE_STYLE}
        >
          {/* Route Line */}
          <ReactMapGL.Source type="geojson" data={routeData as any}>
            <ReactMapGL.Layer {...routeLayer} />
          </ReactMapGL.Source>

          {/* Pickup Marker */}
          {assignment?.route?.pickup && (
            <ReactMapGL.Marker
              longitude={assignment.route.pickup.lng}
              latitude={assignment.route.pickup.lat}
              anchor="bottom"
            >
              <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">P</span>
              </div>
            </ReactMapGL.Marker>
          )}

          {/* Delivery Marker */}
          {assignment?.route?.delivery && (
            <ReactMapGL.Marker
              longitude={assignment.route.delivery.lng}
              latitude={assignment.route.delivery.lat}
              anchor="bottom"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs">D</span>
              </div>
            </ReactMapGL.Marker>
          )}

          {/* User Location Marker */}
          {userLocation && (
            <ReactMapGL.Marker
              longitude={userLocation.lng}
              latitude={userLocation.lat}
              anchor="center"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                <MapPinIcon className="w-4 h-4 text-white" />
              </div>
            </ReactMapGL.Marker>
          )}

          {/* Navigation Controls */}
          <ReactMapGL.NavigationControl position="bottom-right" />
          <ReactMapGL.GeolocateControl position="bottom-right" />
        </ReactMapGL.Map>
      </div>

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 bg-grass-bg-light rounded-t-3xl shadow-xl">
        <div className="p-6">
          {/* Header with distance and time */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">
                {currentStep === 'pickup' ? assignment?.dispensary?.name : assignment?.patient?.name}
              </h2>
              <p className="text-sm text-gray-400">
                {distance} • {estimatedTime} min
              </p>
            </div>
            <button
              onClick={() => setShowChat(!showChat)}
              className="p-2 rounded-full bg-grass-primary/10 hover:bg-grass-primary/20"
            >
              <ChatBubbleLeftIcon className="w-6 h-6 text-grass-primary" />
            </button>
          </div>

          {/* Patient/Dispensary Info */}
          {currentStep === 'pickup' ? (
            <div className="space-y-4">
              {/* Patient Information Section */}
              <div 
                className="bg-grass-bg-dark/50 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'patient' ? null : 'patient')}
              >
                <div className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Patient Information</h3>
                  <ChevronDownIcon 
                    className={`w-5 h-5 transition-transform ${expandedSection === 'patient' ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedSection === 'patient' && (
                  <div className="p-4 pt-0">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="font-medium">{assignment?.patient?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">MMCC ID:</span>
                        <span className="font-medium text-grass-primary">{assignment?.patient?.mmccId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Required Documents Section */}
              <div 
                className="bg-grass-bg-dark/50 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'documents' ? null : 'documents')}
              >
                <div className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Required Documents</h3>
                  <ChevronDownIcon 
                    className={`w-5 h-5 transition-transform ${expandedSection === 'documents' ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedSection === 'documents' && (
                  <div className="p-4 pt-0">
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li className="text-gray-400">MMCC Caregiver Card</li>
                      <li className="text-gray-400">Government-issued ID</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Order Details Section */}
              <div 
                className="bg-grass-bg-dark/50 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setExpandedSection(expandedSection === 'order' ? null : 'order')}
              >
                <div className="p-4 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Order Details</h3>
                  <ChevronDownIcon 
                    className={`w-5 h-5 transition-transform ${expandedSection === 'order' ? 'rotate-180' : ''}`}
                  />
                </div>
                {expandedSection === 'order' && (
                  <div className="p-4 pt-0">
                    <div className="space-y-2">
                      {assignment?.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400">{item.quantity} × {item.name}</span>
                          <span>{item.thc} THC</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-grass-bg-dark/50 rounded-xl p-4">
                <h3 className="text-lg font-semibold mb-2">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <span className="font-medium">{assignment?.delivery?.address}</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Please verify patient's MMCC ID upon arrival before completing delivery
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Chat Section */}
          {showChat && (
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-black/20 rounded-xl px-4 py-2"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 rounded-xl bg-grass-primary text-white"
                >
                  <PaperAirplaneIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Action Button */}
          {currentStep === 'pickup' ? (
            <button
              onClick={handleNext}
              className="w-full bg-grass-primary text-white py-3 rounded-xl mt-4 font-semibold hover:bg-grass-primary-light transition-colors"
            >
              Complete Pickup
            </button>
          ) : (
            isMockOrder || isAtLocation ? (
              <button
                onClick={handleNext}
                className="w-full bg-grass-primary text-white py-3 rounded-xl mt-4 font-semibold hover:bg-grass-primary-light transition-colors"
              >
                Verify ID & Complete Delivery
              </button>
            ) : (
              <div className="bg-grass-bg-dark/50 rounded-xl p-4 mt-4">
                <div className="flex items-center justify-center text-gray-400">
                  <span className="animate-pulse mr-2">●</span>
                  Navigate to delivery location to complete delivery
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <IDVerification
          patient={assignment?.patient}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
    </div>
  );
}; 