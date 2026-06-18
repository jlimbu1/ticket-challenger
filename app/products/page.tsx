import { useEffect, useState } from 'react';
import { DramaticErrorBoundary } from '@/components/DramaticErrorBoundary';
import { VinylSpinner } from '@/components/VinylSpinner';
import { GothicEmptyState } from '@/components/GothicEmptyState';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/src/data/products';
import { useCart } from '@/src/hooks/useCart';
import type { Product } from '@/src/types';

function ProductGrid() {
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (cancelled) return;

        const inStock = products.filter((p) => p.stock > 0);
        setFilteredProducts(inStock);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <VinylSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-crimson-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => {
              setLoading(true);
              setError(null);
              setFilteredProducts([]);
            }}
            className="px-6 py-2 bg-crimson-600 text-white rounded hover:bg-crimson-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GothicEmptyState
          title="No Products Found"
          description="The stage is empty. Check back later for new releases."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={() => addToCart(product, 1)}
        />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <header className="text-center py-8">
          <h1 className="text-4xl font-bold text-crimson-500 tracking-wider uppercase">
            Merchandise
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Exclusive tour merchandise and vinyl
          </p>
        </header>
        <main>
          <ProductGrid />
        </main>
      </div>
    </DramaticErrorBoundary>
  );
}