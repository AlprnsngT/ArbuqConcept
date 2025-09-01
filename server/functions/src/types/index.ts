// Product types - Client ile uyumlu
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  color: 'black' | 'white' | 'amber' | 'clear';
  scented: boolean;
  images: string[];
  avgRating: number;
  reviewCount: number;
  createdAt: any;
  updatedAt: any;
}

// Review types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  text: string;
  createdAt: string;
}

// User types - Client ile uyumlu
export interface User {
  uid: string;
  id: string;
  name: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt: any;
  updatedAt: any;
}

// Cart types - Client ile uyumlu
export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: any;
  updatedAt: any;
}

// Order types
export interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: any;
  updatedAt: any;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth types - Client ile uyumlu
export interface AuthUser {
  id: string;
  name: string;
  email?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Product Filter types
export interface ProductFilters {
  color?: 'black' | 'white' | 'amber' | 'clear';
  scented?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// Campaign types
export interface Campaign {
  id: string;
  name: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  productIds: string[];
  active: boolean;
}
