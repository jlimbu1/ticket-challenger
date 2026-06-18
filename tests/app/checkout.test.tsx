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
      router.replace('/cart?message=Your%20cart%20is%20empty.%20Add%20some%20dark%20artifacts%20first.');
    }
  }, [items, router, isSubmitting]);

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
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      }));

      const order: Order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        items: orderItems,
        total: totalPrice,
        shipping: formData,
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
  }, [formData, items, totalPrice, clearCart, setLastOrder, router]);

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <VinylSpinner />
          <p className="mt-4 text-gray-400 text-lg">Your ritual is being prepared...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <VinylSpinner />
          <p className="mt-4 text-gray-400 text-lg">Redirecting to the void...</p>
        </div>
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-2">Complete the Ritual</h1>
            <p className="text-gray-400">Summon your dark artifacts to their final destination</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Shipping Information</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
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
                      placeholder="dark.soul@shadowrealm.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-400">{errors.email}</p>
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
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.address ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="123 Cemetery Lane"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-400">{errors.address}</p>
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
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-300 mb-1">
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
                        placeholder="66613"
                      />
                      {errors.zip && (
                        <p className="mt-1 text-sm text-red-400">{errors.zip}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <GothicButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 text-lg font-bold bg-red-800 hover:bg-red-700 text-white rounded-md transition-all duration-300 shadow-lg shadow-red-900/50 hover:shadow-red-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <VinylSpinner />
                        <span className="ml-2">Channeling dark energies...</span>
                      </span>
                    ) : (
                      'Complete the Ritual'
                    )}
                  </GothicButton>
                </div>
              </form>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-gray-700 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded-md overflow-hidden">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-white font-medium">{item.product.name}</p>
                        <p className="text-gray-400 text-sm">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="text-white font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-300">Subtotal</span>
                  <span className="text-white font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg mt-2">
                  <span className="text-gray-300">Shipping</span>
                  <span className="text-gray-400">Free (dark magic)</span>
                </div>
                <div className="flex justify-between text-xl mt-4 pt-4 border-t border-gray-700">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-red-400 font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
}