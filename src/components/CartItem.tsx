<<<<<<< HEAD
'use client';

import Image from 'next/image';
import { useCart } from '@/hooks/useCart';

interface CartItemProps {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export default function CartItem({ productId, name, price, quantity, imageUrl }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const subtotal = price * quantity;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const parsed = parseInt(rawValue, 10);

    if (isNaN(parsed) || parsed < 1) {
      e.target.value = '1';
      updateQuantity(productId, 1);
      return;
    }

    updateQuantity(productId, parsed);
  };

  const handleRemove = () => {
    removeItem(productId);
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover object-center"
          sizes="80px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">${price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor={`quantity-${productId}`} className="sr-only">
          Quantity for {name}
        </label>
        <input
          id={`quantity-${productId}`}
          type="number"
          min={1}
          value={quantity}
          onChange={handleQuantityChange}
          className="w-16 text-center border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
        <button
          onClick={handleRemove}
          className="mt-1 text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
=======
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
          <img
            src={item.imageUrl}
            alt={item.title}
            className={`w-16 h-16 object-cover rounded border border-crimson-800/50 ${
              isAnimating ? 'animate-spin' : ''
            }`}
          />
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded">
              <svg
                className="w-8 h-8 text-crimson-500 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="31.4 31.4"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-200 truncate">
            {item.title}
          </h3>
          <p className="text-sm text-crimson-400 mt-1">
            {formatPrice(item.price)}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-crimson-800/50 text-gray-400 hover:text-crimson-400 hover:border-crimson-600 transition-colors"
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="text-sm text-gray-300 w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded border border-crimson-800/50 text-gray-400 hover:text-crimson-400 hover:border-crimson-600 transition-colors"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm font-medium text-gray-200">
            {formatPrice(item.price * item.quantity)}
          </span>
          <button
            onClick={() => onRemove(item.id)}
            className="text-xs text-gray-500 hover:text-crimson-400 transition-colors"
            aria-label={`Remove ${item.title} from cart`}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
>>>>>>> origin/main
