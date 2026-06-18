import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';

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
      const itemIndex = state.items.findIndex((item) => item.id === action.payload);
      if (itemIndex < 0) return state;

      const item = state.items[itemIndex];
      if (item.quantity > 1) {
        const updatedItems = state.items.map((existingItem, index) =>
          index === itemIndex
            ? { ...existingItem, quantity: existingItem.quantity - 1 }
            : existingItem
        );
        return {
          ...state,
          items: updatedItems,
        };
      }

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity < 1) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        animationState: 'idle',
        lastAddedItemId: null,
      };

    case 'SET_ANIMATION_IDLE':
      return {
        ...state,
        animationState: 'idle',
      };

    case 'LOAD_CART':
      return {
        items: action.payload,
        animationState: 'idle',
        lastAddedItemId: null,
      };

    default:
      return state;
  }
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: unknown): item is CartItem =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'productId' in item &&
        'title' in item &&
        'price' in item &&
        'quantity' in item &&
        'imageUrl' in item
    );
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable - silently fail
  }
}

interface CartContextValue {
  items: CartItem[];
  animationState: AnimationState;
  lastAddedItemId: string | null;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setAnimationIdle: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    animationState: 'idle',
    lastAddedItemId: null,
  });

  useEffect(() => {
    const storedItems = loadCartFromStorage();
    if (storedItems.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: storedItems });
    }
  }, []);

  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const setAnimationIdle = useCallback(() => {
    dispatch({ type: 'SET_ANIMATION_IDLE' });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value: CartContextValue = {
    items: state.items,
    animationState: state.animationState,
    lastAddedItemId: state.lastAddedItemId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setAnimationIdle,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}