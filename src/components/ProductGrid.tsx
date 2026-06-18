'use client';

import React, { useState, useEffect } from 'react';
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

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  emptyMessage?: string;
  emptyAction?: React.ReactNode;
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-white shadow-sm">
      <div className="aspect-square rounded-t-xl bg-gray-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="h-6 w-1/4 rounded bg-gray-200" />
        <div className="h-5 w-1/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fadeIn">
      <svg
        className="mb-6 h-24 w-24 text-gray-300"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <p className="text-lg text-gray-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default function ProductGrid({ products, loading = false, emptyMessage = 'No products found.', emptyAction }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <EmptyState message={emptyMessage} action={emptyAction} />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          className="group block rounded-xl bg-white shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <div className="relative aspect-square overflow-hidden rounded-t-xl">
            <Image
              src={product.imageUrl}
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
            <p className="mt-2 text-xl font-bold text-indigo-600">
              ${product.price.toFixed(2)}
            </p>
            <span className="mt-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-800">
              {product.category}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}