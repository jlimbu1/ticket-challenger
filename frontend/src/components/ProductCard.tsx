import React from 'react';
import '../styles/theme.css';
import '../styles/animations.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  onAddToCart?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  category,
  image,
  onAddToCart,
}) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <div className="product-card" role="article" aria-label={`${name} - $${price.toFixed(2)}`}>
      <div className="product-card-image-wrapper">
        <img
          src={image}
          alt={name}
          className="product-card-image"
          loading="lazy"
        />
        <div className="product-card-overlay" aria-hidden="true">
          <div className="overlay-skull" />
          <div className="overlay-rose" />
          <div className="overlay-distressed" />
        </div>
        <div className="product-card-hover-content">
          <span className="product-card-category">{category}</span>
          <button
            className="product-card-add-button"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
          >
            Add to Collection
          </button>
        </div>
      </div>
      <div className="product-card-info">
        <h3 className="product-card-name">{name}</h3>
        <p className="product-card-price">${price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductCard;