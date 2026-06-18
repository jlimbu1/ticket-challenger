'use client';

import { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { GothicButton } from './GothicButton';
import { VinylSpinner } from './VinylSpinner';

interface ProductCardProps {
  product: Product;
}

const NOISE_PATTERN = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E`;

const SKULL_ROSE_OVERLAY = `data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238B0000' stroke-width='1.5' opacity='0.6'%3E%3Cpath d='M200 120c-33 0-60 27-60 60 0 20 10 38 25 48l-10 30 20-15c8 3 16 5 25 5s17-2 25-5l20 15-10-30c15-10 25-28 25-48 0-33-27-60-60-60z'/%3E%3Ccircle cx='180' cy='155' r='8'/%3E%3Ccircle cx='220' cy='155' r='8'/%3E%3Cpath d='M185 185c5 5 10 8 15 8s10-3 15-8'/%3E%3C/g%3E%3Cg fill='%238B0000' opacity='0.4'%3E%3Cpath d='M320 280c-10-30-30-50-60-60 20 10 35 25 45 45 5 10 10 15 15 15z'/%3E%3Cpath d='M80 280c10-30 30-50 60-60-20 10-35 25-45 45-5 10-10 15-15 15z'/%3E%3C/g%3E%3C/svg%3E`;

const ADD_TO_CART_TIMEOUT = 10000;

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    if (isAdding) return;

    setIsAdding(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ADD_TO_CART_TIMEOUT);

    try {
      await addItem(product);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('The ritual took too long. Please try again.');
      } else {
        const message = err instanceof Error ? err.message : 'Failed to add to cart';
        setError(message);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsAdding(false);
    }
  };

  return (
    <div
      className="relative group overflow-hidden rounded-lg bg-gray-900 border border-gray-800 transition-all duration-500 hover:border-crimson-600 hover:shadow-[0_0_30px_rgba(139,0,0,0.3)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setError(null);
      }}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.title} by ${product.artist}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url('${SKULL_ROSE_OVERLAY}'), url('${NOISE_PATTERN}')`,
            backgroundBlendMode: 'overlay, normal',
          }}
        />

        <div
          className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'radial-gradient(circle at center, rgba(139,0,0,0.2) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-serif text-lg font-bold text-white truncate">
          {product.title}
        </h3>
        <p className="text-sm text-gray-400">{product.artist}</p>
        <div className="flex items-center justify-between">
          <span className="text-crimson-400 font-bold text-xl">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">{product.year}</span>
        </div>

        {error && (
          <p className="text-red-400 text-xs mt-1" role="alert">
            {error}
          </p>
        )}

        <GothicButton
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
          className="w-full mt-2"
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