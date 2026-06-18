'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
              >
                Ticket Challenger
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link
                  href="/products"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-indigo-600 border-b-2 border-transparent hover:border-indigo-600 transition-colors duration-200"
                >
                  Products
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/cart"
                className="relative inline-flex items-center p-2 text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                aria-label={`Shopping cart with ${totalItems} items`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-indigo-600 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}