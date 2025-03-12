'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { BuddyHomeScreen } from '../components/BuddyHomeScreen';
import { DeliveryNavigation } from '../components/DeliveryNavigation';
import { BuddyProfile } from '../components/BuddyProfile';
import { Buddy, OrderAssignment, ComplianceCheck } from '../../types/buddy';
import { orderAssignmentService } from '../services/orderAssignment';
import { createWebSocket } from '../services/websocket';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { assignBuddy, updateOrderStatus } from '@/store/ordersSlice';
import { logout } from '@/store/authSlice';
import type { Order } from '@/store/ordersSlice';
import { EarningsSummary } from '../components/EarningsSummary';
import { assignOrder, calculateRoute } from '../services/orderService';

// Mock data for testing
const mockBuddy: Buddy = {
  id: '1',
  name: 'Britt',
  photo_url: 'https://ui-avatars.com/api/?name=Britt&background=0D8ABC&color=fff',
  rating: 4.89,
  total_deliveries: 3104,
  status: 'available',
  mmccId: 'CG-123456',
  yearToDateEarnings: 24680.50,
  vehicle_info: {
    type: 'car',
    model: 'Toyota Camry',
    color: 'Silver',
  },
  metadata: {},
};

const mockPastOrders = [
  {
    id: '123',
    date: '2024-03-11T14:30:00Z',
    dispensary: 'Green Dispensary',
    patient: {
      name: 'John D.',
      mmccId: 'PT-789012',
      currentPossession: {
        flower: 10.5,
        concentrate: 2.0,
        thcProducts: 100
      }
    },
    items: [
      {
        name: 'Blue Dream',
        type: 'flower' as const,
        quantity: '3.5g',
        thc: '24%'
      },
      {
        name: 'GSC Live Resin',
        type: 'concentrate' as const,
        quantity: '1g',
        thc: '82%'
      }
    ],
    total: 125.00,
    earnings: 35.00,
    complianceChecks: {
      patientIdVerified: true,
      withinLimits: true,
      orderCompliant: true
    }
  }
];

interface BuddyAppState {
  currentView: 'home' | 'profile' | 'delivery';
  isOnline: boolean;
  earnings: number;
  currentAssignment: OrderAssignment | null;
  currentBuddy: Buddy;
  isConnected: boolean;
  pendingOrder: Order | null;
  activeDelivery: OrderAssignment | null;
  currentStep: 'pickup' | 'delivery';
  estimatedTime: number;
  distance: string;
  userLocation: { lat: number; lng: number };
  showEarningsSummary: boolean;
  weeklyEarnings: number;
  payoutHistory: Array<{
    id: string;
    amount: number;
    status: 'completed' | 'processing' | 'failed';
    method: 'ach' | 'instant';
    date: string;
    estimatedArrival?: string;
  }>;
}

export const BuddyApp: React.FC = () => {
  const router = useRouter();
  const [state, setState] = useState<BuddyAppState>({
    currentView: 'home',
    isOnline: false,
    earnings: 135.48,
    currentAssignment: null,
    currentBuddy: mockBuddy,
    isConnected: false,
    pendingOrder: null,
    activeDelivery: null,
    currentStep: 'pickup',
    estimatedTime: 0,
    distance: '',
    userLocation: { lat: 39.2904, lng: -76.6122 },
    showEarningsSummary: false,
    weeklyEarnings: 0,
    payoutHistory: [
      {
        id: '1',
        amount: 174.48,
        date: new Date().toISOString(),
        status: 'processing',
        method: 'ach',
        estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
      }
    ]
  });
  
  // WebSocket reference
  const wsRef = useRef(createWebSocket(state.currentBuddy.id));
  
  // Get active order from GrassApp web store
  const { activeOrder } = useAppSelector((state) => state.orders);
  const dispatch = useAppDispatch();

  // Enhanced logging for state changes
  useEffect(() => {
    console.log('🟢 BuddyApp State:', {
      currentView: state.currentView,
      isOnline: state.isOnline,
      isConnected: state.isConnected,
      hasPendingOrder: !!state.pendingOrder,
      hasCurrentAssignment: !!state.currentAssignment,
      earnings: state.earnings
    });
  }, [state.currentView, state.isOnline, state.isConnected, state.pendingOrder, state.currentAssignment, state.earnings]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!state.isOnline) return; // Only connect when online

    console.log('🌐 Initializing WebSocket connection...');
    const ws = wsRef.current;

    ws.setCallbacks({
      onConnectionChange: (connected) => {
        console.log('🌐 WebSocket connection status:', connected);
        setState(prev => ({
          ...prev,
          isConnected: connected
        }));
        if (!connected) {
          console.log('❌ WebSocket disconnected, clearing pending order');
          setState(prev => ({
            ...prev,
            pendingOrder: null
          }));
        }
      },
      onOrderAvailable: (order) => {
        console.log('📦 New order available:', order);
        if (state.isOnline) {
          console.log('✅ Buddy is online, setting pending order');
          setState(prev => ({
            ...prev,
            pendingOrder: order
          }));
        } else {
          console.log('❌ Buddy is offline, ignoring order');
        }
      },
      onOrderAssigned: (assignment) => {
        console.log('🚗 Order assigned:', assignment);
        setState(prev => ({
          ...prev,
          currentAssignment: assignment,
          pendingOrder: null
        }));
      },
      onEarningsUpdate: (newEarnings) => {
        console.log('💰 Earnings update:', newEarnings);
        setState(prev => ({
          ...prev,
          earnings: prev.earnings + newEarnings,
          currentBuddy: {
            ...prev.currentBuddy,
            yearToDateEarnings: prev.currentBuddy.yearToDateEarnings + newEarnings
          }
        }));
      },
      onOrderStatusUpdate: (status) => {
        console.log('📝 Order status update:', status);
        if (state.currentAssignment) {
          setState(prev => ({
            ...prev,
            currentAssignment: prev.currentAssignment ? { ...prev.currentAssignment, status } : null
          }));
          dispatch(updateOrderStatus({ status }));
        }
      }
    });

    ws.connect();

    return () => {
      if (state.isOnline) {
        console.log('🔴 Cleaning up WebSocket connection');
        ws.disconnect();
      }
    };
  }, [state.isOnline]); // Only depend on isOnline state

  // Update location when online
  useEffect(() => {
    if (!state.isOnline || !state.isConnected || !state.currentBuddy.location) return;

    console.log('📍 Starting location updates...');
    let locationUpdateInterval = setInterval(() => {
      const newLocation = {
        lat: state.currentBuddy.location!.lat + (Math.random() - 0.5) * 0.001,
        lng: state.currentBuddy.location!.lng + (Math.random() - 0.5) * 0.001,
        timestamp: new Date().toISOString()
      };

      setState(prev => ({
        ...prev,
        currentBuddy: {
          ...prev.currentBuddy,
          location: newLocation
        }
      }));

      // Only update location if still connected
      if (state.isConnected) {
        wsRef.current.updateLocation(newLocation);
      }

      // If in delivery mode, update the map view
      if (state.currentView === 'delivery' && state.currentAssignment) {
        setState(prev => ({
          ...prev,
          currentAssignment: prev.currentAssignment ? {
            ...prev.currentAssignment,
            route: {
              ...prev.currentAssignment.route,
              estimated_duration: Math.max(1, prev.currentAssignment.route.estimated_duration - 1),
              estimated_distance: Math.max(0.1, prev.currentAssignment.route.estimated_distance - 0.1)
            }
          } : null
        }));
      }
    }, 5000);

    return () => {
      console.log('📍 Stopping location updates...');
      clearInterval(locationUpdateInterval);
    };
  }, [state.isOnline, state.isConnected, state.currentBuddy.location, state.currentView, state.currentAssignment]);

  // Handle going online/offline
  const handleGoOnline = () => {
    if (!state.isOnline) {
      console.log('🟢 Going online...');
      setState(prev => ({
        ...prev,
        isOnline: true,
        currentBuddy: {
          ...prev.currentBuddy,
          status: 'available',
          location: {
            lat: 39.2904,
            lng: -76.6122,
            timestamp: new Date().toISOString()
          }
        }
      }));
    } else {
      console.log('🔴 Going offline...');
      setState(prev => ({
        ...prev,
        isOnline: false,
        currentBuddy: {
          ...prev.currentBuddy,
          status: 'offline',
          location: undefined
        },
        currentAssignment: null,
        pendingOrder: null
      }));
    }
  };

  // Handle order acceptance
  const handleAcceptOrder = (orderId: string) => {
    console.log('✅ Attempting to accept order:', orderId);
    if (state.pendingOrder && state.pendingOrder.id === orderId) {
      console.log('📦 Found matching pending order, creating mock assignment...');
      
      // Create a mock assignment for testing
      const mockAssignment: OrderAssignment = {
        order_id: state.pendingOrder.id,
        buddy_id: state.currentBuddy.id,
        status: 'delivering',
        assigned_at: new Date().toISOString(),
        accepted_at: new Date().toISOString(),
        patient: {
          name: "Test Patient",
          mmccId: "MMCC-123456"
        },
        dispensary: {
          name: state.pendingOrder.location.pickup.address,
          license: "DISP-123",
          address: state.pendingOrder.location.pickup.address,
          lat: state.pendingOrder.location.pickup.lat,
          lng: state.pendingOrder.location.pickup.lng
        },
        delivery: {
          address: state.pendingOrder.location.delivery.address,
          lat: state.pendingOrder.location.delivery.lat,
          lng: state.pendingOrder.location.delivery.lng
        },
        items: state.pendingOrder.items.map(item => ({
          name: item.name,
          type: 'flower',
          quantity: item.weight || '1g',
          thc: '20%'
        })),
        route: {
          pickup: {
            address: state.pendingOrder.location.pickup.address,
            lat: state.pendingOrder.location.pickup.lat,
            lng: state.pendingOrder.location.pickup.lng
          },
          delivery: {
            address: state.pendingOrder.location.delivery.address,
            lat: state.pendingOrder.location.delivery.lat,
            lng: state.pendingOrder.location.delivery.lng
          },
          estimated_distance: 5000,
          estimated_duration: 15
        }
      };

      console.log('🚗 Created mock assignment:', mockAssignment);
      setState(prev => ({
        ...prev,
        currentAssignment: mockAssignment,
        activeDelivery: mockAssignment,
        currentStep: 'pickup',
        estimatedTime: 15,
        distance: '5.0 mi'
      }));
      
      // Update buddy status
      setState(prev => ({
        ...prev,
        currentBuddy: {
          ...prev.currentBuddy,
          status: 'delivering'
        }
      }));
      
      setState(prev => ({
        ...prev,
        pendingOrder: null,
        currentView: 'delivery'
      }));
      
      // Update store if needed
      if (dispatch) {
        dispatch(assignBuddy({ buddy: state.currentBuddy, assignment: mockAssignment }));
        dispatch(updateOrderStatus({ status: 'delivering' }));
      }
    } else {
      console.log('❌ No matching pending order found for:', orderId);
    }
  };

  // Handle order decline
  const handleDeclineOrder = (orderId: string) => {
    console.log('❌ Attempting to decline order:', orderId);
    if (state.pendingOrder && state.pendingOrder.id === orderId) {
      console.log('📦 Found matching pending order, declining...');
      setState(prev => ({
        ...prev,
        pendingOrder: null
      }));
      wsRef.current.send({
        type: 'order_declined',
        payload: { orderId }
      });
    } else {
      console.log('❌ No matching pending order found for:', orderId);
    }
  };

  // Function to check if an order is a mock order
  const isMockOrder = (assignment: OrderAssignment): boolean => {
    // All orders that are not from GrassApp web, don't have valid payment methods,
    // and don't have an official dispensary API are considered mock orders
    return true; // For now, treat all orders as mock orders
  };

  useEffect(() => {
    // Update WebSocket service with delivery status
    if (state.activeDelivery) {
      const destination = state.currentStep === 'pickup' 
        ? state.activeDelivery.route.pickup 
        : state.activeDelivery.route.delivery;
      wsRef.current.setActiveDelivery(true, destination);
    } else {
      wsRef.current.setActiveDelivery(false);
    }
  }, [state.activeDelivery, state.currentStep]);

  const handleOrderAccept = async (order: Order) => {
    try {
      console.log('✅ Attempting to accept order:', order.id);
      const assignment = await assignOrder(order);
      console.log('📦 Found matching pending order, assigning...', assignment);
      
      setState(prev => ({
        ...prev,
        currentAssignment: assignment,
        activeDelivery: assignment,
        currentStep: 'pickup',
        estimatedTime: 15,
        distance: '5.0 mi'
      }));
      
      // Update buddy status
      setState(prev => ({
        ...prev,
        currentBuddy: {
          ...prev.currentBuddy,
          status: 'delivering'
        }
      }));
      
      setState(prev => ({
        ...prev,
        pendingOrder: null,
        currentView: 'delivery'
      }));
      
      // Update store if needed
      if (dispatch) {
        dispatch(assignBuddy({ buddy: state.currentBuddy, assignment }));
        dispatch(updateOrderStatus({ status: 'delivering' }));
      }
    } catch (error) {
      console.error('❌ Failed to accept order:', error);
    }
  };

  const handlePickupComplete = async () => {
    console.log('🔄 handlePickupComplete called');
    if (!state.activeDelivery) {
      console.log('❌ No active delivery found');
      return;
    }

    console.log('📍 Updating current step to delivery');
    setState(prev => ({
      ...prev,
      currentStep: 'delivery'
    }));
    
    // Calculate route to delivery
    console.log('🗺️ Calculating route to delivery location');
    const routeMetrics = await calculateRoute(
      state.activeDelivery.route.pickup,
      state.activeDelivery.route.delivery
    );
    console.log('📊 Route metrics calculated:', routeMetrics);
    setState(prev => ({
      ...prev,
      estimatedTime: routeMetrics.duration,
      distance: routeMetrics.distance
    }));
  };

  const handleDeliveryComplete = (success: boolean) => {
    if (success && state.activeDelivery) {
      // Calculate earnings for this delivery
      const BASE_RATE = 5.00;        // Base rate per delivery
      const PER_MILE_RATE = 1.50;    // Rate per mile
      const PER_ITEM_RATE = 0.50;    // Rate per item
      const TIP_PERCENTAGE = 1.00;    // 100% of tip goes to buddy

      const deliveryEarnings = 
        BASE_RATE +
        (parseFloat(state.distance) * PER_MILE_RATE) +
        (state.activeDelivery.items.length * PER_ITEM_RATE);

      // Update earnings
      setState(prev => ({
        ...prev,
        earnings: prev.earnings + deliveryEarnings,
        currentBuddy: {
          ...prev.currentBuddy,
          yearToDateEarnings: prev.currentBuddy.yearToDateEarnings + deliveryEarnings,
          total_deliveries: prev.currentBuddy.total_deliveries + 1
        }
      }));

      // Clear active delivery
      setState(prev => ({
        ...prev,
        activeDelivery: null,
        currentStep: 'pickup'
      }));
      
      // Update store
      dispatch(updateOrderStatus({ status: 'completed' }));
      
      // Return to home screen
      setState(prev => ({
        ...prev,
        currentView: 'home'
      }));
    }
  };

  const handleMessageSend = (message: string) => {
    if (!state.activeDelivery) return;
    console.log('💬 Sending message:', message);
  };

  const handleEarningsClick = () => {
    setState(prev => ({
      ...prev,
      showEarningsSummary: true
    }));
  };

  const handleBackFromEarnings = () => {
    setState(prev => ({
      ...prev,
      showEarningsSummary: false
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/budz/auth');
  };

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'home':
        return (
          <BuddyHomeScreen
            buddy={state.currentBuddy}
            earnings={state.earnings}
            onGoOnline={handleGoOnline}
            isOnline={state.isOnline}
            onProfileClick={() => setState(prev => ({ ...prev, currentView: 'profile' }))}
            onEarningsClick={handleEarningsClick}
            onAcceptOrder={handleAcceptOrder}
            onDeclineOrder={handleDeclineOrder}
            pendingOrder={state.pendingOrder}
          />
        );
      case 'profile':
        return (
          <BuddyProfile
            buddy={state.currentBuddy}
            yearsActive={2.5}
            pastOrders={mockPastOrders}
            onBack={() => setState(prev => ({ ...prev, currentView: 'home' }))}
          />
        );
      case 'delivery':
        if (!state.activeDelivery) {
          // If there's no assignment, redirect to home
          setState(prev => ({ ...prev, currentView: 'home' }));
          return null;
        }
        return (
          <DeliveryNavigation
            assignment={state.activeDelivery}
            currentStep={state.currentStep}
            estimatedTime={state.estimatedTime}
            distance={state.distance}
            onPickupComplete={handlePickupComplete}
            onDeliveryComplete={handleDeliveryComplete}
            onMessageSend={handleMessageSend}
            userLocation={state.userLocation}
            isMockOrder={isMockOrder(state.activeDelivery)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {state.showEarningsSummary ? (
        <EarningsSummary
          onBack={handleBackFromEarnings}
          dailyEarnings={state.earnings}
          weeklyEarnings={state.weeklyEarnings}
          payoutHistory={state.payoutHistory}
        />
      ) : renderCurrentView()}
    </div>
  );
}; 