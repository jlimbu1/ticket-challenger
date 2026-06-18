"use client";

import { useState, useEffect } from "react";
import { products } from "@/src/data/products";
import ProductCard from "@/components/ProductCard";
import DramaticErrorBoundary from "@/components/DramaticErrorBoundary";
import GothicEmptyState from "@/components/GothicEmptyState";
import VinylSpinner from "@/components/VinylSpinner";
import type { Product } from "@/src/types";

export default function ProductsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!products || !Array.isArray(products)) {
          throw new Error("Product data is unavailable");
        }
        setProductList(products);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
      } finally {
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <VinylSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <DramaticErrorBoundary>
          <GothicEmptyState
            title="Something went wrong"
            message={error}
          />
        </DramaticErrorBoundary>
      </div>
    );
  }

  if (productList.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <GothicEmptyState
          title="No products found"
          message="The collection is empty. Check back later for new arrivals."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-crimson md:text-4xl">
            The Collection
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Browse our curated selection of dark relics and artifacts
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productList.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}