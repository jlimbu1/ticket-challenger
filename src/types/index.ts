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

export interface Order {
  id: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
  total: number;
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: string;
}