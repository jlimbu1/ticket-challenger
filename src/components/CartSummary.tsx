'use client';

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export default function CartSummary() {
  const { items, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm">
            <span className="text-gray-600 truncate max-w-[200px]">
              {item.name} x{item.quantity}
            </span>
            <span className="text-gray-900 font-medium">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold text-gray-900">
            Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
          </span>
          <span className="text-lg font-bold text-indigo-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <Link
          href="/checkout"
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}