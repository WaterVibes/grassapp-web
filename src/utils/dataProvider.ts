import { productsAPI, dispensaryAPI, ordersAPI } from '../services/api';
import type { Product, Dispensary, Order, PaginatedResponse } from '../types/api';

// Check if mock data is enabled
const useMockData = process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true';

// Mock data generators (only loaded if mock data is enabled)
const getMockGenerators = async () => {
  if (useMockData) {
    return import('./mockData');
  }
  return null;
};

// Data provider functions that handle both mock and real data
export const dataProvider = {
  // Products
  async getProducts(filters?: { category?: string; search?: string }): Promise<PaginatedResponse<Product>> {
    if (useMockData) {
      const mockGenerators = await getMockGenerators();
      return mockGenerators?.generateProducts(filters) as PaginatedResponse<Product>;
    }
    
    const response = await productsAPI.getProducts(filters);
    return response.data;
  },

  // Dispensaries
  async getDispensaries(location: { lat: number; lng: number }): Promise<PaginatedResponse<Dispensary>> {
    if (useMockData) {
      const mockGenerators = await getMockGenerators();
      return mockGenerators?.generateDispensaries(location) as PaginatedResponse<Dispensary>;
    }

    const response = await dispensaryAPI.getDispensaries(location);
    return response.data;
  },

  // Orders
  async getOrders(): Promise<PaginatedResponse<Order>> {
    if (useMockData) {
      const mockGenerators = await getMockGenerators();
      return mockGenerators?.generateOrders() as PaginatedResponse<Order>;
    }

    const response = await ordersAPI.getOrderHistory();
    return response.data;
  },

  // Helper function to determine if we're using mock data
  isMockData(): boolean {
    return useMockData;
  },

  // Helper function to get image URLs (handles both mock and real data)
  getImageUrl(path: string): string {
    if (useMockData) {
      // Return placeholder images in mock mode
      return `/mock-images${path}`;
    }
    
    // Return real API image URLs
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${apiUrl}/images${path}`;
  },

  // Helper function to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },

  // Helper function to format dates
  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(new Date(date));
  },
}; 