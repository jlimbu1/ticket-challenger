'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface ShippingFields {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

interface FormErrors {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  cardNumber?: string;
}

interface CheckoutResponse {
  orderId: string;
  error?: string;
}

const INITIAL_SHIPPING: ShippingFields = {
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

const INITIAL_ERRORS: FormErrors = {};

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '');
  const groups: string[] = [];
  for (let i = 0; i < digits.length && i < 16; i += 4) {
    groups.push(digits.slice(i, i + 4));
  }
  return groups.join(' ');
}

function validateCardNumber(value: string): string | null {
  const digits = value.replace(/\s/g, '');
  if (digits.length === 0) {
    return 'Card number is required';
  }
  if (!/^\d+$/.test(digits)) {
    return 'Card number must contain only digits';
  }
  if (digits.length !== 16) {
    return 'Card number must be 16 digits';
  }
  return null;
}

function validateShipping(fields: ShippingFields): FormErrors {
  const errors: FormErrors = {};
  if (!fields.name.trim()) {
    errors.name = 'Full name is required';
  }
  if (!fields.address.trim()) {
    errors.address = 'Address is required';
  }
  if (!fields.city.trim()) {
    errors.city = 'City is required';
  }
  if (!fields.state.trim()) {
    errors.state = 'State is required';
  }
  if (!fields.zip.trim()) {
    errors.zip = 'ZIP code is required';
  }
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [shipping, setShipping] = useState<ShippingFields>(INITIAL_SHIPPING);
  const [cardNumber, setCardNumber] = useState('');
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  const handleShippingChange = useCallback(
    (field: keyof ShippingFields) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setShipping((prev) => ({ ...prev, [field]: e.target.value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      },
    []
  );

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatCardNumber(e.target.value);
      setCardNumber(formatted);
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError(null);

      const shippingErrors = validateShipping(shipping);
      const cardError = validateCardNumber(cardNumber);

      if (shippingErrors.name || shippingErrors.address || shippingErrors.city || shippingErrors.state || shippingErrors.zip || cardError) {
        setErrors({
          ...shippingErrors,
          cardNumber: cardError || undefined,
        });
        return;
      }

      setIsSubmitting(true);

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
            shipping,
            cardNumber,
          }),
        });

        if (!response.ok) {
          const errorData: CheckoutResponse = await response.json();
          throw new Error(errorData.error || 'Checkout failed');
        }

        const data: CheckoutResponse = await response.json();
        clearCart();
        router.push(`/confirmation?id=${data.orderId}`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [shipping, cardNumber, items, clearCart, router]
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={shipping.name}
                  onChange={handleShippingChange('name')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.name ? 'border-red-300' : ''
                  }`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={shipping.address}
                  onChange={handleShippingChange('address')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.address ? 'border-red-300' : ''
                  }`}
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={shipping.city}
                  onChange={handleShippingChange('city')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.city ? 'border-red-300' : ''
                  }`}
                />
                {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={shipping.state}
                  onChange={handleShippingChange('state')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.state ? 'border-red-300' : ''
                  }`}
                />
                {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
              </div>

              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  value={shipping.zip}
                  onChange={handleShippingChange('zip')}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    errors.zip ? 'border-red-300' : ''
                  }`}
                />
                {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.cardNumber ? 'border-red-300' : ''
                }`}
              />
              {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}