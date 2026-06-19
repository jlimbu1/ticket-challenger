"use client";

import { useCartStore } from '@/src/stores/cartStore';
import type { Event, TicketType } from '@/src/data/events';
import type { CartItem } from '@/src/stores/cartStore';
import { storeToRefs } from 'pinia';

interface UseCartReturn {
  items: CartItem[];
  addToCart: (event: Event, ticketType: TicketType, quantity?: number) => void;
  removeFromCart: (eventId: string, ticketType: string) => void;
  updateQuantity: (eventId: string, ticketType: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

export function useCart(): UseCartReturn {
  const cartStore = useCartStore();
  const { items, itemCount, total } = storeToRefs(cartStore);

  return {
    items: items.value,
    addToCart: (event: Event, ticketType: TicketType, quantity?: number) => {
      cartStore.addItem(event, ticketType, quantity);
    },
    removeFromCart: (eventId: string, ticketType: string) => {
      cartStore.removeItem(eventId, ticketType);
    },
    updateQuantity: (eventId: string, ticketType: string, quantity: number) => {
      cartStore.updateQuantity(eventId, ticketType, quantity);
    },
    clearCart: () => {
      cartStore.clearCart();
    },
    itemCount: itemCount.value,
    totalPrice: total.value,
  };
}