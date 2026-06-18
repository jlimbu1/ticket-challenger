'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CheckoutForm from '@/components/CheckoutForm';

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

  const handleShippingChange = useCallback((field: keyof ShippingFields, value: string) => {
    setShipping((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleCardNumberChange = useCallback((value: string) => {
    const formatted = formatCardNumber(value);
    setCardNumber(formatted);
    setErrors((prev) => ({ ...prev, cardNumber: undefined }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setSubmitError(null);

    const shippingErrors = validateShipping(shipping);
    const cardError = validateCardNumber(cardNumber);

    const allErrors: FormErrors = { ...shippingErrors };
    if (cardError) {
      allErrors.cardNumber = cardError;
    }

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    if (items.length === 0) {
      setSubmitError('Your cart is empty. Add items before checking out.');
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
        throw new Error(errorData.error || 'Checkout failed. Please try again.');
      }

      const data: CheckoutResponse = await response.json();
      clearCart();
      router.push(`/confirmation?id=${data.orderId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  }, [shipping, cardNumber, items, clearCart, router]);

  useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      router.push('/cart');
    }
  }, [items, isSubmitting, router]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {submitError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{submitError}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
          {items.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id} className="py-3 flex justify-between">
                  <span className="text-gray-700">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="text-gray-900 font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
          <CheckoutForm
            shipping={shipping}
            cardNumber={cardNumber}
            errors={errors}
            isSubmitting={isSubmitting}
            onShippingChange={handleShippingChange}
            onCardNumberChange={handleCardNumberChange}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}