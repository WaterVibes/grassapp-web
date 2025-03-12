import axios from 'axios';
import { Dispensary, DispensaryListResponse } from './types';

// Types based on your FastAPI models
export interface Product {
  id: string;
  name: string;
  price?: number;
  original_price?: number;
  description?: string;
  image_url?: string;
  category?: string;
  brand?: string;
  effects: string[];
  thc?: string;
  cbd?: string;
  strain_type?: string;
  in_stock: boolean;
  metadata: {
    sizes: Array<{
      name: string;
      weight: string;
      price: number;
    }>;
  };
}

export interface DispensaryResponse {
  status: 'success';
  url: string;
  products: Product[];
  total_products: number;
  timestamp: string;
  cache_hit: boolean;
  metadata: Record<string, unknown>;
}

export interface ErrorResponse {
  status: 'error';
  code: number;
  message: string;
  timestamp: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image_url?: string;
  category?: string;
  brand?: string;
  strain_type?: string;
  thc?: string;
  cbd?: string;
  added_at: string;
  metadata: Record<string, unknown>;
}

export interface Cart {
  id: string;
  user_id: string;
  dispensary_url: string;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface AddToCartRequest {
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image_url?: string;
  category?: string;
  brand?: string;
  strain_type?: string;
  thc?: string;
  cbd?: string;
  metadata: Record<string, unknown>;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

const API_URL = process.env.API_URL || 'http://localhost:8001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 120000, // 2 minutes
});

// Add request interceptor to include API key
api.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('weedmaps_api_key');
  if (apiKey) {
    config.headers['X-API-Key'] = apiKey;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - the server is taking too long to respond');
      return Promise.reject(new Error('Request timeout - please try again'));
    }
    return Promise.reject(error);
  }
);

// API functions
export const getDispensaryData = async (
  dispensaryUrl: string,
  maxPages: number = 5,
  forceRefresh: boolean = false,
  includeMetadata: boolean = false
): Promise<DispensaryResponse> => {
  try {
    console.log('Making request to dispensary endpoint with URL:', dispensaryUrl);
    
    // Remove any existing protocol and encode the URL
    const cleanUrl = dispensaryUrl.replace(/^https?:\/\//, '');
    const encodedUrl = encodeURIComponent(cleanUrl);
    
    // Make the request with the encoded URL
    const response = await api.get(`/dispensary/${encodedUrl}`, {
      params: {
        max_pages: maxPages,
        force_refresh: forceRefresh,
        include_metadata: includeMetadata,
      },
    });
    
    console.log('Dispensary response:', response.data);
    
    if (!response.data || !response.data.products) {
      throw new Error('Invalid response format from server');
    }
    
    return response.data;
  } catch (error) {
    console.error('Error fetching dispensary data:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      throw new Error(error.response?.data?.detail || error.message);
    }
    throw error;
  }
};

export const getDispensaryProducts = async (
  dispensaryUrl: string,
  filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }
): Promise<Product[]> => {
  const response = await api.get(`/dispensary/${dispensaryUrl}/products`, {
    params: {
      category: filters?.category,
      min_price: filters?.minPrice,
      max_price: filters?.maxPrice,
      in_stock: filters?.inStock,
    },
  });
  return response.data;
};

// Cart management functions
export const getUserCart = async (
  userId: string,
  dispensaryUrl: string
): Promise<Cart> => {
  const response = await api.get(`/cart/${userId}/${dispensaryUrl}`);
  return response.data;
};

export const addToCart = async (
  userId: string,
  dispensaryUrl: string,
  item: Omit<CartItem, 'id'>
): Promise<Cart> => {
  const response = await api.post(`/cart/${userId}/${dispensaryUrl}/items`, item);
  return response.data;
};

export const updateCartItem = async (
  userId: string,
  dispensaryUrl: string,
  itemId: string,
  quantity: number
): Promise<Cart> => {
  const response = await api.put(
    `/cart/${userId}/${dispensaryUrl}/items/${itemId}`,
    { quantity }
  );
  return response.data;
};

export const removeCartItem = async (
  userId: string,
  dispensaryUrl: string,
  itemId: string
): Promise<Cart> => {
  const response = await api.delete(
    `/cart/${userId}/${dispensaryUrl}/items/${itemId}`
  );
  return response.data;
};

export const clearCart = async (
  userId: string,
  dispensaryUrl: string
): Promise<Cart> => {
  const response = await api.delete(`/cart/${userId}/${dispensaryUrl}`);
  return response.data;
};

// Dispensary listing functions
export const getDispensaries = async (
  page: number = 1,
  per_page: number = 12
): Promise<DispensaryListResponse> => {
  console.log('Making request to /dispensaries with params:', { page, per_page });
  try {
    const response = await api.get('/dispensaries', {
      params: { page, per_page }
    });
    console.log('Dispensaries response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching dispensaries:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
    }
    throw error;
  }
};

export const calculateDeliveryFee = (distanceInMiles: number): number => {
  // Base delivery fee
  let fee = 5.99;
  
  // Additional fee per mile after first 3 miles
  if (distanceInMiles > 3) {
    fee += (distanceInMiles - 3) * 1.50;
  }
  
  // Cap the maximum delivery fee at $15.99
  return Math.min(fee, 15.99);
}; 