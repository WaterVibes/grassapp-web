import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  weight: string;
  image_url?: string;
  strain_type?: string;
  thc?: string;
  cbd?: string;
  added_at?: string;
  metadata?: Record<string, unknown>;
}

interface CartState {
  items: CartItem[];
  dispensaryUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  dispensaryUrl: null,
  isLoading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setDispensary: (state, action: PayloadAction<string>) => {
      if (state.dispensaryUrl !== action.payload) {
        state.items = []; // Clear cart when switching dispensaries
      }
      state.dispensaryUrl = action.payload;
    },
    addItem: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    updateItemQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.itemId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setDispensary,
  addItem,
  updateItemQuantity,
  removeItem,
  clearCart,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer; 