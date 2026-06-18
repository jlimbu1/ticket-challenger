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
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleShippingChange = useCallback((field: keyof ShippingFields) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setShipping((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [errors]);

  const handleCardNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (errors.cardNumber) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.cardNumber;
        return next;
      });
    }
  }, [errors.cardNumber]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const shippingErrors = validateShipping(shipping);
    const cardError = validateCardNumber(cardNumber);

    const allErrors: FormErrors = { ...shippingErrors };
    if (cardError) {
      allErrors.cardNumber = cardError;
    }

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    try {
      await onSubmit(shipping, cardNumber);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setSubmitError(message);
    }
  }, [shipping, cardNumber, onSubmit]);

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? 'border-red-500' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" role="alert">
          {submitError}
        </div>
      )}

      <fieldset>
        <legend className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</legend>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={shipping.name}
              onChange={handleShippingChange('name')}
              className={inputClass('name')}
              placeholder="John Doe"
              disabled={isSubmitting}
              autoComplete="name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
              className={inputClass('address')}
              placeholder="123 Main Street"
              disabled={isSubmitting}
              autoComplete="street-address"
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
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
                className={inputClass('city')}
                placeholder="New York"
                disabled={isSubmitting}
                autoComplete="address-level2"
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
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
                className={inputClass('state')}
                placeholder="NY"
                disabled={isSubmitting}
                autoComplete="address-level1"
              />
              {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
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
              className={inputClass('zip')}
              placeholder="10001"
              disabled={isSubmitting}
              autoComplete="postal-code"
            />
            {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-lg font-semibold text-gray-900 mb-4">Payment Information</legend>
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <input
            id="cardNumber"
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            className={inputClass('cardNumber')}
            placeholder="4242 4242 4242 4242"
            disabled={isSubmitting}
            autoComplete="cc-number"
            inputMode="numeric"
            maxLength={19}
          />
          {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
          <p className="mt-1 text-xs text-gray-500">Use 4242 4242 4242 4242 or any 16-digit number</p>
        </div>
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
}