import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../src/hooks/useCart';

const CART_STORAGE_KEY = 'ticket-challenger-cart';

const mockProduct = {
  id: 'prod-1',
  productId: 'prod-1',
  title: 'The Black Parade',
  price: 29.99,
  quantity: 1,
  imageUrl: '/images/black-parade.jpg',
};

const mockProduct2 = {
  id: 'prod-2',
  productId: 'prod-2',
  title: 'Three Cheers for Sweet Revenge',
  price: 24.99,
  quantity: 1,
  imageUrl: '/images/three-cheers.jpg',
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
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.animationState).toBe('idle');
    expect(result.current.lastAddedItemId).toBeNull();
  });

  it('should add an item to the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual(mockProduct);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.total).toBe(29.99);
  });

  it('should set animation state to spinning when adding an item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');
    expect(result.current.lastAddedItemId).toBe('prod-1');
  });

  it('should reset animation state to idle after 1 second', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.animationState).toBe('idle');
    expect(result.current.lastAddedItemId).toBeNull();

    vi.useRealTimers();
  });

  it('should increase quantity when adding an existing product', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem({ ...mockProduct, id: 'prod-1', quantity: 1 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.total).toBe(59.98);
  });

  it('should remove an item from the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem(mockProduct2);
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.removeItem('prod-1');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe('prod-2');
    expect(result.current.itemCount).toBe(1);
    expect(result.current.total).toBe(24.99);
  });

  it('should update quantity of an item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.itemCount).toBe(3);
    expect(result.current.total).toBe(89.97);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 0);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('should clear the cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem(mockProduct2);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should persist cart state to localStorage', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '{}');
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe('prod-1');
  });

  it('should load cart state from localStorage on init', () => {
    const storedItems = [mockProduct, mockProduct2];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(storedItems));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toHaveLength(2);
    expect(result.current.items[0].productId).toBe('prod-1');
    expect(result.current.items[1].productId).toBe('prod-2');
    expect(result.current.total).toBe(54.98);
    expect(result.current.itemCount).toBe(2);
  });

  it('should handle invalid localStorage data gracefully', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'invalid-json');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage write errors gracefully', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe('prod-1');

    setItemSpy.mockRestore();
  });

  it('should handle localStorage read errors gracefully', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);

    getItemSpy.mockRestore();
  });

  it('should handle multiple rapid additions correctly', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');

    act(() => {
      result.current.addItem(mockProduct2);
    });

    expect(result.current.animationState).toBe('spinning');
    expect(result.current.lastAddedItemId).toBe('prod-2');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.animationState).toBe('idle');
    expect(result.current.lastAddedItemId).toBeNull();

    vi.useRealTimers();
  });

  it('should calculate total correctly with multiple items', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem(mockProduct2);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 3);
    });

    expect(result.current.total).toBe(114.96);
    expect(result.current.itemCount).toBe(4);
  });

  it('should handle removing non-existent item gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.removeItem('non-existent-id');
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.total).toBe(29.99);
  });

  it('should handle updating quantity for non-existent item gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('non-existent-id', 5);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.total).toBe(29.99);
  });

  it('should handle negative quantity gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', -5);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle adding item with zero quantity gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({ ...mockProduct, quantity: 0 });
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle adding item with negative quantity gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem({ ...mockProduct, quantity: -1 });
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle adding item with missing fields gracefully', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: '',
      price: -10,
      quantity: 1,
      imageUrl: '',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].title).toBe('');
    expect(result.current.items[0].price).toBe(-10);
    expect(result.current.total).toBe(-10);
  });

  it('should handle very large quantities', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 999999);
    });

    expect(result.current.items[0].quantity).toBe(999999);
    expect(result.current.total).toBe(29999969.01);
    expect(result.current.itemCount).toBe(999999);
  });

  it('should handle clearing an already empty cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle removing from an empty cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.removeItem('non-existent');
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle updating quantity in an empty cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.updateQuantity('non-existent', 5);
    });

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage with corrupted data structure', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ not: 'an array' }));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage with null value', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'null');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage with undefined value', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'undefined');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage with empty array', () => {
    localStorage.setItem(CART_STORAGE_KEY, '[]');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle multiple items with same productId but different ids', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem({ ...mockProduct, id: 'prod-1-duplicate', quantity: 1 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should handle animation state correctly when adding same item multiple times', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');

    act(() => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.animationState).toBe('idle');

    vi.useRealTimers();
  });

  it('should handle animation state correctly when adding different items rapidly', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');

    act(() => {
      vi.advanceTimersByTime(200);
    });

    act(() => {
      result.current.addItem(mockProduct2);
    });

    expect(result.current.animationState).toBe('spinning');
    expect(result.current.lastAddedItemId).toBe('prod-2');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.animationState).toBe('idle');
    expect(result.current.lastAddedItemId).toBeNull();

    vi.useRealTimers();
  });

  it('should handle animation state when clearing cart during animation', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.animationState).toBe('idle');
    expect(result.current.lastAddedItemId).toBeNull();
    expect(result.current.items).toEqual([]);

    vi.useRealTimers();
  });

  it('should handle animation state when removing last item during animation', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.animationState).toBe('spinning');

    act(() => {
      result.current.removeItem('prod-1');
    });

    expect(result.current.animationState).toBe('idle');
    expect(result.current.lastAddedItemId).toBeNull();
    expect(result.current.items).toEqual([]);

    vi.useRealTimers();
  });

  it('should handle animation state when removing non-last item during animation', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem(mockProduct2);
    });

    expect(result.current.animationState).toBe('spinning');
    expect(result.current.lastAddedItemId).toBe('prod-2');

    act(() => {
      result.current.removeItem('prod-1');
    });

    expect(result.current.animationState).toBe('spinning');
    expect(result.current.lastAddedItemId).toBe('prod-2');

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.animationState).toBe('idle');
    expect(result.current.lastAddedItemId).toBeNull();

    vi.useRealTimers();
  });

  it('should handle localStorage sync after clear', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.clearCart();
    });

    const stored = localStorage.getItem(CART_STORAGE_KEY);
    expect(stored).toBe('[]');
  });

  it('should handle localStorage sync after remove', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.addItem(mockProduct2);
    });

    act(() => {
      result.current.removeItem('prod-1');
    });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].productId).toBe('prod-2');
  });

  it('should handle localStorage sync after quantity update', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 5);
    });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored[0].quantity).toBe(5);
  });

  it('should handle multiple localStorage writes correctly', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 2);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 3);
    });

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored[0].quantity).toBe(3);
  });

  it('should handle localStorage with items missing required fields', () => {
    const corruptedItems = [
      { id: 'prod-1', productId: 'prod-1', title: 'Test', price: 10, quantity: 1 },
    ];
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(corruptedItems));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].imageUrl).toBeUndefined();
  });

  it('should handle localStorage with non-array JSON object', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items: [mockProduct] }));

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage with boolean value', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'true');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage with number value', () => {
    localStorage.setItem(CART_STORAGE_KEY, '123');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle localStorage with string value', () => {
    localStorage.setItem(CART_STORAGE_KEY, '"some string"');

    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle multiple rapid clear and add operations', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.clearCart();
    });

    act(() => {
      result.current.addItem(mockProduct2);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe('prod-2');
    expect(result.current.total).toBe(24.99);
    expect(result.current.itemCount).toBe(1);
  });

  it('should handle adding maximum safe integer quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', Number.MAX_SAFE_INTEGER);
    });

    expect(result.current.items[0].quantity).toBe(Number.MAX_SAFE_INTEGER);
  });

  it('should handle floating point quantity gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', 2.5);
    });

    expect(result.current.items[0].quantity).toBe(2.5);
    expect(result.current.total).toBe(74.975);
  });

  it('should handle NaN quantity gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', NaN);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle Infinity quantity gracefully', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity('prod-1', Infinity);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle adding item with undefined productId', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: undefined as unknown as string,
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBeUndefined();
  });

  it('should handle adding item with null productId', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: null as unknown as string,
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBeNull();
  });

  it('should handle adding item with undefined price', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: undefined as unknown as number,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].price).toBeUndefined();
    expect(result.current.total).toBeNaN();
  });

  it('should handle adding item with null price', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: null as unknown as number,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].price).toBeNull();
    expect(result.current.total).toBe(0);
  });

  it('should handle adding item with undefined quantity', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: undefined as unknown as number,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle adding item with null quantity', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: null as unknown as number,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.total).toBe(0);
    expect(result.current.itemCount).toBe(0);
  });

  it('should handle adding item with undefined id', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: undefined as unknown as string,
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBeUndefined();
  });

  it('should handle adding item with null id', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: null as unknown as string,
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBeNull();
  });

  it('should handle adding item with empty string id', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: '',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('');
  });

  it('should handle adding item with empty string productId', () => {
    const { result } = renderHook(() => useCart());

    const invalidItem = {
      id: 'prod-3',
      productId: '',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(invalidItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].productId).toBe('');
  });

  it('should handle adding item with very long title', () => {
    const { result } = renderHook(() => useCart());

    const longTitle = 'A'.repeat(10000);
    const longItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: longTitle,
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(longItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].title).toBe(longTitle);
  });

  it('should handle adding item with special characters in title', () => {
    const { result } = renderHook(() => useCart());

    const specialItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: '<script>alert("xss")</script>',
      price: 10,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(specialItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].title).toBe('<script>alert("xss")</script>');
  });

  it('should handle adding item with very large price', () => {
    const { result } = renderHook(() => useCart());

    const largePriceItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 999999999999,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(largePriceItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].price).toBe(999999999999);
    expect(result.current.total).toBe(999999999999);
  });

  it('should handle adding item with negative price', () => {
    const { result } = renderHook(() => useCart());

    const negativePriceItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: -50,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(negativePriceItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].price).toBe(-50);
    expect(result.current.total).toBe(-50);
  });

  it('should handle adding item with zero price', () => {
    const { result } = renderHook(() => useCart());

    const zeroPriceItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Free Item',
      price: 0,
      quantity: 1,
      imageUrl: '/test.jpg',
    };

    act(() => {
      result.current.addItem(zeroPriceItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].price).toBe(0);
    expect(result.current.total).toBe(0);
  });

  it('should handle adding item with very long imageUrl', () => {
    const { result } = renderHook(() => useCart());

    const longUrl = 'https://example.com/' + 'a'.repeat(10000) + '.jpg';
    const longUrlItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: longUrl,
    };

    act(() => {
      result.current.addItem(longUrlItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].imageUrl).toBe(longUrl);
  });

  it('should handle adding item with data URI as imageUrl', () => {
    const { result } = renderHook(() => useCart());

    const dataUriItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    };

    act(() => {
      result.current.addItem(dataUriItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].imageUrl).toContain('data:image/png');
  });

  it('should handle adding item with javascript: URL as imageUrl', () => {
    const { result } = renderHook(() => useCart());

    const xssUrlItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: 'javascript:alert("xss")',
    };

    act(() => {
      result.current.addItem(xssUrlItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].imageUrl).toBe('javascript:alert("xss")');
  });

  it('should handle adding item with relative path as imageUrl', () => {
    const { result } = renderHook(() => useCart());

    const relativeUrlItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '/images/../etc/passwd',
    };

    act(() => {
      result.current.addItem(relativeUrlItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].imageUrl).toBe('/images/../etc/passwd');
  });

  it('should handle adding item with protocol-relative URL as imageUrl', () => {
    const { result } = renderHook(() => useCart());

    const protocolRelativeUrlItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      imageUrl: '//evil.com/image.jpg',
    };

    act(() => {
      result.current.addItem(protocolRelativeUrlItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].imageUrl).toBe('//evil.com/image.jpg');
  });

  it('should handle adding item with blob URL as imageUrl', () => {
    const { result } = renderHook(() => useCart());

    const blobUrlItem = {
      id: 'prod-3',
      productId: 'prod-3',
      title: 'Test',
      price: 10,
      quantity: 1,
      image