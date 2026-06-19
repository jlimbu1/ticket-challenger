'use client';

import { CartProvider } from '../src/hooks/useCart';
import CartBadge from '../components/CartBadge';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ticket Challenger',
  description: 'Gothic ticket storefront',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <CartProvider>
          <header className="sticky top-0 z-50 border-b border-purple-900/40 bg-gray-950/90 backdrop-blur-sm">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <Link
                href="/"
                className="text-xl font-bold tracking-tighter text-purple-300 hover:text-purple-200"
              >
                Ticket Challenger
              </Link>
              <div className="flex items-center gap-6">
                <CartBadge />
              </div>
            </nav>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}