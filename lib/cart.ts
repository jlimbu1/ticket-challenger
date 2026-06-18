import { Product } from '../types/product';

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
}

const CART_STORAGE_KEY = 'mcr-cart';

function generateItemId(): string {
  return `cart-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

let inMemoryCart: CartItem[] = [];

function getStorage(): Storage | null {
  if (isLocalStorageAvailable()) {
    return localStorage;
  }
  return null;
}

export function getCart(): CartItem[] {
  const storage = getStorage();
  if (storage) {
    try {
      const stored = storage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn('Failed to parse cart from localStorage:', error);
    }
  }
  return inMemoryCart;
}

function saveCart(items: CartItem[]): void {
  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn('Failed to save cart to localStorage:', error);
    }
  }
  inMemoryCart = items;
}

export function addToCart(product: Product): CartItem[] {
  if (!product || typeof product.id !== 'string' || !product.id) {
    console.warn('Invalid product provided to addToCart');
    return getCart();
  }

  const currentCart = getCart();
  const existingItemIndex = currentCart.findIndex(
    (item) => item.productId === product.id
  );

  if (existingItemIndex >= 0) {
    const updatedCart = [...currentCart];
    updatedCart[existingItemIndex] = {
      ...updatedCart[existingItemIndex],
      quantity: updatedCart[existingItemIndex].quantity + 1,
    };
    saveCart(updatedCart);
    return updatedCart;
  }

  const newItem: CartItem = {
    id: generateItemId(),
    productId: product.id,
    title: product.title || 'Untitled Vinyl',
    price: typeof product.price === 'number' ? product.price : 0,
    quantity: 1,
    imageUrl: product.imageUrl || product.images?.[0] || '/images/placeholder.jpg',
  };

  const updatedCart = [...currentCart, newItem];
  saveCart(updatedCart);
  return updatedCart;
}

export function removeFromCart(itemId: string): CartItem[] {
  if (!itemId || typeof itemId !== 'string') {
    console.warn('Invalid itemId provided to removeFromCart');
    return getCart();
  }

  const currentCart = getCart();
  const updatedCart = currentCart.filter((item) => item.id !== itemId);

  if (updatedCart.length === currentCart.length) {
    console.warn(`Item with id ${itemId} not found in cart`);
    return currentCart;
  }

  saveCart(updatedCart);
  return updatedCart;
}

export function updateItemQuantity(itemId: string, quantity: number): CartItem[] {
  if (!itemId || typeof itemId !== 'string') {
    console.warn('Invalid itemId provided to updateItemQuantity');
    return getCart();
  }

  if (typeof quantity !== 'number' || quantity < 0 || !Number.isInteger(quantity)) {
    console.warn('Invalid quantity provided to updateItemQuantity');
    return getCart();
  }

  if (quantity === 0) {
    return removeFromCart(itemId);
  }

  const currentCart = getCart();
  const itemIndex = currentCart.findIndex((item) => item.id === itemId);

  if (itemIndex < 0) {
    console.warn(`Item with id ${itemId} not found in cart`);
    return currentCart;
  }

  const updatedCart = [...currentCart];
  updatedCart[itemIndex] = {
    ...updatedCart[itemIndex],
    quantity,
  };

  saveCart(updatedCart);
  return updatedCart;
}

export function clearCart(): CartItem[] {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear cart from localStorage:', error);
    }
  }
  inMemoryCart = [];
  return [];
}

export function getCartTotal(items?: CartItem[]): number {
  const cartItems = items || getCart();
  if (!Array.isArray(cartItems)) {
    return 0;
  }
  return cartItems.reduce((total, item) => {
    const price = typeof item.price === 'number' ? item.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return total + price * quantity;
  }, 0);
}

export function getCartItemCount(items?: CartItem[]): number {
  const cartItems = items || getCart();
  if (!Array.isArray(cartItems)) {
    return 0;
  }
  return cartItems.reduce((count, item) => {
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return count + quantity;
  }, 0);
}