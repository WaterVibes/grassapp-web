import { Order } from '@/store/ordersSlice';
import { OrderAssignment } from '@/types/buddy';
import { orderAssignmentService } from './orderAssignment';

export const assignOrder = async (order: Order): Promise<OrderAssignment> => {
  // For now, we'll create a mock assignment directly
  const mockAssignment: OrderAssignment = {
    order_id: order.id,
    buddy_id: 'BUDDY-123',
    status: 'delivering',
    assigned_at: new Date().toISOString(),
    accepted_at: new Date().toISOString(),
    patient: {
      name: "Test Patient",
      mmccId: "MMCC-123456"
    },
    dispensary: {
      name: order.location.pickup.address,
      license: "DISP-123",
      address: order.location.pickup.address,
      lat: order.location.pickup.lat,
      lng: order.location.pickup.lng
    },
    delivery: {
      address: order.location.delivery.address,
      lat: order.location.delivery.lat,
      lng: order.location.delivery.lng
    },
    items: order.items.map(item => ({
      name: item.name,
      type: 'flower',
      quantity: item.weight || '1g',
      thc: '20%'
    })),
    route: {
      pickup: {
        address: order.location.pickup.address,
        lat: order.location.pickup.lat,
        lng: order.location.pickup.lng
      },
      delivery: {
        address: order.location.delivery.address,
        lat: order.location.delivery.lat,
        lng: order.location.delivery.lng
      },
      estimated_distance: 5000,
      estimated_duration: 15
    }
  };

  return mockAssignment;
};

interface RouteLocation {
  lat: number;
  lng: number;
}

interface RouteMetrics {
  distance: string;
  duration: number;
}

export const calculateRoute = async (
  origin: RouteLocation,
  destination: RouteLocation
): Promise<RouteMetrics> => {
  // For now, return mock metrics
  return {
    distance: '5.0 mi',
    duration: 15
  };
}; 