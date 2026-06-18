"use client";

import { useState } from 'react';
import { GothicButton } from '@/components/GothicButton';
import { useCart } from '@/src/hooks/useCart';
import type { Product } from '@/src/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const stockLabel = product.stock > 0 ? 'In Stock' : 'Out of Stock';
  const stockColor = product.stock > 0 ? 'text-crimson-500' : 'text-gray-500';

  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900 shadow-lg hover:shadow-crimson-500/20 transition-shadow duration-300">
      <div className="aspect-square bg-gray-800 rounded-md mb-4 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            No Image
          </div>
        )}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{product.name}</h3>
      <p className="text-crimson-400 font-semibold mb-2">
        ${product.price.toFixed(2)}
      </p>
      <p className={`text-sm mb-3 ${stockColor}`}>{stockLabel}</p>
      <GothicButton
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
        className="w-full"
      >
        {added ? 'Added to Cart' : product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
      </GothicButton>
    </div>
  );
}