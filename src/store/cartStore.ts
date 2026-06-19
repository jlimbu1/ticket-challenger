import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product, CartItem } from '@/types';

const CART_STORAGE_KEY = 'ticket-challenger-cart';

function findItem(items: CartItem[], productId: string): CartItem | undefined {
  return items.find((item) => item.product.id === productId);
}

function validateQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 0) {
    return 0;
  }
  return Math.floor(quantity);
}

function loadCartFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Invalid stored data, start fresh
  }
  return [];
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — silently fail, cart still works in memory
  }
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>(loadCartFromStorage());

  const total = computed(() => {
    return items.value.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);
  });

  const itemCount = computed(() => {
    return items.value.reduce((sum, item) => sum + item.quantity, 0);
  });

  watch(
    items,
    (newItems) => {
      saveCartToStorage(newItems);
    },
    { deep: true }
  );

  function addItem(product: Product, quantity: number = 1): void {
    if (!product || !product.id) {
      return;
    }

    const safeQuantity = validateQuantity(quantity);
    if (safeQuantity === 0) {
      return;
    }

    const existing = findItem(items.value, product.id);
    if (existing) {
      existing.quantity += safeQuantity;
    } else {
      items.value.push({ product, quantity: safeQuantity });
    }
  }

  function removeItem(productId: string): void {
    if (!productId) {
      return;
    }

    const index = items.value.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  }

  function updateQuantity(productId: string, quantity: number): void {
    if (!productId) {
      return;
    }

    const safeQuantity = validateQuantity(quantity);

    const existing = findItem(items.value, productId);
    if (!existing) {
      return;
    }

    if (safeQuantity === 0) {
      removeItem(productId);
    } else {
      existing.quantity = safeQuantity;
    }
  }

  function clearCart(): void {
    items.value = [];
  }

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
});