export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentInfo: PaymentInfo;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
}

export interface ApiError {
  message: string;
  status: number;
}

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

export interface ProductFilters {
  search: string;
  category: string;
  sort: SortOption;
  minPrice: number;
  maxPrice: number;
}

export const DEFAULT_FILTERS: ProductFilters = {
  search: '',
  category: '',
  sort: 'newest',
  minPrice: 0,
  maxPrice: Infinity,
};

export const CATEGORIES: string[] = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Books',
  'Sports & Outdoors',
  'Toys & Games',
  'Food & Beverages',
  'Health & Beauty',
  'Automotive',
];