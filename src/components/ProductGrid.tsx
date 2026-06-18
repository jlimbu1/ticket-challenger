import { useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
}

export default function ProductGrid({
  products,
  isLoading,
  error,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  categories,
}: ProductGridProps) {
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        onSearchChange(debouncedSearch);
        setLocalError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update search';
        setLocalError(message);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [debouncedSearch, onSearchChange]);

  const handleSearchInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDebouncedSearch(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      try {
        onCategoryChange(e.target.value);
        setLocalError(null);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to update category';
        setLocalError(message);
      }
    },
    [onCategoryChange]
  );

  const displayError = error || localError;

  const filteredProducts = useMemo(() => {
    try {
      let result = products;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter((product) =>
          product.name.toLowerCase().includes(query)
        );
      }

      if (selectedCategory) {
        result = result.filter(
          (product) => product.category === selectedCategory
        );
      }

      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to filter products';
      setLocalError(message);
      return products;
    }
  }, [products, searchQuery, selectedCategory]);

  if (isLoading) {
    return (
      <div className="w-full" role="status" aria-label="Loading products">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (displayError) {
    return (
      <div className="w-full" role="alert">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <p className="text-red-800 font-medium">Error loading products</p>
          <p className="mt-2 text-red-600 text-sm">{displayError}</p>
          <button
            onClick={() => {
              setLocalError(null);
              onSearchChange('');
              onCategoryChange('');
              setDebouncedSearch('');
            }}
            className="mt-4 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full" role="status">
        <div className="rounded-lg bg-gray-50 p-12 text-center">
          <p className="text-gray-500 text-lg">No products available</p>
          <p className="mt-2 text-gray-400 text-sm">
            Check back later for new products
          </p>
        </div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="w-full" role="status">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 text-lg">No products match your search</p>
            <p className="mt-2 text-gray-400 text-sm">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('');
                setDebouncedSearch('');
              }}
              className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={debouncedSearch}
            onChange={handleSearchInputChange}
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search products"
          />
          <svg
            className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div
        className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
        role="list"
        aria-label="Product grid"
      >
        {filteredProducts.map((product) => (
          <div key={product.id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}