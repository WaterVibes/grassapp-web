import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

interface MMCCInfo {
  id: string;
  expirationDate: string;
  type: 'patient' | 'caregiver' | 'minor';
  isVerified: boolean;
}

interface DeliveryAddress {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zip: string;
  isVerified: boolean;
}

interface GrassPass {
  tier: 'Monthly' | 'Annual';
  expiryDate: string;
  autoRenew: boolean;
  status: 'active' | 'cancelled' | 'expired';
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  grassPoints: number;
  mmcc?: MMCCInfo;
  deliveryAddresses: DeliveryAddress[];
  defaultAddressIndex: number;
  grassPass?: GrassPass;
  // Budzz-specific fields
  yearToDateEarnings?: number;
  total_deliveries?: number;
  status?: 'available' | 'delivering' | 'offline';
  rating?: number;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

// Try to get initial state from cookies
const getUserFromCookie = (): User | null => {
  const userStr = Cookies.get('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

const initialState: AuthState = {
  isLoggedIn: !!Cookies.get('auth_token'),
  user: getUserFromCookie(),
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.user = action.payload;
      // Set cookies
      Cookies.set('auth_token', 'temp_token', { expires: 7 }); // 7 days
      Cookies.set('user', JSON.stringify(action.payload), { expires: 7 });
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      // Remove cookies
      Cookies.remove('auth_token');
      Cookies.remove('user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        // Update user cookie
        Cookies.set('user', JSON.stringify(state.user), { expires: 7 });
      }
    },
    addDeliveryAddress: (state, action: PayloadAction<DeliveryAddress>) => {
      if (state.user) {
        state.user.deliveryAddresses.push(action.payload);
        // Update user cookie
        Cookies.set('user', JSON.stringify(state.user), { expires: 7 });
      }
    },
    setDefaultAddress: (state, action: PayloadAction<number>) => {
      if (state.user) {
        state.user.defaultAddressIndex = action.payload;
        // Update user cookie
        Cookies.set('user', JSON.stringify(state.user), { expires: 7 });
      }
    },
    updateMMCCInfo: (state, action: PayloadAction<MMCCInfo>) => {
      if (state.user) {
        state.user.mmcc = action.payload;
        // Update user cookie
        Cookies.set('user', JSON.stringify(state.user), { expires: 7 });
      }
    },
  },
});

export const {
  login,
  logout,
  updateUser,
  addDeliveryAddress,
  setDefaultAddress,
  updateMMCCInfo,
} = authSlice.actions;

export default authSlice.reducer; 