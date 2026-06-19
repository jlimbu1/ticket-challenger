export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'vinyl' | 'apparel' | 'poster' | 'accessory';
  stock: number;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, ticketType?: string) => void;
  updateQuantity: (productId: string, ticketType: string, quantity: number) => void;
  clearCart: () => void;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerEmail: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  pendingOrders: number;
}