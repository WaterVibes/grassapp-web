# GrassApp Buddies System Handoff Log

## Overview
The Buddies system is our delivery driver network for GrassApp. Buddies are responsible for delivering cannabis products from dispensaries to customers.

## Current Implementation
- Basic order tracking UI in `/order-status` page
- Placeholder driver info (currently hardcoded as "John Doe")
- Simple timeline showing "Preparing" and "Delivery" states
- Basic map placeholder for delivery tracking

## Next Steps

### 1. Buddy Profile System
```typescript
interface Buddy {
  id: string;
  name: string;
  photo_url: string;
  rating: number;
  total_deliveries: number;
  status: 'available' | 'delivering' | 'offline';
  current_order?: string;
  location?: {
    lat: number;
    lng: number;
    last_updated: string;
  };
  vehicle_info: {
    type: 'car' | 'motorcycle' | 'bicycle';
    model?: string;
    color?: string;
    license_plate?: string;
  };
  metadata: Record<string, unknown>;
}
```

### 2. Order Assignment System
```typescript
interface OrderAssignment {
  order_id: string;
  buddy_id: string;
  status: 'assigned' | 'accepted' | 'picked_up' | 'delivered' | 'cancelled';
  assigned_at: string;
  accepted_at?: string;
  picked_up_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  cancel_reason?: string;
  route: {
    pickup: {
      address: string;
      lat: number;
      lng: number;
    };
    delivery: {
      address: string;
      lat: number;
      lng: number;
    };
    estimated_distance: number;
    estimated_duration: number;
  };
}
```

### 3. Real-time Location Tracking
- Implement WebSocket connection for real-time location updates
- Add Google Maps integration for live tracking
- Create geofencing for delivery zones
- Implement ETA calculations based on real-time traffic

### 4. Buddy Mobile App Features
- Authentication and profile management
- Order acceptance/rejection
- Navigation integration
- Delivery confirmation with photo upload
- Customer communication system
- Earnings tracking
- Schedule management

### 5. Customer Features
- Real-time Buddy location tracking
- In-app chat with Buddy
- Delivery preferences (contactless, specific instructions)
- Buddy rating system
- Tip adjustment after delivery

### 6. Admin Dashboard
- Buddy management system
- Real-time fleet tracking
- Performance metrics
- Earnings management
- Schedule optimization
- Zone management

### 7. Security Features
- Identity verification system
- Background check integration
- Insurance verification
- Vehicle registration tracking
- Safety incident reporting

## Required API Endpoints

### Buddy Management
```typescript
// Create new Buddy
POST /api/buddies
Body: BuddyRegistration

// Update Buddy status
PATCH /api/buddies/{id}/status
Body: { status: BuddyStatus }

// Update Buddy location
POST /api/buddies/{id}/location
Body: { lat: number, lng: number }

// Get Buddy details
GET /api/buddies/{id}

// List available Buddies in area
GET /api/buddies/available
Query: { lat: number, lng: number, radius: number }
```

### Order Assignment
```typescript
// Assign order to Buddy
POST /api/orders/{orderId}/assign
Body: { buddyId: string }

// Accept/Reject order
POST /api/orders/{orderId}/respond
Body: { action: 'accept' | 'reject', reason?: string }

// Update order status
PATCH /api/orders/{orderId}/status
Body: { status: OrderStatus, location?: { lat: number, lng: number } }
```

## Database Schema Updates

### Buddies Table
```sql
CREATE TABLE buddies (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  photo_url TEXT,
  status VARCHAR(20) NOT NULL,
  rating DECIMAL(3,2),
  total_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_location_lat DECIMAL(10,8),
  last_location_lng DECIMAL(11,8),
  last_location_updated TIMESTAMP WITH TIME ZONE,
  vehicle_info JSONB,
  metadata JSONB
);
```

### Order Assignments Table
```sql
CREATE TABLE order_assignments (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  buddy_id UUID REFERENCES buddies(id),
  status VARCHAR(20) NOT NULL,
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL,
  accepted_at TIMESTAMP WITH TIME ZONE,
  picked_up_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancel_reason TEXT,
  route_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## UI Components to Create

1. BuddyProfile
2. BuddyLocationMap
3. DeliveryTimeline
4. OrderAssignmentCard
5. BuddyRatingModal
6. DeliveryInstructions
7. ChatInterface
8. TipAdjustment
9. DeliveryConfirmation
10. IncidentReport

## Testing Requirements

1. Unit tests for assignment algorithms
2. Integration tests for real-time updates
3. End-to-end delivery flow tests
4. Geolocation accuracy tests
5. Load testing for concurrent orders
6. Security testing for sensitive data
7. Offline mode testing
8. Edge case handling for delivery zones

## Performance Considerations

1. Optimize WebSocket connections
2. Implement caching for static data
3. Use efficient geospatial queries
4. Batch location updates
5. Implement rate limiting
6. Handle offline scenarios gracefully
7. Optimize map rendering
8. Implement progressive loading

## Security Considerations

1. Encrypt sensitive data
2. Implement role-based access control
3. Add API request signing
4. Implement rate limiting
5. Add audit logging
6. Secure WebSocket connections
7. Implement session management
8. Add request validation

## Next Immediate Tasks

1. Create Buddy profile system
2. Implement basic location tracking
3. Set up WebSocket server
4. Create order assignment algorithm
5. Design mobile app wireframes
6. Set up admin dashboard
7. Implement chat system
8. Add rating system

## Dependencies to Add

```json
{
  "dependencies": {
    "@googlemaps/react-wrapper": "^1.1.35",
    "@react-google-maps/api": "^2.19.2",
    "socket.io-client": "^4.7.2",
    "geolocation-utils": "^1.2.5",
    "react-rating-stars-component": "^2.2.0"
  }
}
``` 