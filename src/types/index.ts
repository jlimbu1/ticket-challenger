export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  description: string;
  year: number;
  genre: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  customerInfo: CustomerInfo;
  createdAt: string;
}

export interface ThemeContextType {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isDark: boolean;
}