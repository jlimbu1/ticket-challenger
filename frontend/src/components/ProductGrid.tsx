import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import '../styles/theme.css';
import '../styles/animations.css';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="product-grid-error" role="alert">
        <p className="error-text">The records are scratched... {error}</p>
        <button
          className="retry-button"
          onClick={() => {
            setLoading(true);
            setError(null);
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="product-grid" role="list" aria-label="Product collection">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          category={product.category}
          image={product.image}
        />
      ))}
    </div>
  );
};

export default ProductGrid;