import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (userData: { name: string; email: string; password: string }) =>
    api.post('/auth/register', userData),
  verifyMMCC: (mmccData: { id: string; expirationDate: string }) =>
    api.post('/auth/verify-mmcc', mmccData),
};

// Products endpoints
export const productsAPI = {
  getProducts: (filters?: { category?: string; search?: string }) =>
    api.get('/products', { params: filters }),
  getProduct: (id: string) => 
    api.get(`/products/${id}`),
  getCategories: () => 
    api.get('/products/categories'),
};

// Dispensary endpoints
export const dispensaryAPI = {
  getDispensaries: (location: { lat: number; lng: number }) =>
    api.get('/dispensaries', { params: location }),
  getDispensary: (id: string) =>
    api.get(`/dispensaries/${id}`),
  getSavedDispensaries: () =>
    api.get('/dispensaries/saved'),
  saveDispensary: (id: string) =>
    api.post(`/dispensaries/${id}/save`),
};

// Orders endpoints
export const ordersAPI = {
  createOrder: (orderData: any) =>
    api.post('/orders', orderData),
  getOrder: (id: string) =>
    api.get(`/orders/${id}`),
  getOrderHistory: () =>
    api.get('/orders/history'),
  updateOrderStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }),
};

// Buddy endpoints
export const buddyAPI = {
  updateStatus: (status: 'available' | 'delivering' | 'offline') =>
    api.patch('/buddy/status', { status }),
  updateLocation: (location: { lat: number; lng: number }) =>
    api.patch('/buddy/location', location),
  getDeliveries: () =>
    api.get('/buddy/deliveries'),
  acceptDelivery: (orderId: string) =>
    api.post(`/buddy/deliveries/${orderId}/accept`),
  completeDelivery: (orderId: string) =>
    api.post(`/buddy/deliveries/${orderId}/complete`),
  getEarnings: () =>
    api.get('/buddy/earnings'),
};

// User profile endpoints
export const userAPI = {
  getProfile: () =>
    api.get('/user/profile'),
  updateProfile: (profileData: any) =>
    api.patch('/user/profile', profileData),
  getAddresses: () =>
    api.get('/user/addresses'),
  addAddress: (address: any) =>
    api.post('/user/addresses', address),
  updateAddress: (id: string, address: any) =>
    api.patch(`/user/addresses/${id}`, address),
  deleteAddress: (id: string) =>
    api.delete(`/user/addresses/${id}`),
};

export default api; 