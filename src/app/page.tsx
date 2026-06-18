import React from 'react';
import { Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import VinylSpinner from '../components/VinylSpinner';
import DramaticEmptyState from '../components/DramaticEmptyState';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const { addToCart } = useCart();

  React.useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const { products: productData } = await import('../data/products');
        setProducts(productData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load products';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <VinylSpinner size="lg" label="Loading the record collection..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="relative w-32 h-32 mx-auto mb-6">
            <div
              className="absolute inset-0 rounded-full opacity-20"
              style={{
                background: 'radial-gradient(circle, #8B0000 0%, transparent 70%)',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl opacity-30 select-none">&#9760;</span>
            </div>
          </div>
          <h2
            className="text-3xl font-gothic text-crimson mb-4"
            style={{ textShadow: '0 0 20px rgba(139, 0, 0, 0.4)' }}
          >
            The Record Player is Broken
          </h2>
          <p className="text-gray-400 font-serif italic text-lg mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-crimson text-white font-gothic tracking-wider hover:bg-deepPurple transition-colors duration-300 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <DramaticEmptyState
          title="The shelves are bare, like a forgotten attic"
          subtitle="No records to be found in this haunted collection..."
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-gothic text-crimson mb-4"
            style={{ textShadow: '0 0 30px rgba(139, 0, 0, 0.3)' }}
          >
            The Record Collection
          </h1>
          <p className="text-gray-400 font-serif italic text-lg">
            Browse our curated selection of vintage vinyl
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </main>
  );
}