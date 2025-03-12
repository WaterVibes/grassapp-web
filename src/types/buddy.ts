export type BuddyStatus = 'available' | 'delivering' | 'offline';
export type VehicleType = 'car' | 'motorcycle' | 'bicycle';

export interface VehicleInfo {
  type: VehicleType;
  model?: string;
  color?: string;
  license_plate?: string;
}

export interface BuddyLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

export interface Buddy {
  id: string;
  name: string;
  photo_url: string;
  rating: number;
  total_deliveries: number;
  status: BuddyStatus;
  mmccId: string;
  yearToDateEarnings: number;
  current_order?: string;
  location?: BuddyLocation;
  vehicle_info: VehicleInfo;
  metadata: Record<string, unknown>;
}

export interface Patient {
  name: string;
  mmccId: string;
  currentPossession?: {
    flower: number; // grams
    concentrate: number; // grams
    thcProducts: number; // mg of THC
  };
}

export interface DispensaryInfo {
  name: string;
  license: string;
  address: string;
  lat: number;
  lng: number;
}

export interface OrderItem {
  name: string;
  type: 'flower' | 'concentrate' | 'edible' | 'other';
  quantity: string;
  thc: string;
}

export interface ComplianceCheck {
  withinFlowerLimit: boolean;
  withinConcentrateLimit: boolean;
  withinTHCLimit: boolean;
  message: string;
}

export interface PastOrder {
  id: string;
  date: string;
  dispensary: string;
  patient: Patient;
  items: OrderItem[];
  total: number;
  earnings: number;
  complianceChecks: {
    patientIdVerified: boolean;
    withinLimits: boolean;
    orderCompliant: boolean;
  };
}

export type OrderAssignmentStatus = 'preparing' | 'seeking_buddy' | 'delivering' | 'completed';

export interface RouteLocation {
  address: string;
  lat: number;
  lng: number;
}

export interface OrderAssignment {
  order_id: string;
  buddy_id: string;
  status: OrderAssignmentStatus;
  assigned_at: string;
  accepted_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancel_reason?: string;
  patient: Patient;
  dispensary: DispensaryInfo;
  delivery: {
    address: string;
    lat: number;
    lng: number;
  };
  items: OrderItem[];
  route: {
    pickup: RouteLocation;
    delivery: RouteLocation;
    estimated_distance: number;
    estimated_duration: number;
  };
}

export interface BuddyRegistration {
  name: string;
  email: string;
  phone: string;
  mmccId: string;
  vehicle_info: VehicleInfo;
}

export interface BuddyStatusUpdate {
  status: BuddyStatus;
}

export interface BuddyLocationUpdate {
  lat: number;
  lng: number;
} 