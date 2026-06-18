import { products } from '@/src/data/products';
import ProductCard from '@/components/ProductCard';
import DramaticErrorBoundary from '@/components/DramaticErrorBoundary';
import GothicEmptyState from '@/components/GothicEmptyState';
import VinylSpinner from '@/components/VinylSpinner';
import { useCart } from '@/src/context/CartContext';
import type { Product } from '@/src/types';

export default function ProductsPage() {
  const { addToCart } = useCart();

  const inStockProducts = products.filter((product: Product) => product.stock > 0);
  const outOfStockProducts = products.filter((product: Product) => product.stock <= 0);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (products.length === 0) {
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

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8 tracking-wider uppercase">
            Merchandise
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inStockProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {outOfStockProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6 tracking-wider uppercase text-gray-500">
                Sold Out
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                {outOfStockProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DramaticErrorBoundary>
  );
}