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

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { addToCart } = useCart();

  const handleAddToCart = useCallback(async () => {
    if (isAdding) return;

    setIsAdding(true);
    setAddError(null);

    try {
      const addPromise = new Promise<void>((resolve, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Add to cart timed out'));
        }, ADD_TO_CART_TIMEOUT);

        try {
          addToCart(product);
          clearTimeout(timeoutRef.current!);
          timeoutRef.current = null;
          resolve();
        } catch (err) {
          clearTimeout(timeoutRef.current!);
          timeoutRef.current = null;
          reject(err);
        }
      });

      await addPromise;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setAddError(message);
    } finally {
      setIsAdding(false);
    }
  }, [isAdding, addToCart, product]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div
      className="relative group overflow-hidden rounded-lg bg-gray-900 border border-gray-800 transition-all duration-500 hover:border-crimson-700 hover:shadow-[0_0_30px_rgba(139,0,0,0.3)]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-testid="product-card"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.title} by ${product.artist}`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {isHovered && (
          <div
            className="absolute inset-0 z-10 transition-opacity duration-500"
            style={{
              backgroundImage: `url('${SKULL_ROSE_OVERLAY}'), url('${NOISE_PATTERN}')`,
              backgroundBlendMode: 'overlay, multiply',
              backgroundColor: 'rgba(139, 0, 0, 0.15)',
              boxShadow: 'inset 0 0 60px rgba(139, 0, 0, 0.4)',
            }}
            data-testid="hover-overlay"
          />
        )}

        {!product.inStock && (
          <div className="absolute top-2 right-2 z-20 bg-gray-900/90 text-gray-400 text-xs px-2 py-1 rounded border border-gray-700">
            Out of Stock
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-serif text-lg font-bold text-gray-100 truncate">
          {product.title}
        </h3>
        <p className="text-sm text-gray-400 truncate">{product.artist}</p>
        <div className="flex items-center justify-between">
          <span className="text-crimson-400 font-semibold">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">{product.year}</span>
        </div>

        {addError && (
          <p className="text-xs text-red-400 mt-1" role="alert">
            {addError}
          </p>
        )}

        <GothicButton
          onClick={handleAddToCart}
          disabled={isAdding || !product.inStock}
          className="w-full mt-2"
          data-testid="add-to-cart-button"
        >
          {isAdding ? (
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
  );
}