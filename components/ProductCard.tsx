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

  useEffect(() => {
    const timer = setTimeout(() => {
      setProductList(products);
      setIsLoading(false);
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

  if (productList.length === 0) {
    return (
      <DramaticErrorBoundary>
        <div className="min-h-screen bg-black text-white p-8">
          <GothicEmptyState
            title="No Products Found"
            message="The stage is empty. Check back later for new releases."
          />
        </div>
      </DramaticErrorBoundary>
    );
  }

  const inStockProducts = productList.filter((product: Product) => product.stock > 0);
  const outOfStockProducts = productList.filter((product: Product) => product.stock <= 0);

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-crimson tracking-wider uppercase">
          The Black Parade
        </h1>
        {inStockProducts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gothic-300 border-b border-gothic-700 pb-2">
              Available Relics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inStockProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
        {outOfStockProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6 text-gothic-500 border-b border-gothic-700 pb-2">
              Sold Out
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-60">
              {outOfStockProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </DramaticErrorBoundary>
  );
}