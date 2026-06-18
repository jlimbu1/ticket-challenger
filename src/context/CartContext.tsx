"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type { Product, CartItem } from '@/src/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const CART_STORAGE_KEY = 'ticket-challenger-cart';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity } = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return { items: updatedItems };
      }

      return {
        items: [...state.items, { product, quantity }],
      };
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.product.id !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART': {
      return { items: [] };
    }

    case 'LOAD_CART': {
      return { items: action.payload };
    }

    default:
      return state;
  }
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
  } catch (error) {
    console.error('[CartContext] Failed to load cart from localStorage:', error);
  }
  return [];
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('[CartContext] Failed to save cart to localStorage:', error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    const storedItems = loadCartFromStorage();
    if (storedItems.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: storedItems });
    }
  }, []);

  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (quantity <= 0) {
      console.warn('[CartContext] addToCart called with invalid quantity:', quantity);
      return;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    if (!productId) {
      console.warn('[CartContext] removeFromCart called with empty productId');
      return;
    }
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId) {
      console.warn('[CartContext] updateQuantity called with empty productId');
      return;
    }
    if (quantity < 0) {
      console.warn('[CartContext] updateQuantity called with negative quantity:', quantity);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemCount = useMemo(() => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [state.items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice,
    }),
    [state.items, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      'useCart must be used within a CartProvider. ' +
      'Wrap your component tree with <CartProvider> to access cart functionality.'
    );
  }
  return context;
}