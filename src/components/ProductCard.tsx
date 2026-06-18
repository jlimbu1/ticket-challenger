import React from 'react';
import { Product } from '../data/products';
import GothicButton from './GothicButton';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isAddingToCart, setIsAddingToCart] = React.useState(false);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    onAddToCart(product);
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 800);
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
            className="w-full h-64 object-cover transition-all duration-500 ease-out"
            style={{
              filter: isHovered ? 'brightness(0.6) sepia(0.3)' : 'brightness(1)',
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
            style={{
              opacity: isHovered ? 0.8 : 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(139,0,0,0.3) 0%, transparent 60%)',
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
            style={{
              opacity: isHovered ? 0.15 : 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' text-anchor='middle' dominant-baseline='central' font-size='40' opacity='0.3'%3E%26%239761%3B%3C/text%3E%3C/svg%3E")`,
              backgroundSize: '80px 80px',
              backgroundRepeat: 'repeat',
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
            style={{
              opacity: isHovered ? 0.1 : 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' text-anchor='middle' dominant-baseline='central' font-size='30' opacity='0.3'%3E%26%239744%3B%3C/text%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
              backgroundRepeat: 'repeat',
            }}
          />
          <div
            className="absolute inset-0 transition-opacity duration-500 ease-out pointer-events-none"
            style={{
              opacity: isHovered ? 0.2 : 0,
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
              backgroundSize: '4px 4px',
            }}
          />
          <div
            className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-500 ease-out ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <GothicButton
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full"
              variant="primary"
            >
              {isAddingToCart ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                  Adding...
                </span>
              ) : (
                'Add to Collection'
              )}
            </GothicButton>
          </div>
        </div>
        <div className="p-4">
          <h3
            className="text-xl font-gothic text-crimson mb-2 truncate"
            style={{
              textShadow: '0 0 10px rgba(139, 0, 0, 0.3)',
            }}
          >
            {product.name}
          </h3>
          <p className="text-sm text-gray-400 font-serif italic mb-3 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-gothic text-deepPurple">
              ${product.price.toFixed(2)}
            </span>
            {product.isNewArrival && (
              <span className="text-xs font-gothic text-crimson border border-crimson px-2 py-1 rounded">
                New Arrival
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;