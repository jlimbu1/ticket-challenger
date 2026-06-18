"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/src/data/products";
import type { Product, CartItem, Order } from "@/src/types";
import GothicButton from "@/components/GothicButton";
import GothicEmptyState from "@/components/GothicEmptyState";
import DramaticErrorBoundary from "@/components/DramaticErrorBoundary";
import VinylSpinner from "@/components/VinylSpinner";

function generateOrderId(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "MCR-";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateEstimatedDelivery(): string {
  const date = new Date();
  date.setDate(date.getDate() + 7 + Math.floor(Math.random() * 14));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface OrderItemDisplay {
  product: Product;
  quantity: number;
  subtotal: number;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemDisplay[]>([]);
  const [orderId] = useState(generateOrderId);
  const [estimatedDelivery] = useState(generateEstimatedDelivery);

  useEffect(() => {
    const timer = setTimeout(() => {
      const orderParam = searchParams.get("order");
      if (orderParam) {
        try {
          const parsedOrder: Order = JSON.parse(decodeURIComponent(orderParam));
          setOrder(parsedOrder);
          const items: OrderItemDisplay[] = parsedOrder.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
          }));
          setOrderItems(items);
        } catch {
          setOrder(null);
          setOrderItems([]);
        }
      } else {
        const storedOrder = sessionStorage.getItem("lastOrder");
        if (storedOrder) {
          try {
            const parsedOrder: Order = JSON.parse(storedOrder);
            setOrder(parsedOrder);
            const items: OrderItemDisplay[] = parsedOrder.items.map((item) => ({
              product: item.product,
              quantity: item.quantity,
              subtotal: item.product.price * item.quantity,
            }));
            setOrderItems(items);
          } catch {
            setOrder(null);
            setOrderItems([]);
          }
        }
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <VinylSpinner />
      </div>
    );
  }

  if (!order || orderItems.length === 0) {
    return (
      <DramaticErrorBoundary>
        <div className="min-h-screen bg-black text-white p-8">
          <GothicEmptyState
            title="No Order Found"
            message="The tour diary is empty. No order was placed."
          />
        </div>
      </DramaticErrorBoundary>
    );
  }

  const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="border border-gothic-700 bg-gothic-900/50 shadow-gothic rounded-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-crimson mb-2">
                The Ritual is Complete
              </h1>
              <p className="text-gothic-300 text-lg">
                Your order has been sealed in the void.
              </p>
            </div>

            <div className="border-t border-b border-gothic-700 py-6 mb-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gothic-400">Order ID:</span>
                  <span className="text-white ml-2 font-mono">{orderId}</span>
                </div>
                <div>
                  <span className="text-gothic-400">Date:</span>
                  <span className="text-white ml-2">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gothic-400">Name:</span>
                  <span className="text-white ml-2">{order.customerName}</span>
                </div>
                <div>
                  <span className="text-gothic-400">Email:</span>
                  <span className="text-white ml-2">{order.customerEmail}</span>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-crimson mb-4">
                Tour Diary Entry
              </h2>
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between border-b border-gothic-700 pb-3"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gothic-800 rounded overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://placehold.co/64x64/1a1a2e/fff?text=MCR";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.product.name}</p>
                        <p className="text-sm text-gothic-400">
                          Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-white font-medium">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gothic-700 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gothic-300">Total</span>
                <span className="text-2xl font-bold text-crimson">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-gothic-800/50 border border-gothic-700 rounded p-4 mb-6">
              <p className="text-sm text-gothic-300">
                <span className="text-crimson font-semibold">Estimated Delivery:</span>{" "}
                {estimatedDelivery}
              </p>
              <p className="text-xs text-gothic-400 mt-2">
                The spirits are preparing your package for its journey through the void.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <GothicButton
                onClick={() => window.location.href = "/products"}
              >
                Return to the Stage
              </GothicButton>
            </div>
          </div>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <VinylSpinner />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}