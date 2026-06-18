import { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../hooks/useCart';
import { GothicButton } from './GothicButton';
import { VinylSpinner } from './VinylSpinner';
import { EmptyState } from './EmptyState';

interface ProductCardProps {
  product: Product;
}

const NOISE_PATTERN = `data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E`;

const SKULL_ROSE_OVERLAY = `data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%238B0000' stroke-width='1.5' opacity='0.6'%3E%3Cpath d='M200 120c-33 0-60 27-60 60 0 20 10 38 25 48l-10 30 20-15c8 3 16 5 25 5s17-2 25-5l20 15-10-30c15-10 25-28 25-48 0-33-27-60-60-60z'/%3E%3Ccircle cx='180' cy='155' r='8'/%3E%3Ccircle cx='220' cy='155' r='8'/%3E%3Cpath d='M185 185c5 5 10 8 15 8s10-3 15-8'/%3E%3C/g%3E%3Cg fill='%238B0000' opacity='0.4'%3E%3Cpath d='M320 280c-10-30-30-50-60-60 20 10 35 25 45 45 5 10 10 15 15 15z'/%3E%3Cpath d='M80 280c10-30 30-50 60-60-20 10-35 25-45 45-5 10-10 15-15 15z'/%3E%3C/g%3E%3C/svg%3E`;

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-900 border border-gray-800 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,0,0,0.5)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid="product-card"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.imageUrl}
          alt={`${product.title} by ${product.artist}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {isHovered && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
            style={{ backgroundImage: `url(${SKULL_ROSE_OVERLAY})` }}
            data-testid="hover-overlay"
          />
        )}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ backgroundImage: `url(${NOISE_PATTERN})` }}
        />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-serif text-white truncate">{product.title}</h3>
        <p className="text-sm text-gray-400">{product.artist}</p>
        <div className="flex items-center justify-between">
          <span className="text-crimson font-bold text-xl">${product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-500">{product.year}</span>
        </div>
        <GothicButton
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
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
            'Out of Stock'
          )}
        </GothicButton>
      </div>
    </div>
  );
}