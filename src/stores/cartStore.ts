import { defineStore } from 'pinia';
import type { Product } from '../data/products';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
  }),

  getters: {
    total(state): number {
      return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    },

    itemCount(state): number {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
  },

  actions: {
    addItem(product: Product, quantity: number = 1): void {
      if (!product || !product.id) {
        console.error('cartStore.addItem: invalid product', product);
        return;
      }

      const safeQuantity = Math.max(1, Math.floor(quantity));

      const existing = this.items.find((item) => item.id === product.id);

      if (existing) {
        existing.quantity += safeQuantity;
      } else {
        this.items.push({
          id: product.id,
          product,
          quantity: safeQuantity,
        });
      }
    },

    removeItem(productId: string): void {
      if (!productId) {
        console.error('cartStore.removeItem: productId is required');
        return;
      }

      this.items = this.items.filter((item) => item.id !== productId);
    },

    updateQuantity(productId: string, quantity: number): void {
      if (!productId) {
        console.error('cartStore.updateQuantity: productId is required');
        return;
      }

      const safeQuantity = Math.max(1, Math.floor(quantity));

      const item = this.items.find((item) => item.id === productId);

      if (!item) {
        console.error('cartStore.updateQuantity: item not found for productId', productId);
        return;
      }

      item.quantity = safeQuantity;
    },
  },
});