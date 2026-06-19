import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../../src/stores/cartStore';

const CART_STORAGE_KEY = 'ticket-challenger-cart';

const mockItem = {
  id: 'item-1',
  productId: 'prod-1',
  title: 'The Black Parade',
  price: 29.99,
  quantity: 1,
  imageUrl: '/images/black-parade.jpg',
};

const mockItem2 = {
  id: 'item-2',
  productId: 'prod-2',
  title: 'Three Cheers for Sweet Revenge',
  price: 24.99,
  quantity: 2,
  imageUrl: '/images/three-cheers.jpg',
};

describe('useCartStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with empty cart', () => {
    const store = useCartStore();

    expect(store.items).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should add an item to the cart', () => {
    const store = useCartStore();

    store.addItem(mockItem);

    expect(store.items).toHaveLength(1);
    expect(store.items[0]).toEqual(mockItem);
    expect(store.total).toBe(29.99);
    expect(store.itemCount).toBe(1);
  });

  it('should increase quantity when adding an existing item', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.addItem({ ...mockItem, quantity: 2 });

    expect(store.items).toHaveLength(1);
    expect(store.items[0].quantity).toBe(3);
    expect(store.total).toBe(89.97);
    expect(store.itemCount).toBe(3);
  });

  it('should add multiple different items', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.addItem(mockItem2);

    expect(store.items).toHaveLength(2);
    expect(store.total).toBe(79.97);
    expect(store.itemCount).toBe(3);
  });

  it('should remove an item from the cart', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.addItem(mockItem2);
    store.removeItem(mockItem.productId);

    expect(store.items).toHaveLength(1);
    expect(store.items[0]).toEqual(mockItem2);
    expect(store.total).toBe(49.98);
    expect(store.itemCount).toBe(2);
  });

  it('should remove an item with ticket type', () => {
    const store = useCartStore();

    const itemWithType = { ...mockItem, id: 'item-1-general', ticketType: 'general' };
    store.addItem(itemWithType);
    store.removeItem(mockItem.productId, 'general');

    expect(store.items).toHaveLength(0);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should not remove items with different ticket type', () => {
    const store = useCartStore();

    const itemGeneral = { ...mockItem, id: 'item-1-general', ticketType: 'general' };
    const itemVip = { ...mockItem, id: 'item-1-vip', ticketType: 'vip' };
    store.addItem(itemGeneral);
    store.addItem(itemVip);
    store.removeItem(mockItem.productId, 'general');

    expect(store.items).toHaveLength(1);
    expect(store.items[0].ticketType).toBe('vip');
  });

  it('should update quantity of an item', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.updateQuantity(mockItem.productId, '', 5);

    expect(store.items[0].quantity).toBe(5);
    expect(store.total).toBe(149.95);
    expect(store.itemCount).toBe(5);
  });

  it('should update quantity with ticket type', () => {
    const store = useCartStore();

    const itemWithType = { ...mockItem, id: 'item-1-general', ticketType: 'general' };
    store.addItem(itemWithType);
    store.updateQuantity(mockItem.productId, 'general', 3);

    expect(store.items[0].quantity).toBe(3);
    expect(store.total).toBe(89.97);
  });

  it('should remove item when quantity is set to 0', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.updateQuantity(mockItem.productId, '', 0);

    expect(store.items).toHaveLength(0);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should remove item when quantity is set to negative', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.updateQuantity(mockItem.productId, '', -1);

    expect(store.items).toHaveLength(0);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should clear the cart', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.addItem(mockItem2);
    store.clearCart();

    expect(store.items).toHaveLength(0);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should persist cart to localStorage on add', () => {
    const store = useCartStore();

    store.addItem(mockItem);

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(mockItem);
  });

  it('should persist cart to localStorage on remove', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.addItem(mockItem2);
    store.removeItem(mockItem.productId);

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual(mockItem2);
  });

  it('should persist cart to localStorage on update quantity', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.updateQuantity(mockItem.productId, '', 5);

    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    expect(stored[0].quantity).toBe(5);
  });

  it('should persist cart to localStorage on clear', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.clearCart();

    const stored = localStorage.getItem(CART_STORAGE_KEY);
    expect(stored).toBe('[]');
  });

  it('should load cart from localStorage on initialization', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([mockItem, mockItem2]));

    const store = useCartStore();

    expect(store.items).toHaveLength(2);
    expect(store.items[0]).toEqual(mockItem);
    expect(store.items[1]).toEqual(mockItem2);
    expect(store.total).toBe(79.97);
    expect(store.itemCount).toBe(3);
  });

  it('should handle corrupted localStorage data gracefully', () => {
    localStorage.setItem(CART_STORAGE_KEY, 'invalid-json');

    const store = useCartStore();

    expect(store.items).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should handle non-array localStorage data gracefully', () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ invalid: 'data' }));

    const store = useCartStore();

    expect(store.items).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should handle localStorage setItem failure gracefully', () => {
    const store = useCartStore();
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    store.addItem(mockItem);

    expect(store.items).toHaveLength(1);
    expect(setItemSpy).toHaveBeenCalled();

    setItemSpy.mockRestore();
  });

  it('should handle localStorage getItem failure gracefully', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const store = useCartStore();

    expect(store.items).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should compute total correctly with multiple items', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.addItem(mockItem2);

    expect(store.total).toBe(79.97);
  });

  it('should compute itemCount correctly with multiple items', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.addItem(mockItem2);

    expect(store.itemCount).toBe(3);
  });

  it('should handle adding item with quantity 0', () => {
    const store = useCartStore();

    store.addItem({ ...mockItem, quantity: 0 });

    expect(store.items).toHaveLength(0);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should handle adding item with negative quantity', () => {
    const store = useCartStore();

    store.addItem({ ...mockItem, quantity: -1 });

    expect(store.items).toHaveLength(0);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should handle removing non-existent item gracefully', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.removeItem('non-existent-id');

    expect(store.items).toHaveLength(1);
  });

  it('should handle updating quantity of non-existent item gracefully', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.updateQuantity('non-existent-id', '', 5);

    expect(store.items).toHaveLength(1);
    expect(store.items[0].quantity).toBe(1);
  });

  it('should handle clearing empty cart gracefully', () => {
    const store = useCartStore();

    store.clearCart();

    expect(store.items).toEqual([]);
    expect(store.total).toBe(0);
    expect(store.itemCount).toBe(0);
  });

  it('should handle adding item with same productId but different ticketType', () => {
    const store = useCartStore();

    const itemGeneral = { ...mockItem, id: 'item-1-general', ticketType: 'general' };
    const itemVip = { ...mockItem, id: 'item-1-vip', ticketType: 'vip' };
    store.addItem(itemGeneral);
    store.addItem(itemVip);

    expect(store.items).toHaveLength(2);
    expect(store.total).toBe(59.98);
    expect(store.itemCount).toBe(2);
  });

  it('should handle updating quantity with ticket type for non-existent item', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.updateQuantity('non-existent-id', 'general', 5);

    expect(store.items).toHaveLength(1);
    expect(store.items[0].quantity).toBe(1);
  });

  it('should handle removing item with ticket type for non-existent item', () => {
    const store = useCartStore();

    store.addItem(mockItem);
    store.removeItem('non-existent-id', 'general');

    expect(store.items).toHaveLength(1);
  });
});