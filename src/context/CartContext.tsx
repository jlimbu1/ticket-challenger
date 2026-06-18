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
    errors.zip = 'ZIP code is required for the dark postal service';
  }

  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, setLastOrder } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !redirecting) {
      setRedirecting(true);
      router.push('/cart');
    }
  }, [items, router, redirecting]);

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
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const order: Order = {
        id: orderId,
        items: orderItems,
        total: totalPrice,
        shipping: formData,
        createdAt: new Date().toISOString(),
      };

      setLastOrder(order);
      clearCart();
      router.push('/confirmation');
    } catch (error) {
      console.error('Failed to complete order:', error);
      setIsSubmitting(false);
    }
  }, [formData, items, totalPrice, clearCart, setLastOrder, router]);

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <VinylSpinner />
          <p className="text-gray-400 mt-4">Your cart is empty. Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center mb-2 text-red-600">
            Complete the Ritual
          </h1>
          <p className="text-center text-gray-400 mb-8">
            Provide your details to seal the pact
          </p>

          <div className="bg-gray-900 rounded-lg p-6 mb-8 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4 text-red-400">Order Summary</h2>
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between py-2 border-b border-gray-800 last:border-b-0">
                <span className="text-gray-300">
                  {item.product.name} x{item.quantity}
                </span>
                <span className="text-gray-300">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="flex justify-between pt-4 mt-2 border-t border-gray-700">
              <span className="text-lg font-bold text-red-400">Total</span>
              <span className="text-lg font-bold text-red-400">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  errors.name ? 'border-red-600' : 'border-gray-700'
                }`}
                placeholder="Your dark name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  errors.email ? 'border-red-600' : 'border-gray-700'
                }`}
                placeholder="dark.soul@shadowrealm.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                  errors.address ? 'border-red-600' : 'border-gray-700'
                }`}
                placeholder="666 Haunted Lane"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    errors.city ? 'border-red-600' : 'border-gray-700'
                  }`}
                  placeholder="Gotham"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-300 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    errors.zip ? 'border-red-600' : 'border-gray-700'
                  }`}
                  placeholder="66666"
                />
                {errors.zip && (
                  <p className="mt-1 text-sm text-red-500">{errors.zip}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <GothicButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xl font-bold bg-red-800 hover:bg-red-700 text-white border-2 border-red-600 shadow-lg shadow-red-900/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <VinylSpinner />
                    <span>Sealing the pact...</span>
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