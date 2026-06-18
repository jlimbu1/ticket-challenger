'use client';

import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { VinylSpinner } from './VinylSpinner';
import { EmptyState } from './EmptyState';
import { getProducts } from '../data/mockData';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

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
          title="The Shelves Are Empty"
          message="Like a forgotten jukebox in an abandoned diner, our collection has vanished into the void. Check back when the records return from their tour."
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}