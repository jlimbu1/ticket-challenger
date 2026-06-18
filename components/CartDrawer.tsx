import React, { useEffect, useRef } from 'react';
import { useCart } from '../hooks/useCart';
import VinylSpinner from './VinylSpinner';
import GothicEmptyState from './GothicEmptyState';
import ThemedButton from './ThemedButton';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    items,
    total,
    itemCount,
    animationState,
    lastAddedItemId,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);

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

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  const renderCartItems = () => {
    if (items.length === 0) {
      return (
        <GothicEmptyState
          title="Empty Record Shelves"
          message="Your collection awaits... add some vinyl to begin your journey through the darkness."
        />
      );
    }

    return (
      <div className="cart-items" data-testid="cart-items">
        {items.map((item) => (
          <div
            key={item.id}
            className={`cart-item ${lastAddedItemId === item.id && animationState === 'spinning' ? 'cart-item--spinning' : ''}`}
            data-testid={`cart-item-${item.id}`}
          >
            <div className="cart-item__image">
              <img src={item.imageUrl} alt={item.title} />
            </div>
            <div className="cart-item__details">
              <h3 className="cart-item__title">{item.title}</h3>
              <p className="cart-item__price">{formatPrice(item.price)}</p>
              <div className="cart-item__quantity">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="cart-item__quantity-btn"
                  aria-label={`Decrease quantity of ${item.title}`}
                >
                  -
                </button>
                <span className="cart-item__quantity-value">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="cart-item__quantity-btn"
                  aria-label={`Increase quantity of ${item.title}`}
                >
                  +
                </button>
              </div>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="cart-item__remove"
              aria-label={`Remove ${item.title} from cart`}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="cart-overlay"
          data-testid="cart-overlay"
          onClick={handleOverlayClick}
        />
      )}
      <div
        ref={drawerRef}
        className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}
        data-testid="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Your Collection
            {itemCount > 0 && (
              <span className="cart-drawer__count" data-testid="cart-count">
                ({itemCount})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="cart-drawer__close"
            aria-label="Close cart"
          >
            &times;
          </button>
        </div>

        {animationState === 'spinning' && (
          <div className="cart-drawer__spinner-overlay" data-testid="vinyl-spinner-overlay">
            <VinylSpinner />
          </div>
        )}

        <div className="cart-drawer__content">
          {renderCartItems()}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Total:</span>
              <span className="cart-drawer__total-value" data-testid="cart-total">
                {formatPrice(total)}
              </span>
            </div>
            <div className="cart-drawer__actions">
              <ThemedButton
                onClick={clearCart}
                variant="secondary"
                data-testid="clear-cart-button"
              >
                Clear Collection
              </ThemedButton>
              <ThemedButton
                onClick={() => {
                  // Navigate to checkout - will be implemented in T001-4
                  onClose();
                }}
                variant="primary"
                data-testid="checkout-button"
              >
                Proceed to Ritual
              </ThemedButton>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: 400px;
          max-width: 100vw;
          background: #1a1a1a;
          border-left: 2px solid #8B0000;
          z-index: 1001;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
        }

        .cart-drawer--open {
          transform: translateX(0);
        }

        .cart-drawer__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #333;
          background: linear-gradient(180deg, #2a0a0a 0%, #1a1a1a 100%);
        }

        .cart-drawer__title {
          font-family: 'Cinzel', serif;
          font-size: 1.5rem;
          color: #8B0000;
          margin: 0;
        }

        .cart-drawer__count {
          font-size: 1rem;
          color: #666;
          margin-left: 0.5rem;
        }

        .cart-drawer__close {
          background: none;
          border: none;
          color: #666;
          font-size: 2rem;
          cursor: pointer;
          padding: 0.5rem;
          line-height: 1;
          transition: color 0.2s;
        }

        .cart-drawer__close:hover {
          color: #8B0000;
        }

        .cart-drawer__spinner-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          animation: fadeIn 0.2s ease;
        }

        .cart-drawer__content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: #222;
          border: 1px solid #333;
          border-radius: 4px;
          transition: border-color 0.2s;
          position: relative;
        }

        .cart-item:hover {
          border-color: #8B0000;
        }

        .cart-item--spinning {
          animation: vinylSpin 1.5s ease;
        }

        .cart-item__image {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid #333;
        }

        .cart-item__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cart-item__details {
          flex: 1;
          min-width: 0;
        }

        .cart-item__title {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          color: #fff;
          margin: 0 0 0.5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cart-item__price {
          font-size: 0.9rem;
          color: #8B0000;
          margin: 0 0 0.5rem;
        }

        .cart-item__quantity {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .cart-item__quantity-btn {
          background: #333;
          border: 1px solid #555;
          color: #fff;
          width: 28px;
          height: 28px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .cart-item__quantity-btn:hover {
          background: #8B0000;
          border-color: #8B0000;
        }

        .cart-item__quantity-value {
          font-size: 1rem;
          color: #fff;
          min-width: 24px;
          text-align: center;
        }

        .cart-item__remove {
          background: none;
          border: none;
          color: #666;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          line-height: 1;
          transition: color 0.2s;
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
        }

        .cart-item__remove:hover {
          color: #8B0000;
        }

        .cart-drawer__footer {
          padding: 1.5rem;
          border-top: 1px solid #333;
          background: #1a1a1a;
        }

        .cart-drawer__total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-family: 'Cinzel', serif;
          font-size: 1.2rem;
          color: #fff;
        }

        .cart-drawer__total-value {
          color: #8B0000;
          font-size: 1.4rem;
        }

        .cart-drawer__actions {
          display: flex;
          gap: 1rem;
        }

        .cart-drawer__actions > :global(*) {
          flex: 1;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes vinylSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 480px) {
          .cart-drawer {
            width: 100vw;
          }
        }
      `}</style>
    </>
  );
};

export default CartDrawer;