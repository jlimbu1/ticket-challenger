"use client";

import { useEffect, useState } from "react";
import { DramaticErrorBoundary } from "@/components/DramaticErrorBoundary";
import { VinylSpinner } from "@/components/VinylSpinner";
import { GothicEmptyState } from "@/components/GothicEmptyState";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/src/data/products";
import { useCart } from "@/src/hooks/useCart";
import type { Product } from "@/src/types";

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
          err instanceof Error ? err.message : "Failed to load products";
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
        <GothicEmptyState
          title="Failed to Load Products"
          description={error}
          actionLabel="Retry"
          onAction={() => {
            setLoading(true);
            setError(null);
            setFilteredProducts([]);
          }}
        />
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GothicEmptyState
          title="No Products Available"
          description="Check back later for new arrivals."
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <DramaticErrorBoundary>
      <main className="min-h-screen bg-gray-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-crimson-400 mb-8 text-center">
            Merch & Vinyl
          </h1>
          <ProductGrid />
        </div>
      </main>
    </DramaticErrorBoundary>
  );
}