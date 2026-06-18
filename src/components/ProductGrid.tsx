'use client';

import { useState, useEffect, useCallback } from 'react';
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
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.title} album artwork`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = NOISE_PATTERN;
            target.alt = 'Album artwork unavailable';
          }}
        />

        {/* Hover overlay with skull/rose pattern */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 bg-gradient-to-t from-crimson/30 to-transparent"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${SKULL_ROSE_OVERLAY})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${NOISE_PATTERN})`,
              backgroundSize: 'cover',
              mixBlendMode: 'overlay',
            }}
          />
        </div>

        {/* Crimson glow on hover */}
        <div
          className={`absolute inset-0 transition-shadow duration-500 ${
            isHovered ? 'shadow-[inset_0_0_30px_rgba(139,0,0,0.5)]' : ''
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2">
        <h3 className="font-serif text-lg text-white truncate">
          {product.title}
        </h3>
        <p className="text-sm text-gray-400">
          {product.artist} &middot; {product.year}
        </p>
        <p className="text-xl font-bold text-crimson">
          ${product.price.toFixed(2)}
        </p>

        {/* Stock status */}
        <p className={`text-xs ${product.inStock ? 'text-green-500' : 'text-red-500'}`}>
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </p>

        {/* Add to cart button */}
        <GothicButton
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="w-full"
          aria-label={`Add ${product.title} to cart`}
        >
          {isAdding ? (
            <span className="flex items-center justify-center gap-2">
              <VinylSpinner size="small" />
              Adding...
            </span>
          ) : product.inStock ? (
            'Add to Cart'
          ) : (
            'Sold Out'
          )}
        </GothicButton>

        {/* Error message */}
        {addError && (
          <p className="text-xs text-red-500 mt-1" role="alert">
            {addError}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProductGrid({ products, isLoading = false, error = null }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" role="status">
        <VinylSpinner />
        <span className="sr-only">Loading products...</span>
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
          message="Like a forgotten jukebox in an abandoned diner, our collection has vanished into the void. Check back when the stars align."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-serif text-4xl text-white mb-8 text-center">
        The Collection
      </h1>
      <div
        className="grid gap-6"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        }}
        role="list"
        aria-label="Product grid"
      >
        {products.map((product) => (
          <div key={product.id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}