"use client";

import { cn } from "@/lib/utils";
import { useCart } from "@/src/context/CartContext";
import type { Product } from "@/src/types";
import GothicButton from "@/components/GothicButton";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    try {
      addToCart(product, 1);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setTimeout(() => setIsAdding(false), 500);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const displayImage = imageError || !product.image
    ? "https://placehold.co/300x300/1a1a2e/ff6b6b?text=No+Image"
    : product.image;

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border border-gothic-700 bg-gothic-900/80 shadow-gothic transition-all duration-300 hover:border-crimson/50 hover:shadow-crimson/20",
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={displayImage}
          alt={product.name}
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {!product.stock || product.stock <= 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="text-lg font-bold text-crimson">Sold Out</span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-lg text-gothic-200 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gothic-400 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-xl font-bold text-crimson">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gothic-500">
            {product.category}
          </span>
        </div>
        <GothicButton
          onClick={handleAddToCart}
          disabled={isAdding || !product.stock || product.stock <= 0}
          className="mt-2 w-full"
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </GothicButton>
      </div>
    </div>
  );
}