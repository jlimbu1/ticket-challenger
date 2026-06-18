<<<<<<< HEAD
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

interface CartItem {
  productId: number;
  name: string;
=======
import { useReducer, useEffect, useCallback } from 'react';

export interface CartItem {
  id: string;
  productId: string;
  title: string;
>>>>>>> origin/main
  price: number;
  quantity: number;
  imageUrl: string;
}

<<<<<<< HEAD
interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'ticket-challenger-cart';

function loadCartFromStorage(): CartItem[] {
  try {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        'productId' in item &&
        'name' in item &&
        'price' in item &&
        'quantity' in item &&
        'imageUrl' in item
    );
  } catch {
    return [];
  }
=======
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
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Invalid stored data, return empty array
  }
  return [];
>>>>>>> origin/main
}

function saveCartToStorage(items: CartItem[]): void {
  try {
<<<<<<< HEAD
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save cart to localStorage:', error);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const loaded = loadCartFromStorage();
    setItems(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveCartToStorage(items);
  }, [items, isLoaded]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        const loaded = loadCartFromStorage();
        setItems(loaded);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 0) return;
    setItems((prev) => {
      if (quantity === 0) {
        return prev.filter((i) => i.productId !== productId);
      }
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      );
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
=======
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable, silently fail
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    animationState: 'idle' as AnimationState,
    lastAddedItemId: null,
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedItems = loadCartFromStorage();
    if (storedItems.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: storedItems });
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  // Reset animation state after 1 second
  useEffect(() => {
    if (state.animationState === 'spinning') {
      const timer = setTimeout(() => {
        dispatch({ type: 'SET_ANIMATION_IDLE' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.animationState]);

  const addItem = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const total = state.items.reduce(
>>>>>>> origin/main
    (sum, item) => sum + item.price * item.quantity,
    0
  );

<<<<<<< HEAD
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
=======
  const itemCount = state.items.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return {
    items: state.items,
    total,
    itemCount,
    animationState: state.animationState,
    lastAddedItemId: state.lastAddedItemId,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
>>>>>>> origin/main
}