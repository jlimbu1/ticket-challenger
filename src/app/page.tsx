'use client';

import { useState, useEffect } from 'react';
import { Product } from '../types';
import { ProductGrid } from '../components/ProductGrid';
import { VinylSpinner } from '../components/VinylSpinner';
import { EmptyState } from '../components/EmptyState';
import { getProducts } from '../data/mockData';

export default function HomePage() {
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
          message="Our collection has been scattered to the winds. The records that once spun tales of tragedy and triumph are nowhere to be found. Check back when the darkness lifts."
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-serif text-crimson mb-4 tracking-wider">
            The Black Parade
          </h1>
          <p className="text-xl text-gray-400 font-serif italic">
            A collection of vinyl records, each with a story to tell
          </p>
        </div>
        <ProductGrid products={products} />
      </div>
    </main>
  );
}