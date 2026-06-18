"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const itemsParam = searchParams.get("items");
        const totalParam = searchParams.get("total");
        const nameParam = searchParams.get("name");
        const emailParam = searchParams.get("email");

        if (!itemsParam || !totalParam || !nameParam || !emailParam) {
          setError("Missing order information. Please complete checkout first.");
          setIsLoading(false);
          return;
        }

        const parsedItems: CartItem[] = JSON.parse(itemsParam);
        const total: number = parseFloat(totalParam);

        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
          setError("No items found in order. Please add items to your cart.");
          setIsLoading(false);
          return;
        }

        if (isNaN(total) || total <= 0) {
          setError("Invalid order total. Please try again.");
          setIsLoading(false);
          return;
        }

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
          customerName: nameParam,
          customerEmail: emailParam,
        };

        setOrder(newOrder);
        setOrderItems(displayItems);
        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load order confirmation";
        setError(message);
        setIsLoading(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchParams, orderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <VinylSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black p-8">
        <DramaticErrorBoundary>
          <GothicEmptyState
            title="Order Not Found"
            message={error}
          >
            <GothicButton
              onClick={() => window.location.href = "/products"}
              className="mt-6"
            >
              Return to the Void
            </GothicButton>
          </GothicEmptyState>
        </DramaticErrorBoundary>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-black p-8">
        <DramaticErrorBoundary>
          <GothicEmptyState
            title="Order Not Found"
            message="No order data available. Please complete checkout first."
          >
            <GothicButton
              onClick={() => window.location.href = "/products"}
              className="mt-6"
            >
              Return to the Void
            </GothicButton>
          </GothicEmptyState>
        </DramaticErrorBoundary>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="font-mcr text-5xl tracking-wider text-crimson">
            The Ritual is Complete
          </h1>
          <p className="mt-4 font-gothic text-lg text-gray-400">
            Your order has been sealed in the void
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
          <div className="mb-6 border-b border-gothic-700 pb-4">
            <h2 className="font-mcr text-2xl text-crimson">Tour Diary Entry</h2>
            <p className="mt-2 font-gothic text-sm text-gray-500">
              Order #{order.id}
            </p>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <h3 className="font-mcr text-lg text-crimson">The Traveler</h3>
              <p className="mt-1 font-gothic text-gray-300">{order.customerName}</p>
              <p className="font-gothic text-sm text-gray-500">{order.customerEmail}</p>
            </div>
            <div>
              <h3 className="font-mcr text-lg text-crimson">Estimated Arrival</h3>
              <p className="mt-1 font-gothic text-gray-300">{estimatedDelivery}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 font-mcr text-lg text-crimson">Setlist (Items)</h3>
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex items-center justify-between border-b border-gothic-800 pb-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mcr text-sm text-crimson/60">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-gothic text-gray-200">{item.product.name}</p>
                      <p className="font-gothic text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-gothic text-gray-300">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gothic-700 pt-4">
            <div className="flex justify-between">
              <span className="font-mcr text-xl text-crimson">Total Tribute</span>
              <span className="font-mcr text-xl text-crimson">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="mb-6 font-gothic text-sm text-gray-500">
            A confirmation email has been dispatched through the void to {order.customerEmail}
          </p>
          <GothicButton
            onClick={() => window.location.href = "/products"}
          >
            Continue the Journey
          </GothicButton>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <VinylSpinner />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}