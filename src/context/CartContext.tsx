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

      const newItem: CartItem = {
        product,
        quantity,
      };
      return { items: [...state.items, newItem] };
    }

    case 'REMOVE_ITEM': {
      const productId = action.payload;
      return {
        items: state.items.filter((item) => item.product.id !== productId),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity < 1 || quantity > 99) {
        console.warn(
          `updateQuantity: quantity ${quantity} is out of range (1-99). Ignoring.`
        );
        return state;
      }
      return {
        items: state.items.map((item) =>
          item.product.id === productId
            ? { ...item, quantity }
            : item
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
    console.warn('Failed to load cart from localStorage:', error);
  }
  return [];
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
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
    if (quantity < 1 || quantity > 99) {
      console.warn(
        `addToCart: quantity ${quantity} is out of range (1-99). Using 1.`
      );
      quantity = 1;
    }
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity } });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1 || quantity > 99) {
      console.warn(
        `updateQuantity: quantity ${quantity} is out of range (1-99). Ignoring.`
      );
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const itemCount = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [state.items]);

  const value = useMemo(
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
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}