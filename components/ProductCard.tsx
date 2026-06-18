import { useCart } from '@/src/context/CartContext';
import DramaticErrorBoundary from '@/components/DramaticErrorBoundary';
import GothicEmptyState from '@/components/GothicEmptyState';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <DramaticErrorBoundary>
      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-purple-900 transition-colors duration-300">
        <div className="aspect-square bg-gray-800 relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <span className="text-4xl">&#9835;</span>
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <span className="text-red-500 font-bold text-lg uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-3">{product.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-purple-400 font-bold text-xl">
              ${product.price.toFixed(2)}
            </span>
            {product.stock > 0 && (
              <button
                onClick={handleAddToCart}
                className="bg-purple-800 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
}