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

        if (!itemsParam || !totalParam) {
          setError("No order data found. Please complete the checkout process first.");
          setIsLoading(false);
          return;
        }

        let parsedItems: CartItem[];
        try {
          parsedItems = JSON.parse(itemsParam) as CartItem[];
        } catch {
          setError("Invalid order data format. Please try checking out again.");
          setIsLoading(false);
          return;
        }

        if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
          setError("Your order appears to be empty. Please add items to your cart and try again.");
          setIsLoading(false);
          return;
        }

        const total = parseFloat(totalParam);
        if (isNaN(total) || total <= 0) {
          setError("Invalid order total. Please try checking out again.");
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
          customerName: searchParams.get("name") || "Valued Customer",
          customerEmail: searchParams.get("email") || "",
        };

        setOrder(newOrder);
        setOrderItems(displayItems);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred while loading your order.");
        setIsLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams, orderId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <VinylSpinner />
          <p className="text-gothic-400 animate-pulse text-lg">
            Chronicling your order in the tour diary...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <DramaticErrorBoundary>
          <GothicEmptyState
            title="Order Not Found"
            message={error}
            actionLabel="Return to Shop"
            onAction={() => window.location.href = "/products"}
          />
        </DramaticErrorBoundary>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <GothicEmptyState
          title="No Order Data"
          message="We couldn't find any order information. Please complete the checkout process first."
          actionLabel="Browse Products"
          onAction={() => window.location.href = "/products"}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8 text-center">
          <h1 className="font-gothic text-4xl font-bold tracking-wider text-crimson md:text-5xl">
            The Black Parade
          </h1>
          <p className="mt-2 text-lg text-gothic-400">Tour Diary Entry</p>
        </div>

        <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/50 p-6 shadow-gothic">
          <div className="mb-6 border-b border-gothic-700 pb-4">
            <h2 className="font-gothic text-2xl font-bold text-crimson">
              Order Confirmed
            </h2>
            <p className="mt-1 text-gothic-400">
              Your ritual has been completed successfully.
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gothic-500">Order ID</p>
              <p className="font-mono text-lg text-crimson">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gothic-500">Date</p>
              <p className="text-lg text-white">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gothic-500">Customer</p>
              <p className="text-lg text-white">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gothic-500">Estimated Delivery</p>
              <p className="text-lg text-white">{estimatedDelivery}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 font-gothic text-xl font-bold text-crimson">
              Items Ordered
            </h3>
            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-gothic-700 bg-gothic-800/50 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-crimson/30 bg-gothic-900">
                      <span className="text-xl text-crimson">&#9835;</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.product.name}</p>
                      <p className="text-sm text-gothic-400">
                        Qty: {item.quantity} x ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="font-mono text-lg text-crimson">
                    ${item.subtotal.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gothic-700 pt-4">
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-white">Total</p>
              <p className="font-mono text-2xl font-bold text-crimson">
                ${order.total.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-gothic-700 bg-gothic-900/30 p-6 shadow-gothic">
          <h3 className="mb-4 font-gothic text-xl font-bold text-crimson">
            What Happens Next
          </h3>
          <ul className="space-y-3 text-gothic-300">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-crimson">&#9835;</span>
              <span>
                Your order has been received and is being prepared for its journey.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-crimson">&#9835;</span>
              <span>
                You will receive a confirmation email with your order details.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-crimson">&#9835;</span>
              <span>
                Estimated delivery: <strong className="text-white">{estimatedDelivery}</strong>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-crimson">&#9835;</span>
              <span>
                For any questions, contact our support team with your order ID.
              </span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <GothicButton
            onClick={() => window.location.href = "/products"}
            className="px-8 py-3"
          >
            Continue Shopping
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
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <VinylSpinner />
            <p className="text-gothic-400 animate-pulse text-lg">
              Preparing your tour diary...
            </p>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}