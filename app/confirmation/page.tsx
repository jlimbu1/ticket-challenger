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
      try {
        const itemsParam = searchParams.get("items");
        const totalParam = searchParams.get("total");

        if (!itemsParam || !totalParam) {
          setIsLoading(false);
          return;
        }

        const parsedItems: Array<{ productId: string; quantity: number }> = JSON.parse(
          decodeURIComponent(itemsParam)
        );

        const items: OrderItemDisplay[] = parsedItems
          .map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return {
              product,
              quantity: item.quantity,
              subtotal: product.price * item.quantity,
            };
          })
          .filter((item): item is OrderItemDisplay => item !== null);

        setOrderItems(items);

        const total = items.reduce((sum, item) => sum + item.subtotal, 0);

        setOrder({
          id: orderId,
          items: items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
          })),
          total,
          status: "completed",
          createdAt: new Date().toISOString(),
          customerName: "",
          customerEmail: "",
        });

        setIsLoading(false);
      } catch (error) {
        console.error("[ConfirmationPage] Failed to parse order data:", error);
        setIsLoading(false);
      }
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
            message="The spirits have no record of this transaction. Perhaps the ritual was never completed."
          />
        </div>
      </DramaticErrorBoundary>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="font-gothic text-4xl font-bold tracking-wider text-crimson md:text-5xl">
              The Ritual is Complete
            </h1>
            <p className="mt-2 text-lg text-gothic-300">
              Your order has been sealed in the archives of the black parade.
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
            <div className="mb-4 border-b border-gothic-700 pb-4">
              <h2 className="font-gothic text-2xl font-semibold text-crimson">
                Tour Diary Entry
              </h2>
              <p className="mt-1 text-sm text-gothic-400">
                Order #{orderId}
              </p>
            </div>

            <div className="mb-6 space-y-2 text-sm text-gothic-300">
              <p>
                <span className="font-semibold text-gothic-200">Date:</span>{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p>
                <span className="font-semibold text-gothic-200">Status:</span>{" "}
                <span className="text-emerald-400">Completed</span>
              </p>
              <p>
                <span className="font-semibold text-gothic-200">
                  Estimated Delivery:
                </span>{" "}
                {estimatedDelivery}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="mb-3 font-gothic text-lg font-semibold text-crimson">
                Setlist (Items)
              </h3>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between rounded-md border border-gothic-700 bg-gothic-800/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded border border-gothic-600 bg-gothic-800">
                        <span className="text-2xl text-crimson/60">&#9835;</span>
                      </div>
                      <div>
                        <p className="font-medium text-gothic-100">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gothic-400">
                          Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-gothic-100">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gothic-700 pt-4">
              <div className="flex items-center justify-between">
                <p className="font-gothic text-lg font-semibold text-gothic-200">
                  Total
                </p>
                <p className="font-gothic text-2xl font-bold text-crimson">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-sm text-gothic-400">
              A confirmation email will be sent to the address provided during
              checkout. Keep this order ID for your records.
            </p>
            <GothicButton
              onClick={() => (window.location.href = "/products")}
              className="mx-auto"
            >
              Return to the Stage
            </GothicButton>
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