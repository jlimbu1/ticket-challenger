import React, { useState, useCallback } from 'react';

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

interface CheckoutFormProps {
  onSubmit: (shipping: ShippingFields, cardNumber: string) => Promise<void>;
  isSubmitting: boolean;
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

export default function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [shipping, setShipping] = useState<ShippingFields>(INITIAL_SHIPPING);
  const [cardNumber, setCardNumber] = useState('');
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);

  const handleShippingChange = useCallback((field: keyof ShippingFields) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setShipping((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setErrors((prev) => ({ ...prev, cardNumber: undefined }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const shippingErrors = validateShipping(shipping);
    const cardError = validateCardNumber(cardNumber);

    const allErrors: FormErrors = {
      ...shippingErrors,
      ...(cardError ? { cardNumber: cardError } : {}),
    };

    setErrors(allErrors);

    if (Object.keys(allErrors).length > 0) {
      return;
    }

    await onSubmit(shipping, cardNumber.replace(/\s/g, ''));
  }, [shipping, cardNumber, onSubmit]);

  const inputClasses = (field: keyof FormErrors) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Shipping Address</h2>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={shipping.name}
            onChange={handleShippingChange('name')}
            className={inputClasses('name')}
            placeholder="John Doe"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            id="address"
            type="text"
            value={shipping.address}
            onChange={handleShippingChange('address')}
            className={inputClasses('address')}
            placeholder="123 Main St"
            disabled={isSubmitting}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              id="city"
              type="text"
              value={shipping.city}
              onChange={handleShippingChange('city')}
              className={inputClasses('city')}
              placeholder="New York"
              disabled={isSubmitting}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <input
              id="state"
              type="text"
              value={shipping.state}
              onChange={handleShippingChange('state')}
              className={inputClasses('state')}
              placeholder="NY"
              disabled={isSubmitting}
            />
            {errors.state && (
              <p className="mt-1 text-sm text-red-600">{errors.state}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <input
            id="zip"
            type="text"
            value={shipping.zip}
            onChange={handleShippingChange('zip')}
            className={inputClasses('zip')}
            placeholder="10001"
            disabled={isSubmitting}
          />
          {errors.zip && (
            <p className="mt-1 text-sm text-red-600">{errors.zip}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>

        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={inputClasses('cardNumber')}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            disabled={isSubmitting}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        }`}
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}