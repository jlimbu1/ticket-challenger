'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/src/context/CartContext';
import { GothicButton } from '@/components/GothicButton';
import { VinylSpinner } from '@/components/VinylSpinner';
import { DramaticErrorBoundary } from '@/components/DramaticErrorBoundary';

interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  zip?: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  shipping: FormData;
  createdAt: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required to complete the ritual';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required for your summoning confirmation';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Enter a valid email address, mortal';
  }

  if (!data.address.trim()) {
    errors.address = 'Address is required for delivery of dark artifacts';
  }

  if (!data.city.trim()) {
    errors.city = 'City is required to know where to send your shadows';
  }

  if (!data.zip.trim()) {
    errors.zip = 'ZIP code is required for the dark delivery';
  } else if (!ZIP_REGEX.test(data.zip.trim())) {
    errors.zip = 'Enter a valid 5-digit ZIP code';
  }

  return errors;
}

function generateOrderId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, setLastOrder } = useCart();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.replace('/cart?message=Your cart is empty. Add some dark artifacts before checking out.');
    }
  }, [items, isSubmitting, router]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const order: Order = {
        id: generateOrderId(),
        items: orderItems,
        total,
        shipping: { ...formData },
        createdAt: new Date().toISOString(),
      };

      setLastOrder(order);
      clearCart();

      setIsRedirecting(true);
      router.push('/confirmation');
    } catch (error) {
      console.error('Failed to complete the ritual:', error);
      setIsSubmitting(false);
    }
  }, [formData, items, total, clearCart, setLastOrder, router]);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <VinylSpinner />
          <p className="mt-4 text-gray-400 text-lg">Completing the ritual...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <VinylSpinner />
          <p className="mt-4 text-gray-400 text-lg">Redirecting to your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">
              Complete the Ritual
            </h1>
            <p className="text-gray-400 text-lg">
              Provide your details to summon your dark artifacts
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center text-gray-300"
                >
                  <span>
                    {item.product.name} x{item.quantity}
                  </span>
                  <span>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="border-t border-gray-700 pt-3 flex justify-between items-center text-white font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-6 space-y-6"
            noValidate
          >
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Your dark name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="dark.soul@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="123 Shadow Lane"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-400">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Gotham"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="zip"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.zip ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="66666"
                  maxLength={10}
                />
                {errors.zip && (
                  <p className="mt-1 text-sm text-red-400">{errors.zip}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <GothicButton
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-xl font-bold tracking-wider ${
                  isSubmitting
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <VinylSpinner />
                    <span className="ml-3">Completing the Ritual...</span>
                  </span>
                ) : (
                  'Complete the Ritual'
                )}
              </GothicButton>
            </div>
          </form>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
}