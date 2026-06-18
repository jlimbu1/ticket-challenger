import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product, CartItem, CartState } from '@/types';

const CART_STORAGE_KEY = 'black-parade-cart';

function findItem(items: CartItem[], productId: string): CartItem | undefined {
  return items.find((item) => item.product.id === productId);
}

function validateQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 0) {
    return 0;
  }
  return Math.floor(quantity);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number = 1) => {
        if (!product || !product.id) {
          return;
        }

        const safeQuantity = validateQuantity(quantity);
        if (safeQuantity === 0) {
          return;
        }

        set((state) => {
          const existing = findItem(state.items, product.id);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + safeQuantity }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { product, quantity: safeQuantity }],
          };
        });
      },

      removeItem: (productId: string) => {
        if (!productId) {
          return;
        }

        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (!productId) {
          return;
        }

        const safeQuantity = validateQuantity(quantity);

        set((state) => {
          if (safeQuantity === 0) {
            return {
              items: state.items.filter((item) => item.product.id !== productId),
            };
          }

          return {
            items: state.items.map((item) =>
              item.product.id === productId
                ? { ...item, quantity: safeQuantity }
                : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) {
            console.error('Failed to rehydrate cart from localStorage:', error);
          }
        };
      },
    }
  )
);