'use client';

import { useContext } from 'react';
import Link from 'next/link';
import { CartContext } from '../src/hooks/useCart';

export default function CartBadge() {
  const { state } = useContext(CartContext);
  const count = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href="/cart"
      className="group relative inline-flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-300 transition-colors hover:text-purple-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 7h12l2-7M9 16h6"
        />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-bold leading-none text-white">
          {count > 99 ? '99+' : count}
        </span>
      ) : null}
    </Link>
  );
}