'use client';

import React, { useState, useEffect } from 'react';
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
      <h2 className="text-xl font-semibold text-gray-900">Your cart is empty</h2>
      <p className="mt-2 text-gray-500">Add some products to get started!</p>
      <Link
        href="/products"
        className="btn-primary mt-6"
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

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
        } else {
          setCartItems([]);
        }
      } else {
        setCartItems([]);
      }
    } catch (err) {
      setError('Failed to load cart. Please try again.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      try {
        localStorage.setItem('cart', JSON.stringify(updated));
      } catch (err) {
        setError('Failed to update cart. Please try again.');
      }
      return updated;
    });
  };

  const removeItem = (productId: number) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item.productId !== productId);
      try {
        localStorage.setItem('cart', JSON.stringify(updated));
      } catch (err) {
        setError('Failed to remove item. Please try again.');
      }
      return updated;
    });
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (error) {
    return (
      <div className="page-container page-section">
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
          <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
          <p className="mt-2 text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary mt-6"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page-container page-section">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCartItem key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page-container page-section">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="page-container page-section animate-fadeIn">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.productId}`}
                  className="text-lg font-semibold text-gray-900 transition-colors hover:text-indigo-600"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-gray-500">
                  ${item.price.toFixed(2)} each
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition-colors hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-lg font-semibold text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-sm font-medium text-red-600 transition-colors hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
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