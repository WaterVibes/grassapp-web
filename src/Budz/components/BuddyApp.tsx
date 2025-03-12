import React, { useState, useEffect } from 'react';
import { OrderAssignment, PendingOrder } from '../types';
import { assignOrder, calculateRoute } from '../services/orderService';
import { websocket } from '../services/websocketService';
import { DeliveryNavigation, OrderCard } from '../components';

export const BuddyApp: React.FC = () => {
  const [activeDelivery, setActiveDelivery] = useState<OrderAssignment | null>(null);
  const [currentStep, setCurrentStep] = useState<'pickup' | 'delivery'>('pickup');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [distance, setDistance] = useState('');
  const [isMockOrder] = useState(true);

  useEffect(() => {
    // ... existing WebSocket setup ...

    // Update WebSocket service with delivery status
    if (activeDelivery) {
      const destination = currentStep === 'pickup' 
        ? activeDelivery.route.pickup 
        : activeDelivery.route.delivery;
      websocket.setActiveDelivery(true, destination);
    } else {
      websocket.setActiveDelivery(false);
    }
  }, [activeDelivery, currentStep]);

  const handleOrderAccept = async (order: PendingOrder) => {
    try {
      console.log('✅ Attempting to accept order:', order.id);
      const assignment = await assignOrder(order);
      console.log('📦 Found matching pending order, assigning...', assignment);
      
      setActiveDelivery(assignment);
      setCurrentStep('pickup');
      
      // Calculate initial route metrics
      const routeMetrics = await calculateRoute(
        userLocation,
        assignment.route.pickup
      );
      setEstimatedTime(routeMetrics.duration);
      setDistance(routeMetrics.distance);
      
      console.log('🚗 Order assignment successful:', assignment);
    } catch (error) {
      console.error('❌ Failed to accept order:', error);
    }
  };

  const handlePickupComplete = async () => {
    console.log('🔄 handlePickupComplete called');
    if (!activeDelivery) {
      console.log('❌ No active delivery found');
      return;
    }

    console.log('📍 Updating current step to delivery');
    setCurrentStep('delivery');
    
    // Calculate route to delivery
    console.log('🗺️ Calculating route to delivery location');
    const routeMetrics = await calculateRoute(
      activeDelivery.route.pickup,
      activeDelivery.route.delivery
    );
    console.log('📊 Route metrics calculated:', routeMetrics);
    setEstimatedTime(routeMetrics.duration);
    setDistance(routeMetrics.distance);
  };

  const handleMessageSend = (message: string) => {
    if (!activeDelivery) return;
    
    // In a real app, this would send the message through WebSocket
    console.log('💬 Sending message:', message);
    // websocket.sendMessage(activeDelivery.id, message);
  };

  return (
    <div className="h-screen bg-grass-bg-dark text-white">
      {activeDelivery ? (
        <>
          {console.log('🎯 Rendering DeliveryNavigation with props:', {
            currentStep,
            isMockOrder
          })}
          <DeliveryNavigation
            assignment={activeDelivery}
            currentStep={currentStep}
            estimatedTime={estimatedTime}
            distance={distance}
            onPickupComplete={handlePickupComplete}
            onMessageSend={handleMessageSend}
            userLocation={{ lat: 39.2904, lng: -76.6122 }}
            isMockOrder={isMockOrder}
          />
        </>
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Available Orders</h1>
          {pendingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={() => handleOrderAccept(order)}
            />
          ))}
        </div>
      )}
    </div>
  );
}; 