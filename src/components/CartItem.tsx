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
    const newQuantity = parseInt(e.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 1) {
      return;
    }
    updateQuantity(productId, newQuantity);
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
          className="w-16 text-center border border-gray-300 rounded-md py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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