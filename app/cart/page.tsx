"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/hooks/useCart';
import CartItem from '@/src/components/CartItem';
import GothicEmptyState from '@/src/components/GothicEmptyState';
import VinylSpinner from '@/src/components/VinylSpinner';
import GothicButton from '@/src/components/GothicButton';

export default function CartPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <VinylSpinner />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <GothicEmptyState
          title="Your Ritual Space is Empty"
          description="No items have been summoned yet. Browse the collection to begin."
          actionLabel="Browse Products"
          onAction={() => router.push('/products')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-300">
        Your Ritual Cart
      </h1>

      <div className="max-w-2xl mx-auto space-y-4">
        {items.map((item) => (
          <CartItem key={item.product.id} item={item} />
        ))}
      </div>

      <div className="max-w-2xl mx-auto mt-8 p-4 border border-purple-800 rounded-lg bg-purple-900/20">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg text-purple-300">Total:</span>
          <span className="text-2xl font-bold text-purple-200">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex gap-4">
          <GothicButton
            onClick={() => router.push('/checkout')}
            className="flex-1"
          >
            Proceed to Checkout
          </GothicButton>

          <GothicButton
            onClick={clearCart}
            variant="secondary"
            className="flex-1"
          >
            Clear Cart
          </GothicButton>
        </div>
      </div>
    </div>
  );
}