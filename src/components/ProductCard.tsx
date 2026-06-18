'use client';

import { useState, useRef, useCallback } from 'react';
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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Operation timed out'));
    }, ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(async () => {
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    setAddError(null);

    abortControllerRef.current = new AbortController();

    try {
      await withTimeout(
        addToCart(product),
        ADD_TO_CART_TIMEOUT
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setAddError(message);
    } finally {
      setIsAddingToCart(false);
      abortControllerRef.current = null;
    }
  }, [product, addToCart, isAddingToCart]);

  return (
    <div
      className="relative group overflow-hidden rounded-lg border border-crimson-900/30 bg-black/80 transition-all duration-500 hover:shadow-[0_0_30px_rgba(139,0,0,0.5)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${product.title} by ${product.artist}`}
    >
      {/* Distressed texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10 mix-blend-overlay"
        style={{ backgroundImage: `url(${NOISE_PATTERN})` }}
        aria-hidden="true"
      />

      {/* Skull and rose overlay on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 z-20 transition-opacity duration-500 opacity-60"
          style={{ backgroundImage: `url(${SKULL_ROSE_OVERLAY})`, backgroundSize: 'cover' }}
          aria-hidden="true"
        />
      )}

      {/* Crimson glow on hover */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(139,0,0,0.4) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Product image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.title} album cover`}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"%3E%3Crect fill="%231a1a1a" width="400" height="400"/%3E%3Ctext fill="%238B0000" font-family="serif" font-size="24" x="50" y="200"%3ENo Image%3C/text%3E%3C/svg%3E';
          }}
        />

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-30">
            <span className="text-crimson-500 font-gothic text-2xl tracking-widest transform -rotate-12">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-4 space-y-2">
        <h3 className="font-gothic text-lg text-gray-100 truncate">
          {product.title}
        </h3>
        <p className="text-sm text-gray-400">
          {product.artist}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-crimson-500 font-bold text-xl">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {product.year}
          </span>
        </div>

        {/* Add to cart button */}
        <div className="pt-2">
          {addError && (
            <p className="text-red-500 text-xs mb-2" role="alert">
              {addError}
            </p>
          )}
          <GothicButton
            onClick={handleAddToCart}
            disabled={!product.inStock || isAddingToCart}
            className="w-full"
            aria-label={`Add ${product.title} to cart`}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center gap-2">
                <VinylSpinner size="small" />
                Adding...
              </span>
            ) : product.inStock ? (
              'Add to Cart'
            ) : (
              'Unavailable'
            )}
          </GothicButton>
        </div>
      </div>
    </div>
  );
}