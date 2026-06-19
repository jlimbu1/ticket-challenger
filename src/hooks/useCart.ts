'use client';

import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type AnimationState = 'idle' | 'spinning';

export interface CartState {
  items: CartItem[];
  animationState: AnimationState;
  lastAddedItemId: string | null;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ANIMATION_IDLE' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const CART_STORAGE_KEY = 'ticket-challenger-cart';

const initialState: CartState = {
  items: [],
  animationState: 'idle',
  lastAddedItemId: null,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        (item) => item.productId === action.payload.productId
      );

      if (existingIndex >= 0) {
        const updatedItems = state.items.map((item, index) =>
          index === existingIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
        return {
          items: updatedItems,
          animationState: 'spinning',
          lastAddedItemId: updatedItems[existingIndex].id,
        };
      }

      return {
        items: [...state.items, action.payload],
        animationState: 'spinning',
        lastAddedItemId: action.payload.id,
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case 'CLEAR_CART': {
      return {
        items: [],
        animationState: 'idle',
        lastAddedItemId: null,
      };
    }
    case 'SET_ANIMATION_IDLE': {
      return {
        ...state,
        animationState: 'idle',
        lastAddedItemId: null,
      };
    }
    case 'LOAD_CART': {
      return {
        items: action.payload,
        animationState: 'idle',
        lastAddedItemId: null,
      };
    }
    default: {
      return state;
    }
  }
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed: CartItem[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [];
  } catch {
    console.warn('Failed to load cart from localStorage');
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    console.warn('Failed to save cart to localStorage');
  }
}

export interface CartContextValue {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}

export const CartContext = createContext<CartContextValue>({
  state: initialState,
  dispatch: () => undefined,
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const storedItems = loadCartFromStorage();
    if (storedItems.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: storedItems });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}