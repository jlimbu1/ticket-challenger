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
      if (quantity <= 0) {
        return state;
      }
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, { product, quantity }],
      };
    }
    case 'REMOVE_ITEM': {
      const productId = action.payload;
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== productId),
      };
    }
    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.product.id !== productId),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        ),
      };
    }
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[];
        if (Array.isArray(parsed)) {
          dispatch({ type: 'LOAD_CART', payload: parsed });
        }
      }
    } catch {
      // Ignore parse errors, start with empty cart
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // Ignore storage errors
    }
  }, [state.items]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    if (!product || !product.id) {
      return;
    }
    const safeQuantity = Math.max(1, Math.floor(quantity));
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity: safeQuantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    if (!productId) {
      return;
    }
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId) {
      return;
    }
    const safeQuantity = Math.max(0, Math.floor(quantity));
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity: safeQuantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemCount = useMemo(() => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
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

function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export { CartContext, CartProvider, useCart };
export type { CartContextValue };