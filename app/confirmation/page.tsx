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

  useEffect(() => {
    const timer = setTimeout(() => {
      const itemsParam = searchParams.get("items");
      const totalParam = searchParams.get("total");
      const nameParam = searchParams.get("name");
      const emailParam = searchParams.get("email");

      if (itemsParam && totalParam && nameParam && emailParam) {
        try {
          const parsedItems: CartItem[] = JSON.parse(itemsParam);
          const total = parseFloat(totalParam);

          if (isNaN(total) || total < 0) {
            throw new Error("Invalid total value");
          }

          if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
            throw new Error("Invalid or empty items array");
          }

          const validItems = parsedItems.filter(
            (item) =>
              item &&
              item.product &&
              typeof item.product.id === "string" &&
              typeof item.product.name === "string" &&
              typeof item.product.price === "number" &&
              item.product.price >= 0 &&
              typeof item.quantity === "number" &&
              item.quantity > 0
          );

          if (validItems.length === 0) {
            throw new Error("No valid items found");
          }

          const displayItems: OrderItemDisplay[] = validItems.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,
          }));

          const newOrder: Order = {
            id: orderId,
            items: validItems,
            total,
            status: "completed",
            createdAt: new Date().toISOString(),
            customerName: decodeURIComponent(nameParam),
            customerEmail: decodeURIComponent(emailParam),
          };

          setOrder(newOrder);
          setOrderItems(displayItems);
        } catch (error) {
          console.error(
            "[ConfirmationPage] Failed to parse order data:",
            error instanceof Error ? error.message : "Unknown error",
            error instanceof Error ? error.stack : undefined
          );
          setOrder(null);
          setOrderItems([]);
        }
      } else {
        setOrder(null);
        setOrderItems([]);
      }

      setIsLoading(false);
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

  if (!order || orderItems.length === 0) {
    return (
      <DramaticErrorBoundary>
        <div className="min-h-screen bg-black p-8">
          <GothicEmptyState
            title="No Order Found"
            message="The ritual was not completed. No order exists to confirm."
          />
        </div>
      </DramaticErrorBoundary>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-8 text-center">
            <h1 className="font-gothic text-4xl tracking-wider text-crimson md:text-5xl">
              The Ritual is Complete
            </h1>
            <p className="mt-2 text-sm text-gray-400">
              Your order has been sealed in the void
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
            <div className="mb-4 border-b border-gothic-700 pb-4">
              <p className="text-sm text-gray-400">Order ID</p>
              <p className="font-mono text-lg text-crimson">{order.id}</p>
            </div>

            <div className="mb-4 border-b border-gothic-700 pb-4">
              <p className="text-sm text-gray-400">Estimated Delivery</p>
              <p className="text-lg text-white">{estimatedDelivery}</p>
            </div>

            <div className="mb-4 border-b border-gothic-700 pb-4">
              <p className="text-sm text-gray-400">Customer</p>
              <p className="text-white">{order.customerName}</p>
              <p className="text-sm text-gray-400">{order.customerEmail}</p>
            </div>

            <div>
              <p className="mb-2 text-sm text-gray-400">Items</p>
              <div className="space-y-3">
                {orderItems.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between rounded bg-gothic-800/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded border border-gothic-600 bg-gothic-800">
                        <span className="text-xs text-gray-400">
                          {item.product.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-crimson">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
            <div className="flex items-center justify-between">
              <p className="text-lg text-gray-400">Total Charged</p>
              <p className="text-2xl font-bold text-crimson">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-sm italic text-gray-500">
              &ldquo;The transaction has been etched into the annals of the
              underworld.&rdquo;
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
        <div className="flex min-h-screen items-center justify-center bg-black">
          <VinylSpinner />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}