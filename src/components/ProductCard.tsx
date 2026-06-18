'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = isValidImageUrl(product.imageUrl)
    ? product.imageUrl
    : '/placeholder.svg';

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block rounded-xl bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 transition-colors duration-200 group-hover:text-indigo-600">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-gray-500">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-indigo-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            {product.category}
          </span>
        </div>
      </div>
    </Link>
  );
}