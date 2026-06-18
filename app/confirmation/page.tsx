"use client";

import React, { useState, useEffect } from "react";
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

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemDisplay[]>([]);
  const [orderId] = useState(generateOrderId);
  const [estimatedDelivery] = useState(generateEstimatedDelivery);

  useEffect(() => {
    const timer = setTimeout(() => {
      const itemsParam = searchParams.get("items");
      const totalParam = searchParams.get("total");

      if (itemsParam && totalParam) {
        try {
          const parsedItems: CartItem[] = JSON.parse(itemsParam);
          const total = parseFloat(totalParam);

          const displayItems: OrderItemDisplay[] = parsedItems.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
          }));

          const newOrder: Order = {
            id: orderId,
            items: parsedItems,
            total: total,
            status: "completed",
            createdAt: new Date().toISOString(),
            customerName: searchParams.get("name") || "Valued Customer",
            customerEmail: searchParams.get("email") || "customer@example.com",
          };

          setOrder(newOrder);
          setOrderItems(displayItems);
        } catch (error) {
          console.error(
            "[ConfirmationPage] Failed to parse order data:",
            error instanceof Error ? error.message : "Unknown error",
            error instanceof Error ? error.stack : ""
          );
          setOrder(null);
        }
      }

      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams, orderId]);

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
            message="The spirits have no record of this order. Perhaps it was lost in the void."
          />
        </div>
      </DramaticErrorBoundary>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Tour Diary Header */}
          <div className="text-center mb-12">
            <div className="inline-block border-2 border-crimson/40 rounded-full px-6 py-2 mb-4">
              <span className="text-crimson text-sm uppercase tracking-widest">
                Tour Diary Entry
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Order Confirmed
            </h1>
            <p className="text-gray-400 text-lg">
              The ritual is complete. Your relics will be dispatched soon.
            </p>
          </div>

          {/* Order ID and Status */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                  Order ID
                </p>
                <p className="text-white text-xl font-mono">{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                  Status
                </p>
                <span className="inline-block bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-sm">
                  Completed
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Items Ordered</h2>
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between border-b border-gray-800 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <span className="text-2xl">&#9835;</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{item.product.name}</p>
                      <p className="text-gray-400 text-sm">
                        Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-white font-semibold">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-400">Free</span>
              </div>
              <div className="border-t border-gray-800 pt-3 flex justify-between text-white font-bold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-crimson/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-crimson text-xl">&#9992;</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">
                  Estimated Delivery
                </p>
                <p className="text-white text-lg font-semibold">
                  {estimatedDelivery}
                </p>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-6">Customer Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Name</span>
                <span className="text-white">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email</span>
                <span className="text-white">{order.customerEmail}</span>
              </div>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div className="text-center">
            <GothicButton
              onClick={() => {
                window.location.href = "/products";
              }}
              className="px-8 py-3"
            >
              Continue Shopping
            </GothicButton>
          </div>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
}