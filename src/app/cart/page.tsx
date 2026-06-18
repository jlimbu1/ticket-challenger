'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function SkeletonCartItem() {
  return (
    <div className="animate-pulse rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-gray-200" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/4 rounded bg-gray-200" />
          <div className="h-8 w-32 rounded bg-gray-200" />
        </div>
        <div className="h-6 w-20 rounded bg-gray-200" />
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
      <svg
        className="mb-6 h-24 w-24 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
      <h3 className="mb-2 text-xl font-semibold text-gray-900">Your cart is empty</h3>
      <p className="mb-6 text-gray-500">Looks like you have not added any items to your cart yet.</p>
      <Link
        href="/products"
        className="btn-primary"
      >
        Browse Products
      </Link>
    </div>
  );
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCart = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const stored = localStorage.getItem('cart');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load cart';
      setError(message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const updateQuantity = useCallback((productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      try {
        localStorage.setItem('cart', JSON.stringify(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save cart';
        setError(message);
      }
      return updated;
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      try {
        localStorage.setItem('cart', JSON.stringify(updated));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save cart';
        setError(message);
      }
      return updated;
    });
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="page-container page-section min-h-[60vh]">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-4">
          <SkeletonCartItem />
          <SkeletonCartItem />
          <SkeletonCartItem />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container page-section min-h-[60vh]">
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
          <svg
            className="mb-6 h-24 w-24 text-red-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Something went wrong</h3>
          <p className="mb-6 text-gray-500">{error}</p>
          <button
            onClick={loadCart}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-container page-section min-h-[60vh]">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="page-container page-section min-h-[60vh]">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 animate-fadeIn">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const imageUrl = isValidImageUrl(item.imageUrl)
              ? item.imageUrl
              : '/placeholder.svg';

            return (
              <div
                key={item.productId}
                className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.productId}`}
                    className="text-lg font-semibold text-gray-900 transition-colors duration-200 hover:text-indigo-600 line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-gray-500">
                    ${item.price.toFixed(2)}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Decrease quantity"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                      aria-label="Increase quantity"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="text-lg font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-red-600 transition-colors duration-200 hover:text-red-500"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md animate-fadeIn">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Order Summary</h2>

            <div className="space-y-3 border-b border-gray-200 pb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between text-lg font-semibold text-gray-900">
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-primary mt-6 w-full"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="btn-secondary mt-3 w-full"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}