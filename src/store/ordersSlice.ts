import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Buddy, OrderAssignment } from '@/types/buddy';

export interface Order {
  id: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    size: string;
    weight: string;
  }>;
  status: 'preparing' | 'seeking_buddy' | 'delivering' | 'completed';
  deliveryTime: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  tip: number;
  deliveryOption: 'delivery' | 'pickup';
  location: {
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
  };
  createdAt: string;
  buddy?: Buddy;
  assignment?: OrderAssignment;
}

export interface OrdersState {
  activeOrder: Order | null;
  hasActiveOrder: boolean;
  orderHistory: Order[];
}

const initialState: OrdersState = {
  activeOrder: null,
  hasActiveOrder: false,
  orderHistory: []
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: (state, action: PayloadAction<Order>) => {
      state.activeOrder = action.payload;
      state.hasActiveOrder = true;
    },
    completeOrder: (state) => {
      if (state.activeOrder) {
        state.orderHistory.push(state.activeOrder);
        state.activeOrder = null;
        state.hasActiveOrder = false;
      }
    },
    updateOrderStatus: (state, action: PayloadAction<{ status: Order['status'] }>) => {
      if (state.activeOrder) {
        state.activeOrder.status = action.payload.status;
      }
    },
    assignBuddy: (state, action: PayloadAction<{ buddy: Buddy, assignment: OrderAssignment }>) => {
      if (state.activeOrder) {
        state.activeOrder.buddy = action.payload.buddy;
        state.activeOrder.assignment = action.payload.assignment;
      }
    },
    updateBuddyLocation: (state, action: PayloadAction<{ lat: number, lng: number }>) => {
      if (state.activeOrder?.buddy) {
        state.activeOrder.buddy.location = {
          ...action.payload,
          last_updated: new Date().toISOString()
        };
      }
    }
  }
});

export const {
  placeOrder,
  completeOrder,
  updateOrderStatus,
  assignBuddy,
  updateBuddyLocation
} = ordersSlice.actions;

export default ordersSlice.reducer; 