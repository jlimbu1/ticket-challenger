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
      try {
        const itemsParam = searchParams.get("items");
        const totalParam = searchParams.get("total");
        const nameParam = searchParams.get("name");
        const emailParam = searchParams.get("email");

        if (!itemsParam || !totalParam || !nameParam || !emailParam) {
          setIsLoading(false);
          return;
        }

        const parsedItems: CartItem[] = JSON.parse(decodeURIComponent(itemsParam));
        const total: number = parseFloat(totalParam);

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
          customerName: decodeURIComponent(nameParam),
          customerEmail: decodeURIComponent(emailParam),
        };

        setOrder(newOrder);
        setOrderItems(displayItems);
      } catch (error) {
        console.error("[ConfirmationPage] Failed to parse order data:", error);
      } finally {
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
        <div className="mx-auto max-w-4xl px-4 py-12">
          <div className="mb-8 text-center">
            <h1 className="font-gothic text-4xl tracking-wider text-crimson md:text-5xl">
              The Ritual is Complete
            </h1>
            <p className="mt-2 text-lg text-gothic-400">
              Your order has been sealed in the archives
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-wider text-gothic-400">
                  Order ID
                </p>
                <p className="font-mono text-lg text-crimson">{order.id}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-gothic-400">
                  Estimated Delivery
                </p>
                <p className="text-lg text-white">{estimatedDelivery}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-gothic-400">
                  Customer
                </p>
                <p className="text-lg text-white">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-wider text-gothic-400">
                  Email
                </p>
                <p className="text-lg text-white">{order.customerEmail}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="mb-4 text-xl font-bold text-crimson">
                Items Ordered
              </h2>
              <div className="space-y-3">
                {orderItems.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex items-center justify-between border-b border-gothic-700 pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded bg-gothic-800">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gothic-400">
                          Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <p className="font-mono text-crimson">
                      ${item.subtotal.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gothic-700 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold text-white">Total</p>
                <p className="font-mono text-2xl text-crimson">
                  ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="mb-4 text-gothic-400">
              A confirmation email has been dispatched through the void to{" "}
              <span className="text-crimson">{order.customerEmail}</span>
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