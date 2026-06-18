import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../src/hooks/useCart';

const CART_STORAGE_KEY = 'ticket-challenger-cart';

const mockProduct = {
  id: 'prod-1',
  name: 'The Black Parade',
  price: 29.99,
  image: '/images/black-parade.jpg',
  description: 'My Chemical Romance\'s magnum opus on 180g black vinyl. Includes exclusive poster.',
  category: 'vinyl' as const,
  stock: 15,
};

const mockProduct2 = {
  id: 'prod-2',
  name: 'Three Cheers for Sweet Revenge',
  price: 24.99,
  image: '/images/three-cheers.jpg',
  description: 'The album that defined a generation. Blood red vinyl pressing.',
  category: 'vinyl' as const,
  stock: 22,
};

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(mockProduct);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.totalPrice).toBe(29.99);
    expect(result.current.itemCount).toBe(1);
  });

  it('should increment quantity when adding duplicate product', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.totalPrice).toBe(59.98);
    expect(result.current.itemCount).toBe(2);
  });

  it('should add multiple different products', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.addToCart(mockProduct2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].product).toEqual(mockProduct);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.items[1].product).toEqual(mockProduct2);
    expect(result.current.items[1].quantity).toBe(1);
    expect(result.current.totalPrice).toBe(54.98);
    expect(result.current.itemCount).toBe(2);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.addToCart(mockProduct2);
    });

    act(() => {
      result.current.removeFromCart('prod-1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product).toEqual(mockProduct2);
    expect(result.current.totalPrice).toBe(24.99);
    expect(result.current.itemCount).toBe(1);
  });

  it('should handle removing from empty cart gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.removeFromCart('nonexistent');
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should update quantity of an item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.totalPrice).toBe(149.95);
    expect(result.current.itemCount).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 0);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should remove item when quantity is set to negative', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', -1);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.addToCart(mockProduct2);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should calculate totalPrice correctly with mixed quantities', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    act(() => {
      result.current.addToCart(mockProduct2, 3);
    });

    const expectedTotal = (29.99 * 2) + (24.99 * 3);
    expect(result.current.totalPrice).toBeCloseTo(expectedTotal, 2);
    expect(result.current.itemCount).toBe(5);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].product.id).toBe('prod-1');
    expect(stored[0].quantity).toBe(1);
  });

  it('should load cart from localStorage on mount', () => {
    const cartData = [
      { product: mockProduct, quantity: 2 },
      { product: mockProduct2, quantity: 1 },
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.items[1].quantity).toBe(1);
    expect(result.current.totalPrice).toBeCloseTo((29.99 * 2) + 24.99, 2);
    expect(result.current.itemCount).toBe(3);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'invalid json');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle missing localStorage data gracefully', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPrice).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should throw error when used outside CartProvider', () => {
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
  });
});