"use client";

import { useContext } from 'react';
import { CartContext } from '@/src/context/CartContext';
import type { Product, CartItem } from '@/src/types';

interface UseCartReturn {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

export function useCart(): UseCartReturn {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return {
    items: context.items,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    itemCount: context.itemCount,
    totalPrice: context.totalPrice,
  };
}