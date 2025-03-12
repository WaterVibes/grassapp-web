import { Dispensary } from './types';
import { Product } from './api';

export const mockDispensaries: Dispensary[] = [
  {
    url: 'green-leaf-dispensary',
    name: 'Green Leaf Dispensary',
    is_open: true,
    description: 'Your premier cannabis destination in Baltimore',
    logo_url: '/images/dispensaries/placeholder.jpg',
    location: {
      address: '1234 Cannabis Street',
      city: 'Baltimore',
      state: 'MD',
      zip: '21201',
      lat: 39.2904,
      lng: -76.6122
    },
    rating: 4.8,
    delivery_time: '30-45 min',
    minimum_order: 50,
    delivery_fee: 0,
    metadata: {}
  },
  {
    url: 'purple-haze-collective',
    name: 'Purple Haze Collective',
    is_open: true,
    description: 'Premium quality cannabis products',
    logo_url: '/images/dispensaries/placeholder.jpg',
    location: {
      address: '5678 Herb Avenue',
      city: 'Baltimore',
      state: 'MD',
      zip: '21202',
      lat: 39.2884,
      lng: -76.6187
    },
    rating: 4.6,
    delivery_time: '45-60 min',
    minimum_order: 35,
    delivery_fee: 5,
    metadata: {}
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Blue Dream',
    price: 45,
    description: 'A sativa-dominant hybrid offering sweet berry aroma and full-body relaxation',
    image_url: '/images/products/blue-dream.jpg',
    category: 'Flower',
    brand: 'Top Shelf',
    effects: ['Relaxed', 'Happy', 'Euphoric'],
    thc: '18%',
    cbd: '0.1%',
    strain_type: 'Hybrid',
    in_stock: true,
    metadata: {
      sizes: [
        { name: 'Eighth', weight: '1/8oz', price: 45 },
        { name: 'Quarter', weight: '1/4oz', price: 85 },
        { name: 'Half', weight: '1/2oz', price: 160 },
        { name: 'Ounce', weight: '1oz', price: 300 }
      ]
    }
  },
  {
    id: '2',
    name: 'Wedding Cake Pre-Roll',
    price: 15,
    description: 'Premium pre-rolled Wedding Cake strain for immediate enjoyment',
    image_url: '/images/products/wedding-cake.jpg',
    category: 'Pre-Rolls',
    brand: 'Roll Masters',
    effects: ['Relaxed', 'Happy', 'Sleepy'],
    thc: '22%',
    cbd: '0.05%',
    strain_type: 'Indica',
    in_stock: true,
    metadata: {
      sizes: [
        { name: 'Single', weight: '1g', price: 15 },
        { name: 'Pack', weight: '5x1g', price: 65 }
      ]
    }
  },
  {
    id: '3',
    name: 'Sour Diesel',
    price: 50,
    description: 'Fast-acting strain delivering energetic, dreamy cerebral effects',
    image_url: '/images/products/sour-diesel.jpg',
    category: 'Flower',
    brand: 'Premium Buds',
    effects: ['Energetic', 'Creative', 'Focused'],
    thc: '20%',
    cbd: '0.2%',
    strain_type: 'Sativa',
    in_stock: true,
    metadata: {
      sizes: [
        { name: 'Eighth', weight: '1/8oz', price: 50 },
        { name: 'Quarter', weight: '1/4oz', price: 95 },
        { name: 'Half', weight: '1/2oz', price: 180 },
        { name: 'Ounce', weight: '1oz', price: 340 }
      ]
    }
  },
  {
    id: '4',
    name: 'Gelato Vape Cartridge',
    price: 60,
    description: '500mg premium distillate vape cartridge',
    image_url: '/images/products/gelato-vape.jpg',
    category: 'Vaporizers',
    brand: 'Vape Supreme',
    effects: ['Relaxed', 'Creative', 'Uplifted'],
    thc: '85%',
    cbd: '0%',
    strain_type: 'Hybrid',
    in_stock: true,
    metadata: {
      sizes: [
        { name: '500mg', weight: '500mg', price: 60 },
        { name: '1000mg', weight: '1000mg', price: 110 }
      ]
    }
  }
]; 