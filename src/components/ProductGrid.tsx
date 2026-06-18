'use client';

import { useState, useCallback } from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { GothicButton } from './GothicButton';
import { VinylSpinner } from './VinylSpinner';
import { EmptyState } from './EmptyState';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
}

const NOISE_PATTERN = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E`;

const SKULL_ROSE_OVERLAY = `data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238B0000' stroke-width='1.5' opacity='0.6'%3E%3Cpath d='M200 120c-33 0-60 27-60 60 0 20 10 38 25 48l-10 30 20-15c8 3 16 5 25 5s17-2 25-5l20 15-10-30c15-10 25-28 25-48 0-33-27-60-60-60z'/%3E%3Ccircle cx='180' cy='155' r='8'/%3E%3Ccircle cx='220' cy='155' r='8'/%3E%3Cpath d='M185 185c5 5 10 8 15 8s10-3 15-8'/%3E%3C/g%3E%3Cg fill='%238B0000' opacity='0.4'%3E%3Cpath d='M320 280c-10-30-30-50-60-60 20 10 35 25 45 45 5 10 10 15 15 15z'/%3E%3Cpath d='M80 280c10-30 30-50 60-60-20 10-35 25-45 45-5 10-10 15-15 15z'/%3E%3C/g%3E%3C/svg%3E`;

const ADD_TO_CART_TIMEOUT = 10000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, ms);
    promise.then(resolve, reject).finally(() => clearTimeout(timer));
  });
}

export function ProductGrid({ products, isLoading = false, error = null }: ProductGridProps) {
  const { addItem } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  const handleAddToCart = useCallback(async (product: Product) => {
    if (addingId) return;
    setAddingId(product.id);
    setAddError(null);
    try {
      await withTimeout(Promise.resolve(addItem(product)), ADD_TO_CART_TIMEOUT);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setAddError(message);
    } finally {
      setAddingId(null);
    }
  }, [addingId, addItem]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <VinylSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          title="The Record Player is Broken"
          message="A ghost in the machine has scattered our collection. The vinyls are silent, the needles are still. Perhaps refresh and try again?"
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          title="The Shelves are Empty"
          message="Like a forgotten jukebox in an abandoned diner, our collection has vanished into the void. Check back when the ghosts have returned the records."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif text-crimson text-center mb-12 tracking-wider uppercase">
          The Collection
        </h1>
        {addError && (
          <div className="text-crimson text-center mb-6 text-sm" role="alert">
            {addError}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gray-900 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,0,0,0.5)]"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={`${product.title} by ${product.artist}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    backgroundImage: `url(${SKULL_ROSE_OVERLAY}), url(${NOISE_PATTERN})`,
                    backgroundBlendMode: 'overlay',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-serif text-white mb-1 truncate">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-400 mb-1">
                  {product.artist}
                </p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-crimson font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {product.year}
                  </span>
                </div>
                <GothicButton
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock || addingId === product.id}
                  className="w-full text-sm"
                >
                  {addingId === product.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <VinylSpinner size="small" />
                      Adding...
                    </span>
                  ) : product.inStock ? (
                    'Add to Collection'
                  ) : (
                    'Out of Stock'
                  )}
                </GothicButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}