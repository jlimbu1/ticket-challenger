export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// ── Order types ──

export interface OrderItem {
  productId: string
  title: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: string
}

export interface OrderSubmission {
  items: Array<{ productId: string; quantity: number }>
  total: number
}

// ── User types ──

export interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  orderCount: number
}

export interface PasswordChange {
  oldPassword: string
  newPassword: string
}

// ── Admin / Event types ──

export interface EventData {
  id: string
  title: string
  date: string
  venue: string
  price: number
  inventory: number
  description: string
}