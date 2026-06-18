"use client";

import { useState, useEffect } from "react";
import { products } from "@/src/data/products";
import ProductCard from "@/components/ProductCard";
import ErrorBoundary from "@/components/ErrorBoundary";
import EmptyState from "@/components/EmptyState";
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
        <ErrorBoundary>
          <div className="text-crimson text-center">
            <p className="text-2xl font-bold mb-4">Something went wrong</p>
            <p>{error}</p>
          </div>
        </ErrorBoundary>
      </div>
    );
  }

  if (productList.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <EmptyState message="No products available. The void is empty." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-crimson mb-8 text-center">
        Merch Collection
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}