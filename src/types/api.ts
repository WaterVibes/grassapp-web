// Common types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'buddy' | 'admin';
  mmccVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  strain: 'indica' | 'sativa' | 'hybrid';
  thcContent: number;
  cbdContent: number;
  price: number;
  imageUrl: string;
  effects: string[];
  dispensaryId: string;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// Dispensary types
export interface Dispensary {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  address: Address;
  phone: string;
  email: string;
  operatingHours: OperatingHours;
  deliveryRadius: number;
  rating: number;
  reviewCount: number;
  location: {
    lat: number;
    lng: number;
  };
}

export interface OperatingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isClosed: boolean;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  dispensaryId: string;
  buddyId?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  deliveryAddress: Address;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

// Buddy types
export interface BuddyProfile extends User {
  status: 'available' | 'delivering' | 'offline';
  currentLocation?: {
    lat: number;
    lng: number;
  };
  rating: number;
  deliveryCount: number;
  earnings: BuddyEarnings;
}

export interface BuddyEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  pendingPayout: number;
}

export interface DeliveryAssignment {
  id: string;
  order: Order;
  status: OrderStatus;
  pickupLocation: {
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    lat: number;
    lng: number;
  };
  estimatedDuration: number;
  estimatedDistance: number;
  earnings: {
    base: number;
    tip: number;
    total: number;
  };
} 