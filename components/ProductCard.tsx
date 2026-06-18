import React, { useState } from 'react';
import { useCart } from '../src/hooks/useCart';
import { Product } from '../src/types';
import GothicButton from './GothicButton';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, 1);
    setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  const formatPrice = (price: number | string): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numericPrice)) {
      return '$0.00';
    }
    return `$${numericPrice.toFixed(2)}`;
  };

  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-800">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-800">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-album.svg';
              target.onerror = null;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 truncate">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-purple-400">{formatPrice(product.price)}</span>
          <GothicButton
            onClick={handleAddToCart}
            disabled={isAdding}
            className={isAdding ? 'opacity-50 cursor-not-allowed' : ''}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </GothicButton>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;