import React from 'react';
import { Product } from '../data/products';
import GothicButton from './GothicButton';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div
      className={`relative group transition-all duration-500 ease-out transform ${
        isHovered ? 'scale-105 shadow-glow' : 'shadow-lg'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className={`bg-black border-2 border-crimson rounded-lg overflow-hidden transition-all duration-500 ease-out ${
          isHovered ? 'border-deepPurple shadow-2xl' : ''
        }`}
        style={{
          transform: isHovered ? 'rotateY(2deg) rotateX(2deg)' : 'rotateY(0deg) rotateX(0deg)',
          transition: 'transform 0.5s ease-out',
        }}
      >
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-64 object-cover transition-all duration-500 ease-out group-hover:scale-110"
            loading="lazy"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          )}
          {isHovered && (
            <div className="absolute top-2 right-2">
              <span className="text-crimson text-2xl opacity-40">&#9760;</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-gothic text-xl text-white mb-1 truncate">
            {product.name}
          </h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-crimson font-bold text-lg">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-gray-500 text-xs">
              {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of stock'}
            </span>
          </div>
          <div className="mt-4">
            <GothicButton
              onClick={handleAddToCart}
              disabled={product.stockCount <= 0}
              size="sm"
              className="w-full"
            >
              {product.stockCount > 0 ? 'Add to Collection' : 'Sold Out'}
            </GothicButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;