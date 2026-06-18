import React, { useState, useEffect } from 'react';
import ProductCard from '../../components/ProductCard';
import VinylSpinner from '../../components/VinylSpinner';
import GothicEmptyState from '../../components/GothicEmptyState';
import DramaticErrorBoundary from '../../components/DramaticErrorBoundary';
import { products } from '../../src/data/products';
import { Product } from '../../src/types';

const ProductsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [productList, setProductList] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (!products || products.length === 0) {
          setProductList([]);
        } else {
          setProductList(products);
        }
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <VinylSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <DramaticErrorBoundary>
          <div className="text-red-500 text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Error Loading Products</h2>
            <p>{error}</p>
          </div>
        </DramaticErrorBoundary>
      </div>
    );
  }

  if (productList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <GothicEmptyState
          title="No Products Found"
          description="The void is empty. Check back later for new arrivals."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center tracking-wider uppercase">
          Merch &amp; Tickets
        </h1>
        <DramaticErrorBoundary>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </DramaticErrorBoundary>
      </div>
    </div>
  );
};

export default ProductsPage;