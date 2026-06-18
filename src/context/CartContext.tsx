import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { id: string; name: string; price: number; image: string; stock: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  addItem: (item: { id: string; name: string; price: number; image: string; stock: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const STORAGE_KEY = 'ticket-challenger-cart';

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex((item) => item.id === action.payload.id);
      if (existingIndex >= 0) {
        const existing = state.items[existingIndex];
        const newQuantity = Math.min(existing.quantity + 1, action.payload.stock);
        if (newQuantity === existing.quantity) {
          return state;
        }
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = { ...existing, quantity: newQuantity };
        return { items: updatedItems };
      }
      return {
        items: [
          ...state.items,
          {
            id: action.payload.id,
            name: action.payload.name,
            price: action.payload.price,
            quantity: 1,
            image: action.payload.image,
            stock: action.payload.stock,
          },
        ],
      };
    }
    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        return state;
      }
      const existingIndex = state.items.findIndex((item) => item.id === id);
      if (existingIndex < 0) {
        return state;
      }
      const existing = state.items[existingIndex];
      const clampedQuantity = Math.min(quantity, existing.stock);
      const updatedItems = [...state.items];
      updatedItems[existingIndex] = { ...existing, quantity: clampedQuantity };
      return { items: updatedItems };
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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // localStorage unavailable or corrupted data — use empty cart
  }
  return [];
}

function saveCartToStorage(items: CartItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage unavailable — silently fail
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
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

  const addItem = useCallback(
    (item: { id: string; name: string; price: number; image: string; stock: number }) => {
      dispatch({ type: 'ADD_ITEM', payload: item });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const totalItems = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const totalPrice = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [state.items]);

  const contextValue = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}