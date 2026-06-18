import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../hooks/useCart';
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
      }, 2000);
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
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-gray-900 to-black border-l border-crimson-900/30 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-crimson-900/30">
            <h2 className="text-2xl font-serif text-crimson-800" style={{ fontFamily: 'var(--font-serif)' }}>
              Your Collection
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-crimson-600 transition-colors duration-200 p-2 rounded-full hover:bg-crimson-900/20"
              aria-label="Close cart"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 mb-6 rounded-full border-2 border-crimson-800/30 opacity-50"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, rgba(139,0,0,0.2) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(74,0,130,0.15) 0%, transparent 50%), radial-gradient(circle, #1a1a1a 0%, #2a2a2a 35%, #1a1a1a 50%, #2a2a2a 65%, #1a1a1a 80%, #2a2a2a 100%)`,
                  }}
                />
                <p className="text-2xl font-serif text-gray-500 mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                  The collection awaits...
                </p>
                <p className="text-sm text-gray-600">
                  Add some vinyl to begin your journey
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
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
            <div className="border-t border-crimson-900/30 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-serif text-gray-300" style={{ fontFamily: 'var(--font-serif)' }}>
                  Total
                </span>
                <span className="text-2xl font-bold text-crimson-600" style={{ fontFamily: 'var(--font-serif)' }}>
                  {formatPrice(total)}
                </span>
              </div>
              <button
                onClick={clearCart}
                className="w-full py-3 px-6 bg-crimson-900/20 hover:bg-crimson-900/40 text-crimson-400 border border-crimson-800/30 rounded-lg transition-all duration-200 font-serif text-sm"
                style={{ fontFamily: 'var(--font-serif)' }}
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