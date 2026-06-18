'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export default function CartSummary() {
  const { totalItems, totalPrice } = useCart();

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">
          Cart Summary
        </span>
        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-indigo-100 bg-indigo-600 rounded-full">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-base text-gray-900">Subtotal</span>
        <span className="text-lg font-semibold text-gray-900">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
      <Link
        href="/cart"
        className="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
      >
        View Cart
      </Link>
    </div>
  );
}