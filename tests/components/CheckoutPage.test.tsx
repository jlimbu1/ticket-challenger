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
    errors.zip = 'ZIP code is required for the dark postal service';
  } else if (!ZIP_REGEX.test(data.zip.trim())) {
    errors.zip = 'Enter a valid 5-digit ZIP code';
  }

  return errors;
}

function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RITUAL-${result}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
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
    if (items.length === 0 && !isSubmitting && !isRedirecting) {
      router.push('/cart?message=Your cart is empty. Add some dark artifacts before checking out.');
    }
  }, [items, router, isSubmitting, isRedirecting]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name as keyof FormErrors];
        return next;
      });
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
      const order: Order = {
        id: generateOrderId(),
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        shipping: { ...formData },
        createdAt: new Date().toISOString(),
      };

      sessionStorage.setItem('lastOrder', JSON.stringify(order));
      
      setIsRedirecting(true);
      clearCart();
      router.push('/confirmation');
    } catch (error) {
      console.error('Failed to complete ritual:', error);
      setIsSubmitting(false);
    }
  }, [formData, items, total, clearCart, router]);

  if (items.length === 0 && !isSubmitting && !isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <VinylSpinner />
      </div>
    );
  }

  return (
    <DramaticErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
            Complete the Ritual
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-700"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-purple-400">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xl font-bold border-t border-gray-600 pt-4">
                <span>Total</span>
                <span className="text-purple-400">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
              <h2 className="text-2xl font-semibold mb-4 text-purple-300">
                Shipping Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      errors.address ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="123 Dark Street"
                  />
                  {errors.address && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.city ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Shadow City"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-sm mt-1">{errors.city}</p>
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
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 bg-gray-700 border rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        errors.zip ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="12345"
                    />
                    {errors.zip && (
                      <p className="text-red-400 text-sm mt-1">{errors.zip}</p>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <GothicButton
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="w-full py-3 text-lg"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <VinylSpinner size="sm" />
                        Completing Ritual...
                      </span>
                    ) : (
                      'Complete the Ritual'
                    )}
                  </GothicButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DramaticErrorBoundary>
  );
}