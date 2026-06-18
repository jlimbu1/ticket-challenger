import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  addToCart,
  removeFromCart,
  clearCart,
  getCart,
  getCartTotal,
  getCartItemCount,
  CartItem,
} from '../../lib/cart';

const STORAGE_KEY = 'mcr-cart';

function createMockProduct(overrides: Partial<CartItem> = {}): CartItem {
  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    productId: `prod-${Date.now()}`,
    title: 'Test Vinyl',
    price: 19.99,
    quantity: 1,
    imageUrl: '/images/test.jpg',
    ...overrides,
  };
}

function setLocalStorage(data: CartItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getLocalStorage(): CartItem[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

describe('cart lib', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('addToCart', () => {
    it('should add a new item to an empty cart', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      const result = addToCart(product);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('prod-1');
      expect(result[0].title).toBe('The Black Parade');
      expect(result[0].price).toBe(29.99);
      expect(result[0].quantity).toBe(1);
      expect(result[0].id).toBeDefined();
      expect(result[0].imageUrl).toBe('/images/test.jpg');
    });

    it('should increment quantity when adding an existing product', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);
      const result = addToCart(product);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('prod-1');
      expect(result[0].quantity).toBe(2);
    });

    it('should handle multiple different products', () => {
      const product1 = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      const product2 = createMockProduct({ productId: 'prod-2', title: 'Three Cheers', price: 24.99 });

      addToCart(product1);
      const result = addToCart(product2);

      expect(result).toHaveLength(2);
      expect(result[0].productId).toBe('prod-1');
      expect(result[1].productId).toBe('prod-2');
    });

    it('should persist to localStorage', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);

      const stored = getLocalStorage();
      expect(stored).toHaveLength(1);
      expect(stored[0].productId).toBe('prod-1');
    });

    it('should handle localStorage being unavailable', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is full');
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      const result = addToCart(product);

      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('prod-1');
      expect(consoleWarnSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should handle invalid product data', () => {
      const invalidProduct = {} as CartItem;
      expect(() => addToCart(invalidProduct)).toThrow();
    });

    it('should handle product with missing required fields', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      delete (product as any).title;
      expect(() => addToCart(product)).toThrow();
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item by id', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);
      const cart = getCart();
      const result = removeFromCart(cart[0].id);

      expect(result).toHaveLength(0);
    });

    it('should handle removing from empty cart', () => {
      const result = removeFromCart('non-existent-id');
      expect(result).toHaveLength(0);
    });

    it('should handle removing non-existent item', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);
      const result = removeFromCart('non-existent-id');

      expect(result).toHaveLength(1);
    });

    it('should persist removal to localStorage', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);
      const cart = getCart();
      removeFromCart(cart[0].id);

      const stored = getLocalStorage();
      expect(stored).toHaveLength(0);
    });

    it('should handle localStorage being unavailable during removal', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is full');
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);
      const cart = getCart();
      const result = removeFromCart(cart[0].id);

      expect(result).toHaveLength(0);
      expect(consoleWarnSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const product1 = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      const product2 = createMockProduct({ productId: 'prod-2', title: 'Three Cheers', price: 24.99 });
      addToCart(product1);
      addToCart(product2);

      const result = clearCart();
      expect(result).toHaveLength(0);
    });

    it('should handle clearing an already empty cart', () => {
      const result = clearCart();
      expect(result).toHaveLength(0);
    });

    it('should persist clear to localStorage', () => {
      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);
      clearCart();

      const stored = getLocalStorage();
      expect(stored).toHaveLength(0);
    });

    it('should handle localStorage being unavailable during clear', () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('localStorage is full');
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const product = createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 });
      addToCart(product);
      const result = clearCart();

      expect(result).toHaveLength(0);
      expect(consoleWarnSpy).toHaveBeenCalled();

      setItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });
  });

  describe('getCart', () => {
    it('should return empty array when cart is empty', () => {
      const result = getCart();
      expect(result).toEqual([]);
    });

    it('should return cart items from localStorage', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99 }),
      ];
      setLocalStorage(items);

      const result = getCart();
      expect(result).toHaveLength(1);
      expect(result[0].productId).toBe('prod-1');
    });

    it('should handle corrupted localStorage data', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid-json');
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getCart();
      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('should handle localStorage being unavailable', () => {
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getCart();
      expect(result).toEqual([]);
      expect(consoleWarnSpy).toHaveBeenCalled();

      getItemSpy.mockRestore();
      consoleWarnSpy.mockRestore();
    });

    it('should handle non-array stored data', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: 'an array' }));
      const result = getCart();
      expect(result).toEqual([]);
    });
  });

  describe('getCartTotal', () => {
    it('should return 0 for empty cart', () => {
      const result = getCartTotal([]);
      expect(result).toBe(0);
    });

    it('should calculate total for single item', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: 2 }),
      ];
      const result = getCartTotal(items);
      expect(result).toBe(59.98);
    });

    it('should calculate total for multiple items', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: 2 }),
        createMockProduct({ productId: 'prod-2', title: 'Three Cheers', price: 24.99, quantity: 1 }),
      ];
      const result = getCartTotal(items);
      expect(result).toBe(84.97);
    });

    it('should handle items with zero quantity', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: 0 }),
      ];
      const result = getCartTotal(items);
      expect(result).toBe(0);
    });

    it('should handle items with negative quantity', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: -1 }),
      ];
      const result = getCartTotal(items);
      expect(result).toBe(-29.99);
    });
  });

  describe('getCartItemCount', () => {
    it('should return 0 for empty cart', () => {
      const result = getCartItemCount([]);
      expect(result).toBe(0);
    });

    it('should return total quantity for single item', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: 3 }),
      ];
      const result = getCartItemCount(items);
      expect(result).toBe(3);
    });

    it('should return total quantity for multiple items', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: 2 }),
        createMockProduct({ productId: 'prod-2', title: 'Three Cheers', price: 24.99, quantity: 1 }),
      ];
      const result = getCartItemCount(items);
      expect(result).toBe(3);
    });

    it('should handle items with zero quantity', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: 0 }),
      ];
      const result = getCartItemCount(items);
      expect(result).toBe(0);
    });

    it('should handle items with negative quantity', () => {
      const items = [
        createMockProduct({ productId: 'prod-1', title: 'The Black Parade', price: 29.99, quantity: -1 }),
      ];
      const result = getCartItemCount(items);
      expect(result).toBe(-1);
    });
  });
});