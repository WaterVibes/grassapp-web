import { Buddy, OrderAssignment, BuddyLocation } from '../../types/buddy';
import { Order } from '../../store/ordersSlice';

// Admin's location (Lawnwood Circle)
const ADMIN_LOCATION = {
  lat: 39.3476,
  lng: -76.7379
};

// List of mock dispensaries
const MOCK_DISPENSARIES = [
  {
    name: 'StoreHouse Dispensary',
    address: '1000 W Baltimore St',
    image: '/dispensary-default.jpg',
    location: {
      lat: 39.3476,
      lng: -76.7379
    }
  },
  {
    name: 'GreenLeaf Wellness',
    address: '2100 Maryland Ave',
    image: '/dispensary-default.jpg',
    location: {
      lat: 39.3176,
      lng: -76.6159
    }
  }
];

// List of mock products
const MOCK_PRODUCTS = [
  { name: 'Blue Dream', price: 50, size: '3.5g' },
  { name: 'GSC', price: 60, size: '3.5g' },
  { name: 'Purple Punch', price: 55, size: '3.5g' }
];

type WebSocketMessage = {
  type: 'order_available' | 'order_assigned' | 'location_update' | 'order_status_update' | 'earnings_update' | 'ping' | 'order_declined';
  payload: any;
};

type WebSocketCallbacks = {
  onOrderAvailable?: (order: Order) => void;
  onOrderAssigned?: (assignment: OrderAssignment) => void;
  onLocationUpdate?: (location: BuddyLocation) => void;
  onOrderStatusUpdate?: (status: OrderAssignment['status']) => void;
  onEarningsUpdate?: (earnings: number) => void;
  onConnectionChange?: (isConnected: boolean) => void;
};

class BuddyWebSocket {
  private callbacks: WebSocketCallbacks = {};
  private buddyId: string;
  private mockOrderInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private notificationSound: HTMLAudioElement | null = null;
  private userLocation: { lat: number; lng: number } = ADMIN_LOCATION;
  private watchId: number | null = null;
  private isConnecting: boolean = false;
  private activeDelivery: boolean = false;
  private deliveryDestination: { lat: number; lng: number } | null = null;

  constructor(buddyId: string) {
    this.buddyId = buddyId;
    // Create audio element for notifications
    if (typeof window !== 'undefined') {
      this.notificationSound = new Audio('/notification.mp3');
    }
  }

  connect() {
    if (this.isConnected || this.isConnecting) {
      console.log('🌐 WebSocket already connected or connecting');
      return;
    }

    console.log('🌐 Attempting WebSocket connection...');
    this.isConnecting = true;

    // Simulate connection delay
    setTimeout(() => {
      if (!this.isConnecting) {
        console.log('🌐 Connection attempt cancelled');
        return;
      }

      console.log('🌐 WebSocket connected successfully');
      this.isConnected = true;
      this.isConnecting = false;
      this.callbacks.onConnectionChange?.(true);
      this.startMockOrderGeneration();
      this.startLocationTracking();
    }, 500);
  }

  private startLocationTracking() {
    if (!this.isConnected) {
      console.log('❌ Cannot start location tracking - not connected');
      return;
    }

    if ('geolocation' in navigator) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (!this.isConnected) return;

          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.updateLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.userLocation = ADMIN_LOCATION;
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000
        }
      );
    }
  }

  private generateMockOrder() {
    console.log('🎲 Generating mock order...');
    const dispensary = MOCK_DISPENSARIES[Math.floor(Math.random() * MOCK_DISPENSARIES.length)];
    const product = MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)];
    
    const mockOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [
        {
          id: '1',
          name: product.name,
          quantity: Math.floor(Math.random() * 2) + 1,
          price: product.price,
          size: product.size,
          weight: product.size
        }
      ],
      status: 'seeking_buddy',
      deliveryTime: '30-35 min',
      total: 125.00,
      subtotal: 100.00,
      deliveryFee: 15.00,
      tip: 10.00,
      deliveryOption: 'delivery',
      location: {
        pickup: {
          address: dispensary.name,
          lat: dispensary.location.lat,
          lng: dispensary.location.lng
        },
        delivery: {
          address: '2110 Lawnwood Cir, Baltimore, MD 21207',
          lat: ADMIN_LOCATION.lat,
          lng: ADMIN_LOCATION.lng
        }
      },
      createdAt: new Date().toISOString()
    };

    console.log('📦 Generated mock order:', mockOrder);
    
    if (this.notificationSound) {
      console.log('🔔 Attempting to play notification sound...');
      this.notificationSound.play().catch(error => {
        console.warn('🔕 Audio playback failed:', error);
      });
    }

    this.callbacks.onOrderAvailable?.(mockOrder);
    return mockOrder;
  }

  private calculateDistanceToDestination(): number {
    if (!this.deliveryDestination || !this.userLocation) return Infinity;
    
    const R = 6371e3; // Earth's radius in meters
    const φ1 = this.userLocation.lat * Math.PI/180;
    const φ2 = this.deliveryDestination.lat * Math.PI/180;
    const Δφ = (this.deliveryDestination.lat - this.userLocation.lat) * Math.PI/180;
    const Δλ = (this.deliveryDestination.lng - this.userLocation.lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  private startMockOrderGeneration() {
    if (this.mockOrderInterval) {
      clearInterval(this.mockOrderInterval);
    }

    this.mockOrderInterval = setInterval(() => {
      // Only generate orders if not in active delivery or within 4 minutes of drop-off
      const distanceToDestination = this.calculateDistanceToDestination();
      const averageSpeed = 13.4; // meters/second (about 30mph)
      const estimatedTimeToDestination = distanceToDestination / averageSpeed;

      if (!this.activeDelivery || estimatedTimeToDestination <= 240) { // 240 seconds = 4 minutes
        this.generateMockOrder();
      }
    }, 30000); // Generate order every 30 seconds if conditions met
  }

  public setActiveDelivery(active: boolean, destination?: { lat: number; lng: number }) {
    this.activeDelivery = active;
    this.deliveryDestination = destination || null;
  }

  private cleanup() {
    if (this.mockOrderInterval) {
      console.log('🧹 Clearing mock order interval');
      clearInterval(this.mockOrderInterval);
      this.mockOrderInterval = null;
    }
    if (this.watchId !== null) {
      console.log('🧹 Clearing location watch');
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  setCallbacks(callbacks: WebSocketCallbacks) {
    this.callbacks = callbacks;
  }

  send(message: WebSocketMessage) {
    console.log('📤 Sending message:', message);
    if (!this.isConnected) {
      console.log('❌ Message not sent - WebSocket not connected');
      return;
    }

    // Handle mock messages
    if (process.env.NODE_ENV === 'development') {
      switch (message.type) {
        case 'order_declined':
          console.log('❌ Order declined:', message.payload.orderId);
          break;
        case 'location_update':
          console.log('📍 Location update:', message.payload);
          this.callbacks.onLocationUpdate?.(message.payload);
          break;
        case 'ping':
          console.log('📡 Ping received');
          break;
      }
    }
  }

  updateLocation(location: BuddyLocation) {
    this.send({
      type: 'location_update',
      payload: location
    });
  }

  disconnect() {
    console.log('🔴 Disconnecting WebSocket...');
    this.isConnecting = false;
    this.cleanup();
    this.isConnected = false;
    this.callbacks.onConnectionChange?.(false);
    console.log('🔴 WebSocket disconnected');
  }

  private handleMessage(message: WebSocketMessage) {
    console.log('📥 WebSocket message received:', message);
    
    switch (message.type) {
      case 'order_available':
        console.log('📦 Processing new order:', message.payload);
        this.callbacks.onOrderAvailable?.(message.payload);
        if (this.notificationSound) {
          console.log('🔔 Playing notification sound...');
          this.notificationSound.play().catch(error => {
            console.warn('🔕 Notification sound failed:', error);
          });
        }
        break;
      // ... other cases ...
    }
  }
}

export const createWebSocket = (buddyId: string) => new BuddyWebSocket(buddyId); 