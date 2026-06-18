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
        setOrder(null);
        setOrderItems([]);
      }
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <VinylSpinner />
      </div>
    );
  }

  if (!order || orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        <GothicEmptyState
          title="No Order Found"
          message="The void has consumed your order. Perhaps it was never meant to be."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4 text-white md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
          <h1 className="mb-2 font-serif text-3xl tracking-wider text-crimson md:text-4xl">
            The Ritual is Complete
          </h1>
          <p className="font-mono text-sm text-gothic-400">
            Order #{orderId}
          </p>
        </div>

        <div className="mb-8 border border-gothic-700 bg-gothic-900/30 p-6">
          <h2 className="mb-4 font-serif text-xl text-rose">Tour Diary Entry</h2>
          <div className="space-y-2 font-mono text-sm text-gothic-300">
            <p>Date: {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
            <p>Location: The Digital Void</p>
            <p>Attendee: {order.customerName}</p>
            <p>Contact: {order.customerEmail}</p>
          </div>
        </div>

        <div className="mb-8 border border-gothic-700 bg-gothic-900/30 p-6">
          <h2 className="mb-4 font-serif text-xl text-rose">Setlist</h2>
          <div className="space-y-4">
            {orderItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between border-b border-gothic-800 pb-2"
              >
                <div>
                  <p className="font-medium text-white">{item.product.name}</p>
                  <p className="font-mono text-sm text-gothic-400">
                    Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <p className="font-mono text-crimson">
                  ${item.subtotal.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-gothic-700 pt-4">
            <p className="font-serif text-lg text-white">Total</p>
            <p className="font-mono text-lg text-crimson">
              ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-8 border border-gothic-700 bg-gothic-900/30 p-6">
          <h2 className="mb-4 font-serif text-xl text-rose">Next Show</h2>
          <p className="font-mono text-sm text-gothic-300">
            Estimated delivery: {estimatedDelivery}
          </p>
          <p className="mt-2 font-mono text-xs text-gothic-500">
            The relics will arrive when the stars align.
          </p>
        </div>

        <div className="text-center">
          <GothicButton
            onClick={() => window.location.href = "/products"}
          >
            Return to the Stage
          </GothicButton>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <DramaticErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-black">
            <VinylSpinner />
          </div>
        }
      >
        <ConfirmationContent />
      </Suspense>
    </DramaticErrorBoundary>
  );
}