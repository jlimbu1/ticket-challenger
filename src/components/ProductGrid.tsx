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

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = useCallback(async () => {
    if (isAdding) return;
    setIsAdding(true);
    setAddError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ADD_TO_CART_TIMEOUT);

    try {
      await addItem(product);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setAddError(message);
    } finally {
      clearTimeout(timeoutId);
      setIsAdding(false);
    }
  }, [product, addItem, isAdding]);

  return (
    <div
      className="relative group overflow-hidden rounded-lg border border-crimson/20 bg-black/80 transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setAddError(null);
      }}
      role="article"
      aria-label={`${product.title} by ${product.artist}`}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.title} album cover`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%231a1a1a" width="400" height="400"/%3E%3Ctext fill="%238B0000" font-family="serif" font-size="24" x="50" y="200"%3EAlbum Art%3C/text%3E%3C/svg%3E';
          }}
        />

        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${SKULL_ROSE_OVERLAY}), url(${NOISE_PATTERN})`,
            backgroundBlendMode: 'overlay, normal',
            boxShadow: isHovered ? '0 0 40px rgba(139, 0, 0, 0.6), inset 0 0 40px rgba(139, 0, 0, 0.3)' : 'none',
          }}
        />

        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-crimson text-white text-xs px-2 py-1 rounded font-gothic">
            Sold Out
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-gothic text-white truncate" title={product.title}>
          {product.title}
        </h3>
        <p className="text-sm text-gray-400 font-gothic">{product.artist}</p>
        <div className="flex items-center justify-between">
          <span className="text-crimson font-bold text-lg">${product.price.toFixed(2)}</span>
          <span className="text-xs text-gray-500">{product.year}</span>
        </div>

        {addError && (
          <p className="text-red-400 text-xs mt-1" role="alert">
            {addError}
          </p>
        )}

        <GothicButton
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="w-full mt-2"
          aria-label={isAdding ? 'Adding to cart...' : `Add ${product.title} to cart`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-2">
              <VinylSpinner size="small" />
              Adding...
            </span>
          ) : product.inStock ? (
            'Add to Cart'
          ) : (
            'Out of Stock'
          )}
        </GothicButton>
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading = false, error = null }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Loading products">
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

  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <EmptyState
          title="The Shelves are Empty"
          message="The records have all been claimed by the shadows. Check back when the moon is full and the collection is replenished."
        />
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6"
      role="list"
      aria-label="Product grid"
    >
      {products.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}