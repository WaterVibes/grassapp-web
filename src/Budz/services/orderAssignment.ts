import { Buddy, OrderAssignment, BuddyLocation } from '../../types/buddy';
import { Order } from '../../store/ordersSlice';

// Maximum distance (in miles) to consider a buddy for an order
const MAX_ASSIGNMENT_DISTANCE = 10;

// Minimum rating to be eligible for orders
const MIN_RATING = 4.0;

// Scoring weights for buddy selection
const WEIGHTS = {
  DISTANCE: 0.4,    // 40% weight for distance
  RATING: 0.3,      // 30% weight for rating
  EXPERIENCE: 0.2,  // 20% weight for experience (total deliveries)
  WORKLOAD: 0.1     // 10% weight for current workload
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calculate buddy score based on multiple factors
function calculateBuddyScore(
  buddy: Buddy,
  distance: number,
  maxDeliveries: number
): number {
  // Distance score (inverse - closer is better)
  const distanceScore = 1 - (distance / MAX_ASSIGNMENT_DISTANCE);
  
  // Rating score
  const ratingScore = (buddy.rating - MIN_RATING) / (5 - MIN_RATING);
  
  // Experience score based on total deliveries
  const experienceScore = buddy.total_deliveries / maxDeliveries;
  
  // Workload score (inverse - less current work is better)
  const workloadScore = buddy.current_order ? 0 : 1;

  // Calculate weighted score
  return (
    WEIGHTS.DISTANCE * distanceScore +
    WEIGHTS.RATING * ratingScore +
    WEIGHTS.EXPERIENCE * experienceScore +
    WEIGHTS.WORKLOAD * workloadScore
  );
}

// Find the best buddy for the order based on multiple criteria
function findBestBuddy(
  availableBuddies: Buddy[],
  dispensaryLat: number,
  dispensaryLng: number
): { buddy: Buddy; distance: number } | null {
  if (availableBuddies.length === 0) return null;

  // Find maximum deliveries for normalization
  const maxDeliveries = Math.max(...availableBuddies.map(b => b.total_deliveries));

  let bestBuddy: Buddy | null = null;
  let bestScore = -1;
  let bestDistance = 0;

  availableBuddies.forEach(buddy => {
    if (
      buddy.status === 'available' &&
      buddy.location &&
      buddy.rating >= MIN_RATING
    ) {
      const distance = calculateDistance(
        buddy.location.lat,
        buddy.location.lng,
        dispensaryLat,
        dispensaryLng
      );

      if (distance <= MAX_ASSIGNMENT_DISTANCE) {
        const score = calculateBuddyScore(buddy, distance, maxDeliveries);
        
        if (score > bestScore) {
          bestScore = score;
          bestBuddy = buddy;
          bestDistance = distance;
        }
      }
    }
  });

  return bestBuddy ? { buddy: bestBuddy, distance: bestDistance } : null;
}

// Calculate earnings for an order
function calculateEarnings(order: Order, distance: number): number {
  const BASE_RATE = 5.00;        // Base rate per delivery
  const PER_MILE_RATE = 1.50;    // Rate per mile
  const PER_ITEM_RATE = 0.50;    // Rate per item
  const TIP_PERCENTAGE = 1.00;    // 100% of tip goes to buddy

  return (
    BASE_RATE +
    (distance * PER_MILE_RATE) +
    (order.items.length * PER_ITEM_RATE) +
    (order.tip * TIP_PERCENTAGE)
  );
}

// Create an order assignment for a buddy
function createOrderAssignment(
  order: Order,
  buddy: Buddy,
  distance: number
): OrderAssignment {
  const earnings = calculateEarnings(order, distance);

  return {
    order_id: order.id,
    buddy_id: buddy.id,
    status: 'seeking_buddy',
    assigned_at: new Date().toISOString(),
    patient: {
      name: 'Patient Name', // This should come from a real patient database
      mmccId: 'PT-' + order.id.slice(-6),
      currentPossession: {
        flower: 0,
        concentrate: 0,
        thcProducts: 0
      }
    },
    dispensary: {
      name: order.location.pickup.address,
      license: 'D-' + Math.random().toString(36).substr(2, 6),
      address: order.location.pickup.address,
      lat: order.location.pickup.lat,
      lng: order.location.pickup.lng,
    },
    delivery: {
      address: order.location.delivery.address,
      lat: order.location.delivery.lat,
      lng: order.location.delivery.lng,
    },
    items: order.items.map(item => ({
      name: item.name,
      type: 'flower',
      quantity: `${item.quantity}g`,
      thc: '20%'
    })),
    route: {
      pickup: {
        address: order.location.pickup.address,
        lat: order.location.pickup.lat,
        lng: order.location.pickup.lng,
      },
      delivery: {
        address: order.location.delivery.address,
        lat: order.location.delivery.lat,
        lng: order.location.delivery.lng,
      },
      estimated_distance: distance,
      estimated_duration: Math.ceil(distance * 2), // Rough estimate: 2 minutes per mile
    },
  };
}

export const orderAssignmentService = {
  // Try to assign an order to the best available buddy
  async assignOrder(
    order: Order,
    availableBuddies: Buddy[]
  ): Promise<{ buddy: Buddy; assignment: OrderAssignment } | null> {
    // Find the best available buddy
    const result = findBestBuddy(
      availableBuddies,
      39.2904, // This should be the actual dispensary latitude
      -76.6122  // This should be the actual dispensary longitude
    );

    if (!result) {
      return null;
    }

    // Create the assignment
    const assignment = createOrderAssignment(order, result.buddy, result.distance);

    // In a real implementation, this would make an API call to:
    // 1. Reserve the buddy
    // 2. Create the assignment in the database
    // 3. Notify the buddy through WebSocket
    
    return {
      buddy: result.buddy,
      assignment
    };
  },

  // Update buddy location
  async updateBuddyLocation(
    buddyId: string,
    location: BuddyLocation
  ): Promise<void> {
    // In a real implementation, this would:
    // 1. Update the buddy's location in the database
    // 2. Notify the customer through WebSocket
    // 3. Update the delivery ETA
    console.log('Updating buddy location:', buddyId, location);
  }
}; 