import React, { useEffect, useRef, useState } from 'react';
import { useCart, CartItem as CartItemType } from '../hooks/useCart';
import CartItemComponent from './CartItem';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, total, itemCount, animationState, lastAddedItemId, removeItem, updateQuantity, clearCart } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (animationState === 'spinning') {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animationState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={handleOverlayClick}
          data-testid="cart-overlay"
        />
      )}
      <div
        ref={drawerRef}
        data-testid="cart-drawer"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-900 border-l border-crimson-800/50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-crimson-800/30">
            <h2 className="text-xl font-gothic text-crimson-400">
              Your Collection
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-crimson-400 transition-colors duration-200 p-2"
              aria-label="Close cart"
              data-testid="cart-close-button"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg className="w-16 h-16 text-crimson-800/50 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <p className="text-gray-400 text-lg font-gothic italic">
                  The shelves are bare, the records silent...
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Add some vinyl to begin your collection
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item: CartItemType) => (
                  <CartItemComponent
                    key={item.id}
                    item={item}
                    isAnimating={isAnimating && lastAddedItemId === item.id}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-crimson-800/30 p-4 space-y-4">
              <div className="flex items-center justify-between text-gray-300">
                <span className="text-sm">Items ({itemCount})</span>
                <span className="text-lg font-gothic text-crimson-400">
                  {formatPrice(total)}
                </span>
              </div>
              <button
                onClick={clearCart}
                className="w-full py-2 px-4 bg-crimson-900/30 text-crimson-400 border border-crimson-800/50 rounded hover:bg-crimson-900/50 transition-colors duration-200 text-sm"
                data-testid="clear-cart-button"
              >
                Clear Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;