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
    expect(result.current.itemCount).toBe(1);
    expect(result.current.totalPrice).toBe(29.99);
  });

  it('should increment quantity when adding duplicate item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.totalPrice).toBe(59.98);
  });

  it('should add multiple different items', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.addToCart(mockProduct2);
    });

    expect(result.current.items).toHaveLength(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.totalPrice).toBe(54.98);
  });

  it('should add item with custom quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.itemCount).toBe(3);
    expect(result.current.totalPrice).toBe(89.97);
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
    expect(result.current.items[0].product.id).toBe('prod-2');
    expect(result.current.itemCount).toBe(1);
    expect(result.current.totalPrice).toBe(24.99);
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
    expect(result.current.itemCount).toBe(5);
    expect(result.current.totalPrice).toBe(149.95);
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
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
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
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
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
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should handle removing from empty cart without error', () => {
    const { result } = renderHook(() => useCart());

    expect(() => {
      act(() => {
        result.current.removeFromCart('nonexistent');
      });
    }).not.toThrow();

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should handle clearing empty cart without error', () => {
    const { result } = renderHook(() => useCart());

    expect(() => {
      act(() => {
        result.current.clearCart();
      });
    }).not.toThrow();

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should handle updating quantity of nonexistent item without error', () => {
    const { result } = renderHook(() => useCart());

    expect(() => {
      act(() => {
        result.current.updateQuantity('nonexistent', 5);
      });
    }).not.toThrow();

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should persist cart to localStorage on add', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      CART_STORAGE_KEY,
      expect.any(String)
    );

    const storedData = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(storedData).toHaveLength(1);
    expect(storedData[0].product.id).toBe('prod-1');
    expect(storedData[0].quantity).toBe(1);
  });

  it('should persist cart to localStorage on remove', () => {
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

    const storedData = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(storedData).toHaveLength(1);
    expect(storedData[0].product.id).toBe('prod-2');
  });

  it('should persist cart to localStorage on clear', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.clearCart();
    });

    const storedData = localStorage.getItem(CART_STORAGE_KEY);
    expect(storedData).toBe('[]');
  });

  it('should restore cart from localStorage on mount', () => {
    const cartData = [
      {
        id: 'cart-item-1',
        product: mockProduct,
        quantity: 2,
      },
    ];

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('prod-1');
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.totalPrice).toBe(59.98);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'invalid json data');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should handle localStorage quota error gracefully', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError', 'QuotaExceededError');
    });

    const { result } = renderHook(() => useCart());

    expect(() => {
      act(() => {
        result.current.addToCart(mockProduct);
      });
    }).not.toThrow();

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe('prod-1');
  });

  it('should calculate total price correctly with mixed quantities', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    act(() => {
      result.current.addToCart(mockProduct2, 3);
    });

    const expectedTotal = (29.99 * 2) + (24.99 * 3);
    expect(result.current.totalPrice).toBe(expectedTotal);
    expect(result.current.itemCount).toBe(5);
  });

  it('should handle adding item with quantity 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, 0);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should handle adding item with negative quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct, -1);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it('should handle adding item with default quantity when not specified', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    expect(result.current.items[0].quantity).toBe(1);
  });

  it('should update localStorage after quantity change', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 10);
    });

    const storedData = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(storedData[0].quantity).toBe(10);
  });

  it('should remove item from localStorage when quantity set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 0);
    });

    const storedData = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(storedData).toHaveLength(0);
  });
});