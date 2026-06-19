'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

interface FormData {
  name: string
  email: string
  address: string
}

interface FormErrors {
  name?: string
  email?: string
  address?: string
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  timestamp: string
  customer: {
    name: string
    email: string
  }
}

function generateOrderId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'ORD-'
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function loadOrders(): Order[] {
  try {
    const stored = localStorage.getItem('orders')
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem('orders', JSON.stringify(orders))
}

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart()
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    address: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)

  const validateField = (name: keyof FormData, value: string): string | undefined => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Thou must reveal thy name.'
        if (value.trim().length < 2) return 'Thy name be too short.'
        return undefined
      case 'email':
        if (!value.trim()) return 'Thou must provide an email.'
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return 'That email be cursed. Enter a proper one.'
        return undefined
      case 'address':
        if (!value.trim()) return 'Thou must give a dwelling address.'
        if (value.trim().length < 5) return 'Thy address be too vague.'
        return undefined
      default:
        return undefined
    }
  }

  const handleBlur = (field: keyof FormData) => {
    const error = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error on change if it was previously invalid
    if (errors[field]) {
      const error = validateField(field, value)
      if (!error) {
        setErrors((prev) => ({ ...prev, [field]: undefined }))
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let valid = true
    for (const field of ['name', 'email', 'address'] as (keyof FormData)[]) {
      const error = validateField(field, formData[field])
      if (error) {
        newErrors[field] = error
        valid = false
      }
    }
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setSubmitting(true)

    try {
      const order: Order = {
        id: generateOrderId(),
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total,
        timestamp: new Date().toISOString(),
        customer: {
          name: formData.name.trim(),
          email: formData.email.trim(),
        },
      }

      const existingOrders = loadOrders()
      existingOrders.push(order)
      saveOrders(existingOrders)

      clearCart()

      const params = new URLSearchParams({
        orderId: order.id,
        total: order.total.toFixed(2),
      })
      router.push(`/confirmation?${params.toString()}`)
    } catch (err) {
      console.error('Failed to place order:', err)
      setSubmitting(false)
    }
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-4xl font-bold text-rose-600">Checkout</h1>
          <p className="text-xl text-gray-400">Thy cart is empty...</p>
          <p className="text-gray-500">Add some dark delights before thou checkest out.</p>
          <button
            onClick={() => router.push('/')}
            className="inline-block px-6 py-3 bg-rose-800 hover:bg-rose-700 text-white font-semibold rounded transition"
          >
            Return to Shadows
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-gray-200 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-rose-600 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-rose-400 mb-4">Thy Cart</h2>
              <ul className="divide-y divide-gray-800">
                {cart.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">x{item.quantity}</p>
                    </div>
                    <p className="text-rose-400">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-800 pt-4 mt-4 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-rose-500">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-1">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  className={`w-full bg-gray-800 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 ${
                    errors.name ? 'border-rose-600' : 'border-gray-700'
                  }`}
                  placeholder="Enter thy name"
                  disabled={submitting}
                />
                {errors.name && <p className="text-rose-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-300 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-gray-800 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 ${
                    errors.email ? 'border-rose-600' : 'border-gray-700'
                  }`}
                  placeholder="Enter thy email"
                  disabled={submitting}
                />
                {errors.email && <p className="text-rose-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-gray-300 mb-1">Shipping Address</label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  rows={3}
                  className={`w-full bg-gray-800 border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-600 ${
                    errors.address ? 'border-rose-600' : 'border-gray-700'
                  }`}
                  placeholder="Enter thy address"
                  disabled={submitting}
                />
                {errors.address && <p className="text-rose-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* Dummy Payment Info */}
              <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Payment (Dummy)</h3>
                <p className="text-gray-500 text-sm">No real payment is processed. This is a mock.</p>
                <div className="mt-2 space-y-2">
                  <div>
                    <label className="block text-gray-400 text-xs">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4242 4242 4242 4242"
                      readOnly
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-400 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-gray-400 text-xs">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/25"
                        readOnly
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-400 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-400 text-xs">CVC</label>
                      <input
                        type="text"
                        defaultValue="123"
                        readOnly
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-400 text-sm cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-rose-800 hover:bg-rose-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold rounded transition"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}