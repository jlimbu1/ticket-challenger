import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

function truncateDescription(description: string, maxLength: number = 100): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength).trimEnd() + '...';
}

function addToCart(productId: string): void {
  try {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = cart.findIndex(
      (item: { id: string }) => item.id === productId
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ id: productId, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to update cart';
    console.error('Cart update failed:', message);
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = useCallback(() => {
    if (isAdded) return;

    addToCart(product.id);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  }, [product.id, isAdded]);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square overflow-hidden bg-gray-100"
      >
        {imageError ? (
          <div className="flex h-full w-full items-center justify-center bg-gray-200">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1">
          <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {product.category}
          </span>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-1 block text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors duration-200"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {truncateDescription(product.description)}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
              isAdded
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {isAdded ? (
              <>
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Added
              </>
            ) : (
              <>
                <svg
                  className="mr-1.5 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                  />
                </svg>
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}