import React from 'react';
import { CartItem as CartItemType } from '../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  isAnimating: boolean;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  isAnimating,
  onRemove,
  onUpdateQuantity,
}) => {
  const handleQuantityChange = (newQuantity: number): void => {
    if (newQuantity < 1) {
      onRemove(item.id);
      return;
    }
    onUpdateQuantity(item.id, newQuantity);
  };

  const formatPrice = (price: number): string => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <div className="cart-item border-b border-crimson-900/30 py-4 last:border-b-0">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div
            className={`w-16 h-16 rounded-full border-2 border-crimson-800/50 overflow-hidden relative ${
              isAnimating ? 'animate-spin' : ''
            }`}
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(139,0,0,0.3) 0%, transparent 60%), radial-gradient(circle at 70% 70%, rgba(74,0,130,0.2) 0%, transparent 50%), radial-gradient(circle, #1a1a1a 0%, #2a2a2a 35%, #1a1a1a 50%, #2a2a2a 65%, #1a1a1a 80%, #2a2a2a 100%)`,
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-sm text-gray-200 truncate">{item.title}</h3>
          <p className="text-xs text-gray-400 mt-0.5">{item.artist}</p>
          <p className="text-sm font-semibold text-crimson-400 mt-1">{formatPrice(item.price)}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 border border-gray-700 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-6 text-center text-sm text-gray-200">{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-6 h-6 flex items-center justify-center text-xs text-gray-400 border border-gray-700 rounded hover:bg-gray-800 hover:text-gray-200 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-gray-500 hover:text-crimson-500 transition-colors"
            aria-label="Remove item"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;